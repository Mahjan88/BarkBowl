// ── Mock data mirrors supabase/seed.sql ──────────────────────────────────────

export const MOCK_USER = {
  id:    'mock-user-001',
  email: 'demo@pawbowl.com',
}

export const MOCK_PETS = [
  {
    id:             'pet-001',
    user_id:        'mock-user-001',
    name:           'Bella',
    breed:          'Golden Retriever',
    age_years:      3,
    weight_lbs:     55,
    activity_level: 'high',
    allergies:      [],
    health_goals:   ['Shiny coat', 'High energy'],
    created_at:     new Date().toISOString(),
  },
]

export const MOCK_MEALS = [
  {
    id: 'meal-001', name: 'Chicken & Rice Comfort Bowl',
    description: 'A classic, gentle meal built on lean chicken breast and wholesome brown rice. Packed with carrots and peas for vitamins and fiber.',
    tagline: 'The go-to bowl for everyday happy tails',
    best_for: 'All breeds, everyday nutrition',
    calories: 420, protein_pct: 34, fat_pct: 12, fiber_pct: 4,
    base_price: 18.99, badge: 'Popular', is_active: true,
    tags: ['everyday', 'all-breeds', 'balanced'],
    ingredients: ['Chicken breast', 'Brown rice', 'Carrots', 'Peas', 'Fish oil'],
  },
  {
    id: 'meal-002', name: 'Beef Power Bowl',
    description: 'High-protein beef with quinoa base for sustained energy. Perfect for active dogs who need fuel to keep up with their adventures.',
    tagline: 'Fuel for your adventure-ready pup',
    best_for: 'Active and working dogs',
    calories: 520, protein_pct: 40, fat_pct: 18, fiber_pct: 3,
    base_price: 22.99, badge: 'High Protein', is_active: true,
    tags: ['high-protein', 'active', 'energy'],
    ingredients: ['Beef', 'Quinoa', 'Green beans', 'Spinach', 'Joint support'],
  },
  {
    id: 'meal-003', name: 'Turkey Sensitive Stomach Bowl',
    description: 'Mild turkey with easily digestible oats, soothing pumpkin, and probiotics — specifically formulated for dogs with tummy troubles.',
    tagline: 'Gentle on stomachs, big on flavor',
    best_for: 'Dogs with sensitive digestion',
    calories: 380, protein_pct: 30, fat_pct: 9, fiber_pct: 6,
    base_price: 20.99, badge: 'Vet Approved', is_active: true,
    tags: ['sensitive-stomach', 'gentle', 'digestive-support'],
    ingredients: ['Turkey', 'Oats', 'Pumpkin', 'Carrots', 'Probiotics'],
  },
  {
    id: 'meal-004', name: 'Salmon Skin & Coat Bowl',
    description: 'Wild-caught salmon with sweet potato and spinach, boosted with omega-3 fish oil for a glossy coat and healthy skin.',
    tagline: 'Shine bright from nose to tail',
    best_for: 'Dogs with dull coats or dry skin',
    calories: 460, protein_pct: 36, fat_pct: 16, fiber_pct: 4,
    base_price: 24.99, badge: 'Premium', is_active: true,
    tags: ['omega-3', 'skin-coat', 'premium'],
    ingredients: ['Salmon', 'Sweet potato', 'Spinach', 'Green beans', 'Fish oil', 'Skin & coat blend'],
  },
  {
    id: 'meal-005', name: 'Puppy Growth Bowl',
    description: 'DHA-rich chicken and oats with extra probiotics and immune-boosting vitamins, designed for growing puppies under 1 year.',
    tagline: 'The best start for your new best friend',
    best_for: 'Puppies under 12 months',
    calories: 480, protein_pct: 38, fat_pct: 14, fiber_pct: 4,
    base_price: 21.99, badge: 'Puppy', is_active: true,
    tags: ['puppy', 'growth', 'DHA'],
    ingredients: ['Chicken', 'Oats', 'Peas', 'Carrots', 'Probiotics', 'Immune boost'],
  },
  {
    id: 'meal-006', name: 'Senior Wellness Bowl',
    description: 'Light on calories, easy on joints. Salmon, brown rice, and green beans with joint support and fish oil for your older companion.',
    tagline: 'Healthy aging, happy years ahead',
    best_for: 'Dogs over 7 years',
    calories: 320, protein_pct: 28, fat_pct: 10, fiber_pct: 6,
    base_price: 23.99, badge: 'Senior', is_active: true,
    tags: ['senior', 'low-calorie', 'joint-support'],
    ingredients: ['Salmon', 'Brown rice', 'Green beans', 'Pumpkin', 'Joint support', 'Fish oil'],
  },
  {
    id: 'meal-007', name: 'Low-Calorie Lean Bowl',
    description: 'Lean turkey, pumpkin, and green beans — a satisfying, nutrient-dense bowl with controlled calories for weight management.',
    tagline: 'Trim down without missing out',
    best_for: 'Dogs on a weight management plan',
    calories: 280, protein_pct: 32, fat_pct: 7, fiber_pct: 8,
    base_price: 19.99, badge: 'Weight Control', is_active: true,
    tags: ['low-calorie', 'weight-control', 'lean'],
    ingredients: ['Turkey', 'Sweet potato', 'Pumpkin', 'Green beans', 'Carrots', 'Probiotics'],
  },
]

