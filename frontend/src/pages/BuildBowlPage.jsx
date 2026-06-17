import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Check } from 'lucide-react'
import { api } from '../lib/api'
import IngredientCard from '../components/IngredientCard'
import NutritionBadge from '../components/NutritionBadge'
import { useCart } from '../context/CartContext'

const BASE_PRICE = 12.99
const PORTION_OPTIONS = [
  { label: 'Small',  oz: 4,  note: 'Up to 20 lbs'    },
  { label: 'Medium', oz: 7,  note: '20–50 lbs'       },
  { label: 'Large',  oz: 10, note: '50–80 lbs'       },
  { label: 'XL',     oz: 14, note: '80+ lbs'         },
]

// Calculate a simple nutrition score based on selected ingredients
function calcScore(selectedByCategory) {
  const cats = Object.keys(selectedByCategory)
  const filled = cats.filter(c => selectedByCategory[c].length > 0).length
  const total = 4  // protein, base, vegetable, booster
  const base = Math.round((filled / total) * 70)
  // bonus for variety
  const bonus = cats.reduce((sum, c) => sum + Math.min(selectedByCategory[c].length, 2), 0) * 5
  return Math.min(100, base + bonus)
}

export default function BuildBowlPage() {
  const [categories, setCategories] = useState([])
  const [step,       setStep]       = useState(0)  // 0-3 = ingredient steps, 4 = portion, 5 = review
  const [selected,   setSelected]   = useState({}) // { categoryId: [ingredient, ...] }
  const [portion,    setPortion]    = useState(PORTION_OPTIONS[1])
  const [bowlName,   setBowlName]   = useState('My Custom Bowl')
  const [loading,    setLoading]    = useState(true)
  const [saved,      setSaved]      = useState(false)

  const { addItem } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/ingredients')
      .then(data => {
        setCategories(data)
        // Init selection map
        const init = {}
        data.forEach(cat => { init[cat.id] = [] })
        setSelected(init)
      })
      .finally(() => setLoading(false))
  }, [])

  const currentCat  = categories[step]
  const totalSteps  = categories.length + 2  // ingredients + portion + review
  const progress    = Math.round(((step + 1) / totalSteps) * 100)

  const toggleIngredient = (catId, ingredient) => {
    const isSingleSelect = ['protein', 'base'].includes(currentCat?.name)
    setSelected(prev => {
      const current = prev[catId] || []
      const exists  = current.find(i => i.id === ingredient.id)
      if (exists) {
        return { ...prev, [catId]: current.filter(i => i.id !== ingredient.id) }
      }
      if (isSingleSelect) {
        return { ...prev, [catId]: [ingredient] }
      }
      if (current.length >= 3) return prev  // max 3 per category
      return { ...prev, [catId]: [...current, ingredient] }
    })
  }

  const allIngredients = Object.values(selected).flat()
  const priceModifiers = allIngredients.reduce((sum, i) => sum + parseFloat(i.price_modifier || 0), 0)
  const totalPrice     = BASE_PRICE + priceModifiers
  const totalCalories  = Math.round(
    allIngredients.reduce((sum, i) => sum + parseFloat(i.calories_per_oz || 40), 0) / Math.max(allIngredients.length, 1) * portion.oz
  )
  const nutritionScore = calcScore(selected)

  const handleAddToCart = () => {
    if (allIngredients.length === 0) return
    addItem({
      id:          `custom-${Date.now()}`,
      type:        'custom',
      name:        bowlName,
      price:       totalPrice,
      ingredients: allIngredients.map(i => i.name),
      custom_bowl: { ingredient_ids: allIngredients.map(i => i.id), portion_oz: portion.oz },
    })
    navigate('/cart')
  }

  const handleSave = async () => {
    try {
      await api.post('/bowls', {
        name:           bowlName,
        portion_oz:     portion.oz,
        total_price:    totalPrice,
        total_calories: totalCalories,
        ingredient_ids: allIngredients.map(i => i.id),
      })
      setSaved(true)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl animate-bounce block mb-2">🐾</span>
          <p className="text-stone-500">Loading ingredients…</p>
        </div>
      </div>
    )
  }

  const STEP_LABELS = [...categories.map(c => c.name), 'Portion', 'Review']

  return (
    <div className="pb-32 max-w-lg mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-stone-100 px-4 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-3">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="text-stone-500 hover:text-stone-800">
              <ChevronLeft size={22} />
            </button>
          )}
          <div className="flex-1">
            <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">
              Step {step + 1} of {STEP_LABELS.length}
            </p>
            <h1 className="text-xl font-extrabold text-stone-800 capitalize">
              {step < categories.length
                ? `Pick a ${currentCat?.name}`
                : step === categories.length
                  ? 'Portion Size'
                  : 'Review Your Bowl'}
            </h1>
          </div>
          <span className="text-2xl font-bold text-teal-600">${totalPrice.toFixed(2)}</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step pills */}
        <div className="flex gap-1 mt-2 overflow-x-auto no-scrollbar">
          {STEP_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => i < step && setStep(i)}
              className={`shrink-0 text-xs px-2.5 py-1 rounded-full capitalize font-medium transition-colors
                          ${i === step ? 'bg-teal-600 text-white'
                          : i < step  ? 'bg-teal-100 text-teal-700'
                          :             'bg-stone-100 text-stone-400'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Ingredient selection step */}
        {step < categories.length && currentCat && (
          <div>
            <p className="text-sm text-stone-500 mb-4">
              {currentCat.name === 'protein' || currentCat.name === 'base'
                ? 'Choose one'
                : 'Choose up to 3'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {currentCat.ingredients.map(ingredient => (
                <IngredientCard
                  key={ingredient.id}
                  ingredient={ingredient}
                  category={currentCat.name}
                  selected={selected[currentCat.id]?.some(i => i.id === ingredient.id)}
                  onClick={() => toggleIngredient(currentCat.id, ingredient)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Portion step */}
        {step === categories.length && (
          <div>
            <p className="text-sm text-stone-500 mb-4">Based on your dog's weight</p>
            <div className="space-y-3">
              {PORTION_OPTIONS.map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setPortion(opt)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left
                              ${portion.label === opt.label
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-stone-100 bg-white hover:border-stone-300'}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                                   ${portion.label === opt.label ? 'border-teal-500 bg-teal-500' : 'border-stone-300'}`}>
                    {portion.label === opt.label && <Check size={12} className="text-white" strokeWidth={3} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-stone-800">{opt.label} · {opt.oz} oz</p>
                    <p className="text-sm text-stone-500">{opt.note}</p>
                  </div>
                  <span className="text-sm text-stone-500">~{Math.round(opt.oz * 45)} kcal</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Review step */}
        {step === categories.length + 1 && (
          <div className="space-y-4">
            {/* Bowl name */}
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1 block">Bowl Name</label>
              <input
                className="input"
                value={bowlName}
                onChange={e => setBowlName(e.target.value)}
              />
            </div>

            {/* Selected ingredients by category */}
            {categories.map(cat => {
              const items = selected[cat.id] || []
              return (
                <div key={cat.id}>
                  <p className="text-sm font-semibold text-stone-700 capitalize mb-2">{cat.name}</p>
                  {items.length === 0 ? (
                    <p className="text-sm text-stone-400 italic">None selected</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {items.map(i => (
                        <span key={i.id} className="bg-teal-50 text-teal-700 text-sm font-medium px-3 py-1 rounded-full">
                          {i.name}
                          {i.price_modifier > 0 && <span className="text-teal-400 ml-1">+${parseFloat(i.price_modifier).toFixed(2)}</span>}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Portion */}
            <div>
              <p className="text-sm font-semibold text-stone-700 mb-1">Portion</p>
              <p className="text-stone-600">{portion.label} ({portion.oz} oz) · ~{totalCalories} kcal</p>
            </div>

            {/* Nutrition score */}
            <NutritionBadge score={nutritionScore} />

            {/* Price summary */}
            <div className="card p-4 space-y-2">
              <div className="flex justify-between text-sm text-stone-600">
                <span>Base price</span>
                <span>${BASE_PRICE.toFixed(2)}</span>
              </div>
              {priceModifiers > 0 && (
                <div className="flex justify-between text-sm text-stone-600">
                  <span>Premium add-ons</span>
                  <span>+${priceModifiers.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-stone-800 pt-2 border-t border-stone-100">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={handleSave}
              disabled={saved}
              className="w-full flex items-center justify-center gap-2 border-2 border-teal-200
                         bg-teal-50 text-teal-700 font-semibold py-3 rounded-xl
                         hover:bg-teal-100 transition-colors disabled:opacity-50"
            >
              <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
              {saved ? 'Saved to favorites!' : 'Save as favorite'}
            </button>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-20 left-0 right-0 px-4 max-w-lg mx-auto z-30">
        <div className="bg-white border border-stone-100 rounded-2xl shadow-lg p-3 flex gap-3">
          {step < STEP_LABELS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              Continue
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={allIngredients.length === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
