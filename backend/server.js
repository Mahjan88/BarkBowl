import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import mealsRouter       from './routes/meals.js'
import ingredientsRouter from './routes/ingredients.js'
import petsRouter from './routes/pets.js'
import ordersRouter      from './routes/orders.js'
import bowlsRouter       from './routes/bowls.js'

const app = express()
const PORT = process.env.PORT || 3001

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}))
app.use(express.json())

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'PawBowl API' }))

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/meals',       mealsRouter)
app.use('/api/ingredients', ingredientsRouter)
app.use('/api/pets', petsRouter)
app.use('/api/orders',      ordersRouter)
app.use('/api/bowls',       bowlsRouter)

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route ${req.path} not found` }))

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🐾 PawBowl API running on http://localhost:${PORT}`)
})
