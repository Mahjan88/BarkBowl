-- =============================================
-- BarkBowl Seed Data
-- Run AFTER schema.sql
-- =============================================

-- ── Ingredient Categories ────────────────────────────────────────────────────
insert into public.ingredient_categories (name, step) values
  ('protein',   1),
  ('base',      2),
  ('vegetable', 3),
  ('booster',   4);

-- ── Ingredients ─────────────────────────────────────────────────────────────
-- Proteins
insert into public.ingredients (category_id, name, description, calories_per_oz, protein_g, fat_g, fiber_g, price_modifier, tags, is_premium) values
  (1, 'Chicken', 'Lean, easily digestible protein great for all life stages', 47, 8.8, 1.0, 0, 0.00, '{"lean","allergy-friendly","puppy-safe"}', false),
  (1, 'Turkey', 'Mild, low-fat protein ideal for sensitive stomachs', 44, 8.3, 0.9, 0, 0.00, '{"lean","sensitive-stomach","low-fat"}', false),
  (1, 'Beef',   'Rich, high-protein red meat for active dogs', 71, 7.6, 4.8, 0, 1.00, '{"high-protein","active-dogs"}', false),
  (1, 'Salmon', 'Omega-3 rich fish for skin, coat, and brain health', 58, 8.0, 3.5, 0, 2.00, '{"omega-3","skin-coat","senior-friendly"}', true),
  (1, 'Lamb',   'Novel protein great for dogs with chicken/beef allergies', 80, 8.2, 5.8, 0, 3.00, '{"novel-protein","allergy-friendly","grain-free"}', true);

-- Bases
insert into public.ingredients (category_id, name, description, calories_per_oz, protein_g, fat_g, fiber_g, price_modifier, tags, is_premium) values
  (2, 'Brown Rice',    'Wholesome grain for sustained energy and digestion', 109, 2.3, 0.9, 1.8, 0.00, '{"digestible","energy","senior-friendly"}', false),
  (2, 'Sweet Potato',  'Fiber-rich and naturally sweet; great for digestion', 90,  1.6, 0.1, 2.5, 0.00, '{"high-fiber","digestion","grain-free"}', false),
  (2, 'Oats',          'Gentle on the stomach with beta-glucan fiber', 110, 3.2, 1.9, 1.7, 0.00, '{"sensitive-stomach","fiber"}', false),
  (2, 'Quinoa',        'Complete plant protein with all essential amino acids', 111, 4.1, 1.8, 2.8, 1.00, '{"complete-protein","grain-free"}', true);

-- Vegetables
insert into public.ingredients (category_id, name, description, calories_per_oz, protein_g, fat_g, fiber_g, price_modifier, tags, is_premium) values
  (3, 'Carrots',     'Crunchy, low-calorie veggie full of beta-carotene', 12, 0.3, 0.1, 0.8, 0.00, '{"low-calorie","vision","dental"}', false),
  (3, 'Peas',        'High in protein and fiber; supports muscle health', 24, 1.6, 0.2, 2.0, 0.00, '{"high-fiber","protein","puppy-safe"}', false),
  (3, 'Pumpkin',     'Excellent for digestion and soothing upset stomachs', 7,  0.3, 0.1, 0.5, 0.00, '{"digestion","sensitive-stomach"}', false),
  (3, 'Spinach',     'Iron-rich leafy green for energy and immunity', 6,  0.9, 0.1, 0.7, 0.00, '{"iron","immune-support"}', false),
  (3, 'Green Beans', 'Low-calorie crunch that keeps dogs full longer', 9,  0.5, 0.1, 1.0, 0.00, '{"low-calorie","weight-control"}', false);

