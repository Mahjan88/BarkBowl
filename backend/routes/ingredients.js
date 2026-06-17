import express from 'express'
import { createClient } from '@supabase/supabase-js'

const router = express.Router()

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// GET /api/ingredients — all ingredients grouped by category
router.get('/', async (req, res) => {
  const supabase = getSupabase()

  const { data: categories, error: catErr } = await supabase
    .from('ingredient_categories')
    .select('*')
    .order('step')

  if (catErr) return res.status(500).json({ error: catErr.message })

  const { data: ingredients, error: ingErr } = await supabase
    .from('ingredients')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (ingErr) return res.status(500).json({ error: ingErr.message })

  // Group ingredients by category
  const grouped = categories.map(cat => ({
    ...cat,
    ingredients: ingredients.filter(i => i.category_id === cat.id),
  }))

  res.json(grouped)
})

export default router
