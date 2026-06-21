-- =============================================
-- PawBowl Seed Data v2
-- Run AFTER schema.sql
-- =============================================
-- Note: ingredient_categories and nutrition_rules are
-- seeded directly in schema.sql — no need to repeat here.


-- ─────────────────────────────────────────────────────────────────────────────
-- INGREDIENTS
-- ─────────────────────────────────────────────────────────────────────────────

-- Proteins (category_id = 1)
insert into public.ingredients
  (category_id, name, description, calories_per_oz, protein_g_per_oz, fat_g_per_oz, fiber_g_per_oz, price_per_oz, tags, is_premium)
values
  (1, 'Chicken',  'Lean, easily digestible protein great for all life stages',   47,  8.80, 1.00, 0.00, 0.38, '{"lean","allergy-friendly","puppy-safe"}',            false),
  (1, 'Turkey',   'Mild, low-fat protein ideal for sensitive stomachs',           44,  8.30, 0.90, 0.00, 0.38, '{"lean","sensitive-stomach","low-fat"}',              false),
  (1, 'Beef',     'Rich, high-protein red meat for active dogs',                  71,  7.60, 4.80, 0.00, 0.45, '{"high-protein","active-dogs"}',                     false),
  (1, 'Salmon',   'Omega-3 rich fish for skin, coat, and brain health',           58,  8.00, 3.50, 0.00, 0.65, '{"omega-3","skin-coat","senior-friendly"}',           true),
  (1, 'Lamb',     'Novel protein great for dogs with chicken or beef allergies',  80,  8.20, 5.80, 0.00, 0.72, '{"novel-protein","allergy-friendly","grain-free"}',   true),
  (1, 'Duck',     'Highly digestible novel protein, rich in iron and B vitamins', 57,  8.10, 3.30, 0.00, 0.80, '{"novel-protein","iron","grain-free"}',               true);

-- Bases (category_id = 2)
insert into public.ingredients
  (category_id, name, description, calories_per_oz, protein_g_per_oz, fat_g_per_oz, fiber_g_per_oz, price_per_oz, tags, is_premium)
values
  (2, 'Brown Rice',   'Wholesome grain for sustained energy and digestion',       109, 2.30, 0.90, 1.80, 0.10, '{"digestible","energy","senior-friendly"}',   false),
  (2, 'Sweet Potato', 'Fiber-rich and naturally sweet; great for digestion',       90, 1.60, 0.10, 2.50, 0.12, '{"high-fiber","digestion","grain-free"}',      false),
  (2, 'Oats',         'Gentle on the stomach with beta-glucan fiber',             110, 3.20, 1.90, 1.70, 0.10, '{"sensitive-stomach","fiber"}',               false),
  (2, 'Quinoa',       'Complete plant protein with all essential amino acids',    111, 4.10, 1.80, 2.80, 0.20, '{"complete-protein","grain-free"}',            true);

-- Vegetables (category_id = 3)
insert into public.ingredients
  (category_id, name, description, calories_per_oz, protein_g_per_oz, fat_g_per_oz, fiber_g_per_oz, price_per_oz, tags, is_premium)
values
  (3, 'Carrots',     'Crunchy, low-calorie veggie full of beta-carotene',          12, 0.30, 0.10, 0.80, 0.08, '{"low-calorie","vision","dental"}',             false),
  (3, 'Peas',        'High in protein and fiber; supports muscle health',           24, 1.60, 0.20, 2.00, 0.08, '{"high-fiber","protein","puppy-safe"}',         false),
  (3, 'Pumpkin',     'Excellent for digestion and soothing upset stomachs',          7, 0.30, 0.10, 0.50, 0.09, '{"digestion","sensitive-stomach"}',             false),
  (3, 'Spinach',     'Iron-rich leafy green for energy and immunity',                6, 0.90, 0.10, 0.70, 0.09, '{"iron","immune-support"}',                     false),
  (3, 'Green Beans', 'Low-calorie crunch that keeps dogs feeling full longer',       9, 0.50, 0.10, 1.00, 0.07, '{"low-calorie","weight-control"}',              false),
  (3, 'Blueberries', 'Antioxidant-rich fruit treat; supports brain and immunity',   16, 0.20, 0.10, 0.60, 0.18, '{"antioxidant","brain","immune-support"}',      false);

