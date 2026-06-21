-- =============================================
-- PawBowl Database Schema v2
-- Run this in the Supabase SQL Editor
-- =============================================
-- Breaking changes from v1:
--   - dogs              → pets (+ pet_type_id, birth_date, sex, is_neutered, body_condition_score)
--   - custom_bowls      → custom_recipes
--   - custom_bowl_ingredients → custom_recipe_ingredients (+ quantity_oz, snapshots)
--   - meals.ingredients[]  removed → meal_ingredients join table
--   - order_items gets price/name/calorie snapshots
--   - New: pet_types, pet_allergies, pet_health_goals
--   - New: ingredient_rules, ingredient_pet_types
--   - New: nutrition_rules
--   - New: pets_summary view, recipe_nutrition view
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";


-- ─────────────────────────────────────────────────────────────────────────────
-- LOOKUP TABLES
-- ─────────────────────────────────────────────────────────────────────────────

-- Pet types (dog, cat — extensible for future species)
create table public.pet_types (
  id    serial primary key,
  name  text not null unique   -- 'dog', 'cat'
);

insert into public.pet_types (name) values ('dog'), ('cat');


-- Ingredient categories (maps to build-a-bowl wizard steps)
create table public.ingredient_categories (
  id    serial primary key,
  name  text not null,          -- 'protein', 'base', 'vegetable', 'booster'
  step  int  not null,          -- 1–4 wizard step order
  icon  text                    -- emoji or icon name for UI
);

insert into public.ingredient_categories (name, step, icon) values
  ('protein',   1, '🥩'),
  ('base',      2, '🍚'),
  ('vegetable', 3, '🥦'),
  ('booster',   4, '💊');


-- ─────────────────────────────────────────────────────────────────────────────
-- PROFILES (extends auth.users)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  phone       text,
  address     text,
  city        text,
  state       text,
  zip         text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─────────────────────────────────────────────────────────────────────────────
