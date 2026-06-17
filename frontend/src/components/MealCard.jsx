import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'

const BADGE_COLORS = {
  Popular:        'bg-amber-100 text-amber-700',
  'High Protein': 'bg-rose-100 text-rose-700',
  'Vet Approved': 'bg-teal-100 text-teal-700',
  Premium:        'bg-purple-100 text-purple-700',
  Puppy:          'bg-yellow-100 text-yellow-700',
  Senior:         'bg-blue-100 text-blue-700',
  'Weight Control': 'bg-green-100 text-green-700',
}

// Emoji-based meal avatars until real images are added
const MEAL_EMOJIS = {
  'Chicken & Rice Comfort Bowl': '🍗',
  'Beef Power Bowl':             '🥩',
  'Turkey Sensitive Stomach Bowl': '🦃',
  'Salmon Skin & Coat Bowl':     '🐟',
  'Puppy Growth Bowl':           '🐾',
  'Senior Wellness Bowl':        '🌿',
  'Low-Calorie Lean Bowl':       '🥦',
}

export default function MealCard({ meal, onView }) {
  const { addItem } = useCart()

  const handleAdd = (e) => {
    e.stopPropagation()
    addItem({
      id:        meal.id,
      type:      'meal',
      name:      meal.name,
      price:     meal.base_price,
      meal_id:   meal.id,
    })
  }

  return (
    <div
      className="card cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onView?.(meal)}
    >
      {/* Image area */}
      <div className="bg-gradient-to-br from-teal-50 to-amber-50 h-36 flex items-center justify-center relative">
        <span className="text-6xl">{MEAL_EMOJIS[meal.name] || '🍽️'}</span>
        {meal.badge && (
          <span className={`absolute top-3 right-3 badge ${BADGE_COLORS[meal.badge] || 'bg-stone-100 text-stone-600'}`}>
            {meal.badge}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-stone-800 leading-tight">{meal.name}</h3>
        <p className="text-xs text-stone-500 mt-0.5 mb-2 line-clamp-2">{meal.tagline}</p>

        {/* Macros row */}
        <div className="flex gap-3 text-xs text-stone-500 mb-3">
          <span>🔥 {meal.calories} kcal</span>
          <span>💪 {meal.protein_pct}% protein</span>
        </div>

        {/* Best for */}
        <p className="text-xs text-teal-700 font-medium mb-3">
          Best for: {meal.best_for}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-stone-800">${parseFloat(meal.base_price).toFixed(2)}</span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-teal-600 text-white text-sm font-semibold
                       px-3 py-1.5 rounded-lg hover:bg-teal-700 active:scale-95 transition-all"
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