-- Boosters (category_id = 4)
insert into public.ingredients
  (category_id, name, description, calories_per_oz, protein_g_per_oz, fat_g_per_oz, fiber_g_per_oz, price_per_oz, tags, is_premium)
values
  (4, 'Fish Oil',           'Omega-3s for a shiny coat, healthy joints, and brain function', 250, 0.00, 28.00, 0.00, 0.40, '{"omega-3","skin-coat","joints"}',                 false),
  (4, 'Probiotics',         'Gut-friendly bacteria to support digestion and immunity',           5, 0.00,  0.00, 0.00, 0.35, '{"digestion","immunity","sensitive-stomach"}',     false),
  (4, 'Joint Support',      'Glucosamine & chondroitin blend for mobility and comfort',         10, 1.00,  0.00, 0.00, 0.50, '{"joints","senior-friendly","mobility"}',          false),
  (4, 'Skin & Coat Blend',  'Biotin and zinc complex for glossy coat and healthy skin',         15, 0.00,  1.00, 0.00, 0.40, '{"skin-coat","biotin"}',                           false),
  (4, 'Immune Boost',       'Vitamin E, C, and beta-glucan for a strong immune system',          8, 0.00,  0.00, 0.00, 0.50, '{"immunity","antioxidant"}',                       true),
  (4, 'Digestive Enzymes',  'Breaks down food more efficiently; reduces bloating',               3, 0.00,  0.00, 0.00, 0.45, '{"digestion","sensitive-stomach"}',                true);


-- ─────────────────────────────────────────────────────────────────────────────
-- INGREDIENT SAFETY RULES (forbidden ingredients)
-- These reference ingredient names, so we look them up by name after insert.
-- ─────────────────────────────────────────────────────────────────────────────
-- Note: onion, garlic, grapes, chocolate, xylitol are NOT in our ingredient
-- catalogue, but we still create rules for them so the bowl builder can warn
-- if a user somehow tries to add them (e.g. via future admin tool).
-- For now these serve as documentation; expand as the catalogue grows.

-- Spinach: safe in small amounts but contains oxalic acid — add a max dose rule
insert into public.ingredient_rules
  (ingredient_id, pet_type_id, rule_type, description, max_oz_per_meal, is_forbidden, severity)
select id, null, 'max_dose',
  'Spinach contains oxalic acid which can affect calcium absorption in large amounts. Keep under 1 oz per meal.',
  1.0, false, 'warning'
from public.ingredients where name = 'Spinach';


-- ─────────────────────────────────────────────────────────────────────────────
-- PRE-MADE MEALS
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.meals
  (pet_type_id, name, description, tagline, life_stage, best_for,
   total_calories, protein_pct, fat_pct, fiber_pct, base_price, badge, tags)
