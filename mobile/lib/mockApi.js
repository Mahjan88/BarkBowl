import { MOCK_MEALS, MOCK_INGREDIENTS, MOCK_ORDERS, MOCK_DOGS } from './mockData'

// Simulates network latency
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms))

// In-memory state (persists for the session)
let dogs   = [...MOCK_DOGS]
let orders = [...MOCK_ORDERS]
let bowls  = []
let nextDogId   = 100
let nextOrderId = 100

export const mockApi = {
  async get(path) {
    await delay()

    if (path === '/meals')       return [...MOCK_MEALS]
    if (path === '/ingredients') return [...MOCK_INGREDIENTS]
    if (path === '/dogs')        return [...dogs]
    if (path === '/orders')      return [...orders]
    if (path === '/bowls')       return [...bowls]

    if (path.startsWith('/meals/')) {
      const id = path.split('/')[2]
      const m  = MOCK_MEALS.find(m => m.id === id)
      if (!m) throw new Error('Meal not found')
      return m
    }
    if (path.startsWith('/orders/')) {
      const id = path.split('/')[2]
      const o  = orders.find(o => o.id === id)
      if (!o) throw new Error('Order not found')
      return o
    }

    throw new Error(`Mock GET not implemented for ${path}`)
  },

  async post(path, body) {
    await delay(500)

    if (path === '/dogs') {
      const dog = { id: `dog-${++nextDogId}`, user_id: 'mock-user-001', created_at: new Date().toISOString(), ...body }
      dogs = [...dogs, dog]
      return dog
    }

    if (path === '/orders') {
      const order = {
        id:          `order-mock${++nextOrderId}`,
        user_id:     'mock-user-001',
        status:      'confirmed',
        created_at:  new Date().toISOString(),
        dogs:        dogs.find(d => d.id === body.dog_id) ? { name: dogs.find(d => d.id === body.dog_id).name } : null,
        order_items: (body.items || []).map((item, i) => ({ id: `oi-new-${i}`, ...item, order_id: `order-mock${nextOrderId}` })),
        ...body,
      }
      orders = [order, ...orders]
      return order
    }

    if (path === '/bowls') {
      const bowl = { id: `bowl-${Date.now()}`, user_id: 'mock-user-001', created_at: new Date().toISOString(), ...body }
      bowls = [bowl, ...bowls]
      return bowl
    }

    throw new Error(`Mock POST not implemented for ${path}`)
  },

  async put(path, body) {
    await delay(400)

    if (path.startsWith('/dogs/')) {
      const id = path.split('/')[2]
      dogs = dogs.map(d => d.id === id ? { ...d, ...body } : d)
      return dogs.find(d => d.id === id)
    }

    throw new Error(`Mock PUT not implemented for ${path}`)
  },

  async patch(path, body) {
    await delay(300)

    if (path.startsWith('/orders/') && path.endsWith('/cancel')) {
      const id = path.split('/')[2]
      orders = orders.map(o => o.id === id ? { ...o, status: 'cancelled' } : o)
      return orders.find(o => o.id === id)
    }

    if (path.startsWith('/bowls/') && path.endsWith('/favorite')) {
      const id = path.split('/')[2]
      bowls = bowls.map(b => b.id === id ? { ...b, ...body } : b)
      return bowls.find(b => b.id === id)
    }

    throw new Error(`Mock PATCH not implemented for ${path}`)
  },

  async delete(path) {
    await delay(300)

    if (path.startsWith('/dogs/')) {
      const id = path.split('/')[2]
      dogs = dogs.filter(d => d.id !== id)
      return { success: true }
    }
    if (path.startsWith('/bowls/')) {
      const id = path.split('/')[2]
      bowls = bowls.filter(b => b.id !== id)
      return { success: true }
    }

    throw new Error(`Mock DELETE not implemented for ${path}`)
  },
}