export const MOCK_INGREDIENTS = [
  {
    id: 1, name: 'protein', step: 1,
    ingredients: [
      { id: 'ing-p1', category_id: 1, name: 'Chicken',  description: 'Lean, easily digestible protein great for all life stages', calories_per_oz: 47, protein_g: 8.8, fat_g: 1.0, fiber_g: 0, price_modifier: 0,    tags: ['lean','allergy-friendly','puppy-safe'], is_premium: false },
      { id: 'ing-p2', category_id: 1, name: 'Turkey',   description: 'Mild, low-fat protein ideal for sensitive stomachs', calories_per_oz: 44, protein_g: 8.3, fat_g: 0.9, fiber_g: 0, price_modifier: 0,    tags: ['lean','sensitive-stomach','low-fat'], is_premium: false },
      { id: 'ing-p3', category_id: 1, name: 'Beef',     description: 'Rich, high-protein red meat for active dogs', calories_per_oz: 71, protein_g: 7.6, fat_g: 4.8, fiber_g: 0, price_modifier: 1.00, tags: ['high-protein','active-dogs'], is_premium: false },
      { id: 'ing-p4', category_id: 1, name: 'Salmon',   description: 'Omega-3 rich fish for skin, coat, and brain health', calories_per_oz: 58, protein_g: 8.0, fat_g: 3.5, fiber_g: 0, price_modifier: 2.00, tags: ['omega-3','skin-coat','senior-friendly'], is_premium: true },
      { id: 'ing-p5', category_id: 1, name: 'Lamb',     description: 'Novel protein great for dogs with chicken/beef allergies', calories_per_oz: 80, protein_g: 8.2, fat_g: 5.8, fiber_g: 0, price_modifier: 3.00, tags: ['novel-protein','allergy-friendly'], is_premium: true },
    ],
  },
  {
    id: 2, name: 'base', step: 2,
    ingredients: [
      { id: 'ing-b1', category_id: 2, name: 'Brown Rice',   description: 'Wholesome grain for sustained energy and digestion', calories_per_oz: 109, protein_g: 2.3, fat_g: 0.9, fiber_g: 1.8, price_modifier: 0,    tags: ['digestible','energy'], is_premium: false },
      { id: 'ing-b2', category_id: 2, name: 'Sweet Potato', description: 'Fiber-rich and naturally sweet; great for digestion', calories_per_oz: 90,  protein_g: 1.6, fat_g: 0.1, fiber_g: 2.5, price_modifier: 0,    tags: ['high-fiber','grain-free'], is_premium: false },
      { id: 'ing-b3', category_id: 2, name: 'Oats',         description: 'Gentle on the stomach with beta-glucan fiber', calories_per_oz: 110, protein_g: 3.2, fat_g: 1.9, fiber_g: 1.7, price_modifier: 0,    tags: ['sensitive-stomach','fiber'], is_premium: false },
      { id: 'ing-b4', category_id: 2, name: 'Quinoa',       description: 'Complete plant protein with all essential amino acids', calories_per_oz: 111, protein_g: 4.1, fat_g: 1.8, fiber_g: 2.8, price_modifier: 1.00, tags: ['complete-protein','grain-free'], is_premium: true },
    ],
  },
  {
    id: 3, name: 'vegetable', step: 3,
    ingredients: [
      { id: 'ing-v1', category_id: 3, name: 'Carrots',     description: 'Crunchy, low-calorie veggie full of beta-carotene', calories_per_oz: 12, protein_g: 0.3, fat_g: 0.1, fiber_g: 0.8, price_modifier: 0, tags: ['low-calorie','vision'], is_premium: false },
      { id: 'ing-v2', category_id: 3, name: 'Peas',        description: 'High in protein and fiber; supports muscle health', calories_per_oz: 24, protein_g: 1.6, fat_g: 0.2, fiber_g: 2.0, price_modifier: 0, tags: ['high-fiber','protein'], is_premium: false },
      { id: 'ing-v3', category_id: 3, name: 'Pumpkin',     description: 'Excellent for digestion and soothing upset stomachs', calories_per_oz: 7,  protein_g: 0.3, fat_g: 0.1, fiber_g: 0.5, price_modifier: 0, tags: ['digestion','sensitive-stomach'], is_premium: false },
      { id: 'ing-v4', category_id: 3, name: 'Spinach',     description: 'Iron-rich leafy green for energy and immunity', calories_per_oz: 6,  protein_g: 0.9, fat_g: 0.1, fiber_g: 0.7, price_modifier: 0, tags: ['iron','immune-support'], is_premium: false },
      { id: 'ing-v5', category_id: 3, name: 'Green Beans', description: 'Low-calorie crunch that keeps dogs full longer', calories_per_oz: 9,  protein_g: 0.5, fat_g: 0.1, fiber_g: 1.0, price_modifier: 0, tags: ['low-calorie','weight-control'], is_premium: false },
    ],
  },
  {
    id: 4, name: 'booster', step: 4,
    ingredients: [
      { id: 'ing-bo1', category_id: 4, name: 'Fish Oil',          description: "Omega-3s for a shiny coat, healthy joints, and brain function", calories_per_oz: 250, protein_g: 0, fat_g: 28, fiber_g: 0, price_modifier: 1.00, tags: ['omega-3','skin-coat','joints'], is_premium: false },
      { id: 'ing-bo2', category_id: 4, name: 'Probiotics',        description: 'Gut-friendly bacteria to support digestion and immunity', calories_per_oz: 5,   protein_g: 0, fat_g: 0,  fiber_g: 0, price_modifier: 1.00, tags: ['digestion','immunity'], is_premium: false },
      { id: 'ing-bo3', category_id: 4, name: 'Joint Support',     description: 'Glucosamine & chondroitin blend for mobility and comfort', calories_per_oz: 10,  protein_g: 1, fat_g: 0,  fiber_g: 0, price_modifier: 1.50, tags: ['joints','senior-friendly'], is_premium: false },
      { id: 'ing-bo4', category_id: 4, name: 'Skin & Coat Blend', description: 'Biotin and zinc complex for glossy coat and healthy skin', calories_per_oz: 15,  protein_g: 0, fat_g: 1,  fiber_g: 0, price_modifier: 1.00, tags: ['skin-coat','biotin'], is_premium: false },
      { id: 'ing-bo5', category_id: 4, name: 'Immune Boost',      description: 'Vitamin E, C, and beta-glucan for a strong immune system', calories_per_oz: 8,   protein_g: 0, fat_g: 0,  fiber_g: 0, price_modifier: 1.50, tags: ['immunity','antioxidant'], is_premium: true },
    ],
  },
]