values
  (
    1, 'Chicken & Rice Comfort Bowl',
    'A classic, gentle meal built on lean chicken breast and wholesome brown rice. Packed with carrots and peas for vitamins and fiber.',
    'The go-to bowl for everyday happy tails',
    'all_stages', 'All breeds, everyday nutrition',
    420, 34, 12, 4, 18.99, 'Popular', '{"everyday","all-breeds","balanced"}'
  ),
  (
    1, 'Beef Power Bowl',
    'High-protein beef with quinoa base for sustained energy. Perfect for active dogs who need fuel for their adventures.',
    'Fuel for your adventure-ready pup',
    'adult', 'Active and working dogs',
    520, 40, 18, 3, 22.99, 'High Protein', '{"high-protein","active","energy"}'
  ),
  (
    1, 'Turkey Sensitive Stomach Bowl',
    'Mild turkey with easily digestible oats, soothing pumpkin, and probiotics — formulated for dogs with sensitive digestion.',
    'Gentle on stomachs, big on flavor',
    'all_stages', 'Dogs with sensitive digestion',
    380, 30, 9, 6, 20.99, 'Vet Approved', '{"sensitive-stomach","gentle","digestive-support"}'
  ),
  (
    1, 'Salmon Skin & Coat Bowl',
    'Wild-caught salmon with sweet potato and spinach, boosted with omega-3 fish oil for a glossy coat and healthy skin.',
    'Shine bright from nose to tail',
    'all_stages', 'Dogs with dull coats or dry skin',
    460, 36, 16, 4, 24.99, 'Premium', '{"omega-3","skin-coat","premium"}'
  ),
  (
    1, 'Puppy Growth Bowl',
    'DHA-rich chicken and oats with probiotics and immune-boosting vitamins, designed for growing puppies under 1 year.',
    'The best start for your new best friend',
    'puppy', 'Puppies under 12 months',
    480, 38, 14, 4, 21.99, 'Puppy', '{"puppy","growth","DHA"}'
  ),
  (
    1, 'Senior Wellness Bowl',
    'Light on calories, easy on joints. Salmon, brown rice, and green beans with joint support and fish oil for your older companion.',
    'Healthy aging, happy years ahead',
    'senior', 'Dogs over 7 years',
    320, 28, 10, 6, 23.99, 'Senior', '{"senior","low-calorie","joint-support"}'
  ),
  (
    1, 'Low-Calorie Lean Bowl',
    'Lean turkey, pumpkin, and green beans — a satisfying, nutrient-dense bowl with controlled calories for weight management.',
    'Trim down without missing out',
    'adult', 'Dogs on a weight management plan',
    280, 32, 7, 8, 19.99, 'Weight Control', '{"low-calorie","weight-control","lean"}'
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- MEAL INGREDIENTS (quantities per serving)
-- ─────────────────────────────────────────────────────────────────────────────
-- Helper: look up IDs by name to avoid hardcoded UUIDs

-- Chicken & Rice Comfort Bowl
insert into public.meal_ingredients (meal_id, ingredient_id, quantity_oz, sort_order)
select m.id, i.id,
  case i.name
    when 'Chicken'      then 4.0
    when 'Brown Rice'   then 3.0
    when 'Carrots'      then 1.0
    when 'Peas'         then 1.0
    when 'Fish Oil'     then 0.25
  end,
  case i.name
    when 'Chicken'      then 1
    when 'Brown Rice'   then 2
    when 'Carrots'      then 3
    when 'Peas'         then 4
    when 'Fish Oil'     then 5
  end
from public.meals m
cross join public.ingredients i
where m.name = 'Chicken & Rice Comfort Bowl'
  and i.name in ('Chicken', 'Brown Rice', 'Carrots', 'Peas', 'Fish Oil');

-- Beef Power Bowl
insert into public.meal_ingredients (meal_id, ingredient_id, quantity_oz, sort_order)
select m.id, i.id,
  case i.name
    when 'Beef'           then 4.0
    when 'Quinoa'         then 3.0
    when 'Green Beans'    then 1.0
    when 'Spinach'        then 0.5
    when 'Joint Support'  then 0.25
  end,
  case i.name
    when 'Beef'           then 1
    when 'Quinoa'         then 2
    when 'Green Beans'    then 3
    when 'Spinach'        then 4
    when 'Joint Support'  then 5
  end
from public.meals m
cross join public.ingredients i
where m.name = 'Beef Power Bowl'
  and i.name in ('Beef', 'Quinoa', 'Green Beans', 'Spinach', 'Joint Support');

-- Turkey Sensitive Stomach Bowl
insert into public.meal_ingredients (meal_id, ingredient_id, quantity_oz, sort_order)
select m.id, i.id,
  case i.name
    when 'Turkey'      then 4.0
    when 'Oats'        then 3.0
    when 'Pumpkin'     then 1.0
    when 'Carrots'     then 1.0
    when 'Probiotics'  then 0.25
  end,
  case i.name
    when 'Turkey'      then 1
    when 'Oats'        then 2
    when 'Pumpkin'     then 3
    when 'Carrots'     then 4
    when 'Probiotics'  then 5
  end
from public.meals m
cross join public.ingredients i
where m.name = 'Turkey Sensitive Stomach Bowl'
  and i.name in ('Turkey', 'Oats', 'Pumpkin', 'Carrots', 'Probiotics');

-- Salmon Skin & Coat Bowl
insert into public.meal_ingredients (meal_id, ingredient_id, quantity_oz, sort_order)
select m.id, i.id,
  case i.name
    when 'Salmon'            then 4.0
    when 'Sweet Potato'      then 2.5
    when 'Spinach'           then 0.5
    when 'Green Beans'       then 1.0
    when 'Fish Oil'          then 0.25
    when 'Skin & Coat Blend' then 0.25
  end,
  case i.name
    when 'Salmon'            then 1
    when 'Sweet Potato'      then 2
    when 'Spinach'           then 3
    when 'Green Beans'       then 4
    when 'Fish Oil'          then 5
    when 'Skin & Coat Blend' then 6
  end
from public.meals m
cross join public.ingredients i
where m.name = 'Salmon Skin & Coat Bowl'
  and i.name in ('Salmon', 'Sweet Potato', 'Spinach', 'Green Beans', 'Fish Oil', 'Skin & Coat Blend');

-- Puppy Growth Bowl
insert into public.meal_ingredients (meal_id, ingredient_id, quantity_oz, sort_order)
select m.id, i.id,
  case i.name
    when 'Chicken'       then 4.5
    when 'Oats'          then 2.5
    when 'Peas'          then 1.0
    when 'Carrots'       then 1.0
    when 'Probiotics'    then 0.25
    when 'Immune Boost'  then 0.25
  end,
  case i.name
    when 'Chicken'       then 1
    when 'Oats'          then 2
    when 'Peas'          then 3
    when 'Carrots'       then 4
    when 'Probiotics'    then 5
    when 'Immune Boost'  then 6
  end
from public.meals m
cross join public.ingredients i
where m.name = 'Puppy Growth Bowl'
  and i.name in ('Chicken', 'Oats', 'Peas', 'Carrots', 'Probiotics', 'Immune Boost');

-- Senior Wellness Bowl
insert into public.meal_ingredients (meal_id, ingredient_id, quantity_oz, sort_order)
select m.id, i.id,
  case i.name
    when 'Salmon'         then 3.5
    when 'Brown Rice'     then 2.5
    when 'Green Beans'    then 1.0
    when 'Pumpkin'        then 1.0
    when 'Joint Support'  then 0.25
    when 'Fish Oil'       then 0.25
  end,
  case i.name
    when 'Salmon'         then 1
    when 'Brown Rice'     then 2
    when 'Green Beans'    then 3
    when 'Pumpkin'        then 4
    when 'Joint Support'  then 5
    when 'Fish Oil'       then 6
  end
from public.meals m
cross join public.ingredients i
where m.name = 'Senior Wellness Bowl'
  and i.name in ('Salmon', 'Brown Rice', 'Green Beans', 'Pumpkin', 'Joint Support', 'Fish Oil');

-- Low-Calorie Lean Bowl
insert into public.meal_ingredients (meal_id, ingredient_id, quantity_oz, sort_order)
select m.id, i.id,
  case i.name
    when 'Turkey'       then 3.5
    when 'Sweet Potato' then 2.0
    when 'Pumpkin'      then 1.0
    when 'Green Beans'  then 1.5
    when 'Carrots'      then 1.0
    when 'Probiotics'   then 0.25
  end,
  case i.name
    when 'Turkey'       then 1
    when 'Sweet Potato' then 2
    when 'Pumpkin'      then 3
    when 'Green Beans'  then 4
    when 'Carrots'      then 5
    when 'Probiotics'   then 6
  end
from public.meals m
cross join public.ingredients i
where m.name = 'Low-Calorie Lean Bowl'
  and i.name in ('Turkey', 'Sweet Potato', 'Pumpkin', 'Green Beans', 'Carrots', 'Probiotics');
