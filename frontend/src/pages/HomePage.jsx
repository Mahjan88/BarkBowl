import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, RefreshCw, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { api } from '../lib/api'
import MealCard from '../components/MealCard'

export default function HomePage() {
  const { user } = useAuth()
  const { count, total } = useCart()
  const navigate = useNavigate()

  const [meals,    setMeals]    = useState([])
  const [dog,      setDog]      = useState(null)
  const [orders,   setOrders]   = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [mealsData, dogsData, ordersData] = await Promise.all([
          api.get('/meals'),
          api.get('/dogs'),
          api.get('/orders'),
        ])
        setMeals(mealsData.slice(0, 4))
        setDog(dogsData[0] || null)
        setOrders(ordersData.slice(0, 1))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const lastOrder = orders[0]

  return (
    <div className="pb-24 max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white px-5 pt-12 pb-8 rounded-b-3xl">
        <p className="text-teal-200 text-sm font-medium">{greeting()}</p>
        <h1 className="text-2xl font-extrabold mt-0.5">
          {dog ? `What's ${dog.name} eating today? 🐾` : 'Welcome to BarkBowl 🐾'}
        </h1>
        <p className="text-teal-100 text-sm mt-1">
          {dog
            ? `Personalized meals for ${dog.name}`
            : 'Build custom meals for your pup'}
        </p>

        {/* Cart pill */}
        {count > 0 && (
          <button
            onClick={() => navigate('/cart')}
            className="mt-4 flex items-center gap-2 bg-white/20 backdrop-blur rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            <span>🛒 {count} item{count > 1 ? 's' : ''}</span>
            <span className="text-teal-200">·</span>
            <span>${total.toFixed(2)}</span>
            <ArrowRight size={14} className="ml-auto" />
          </button>
        )}
      </div>

      <div className="px-4 mt-5 space-y-6">
        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/build')}
            className="card p-4 flex flex-col gap-2 text-left hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
              <ChefHat size={20} className="text-teal-600" />
            </div>
            <span className="font-bold text-stone-800">Build a Bowl</span>
            <span className="text-xs text-stone-500">Custom meal in minutes</span>
          </button>

          <button
            onClick={() => navigate('/meals')}
            className="card p-4 flex flex-col gap-2 text-left hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-amber-600" />
            </div>
            <span className="font-bold text-stone-800">Ready Meals</span>
            <span className="text-xs text-stone-500">Vet-designed combos</span>
          </button>
        </div>

        {/* Re-order last */}
        {lastOrder && (
          <section>
            <h2 className="font-bold text-stone-700 mb-2 flex items-center gap-2">
              <RefreshCw size={16} /> Reorder
            </h2>
            <button
              onClick={() => navigate('/orders')}
              className="card w-full p-4 flex items-center gap-4 text-left hover:shadow-md transition-shadow"
            >
              <span className="text-3xl">🍽️</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-800 truncate">
                  Order #{lastOrder.id.slice(-6).toUpperCase()}
                </p>
                <p className="text-xs text-stone-500">
                  ${parseFloat(lastOrder.total_amount).toFixed(2)} · {new Date(lastOrder.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`badge text-xs ${
                lastOrder.status === 'delivered'      ? 'bg-green-100 text-green-700'  :
                lastOrder.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {lastOrder.status.replace(/_/g, ' ')}
              </span>
            </button>
          </section>
        )}

        {/* No dog profile CTA */}
        {!dog && !loading && (
          <div className="card p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100">
            <p className="font-bold text-stone-800">Set up your dog's profile</p>
            <p className="text-sm text-stone-500 mt-1 mb-3">
              Get personalized meal recommendations based on breed, age, and health goals.
            </p>
            <button onClick={() => navigate('/profile')} className="btn-primary text-sm py-2">
              Create Profile →
            </button>
          </div>
        )}

        {/* Popular meals */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-stone-700">Popular Meals</h2>
            <button onClick={() => navigate('/meals')} className="text-sm text-teal-600 font-medium">
              See all →
            </button>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="card h-52 animate-pulse bg-stone-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {meals.map(meal => (
                <MealCard key={meal.id} meal={meal} onView={() => navigate('/meals')} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