export const MOCK_ORDERS = [
  {
    id: 'order-abc123def456',
    user_id: 'mock-user-001',
    pet_id: 'pet-001',
    status: 'out_for_delivery',
    total_amount: 45.98,
    delivery_address: '123 Paw Lane, San Francisco, CA 94105',
    subscription_type: 'weekly',
    notes: '',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    pets: { name: 'Bella', breed: 'Golden Retriever' },
    order_items: [
      { id: 'oi-1', order_id: 'order-abc123def456', meal_id: 'meal-004', quantity: 1, unit_price: 24.99, item_name: 'Salmon Skin & Coat Bowl' },
      { id: 'oi-2', order_id: 'order-abc123def456', meal_id: 'meal-001', quantity: 1, unit_price: 18.99, item_name: 'Chicken & Rice Comfort Bowl' },
    ],
  },
  {
    id: 'order-xyz789ghi012',
    user_id: 'mock-user-001',
    pet_id: 'pet-001',
    status: 'delivered',
    total_amount: 22.99,
    delivery_address: '123 Paw Lane, San Francisco, CA 94105',
    subscription_type: null,
    notes: 'Leave at the door',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    pets: { name: 'Bella', breed: 'Golden Retriever' },
    order_items: [
      { id: 'oi-3', order_id: 'order-xyz789ghi012', meal_id: 'meal-002', quantity: 1, unit_price: 22.99, item_name: 'Beef Power Bowl' },
    ],
  },
]
