import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ChefHat } from 'lucide-react'
import { api } from '../lib/api'
import MealCard from '../components/MealCard'
import { useCart } from '../context/CartContext'

const FILTERS = ['All', 'Popular', 'Vet Approved', 'Premium', 'Senior', 'Puppy', 'Weight Control']

export default function MealsPage() {
  const [meals,    setMeals]    = useState([])
  const [filter,   setFilter]   = useState('All')
  const [selected, setSelected] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const { addItem } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/meals')
      .then(setMeals)
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? meals : meals.filter(m => m.badge === filter || m.tags?.includes(filter.toLowerCase()))

  return (
    <div className="pb-24 max-w-lg mx-auto">
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-2xl font-extrabold text-stone-800">Ready Meals</h1>
        <p className="text-stone-500 text-sm mt-1">Vet-designed combos for every pup</p>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar pb-2">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all
                        ${filter === f
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-white text-stone-600 border border-stone-200 hover:border-teal-300'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="px-4 mt-3">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1,2,3,4,5,6].map(i => <div key={i} className="card h-52 animate-pulse bg-stone-100" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-stone-400">No meals found for this filter.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(meal => (
              <MealCard key={meal.id} meal={meal} onView={setSelected} />
            ))}
          </div>
        )}

        {/* Build your own CTA */}
        <button
          onClick={() => navigate('/build')}
          className="mt-6 w-full card p-4 flex items-center gap-3 border-dashed border-2 border-teal-300
                     bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
        >
          <ChefHat size={22} />
          <div className="text-left">
            <p className="font-bold">Can't find the right meal?</p>
            <p className="text-sm text-teal-600">Build your own custom bowl →</p>
          </div>
        </button>
      </div>

      {/* Meal detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setSelected(null)}>
          <div
            className="bg-white w-full max-w-lg mx-auto rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-stone-800">{selected.name}</h2>
                <p className="text-sm text-stone-500 mt-0.5">{selected.best_for}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-stone-400 hover:text-stone-600">
                <X size={22} />
              </button>
            </div>

            <p className="text-stone-600 text-sm mb-4">{selected.description}</p>

            {/* Macros */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: 'Calories', val: selected.calories + ' kcal' },
                { label: 'Protein',  val: selected.protein_pct + '%' },
                { label: 'Fat',      val: selected.fat_pct + '%' },
                { label: 'Fiber',    val: selected.fiber_pct + '%' },
              ].map(({ label, val }) => (
                <div key={label} className="bg-stone-50 rounded-xl p-2 text-center">
                  <p className="text-xs text-stone-500">{label}</p>
                  <p className="font-bold text-stone-800 text-sm">{val}</p>
                </div>
              ))}
            </div>

            {/* Ingredients */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-stone-700 mb-2">Ingredients</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.ingredients?.map(ing => (
                  <span key={ing} className="bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <span className="text-2xl font-extrabold text-stone-800">
                ${parseFloat(selected.base_price).toFixed(2)}
              </span>
              <button
                onClick={() => {
                  addItem({ id: selected.id, type: 'meal', name: selected.name, price: selected.base_price, meal_id: selected.id })
                  setSelected(null)
                }}
                className="btn-primary"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
