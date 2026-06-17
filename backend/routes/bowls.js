import express from 'express'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// GET /api/bowls — user's saved custom bowls
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('custom_bowls')
    .select(`
      *,
      custom_bowl_ingredients (
        ingredient_id,
        ingredients ( id, name, category_id, price_modifier, ingredient_categories(name) )
      )
    `)
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /api/bowls — save a custom bowl
router.post('/', requireAuth, async (req, res) => {
  const { dog_id, name, portion_oz, total_price, total_calories, ingredient_ids } = req.body

  const { data: bowl, error: bowlErr } = await req.supabase
    .from('custom_bowls')
    .insert({ user_id: req.user.id, dog_id, name, portion_oz, total_price, total_calories })
    .select()
    .single()

  if (bowlErr) return res.status(500).json({ error: bowlErr.message })

  if (ingredient_ids && ingredient_ids.length > 0) {
    const links = ingredient_ids.map(id => ({ bowl_id: bowl.id, ingredient_id: id }))
    const { error: linkErr } = await req.supabase
      .from('custom_bowl_ingredients')
      .insert(links)
    if (linkErr) return res.status(500).json({ error: linkErr.message })
  }

  res.status(201).json(bowl)
})

// PATCH /api/bowls/:id/favorite — toggle favorite
router.patch('/:id/favorite', requireAuth, async (req, res) => {
  const { is_favorite } = req.body
  const { data, error } = await req.supabase
    .from('custom_bowls')
    .update({ is_favorite })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// DELETE /api/bowls/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await req.supabase
    .from('custom_bowls')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ success: true })
})

export default router
