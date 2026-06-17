import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { api } from '../lib/api'

const SUBSCRIPTION_OPTIONS = [
  { value: null,        label: 'One-time order',  discount: 0    },
  { value: 'weekly',    label: 'Weekly delivery', discount: 0.10 },
  { value: 'biweekly',  label: 'Every 2 weeks',   discount: 0.08 },
  { value: 'monthly',   label: 'Monthly',         discount: 0.05 },
]

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [dogs,           setDogs]           = useState([])
  const [dogId,          setDogId]          = useState('')
  const [address,        setAddress]        = useState('')
  const [subscription,   setSubscription]   = useState(SUBSCRIPTION_OPTIONS[0])
  const [notes,          setNotes]          = useState('')
  const [placing,        setPlacing]        = useState(false)
  const [success,        setSuccess]        = useState(false)
  const [orderId,        setOrderId]        = useState(null)
  const [error,          setError]          = useState('')

  useEffect(() => {
    api.get('/dogs').then(setDogs).catch(console.error)
  }, [])

  const discount    = total * subscription.discount
  const finalTotal  = total - discount

  const handlePlaceOrder = async () => {
    if (!address.trim()) return setError('Please enter a delivery address')
    setError('')
    setPlacing(true)

    try {
      const orderItems = items.map(item => ({
        meal_id:        item.meal_id  || null,
        custom_bowl_id: null,
        quantity:       item.quantity,
        unit_price:     parseFloat(item.price),
        item_name:      item.name,
      }))

      const order = await api.post('/orders', {
        dog_id:            dogId || null,
        items:             orderItems,
        total_amount:      finalTotal,
        delivery_address:  address,
        subscription_type: subscription.value,
        notes,
      })

      clearCart()
      setOrderId(order.id)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Order failed. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pb-24">
        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4">
          <Check size={40} className="text-teal-600" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-extrabold text-stone-800">Order Placed! 🐾</h1>
        <p className="text-stone-500 mt-2 mb-1">
          Your meal is being prepared with love.
        </p>
        <p className="text-xs text-stone-400 mb-8">Order #{orderId?.slice(-6).toUpperCase()}</p>
        <button onClick={() => navigate('/orders')} className="btn-primary">
          Track Order
        </button>
        <button onClick={() => navigate('/')} className="btn-secondary mt-3">
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="pb-40 max-w-lg mx-auto">
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-2xl font-extrabold text-stone-800">Checkout</h1>
        <p className="text-stone-500 text-sm">{items.length} item{items.length > 1 ? 's' : ''}</p>
      </div>

      <div className="px-4 space-y-5">
        {/* Dog selection */}
        {dogs.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">For which dog?</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setDogId('')}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all
                            ${!dogId ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-stone-200 text-stone-600'}`}
              >
                All dogs
              </button>
              {dogs.map(dog => (
                <button
                  key={dog.id}
                  onClick={() => setDogId(dog.id)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all
                              ${dogId === dog.id ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-stone-200 text-stone-600'}`}
                >
                  🐶 {dog.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Delivery address */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Delivery Address</label>
          <textarea
            className="input resize-none"
            rows={3}
            placeholder="Street address, city, state, ZIP"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>

        {/* Subscription */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Delivery Schedule</label>
          <div className="space-y-2">
            {SUBSCRIPTION_OPTIONS.map(opt => (
              <button
                key={opt.label}
                onClick={() => setSubscription(opt)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left
                            ${subscription.value === opt.value
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-stone-100 bg-white hover:border-stone-300'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                                 ${subscription.value === opt.value ? 'border-teal-500 bg-teal-500' : 'border-stone-300'}`}>
                  {subscription.value === opt.value && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
                <span className="flex-1 font-medium text-stone-800">{opt.label}</span>
                {opt.discount > 0 && (
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                    Save {Math.round(opt.discount * 100)}%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">Notes (optional)</label>
          <input
            className="input"
            placeholder="e.g. Leave at the door, dog has a salmon allergy"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        {/* Order items */}
        <div className="card p-4">
          <p className="text-sm font-semibold text-stone-700 mb-3">Order Summary</p>
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm text-stone-600">
                <span className="truncate max-w-[65%]">{item.name} × {item.quantity}</span>
                <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600 font-medium pt-1">
                <span>Subscription discount</span>
                <span>−${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-stone-800 pt-2 border-t border-stone-100">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto px-4 z-30">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-3">
          <button
            onClick={handlePlaceOrder}
            disabled={placing || items.length === 0}
            className="btn-primary w-full"
          >
            {placing ? 'Placing Order…' : `Place Order · $${finalTotal.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  )
}