-- Boosters
insert into public.ingredients (category_id, name, description, calories_per_oz, protein_g, fat_g, fiber_g, price_modifier, tags, is_premium) values
  (4, 'Fish Oil',          'Omega-3s for a shiny coat, healthy joints, and brain function', 250, 0, 28, 0, 1.00, '{"omega-3","skin-coat","joints"}', false),
  (4, 'Probiotics',        'Gut-friendly bacteria to support digestion and immunity',          5, 0,  0, 0, 1.00, '{"digestion","immunity","sensitive-stomach"}', false),
  (4, 'Joint Support',     'Glucosamine & chondroitin blend for mobility and comfort',         10, 1, 0, 0, 1.50, '{"joints","senior-friendly","mobility"}', false),
  (4, 'Skin & Coat Blend', 'Biotin and zinc complex for glossy coat and healthy skin',         15, 0, 1, 0, 1.00, '{"skin-coat","biotin"}', false),
  (4, 'Immune Boost',      'Vitamin E, C, and beta-glucan for a strong immune system',          8, 0, 0, 0, 1.50, '{"immunity","antioxidant"}', true);

-- ── Pre-made Meals ───────────────────────────────────────────────────────────
insert into public.meals (name, description, tagline, best_for, calories, protein_pct, fat_pct, fiber_pct, base_price, badge, tags, ingredients) values
  (
    'Chicken & Rice Comfort Bowl',
    'A classic, gentle meal built on lean chicken breast and wholesome brown rice. Packed with carrots and peas for vitamins and fiber.',
    'The go-to bowl for everyday happy tails',
    'All breeds, everyday nutrition',
    420, 34, 12, 4,
    18.99,
    'Popular',
    '{"everyday","all-breeds","balanced"}',
    '{"Chicken breast","Brown rice","Carrots","Peas","Fish oil"}'
  ),
  (
    'Beef Power Bowl',
    'High-protein beef with quinoa base for sustained energy. Perfect for active dogs who need fuel to keep up with their adventures.',
    'Fuel for your adventure-ready pup',
    'Active and working dogs',
    520, 40, 18, 3,
    22.99,
    'High Protein',
    '{"high-protein","active","energy"}',
    '{"Beef","Quinoa","Green beans","Spinach","Joint support"}'
  ),
  (
    'Turkey Sensitive Stomach Bowl',
    'Mild turkey with easily digestible oats, soothing pumpkin, and probiotics — specifically formulated for dogs with tummy troubles.',
    'Gentle on stomachs, big on flavor',
    'Dogs with sensitive digestion',
    380, 30, 9, 6,
    20.99,
    'Vet Approved',
    '{"sensitive-stomach","gentle","digestive-support"}',
    '{"Turkey","Oats","Pumpkin","Carrots","Probiotics"}'
  ),
  (
    'Salmon Skin & Coat Bowl',
    'Wild-caught salmon with sweet potato and spinach, boosted with omega-3 fish oil for a glossy coat and healthy skin.',
    'Shine bright from nose to tail',
    'Dogs with dull coats or dry skin',
    460, 36, 16, 4,
    24.99,
    'Premium',
    '{"omega-3","skin-coat","premium"}',
    '{"Salmon","Sweet potato","Spinach","Green beans","Fish oil","Skin & coat blend"}'
  ),
  (
    'Puppy Growth Bowl',
    'DHA-rich chicken and oats with extra probiotics and immune-boosting vitamins, designed for growing puppies under 1 year.',
    'The best start for your new best friend',
    'Puppies under 12 months',
    480, 38, 14, 4,
    21.99,
    'Puppy',
    '{"puppy","growth","DHA"}',
    '{"Chicken","Oats","Peas","Carrots","Probiotics","Immune boost"}'
  ),
  (
    'Senior Wellness Bowl',
    'Light on calories, easy on joints. Salmon, brown rice, and green beans with joint support and fish oil for your older companion.',
    'Healthy aging, happy years ahead',
    'Dogs over 7 years',
    320, 28, 10, 6,
    23.99,
    'Senior',
    '{"senior","low-calorie","joint-support"}',
    '{"Salmon","Brown rice","Green beans","Pumpkin","Joint support","Fish oil"}'
  ),
  (
    'Low-Calorie Lean Bowl',
    'Lean turkey, pumpkin, and green beans — a satisfying, nutrient-dense bowl with controlled calories for weight management.',
    'Trim down without missing out',
    'Dogs on a weight management plan',
    280, 32, 7, 8,
    19.99,
    'Weight Control',
    '{"low-calorie","weight-control","lean"}',
    '{"Turkey","Sweet potato","Pumpkin","Green beans","Carrots","Probiotics"}'
  );
