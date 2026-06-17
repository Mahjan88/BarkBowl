import express from 'express'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// GET /api/orders — user's order history
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id, quantity, unit_price, item_name,
        meal_id, custom_bowl_id
      ),
      dogs ( name, breed )
    `)
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// GET /api/orders/:id — single order
router.get('/:id', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('orders')
    .select(`
      *,
      order_items ( * ),
      dogs ( name, breed )
    `)
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .single()

  if (error) return res.status(404).json({ error: 'Order not found' })
  res.json(data)
})

// POST /api/orders — place new order
router.post('/', requireAuth, async (req, res) => {
  const { dog_id, items, total_amount, delivery_address, subscription_type, notes } = req.body

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must have at least one item' })
  }

  // Create the order
  const { data: order, error: orderErr } = await req.supabase
    .from('orders')
    .insert({
      user_id: req.user.id,
      dog_id,
      total_amount,
      delivery_address,
      subscription_type,
      notes,
      status: 'confirmed',
    })
    .select()
    .single()

  if (orderErr) return res.status(500).json({ error: orderErr.message })

  // Insert order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    meal_id: item.meal_id || null,
    custom_bowl_id: item.custom_bowl_id || null,
    quantity: item.quantity,
    unit_price: item.unit_price,
    item_name: item.item_name,
  }))

  const { error: itemsErr } = await req.supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsErr) return res.status(500).json({ error: itemsErr.message })

  res.status(201).json(order)
})

// PATCH /api/orders/:id/cancel
router.patch('/:id/cancel', requireAuth, async (req, res) => {
  const { data, error } = await req.supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .eq('status', 'confirmed')  // can only cancel confirmed orders
    .select()
    .single()

  if (error) return res.status(400).json({ error: 'Cannot cancel this order' })
  res.json(data)
})

export default router
