import { Check } from 'lucide-react'

const CATEGORY_EMOJIS = {
  protein:   { beef: '🥩', chicken: '🍗', turkey: '🦃', salmon: '🐟', lamb: '🐑' },
  base:      { default: '🌾' },
  vegetable: { carrots: '🥕', peas: '🫛', pumpkin: '🎃', spinach: '🥬', 'green beans': '🫘' },
  booster:   { default: '✨' },
}

function getEmoji(category, name) {
  const lower = name.toLowerCase()
  const map = CATEGORY_EMOJIS[category] || {}
  for (const [key, emoji] of Object.entries(map)) {
    if (lower.includes(key)) return emoji
  }
  return map.default || '🌿'
}

export default function IngredientCard({ ingredient, category, selected, onClick }) {
  const emoji = getEmoji(category, ingredient.name)

  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center text-center p-3 rounded-2xl border-2 transition-all
                  ${selected
                    ? 'border-teal-500 bg-teal-50 shadow-md'
                    : 'border-stone-100 bg-white hover:border-stone-300 hover:shadow-sm'}`}
    >
      {selected && (
        <span className="absolute top-2 right-2 bg-teal-500 text-white rounded-full w-5 h-5
                         flex items-center justify-center">
          <Check size={12} strokeWidth={3} />
        </span>
      )}

      <span className="text-3xl mb-1.5">{emoji}</span>
      <span className={`text-sm font-semibold leading-tight ${selected ? 'text-teal-700' : 'text-stone-700'}`}>
        {ingredient.name}
      </span>

      {ingredient.price_modifier > 0 && (
        <span className={`text-xs mt-1 font-medium ${selected ? 'text-teal-600' : 'text-stone-400'}`}>
          +${parseFloat(ingredient.price_modifier).toFixed(2)}
        </span>
      )}

      {ingredient.is_premium && (
        <span className="text-xs mt-1 bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
          Premium
        </span>
      )}

      {ingredient.description && (
        <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-tight">
          {ingredient.description}
        </p>
      )}
    </button>
  )
}