-- PETS (formerly dogs)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.pets (
  id                    uuid default uuid_generate_v4() primary key,
  user_id               uuid references auth.users on delete cascade not null,
  pet_type_id           int  references public.pet_types not null default 1,  -- default: dog
  name                  text not null,
  breed                 text,
  birth_date            date,           -- preferred over age_years: stays accurate over time
  weight_lbs            numeric(5,1),
  sex                   text check (sex in ('male', 'female', 'unknown')),
  is_neutered           boolean,
  activity_level        text check (activity_level in ('low', 'moderate', 'high', 'very_high')),
  body_condition_score  int  check (body_condition_score between 1 and 9),
                                        -- 1=emaciated … 9=obese; 4–5 = ideal
  avatar_url            text,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

alter table public.pets enable row level security;
create policy "Users manage own pets" on public.pets for all using (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- INGREDIENTS
-- (declared before pet_allergies and ingredient_rules which reference it)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.ingredients (
  id                uuid default uuid_generate_v4() primary key,
  category_id       int  references public.ingredient_categories not null,
  name              text not null,
  description       text,
  calories_per_oz   numeric(6,1),
  protein_g_per_oz  numeric(5,2),
  fat_g_per_oz      numeric(5,2),
  fiber_g_per_oz    numeric(5,2),
  price_per_oz      numeric(5,3) not null default 0,
  image_url         text,
  tags              text[],              -- ['grain-free', 'senior-friendly', ...]
  is_premium        boolean default false,
  is_active         boolean default true,
  created_at        timestamptz default now()
);


-- ─────────────────────────────────────────────────────────────────────────────
-- PET ALLERGIES (normalized)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.pet_allergies (
  id             uuid default uuid_generate_v4() primary key,
  pet_id         uuid references public.pets on delete cascade not null,
  ingredient_id  uuid references public.ingredients,  -- null = free-text allergy
  allergy_name   text,                                -- free-text fallback (e.g. 'chicken')
  severity       text check (severity in ('mild', 'moderate', 'severe')) default 'moderate',
  notes          text,
  created_at     timestamptz default now(),
  constraint allergy_has_source check (ingredient_id is not null or allergy_name is not null)
);

alter table public.pet_allergies enable row level security;
create policy "Users manage own pet allergies" on public.pet_allergies for all
  using (exists (select 1 from public.pets where id = pet_id and user_id = auth.uid()));


-- ─────────────────────────────────────────────────────────────────────────────
-- PET HEALTH GOALS (normalized)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.pet_health_goals (
  id          uuid default uuid_generate_v4() primary key,
  pet_id      uuid references public.pets on delete cascade not null,
  goal_type   text not null check (goal_type in (
                'weight_loss', 'weight_gain', 'sensitive_stomach',
                'skin_coat', 'joint_support', 'senior_health',
                'puppy_growth', 'high_energy', 'kidney_support', 'dental_health'
              )),
  created_at  timestamptz default now()
);

alter table public.pet_health_goals enable row level security;
create policy "Users manage own pet health goals" on public.pet_health_goals for all
  using (exists (select 1 from public.pets where id = pet_id and user_id = auth.uid()));


-- ─────────────────────────────────────────────────────────────────────────────
-- INGREDIENT ↔ PET TYPE COMPATIBILITY
-- ─────────────────────────────────────────────────────────────────────────────
create table public.ingredient_pet_types (
  id             uuid default uuid_generate_v4() primary key,
  ingredient_id  uuid references public.ingredients on delete cascade not null,
  pet_type_id    int  references public.pet_types not null,
  is_allowed     boolean not null default true,
  notes          text,   -- e.g. 'cats cannot convert plant-based proteins efficiently'
  unique (ingredient_id, pet_type_id)
);


-- ─────────────────────────────────────────────────────────────────────────────
-- INGREDIENT SAFETY RULES
-- ─────────────────────────────────────────────────────────────────────────────
create table public.ingredient_rules (
  id               uuid default uuid_generate_v4() primary key,
  ingredient_id    uuid references public.ingredients on delete cascade not null,
  pet_type_id      int  references public.pet_types,   -- null = applies to all pet types
  rule_type        text not null check (rule_type in (
                     'forbidden', 'max_dose', 'age_restriction',
                     'weight_restriction', 'condition_warning'
                   )),
  description      text not null,                      -- human-readable label for UI
  max_oz_per_meal  numeric(4,2),                       -- null if forbidden
  min_age_months   int,
  max_weight_lbs   numeric(5,1),
  is_forbidden     boolean not null default false,     -- hard block in bowl builder
  severity         text check (severity in ('warning', 'danger', 'fatal')) default 'warning',
  created_at       timestamptz default now()
);
-- Forbidden ingredient seed data is in seed.sql after ingredients are populated.


-- ─────────────────────────────────────────────────────────────────────────────
-- MEALS
-- ─────────────────────────────────────────────────────────────────────────────
create table public.meals (
  id               uuid default uuid_generate_v4() primary key,
  pet_type_id      int  references public.pet_types not null default 1,
  name             text not null,
  description      text,
  tagline          text,
  life_stage       text check (life_stage in ('puppy', 'adult', 'senior', 'all_stages'))
                     default 'all_stages',
  best_for         text,                    -- short UI string, e.g. 'Active dogs'
  total_calories   int,
  protein_pct      numeric(4,1),
  fat_pct          numeric(4,1),
  fiber_pct        numeric(4,1),
  base_price       numeric(6,2) not null,
  image_url        text,
  badge            text,                    -- 'Popular', 'New', 'Vet Approved'
  tags             text[],
  is_active        boolean default true,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Publicly readable; writes restricted to admin role at API layer
alter table public.meals enable row level security;
create policy "Anyone can view active meals" on public.meals for select using (is_active = true);


-- Meal ↔ ingredient join (replaces the old ingredients[] text array)
create table public.meal_ingredients (
  id             uuid default uuid_generate_v4() primary key,
  meal_id        uuid references public.meals on delete cascade not null,
  ingredient_id  uuid references public.ingredients not null,
  quantity_oz    numeric(4,2) not null,
  sort_order     int default 0,           -- display order on meal detail card
  unique (meal_id, ingredient_id)
);


-- ─────────────────────────────────────────────────────────────────────────────
-- NUTRITION RULES (per pet type + life stage)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.nutrition_rules (
  id                  uuid default uuid_generate_v4() primary key,
  pet_type_id         int  references public.pet_types not null,
  life_stage          text not null check (life_stage in ('puppy', 'adult', 'senior', 'all_stages')),
  min_protein_pct     numeric(4,1),
  min_fat_pct         numeric(4,1),
  max_fiber_pct       numeric(4,1),
  required_nutrients  text[],             -- e.g. ['taurine'] for cats
  notes               text,
  unique (pet_type_id, life_stage)
);

insert into public.nutrition_rules
  (pet_type_id, life_stage, min_protein_pct, min_fat_pct, max_fiber_pct, required_nutrients, notes)
values
  (1, 'puppy',      28, 17, 5,  '{}',         'Higher protein and fat for growth'),
  (1, 'adult',      18, 5,  5,  '{}',         'AAFCO adult maintenance standard'),
  (1, 'senior',     18, 5,  8,  '{}',         'Lower fat, higher fiber for joint and digestive health'),
  (1, 'all_stages', 18, 5,  5,  '{}',         'General dog formula'),
  (2, 'puppy',      30, 20, 5,  '{taurine}',  'Kitten formula: high calorie, taurine required'),
  (2, 'adult',      26, 9,  5,  '{taurine}',  'Taurine required — cats cannot synthesize it'),
  (2, 'senior',     30, 9,  5,  '{taurine}',  'Higher protein to maintain muscle mass in senior cats'),
  (2, 'all_stages', 26, 9,  5,  '{taurine}',  'General cat formula');


-- ─────────────────────────────────────────────────────────────────────────────
-- CUSTOM RECIPES (formerly custom_bowls)
-- ─────────────────────────────────────────────────────────────────────────────
create table public.custom_recipes (
  id                uuid default uuid_generate_v4() primary key,
  user_id           uuid references auth.users on delete cascade not null,
  pet_id            uuid references public.pets,
  pet_type_id       int  references public.pet_types not null default 1,
  name              text not null default 'My Custom Bowl',
  portion_oz        numeric(4,1),
  total_price       numeric(6,2),
  total_calories    int,
  protein_pct       numeric(4,1),
  fat_pct           numeric(4,1),
  fiber_pct         numeric(4,1),
  nutrition_status  text check (nutrition_status in ('balanced', 'warning', 'incomplete')),
  is_favorite       boolean default false,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

alter table public.custom_recipes enable row level security;
create policy "Users manage own recipes" on public.custom_recipes for all using (auth.uid() = user_id);


-- Custom recipe ingredients with quantity + snapshots
create table public.custom_recipe_ingredients (
  id                 uuid default uuid_generate_v4() primary key,
  custom_recipe_id   uuid references public.custom_recipes on delete cascade not null,
  ingredient_id      uuid references public.ingredients not null,
  quantity_oz        numeric(4,2) not null,
  calories_snapshot  numeric(6,1),   -- calories_per_oz * quantity_oz at time of save
  price_snapshot     numeric(5,3),   -- price_per_oz at time of save
  created_at         timestamptz default now()
);

alter table public.custom_recipe_ingredients enable row level security;
create policy "Users manage own recipe ingredients" on public.custom_recipe_ingredients for all
  using (exists (
    select 1 from public.custom_recipes where id = custom_recipe_id and user_id = auth.uid()
  ));


-- ─────────────────────────────────────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────────────────────────────────────
create table public.orders (
  id                  uuid default uuid_generate_v4() primary key,
  user_id             uuid references auth.users on delete cascade not null,
  pet_id              uuid references public.pets,
  status              text default 'confirmed' check (status in (
                        'confirmed', 'preparing', 'packed',
                        'out_for_delivery', 'delivered', 'cancelled'
                      )),
  total_amount        numeric(8,2) not null,
  delivery_address    text,
  subscription_type   text check (subscription_type in ('weekly', 'biweekly', 'monthly')),
  -- Phase 1: Stripe
  payment_intent_id   text,
  payment_status      text check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  notes               text,
  created_at          timestamptz default now(),
  delivered_at        timestamptz
);

alter table public.orders enable row level security;
create policy "Users view own orders" on public.orders for all using (auth.uid() = user_id);


-- Order line items — snapshots ensure order history is immutable
create table public.order_items (
  id                   uuid default uuid_generate_v4() primary key,
  order_id             uuid references public.orders on delete cascade not null,
  meal_id              uuid references public.meals,           -- one of these two, not both
  custom_recipe_id     uuid references public.custom_recipes,
  quantity             int default 1,
  item_name_snapshot   text not null,         -- meal/recipe name at time of order
  unit_price_snapshot  numeric(6,2) not null, -- price at time of order
  calories_snapshot    int,                   -- calories at time of order
  constraint item_has_source check (meal_id is not null or custom_recipe_id is not null)
);

alter table public.order_items enable row level security;
create policy "Users view own order items" on public.order_items for all
  using (exists (
    select 1 from public.orders where id = order_id and user_id = auth.uid()
  ));


-- ─────────────────────────────────────────────────────────────────────────────
-- VIEWS
-- ─────────────────────────────────────────────────────────────────────────────

-- Pet with type name and computed age
create or replace view public.pets_summary as
select
  p.*,
  pt.name                                           as pet_type,
  date_part('year', age(p.birth_date))::int         as age_years
from public.pets p
join public.pet_types pt on pt.id = p.pet_type_id;


-- Recipe with live nutrition totals (for display in bowl builder)
create or replace view public.recipe_nutrition as
select
  cr.id                                                        as recipe_id,
  cr.name,
  cr.user_id,
  sum(cri.quantity_oz)                                         as total_oz,
  round(sum(cri.quantity_oz * i.calories_per_oz), 1)           as total_calories,
  round(
    sum(cri.quantity_oz * i.protein_g_per_oz * 4) /
    nullif(sum(cri.quantity_oz * i.calories_per_oz), 0) * 100, 1
  )                                                            as protein_pct,
  round(
    sum(cri.quantity_oz * i.fat_g_per_oz * 9) /
    nullif(sum(cri.quantity_oz * i.calories_per_oz), 0) * 100, 1
  )                                                            as fat_pct,
  round(sum(cri.quantity_oz * i.price_per_oz), 2)              as total_price_live
from public.custom_recipes cr
join public.custom_recipe_ingredients cri on cri.custom_recipe_id = cr.id
join public.ingredients i on i.id = cri.ingredient_id
group by cr.id, cr.name, cr.user_id;


-- ─────────────────────────────────────────────────────────────────────────────
-- PHASE 1+ STUBS (uncomment when building each feature)
-- ─────────────────────────────────────────────────────────────────────────────

-- reviews (Phase 1)
-- create table public.reviews (
--   id            uuid default uuid_generate_v4() primary key,
--   order_id      uuid references public.orders on delete cascade not null,
--   meal_id       uuid references public.meals,
--   pet_id        uuid references public.pets,
--   rating        int check (rating between 1 and 5) not null,
--   comment       text,
--   pet_reaction  text check (pet_reaction in ('loved_it', 'liked_it', 'not_a_fan')),
--   created_at    timestamptz default now()
-- );

-- loyalty_points (Phase 2)
-- create table public.loyalty_points (
--   id          uuid default uuid_generate_v4() primary key,
--   user_id     uuid references auth.users not null,
--   order_id    uuid references public.orders,
--   points      int not null,
--   type        text check (type in ('earned', 'redeemed', 'expired', 'bonus')),
--   expires_at  timestamptz,
--   created_at  timestamptz default now()
-- );

-- referrals (Phase 2)
-- create table public.referrals (
--   id           uuid default uuid_generate_v4() primary key,
--   referrer_id  uuid references auth.users not null,
--   referee_id   uuid references auth.users,
--   status       text check (status in ('pending', 'converted', 'credited')),
--   credited_at  timestamptz,
--   created_at   timestamptz default now()
-- );
