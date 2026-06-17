-- =============================================
-- BarkBowl Database Schema
-- Run this in the Supabase SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Profiles (extends auth.users) ───────────────────────────────────────────
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  phone       text,
  address     text,
  city        text,
  state       text,
  zip         text,
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile"    on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"  on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile"  on public.profiles for insert with check (auth.uid() = id);

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

-- ── Dogs ────────────────────────────────────────────────────────────────────
create table public.dogs (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references auth.users on delete cascade not null,
  name            text not null,
  breed           text,
  age_years       numeric(4,1),
  weight_lbs      numeric(5,1),
  activity_level  text check (activity_level in ('low','moderate','high','very_high')),
  allergies       text[],
  health_goals    text[],
  avatar_url      text,
  created_at      timestamptz default now()
);

alter table public.dogs enable row level security;
create policy "Users manage own dogs" on public.dogs for all using (auth.uid() = user_id);

-- ── Ingredient Categories ────────────────────────────────────────────────────
create table public.ingredient_categories (
  id    serial primary key,
  name  text not null,  -- 'protein', 'base', 'vegetable', 'booster'
  step  int  not null   -- build flow step order
);

-- ── Ingredients ─────────────────────────────────────────────────────────────
create table public.ingredients (
  id              uuid default uuid_generate_v4() primary key,
  category_id     int references public.ingredient_categories not null,
  name            text not null,
  description     text,
  calories_per_oz numeric(6,1),
  protein_g       numeric(5,1),
  fat_g           numeric(5,1),
  fiber_g         numeric(5,1),
  price_modifier  numeric(5,2) default 0,  -- extra $ added to bowl
  image_url       text,
  tags            text[],   -- e.g. ['grain-free', 'senior-friendly']
  is_premium      boolean default false,
  is_active       boolean default true
);

-- ── Pre-made Meals ───────────────────────────────────────────────────────────
create table public.meals (
  id              uuid default uuid_generate_v4() primary key,
  name            text not null,
  description     text,
  tagline         text,
  best_for        text,
  calories        int,
  protein_pct     numeric(4,1),
  fat_pct         numeric(4,1),
  fiber_pct       numeric(4,1),
  base_price      numeric(6,2) not null,
  image_url       text,
  badge           text,   -- e.g. 'Popular', 'New', 'Vet Approved'
  tags            text[],
  ingredients     text[],
  is_active       boolean default true,
  created_at      timestamptz default now()
);

-- Meals are public (no RLS needed for reads)
alter table public.meals enable row level security;
create policy "Anyone can view active meals" on public.meals for select using (is_active = true);

-- ── Custom Bowls (saved configurations) ─────────────────────────────────────
create table public.custom_bowls (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references auth.users on delete cascade not null,
  dog_id        uuid references public.dogs,
  name          text not null default 'My Custom Bowl',
  portion_oz    numeric(4,1),
  total_price   numeric(6,2),
  total_calories int,
  is_favorite   boolean default false,
  created_at    timestamptz default now()
);

alter table public.custom_bowls enable row level security;
create policy "Users manage own bowls" on public.custom_bowls for all using (auth.uid() = user_id);

create table public.custom_bowl_ingredients (
  id          uuid default uuid_generate_v4() primary key,
  bowl_id     uuid references public.custom_bowls on delete cascade,
  ingredient_id uuid references public.ingredients
);

-- ── Orders ───────────────────────────────────────────────────────────────────
create table public.orders (
  id                uuid default uuid_generate_v4() primary key,
  user_id           uuid references auth.users on delete cascade not null,
  dog_id            uuid references public.dogs,
  status            text default 'confirmed'
                    check (status in ('confirmed','preparing','packed','out_for_delivery','delivered','cancelled')),
  total_amount      numeric(8,2) not null,
  delivery_address  text,
  subscription_type text,  -- null = one-time, or 'weekly'/'biweekly'/'monthly'
  notes             text,
  created_at        timestamptz default now(),
  delivered_at      timestamptz
);

alter table public.orders enable row level security;
create policy "Users view own orders" on public.orders for all using (auth.uid() = user_id);

create table public.order_items (
  id            uuid default uuid_generate_v4() primary key,
  order_id      uuid references public.orders on delete cascade,
  meal_id       uuid references public.meals,
  custom_bowl_id uuid references public.custom_bowls,
  quantity      int default 1,
  unit_price    numeric(6,2),
  item_name     text not null
);

alter table public.order_items enable row level security;
create policy "Users view own order items" on public.order_items for all
  using (exists (select 1 from public.orders where id = order_id and user_id = auth.uid()));
