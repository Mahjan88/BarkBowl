import express from 'express'
import { createClient } from '@supabase/supabase-js'

const router = express.Router()

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// GET /api/meals — list all active pre-made meals
router.get('/', async (req, res) => {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// GET /api/meals/:id — single meal detail
router.get('/:id', async (req, res) => {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error) return res.status(404).json({ error: 'Meal not found' })
  res.json(data)
})

export default router
