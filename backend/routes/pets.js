import express from 'express'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// GET /api/pets — user's pets
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('pets')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST /api/pets — create pet
router.post('/', requireAuth, async (req, res) => {
  const { name, breed, age_years, weight_lbs, activity_level, allergies, health_goals } = req.body
  if (!name) return res.status(400).json({ error: 'Dog name is required' })

  const { data, error } = await req.supabase
    .from('pets')
    .insert({ user_id: req.user.id, name, breed, age_years, weight_lbs, activity_level, allergies, health_goals })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

// PUT /api/pets/:id — update pet
router.put('/:id', requireAuth, async (req, res) => {
  const { name, breed, age_years, weight_lbs, activity_level, allergies, health_goals } = req.body

  const { data, error } = await req.supabase
    .from('pets')
    .update({ name, breed, age_years, weight_lbs, activity_level, allergies, health_goals })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// DELETE /api/pets/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const { error } = await req.supabase
    .from('pets')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)

  if (error) return res.status(500).json({ error: error.message })
  res.json({ success: true })
})

export default router
