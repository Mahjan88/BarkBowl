import { useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { items, total, updateQty, removeItem, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 pb-24">
        <span className="text-6xl mb-4">🛒</span>
        <h2 className="text-xl font-bold text-stone-700">Your cart is empty</h2>
        <p className="text-stone-400 text-sm mt-1 mb-6">Add a meal or build a custom bowl to get started.</p>
        <button onClick={() => navigate('/meals')} className="btn-primary">Browse Meals</button>
        <button onClick={() => navigate('/build')} className="btn-secondary mt-3">Build a Bowl</button>
      </div>
    )
  }

  return (
    <div className="pb-36 max-w-lg mx-auto">
      <div className="px-4 pt-12 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-800">Your Cart</h1>
          <p className="text-stone-500 text-sm">{items.length} item{items.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={clearCart} className="text-sm text-rose-500 font-medium">Clear all</button>
      </div>

      <div className="px-4 space-y-3">
        {items.map(item => (
          <div key={item.id} className="card p-4 flex gap-3">
            <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center text-3xl shrink-0">
              {item.type === 'custom' ? '🍲' : '🍽️'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 truncate">{item.name}</p>
              {item.type === 'custom' && item.ingredients && (
                <p className="text-xs text-stone-400 truncate mt-0.5">
                  {item.ingredients.slice(0, 3).join(', ')}{item.ingredients.length > 3 ? '…' : ''}
                </p>
              )}
              <p className="text-sm font-bold text-teal-700 mt-1">${parseFloat(item.price).toFixed(2)}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={() => removeItem(item.id)} className="text-stone-300 hover:text-rose-400 transition-colors">
                <Trash2 size={16} />
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200"
                >
                  <Minus size={12} />
                </button>
                <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 hover:bg-teal-200"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order summary sticky footer */}
      <div className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto px-4 z-30">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-4">
          <div className="space-y-1.5 mb-3">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm text-stone-600">
                <span className="truncate max-w-[60%]">{item.name} × {item.quantity}</span>
                <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-stone-800 pt-2 border-t border-stone-100">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} />
            Checkout · ${total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  )
}
