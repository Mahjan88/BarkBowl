// Simple nutrition score indicator
export default function NutritionBadge({ score }) {
  // score: 0-100
  const label  = score >= 80 ? 'Excellent' : score >= 60 ? 'Balanced' : score >= 40 ? 'Fair' : 'Incomplete'
  const color  = score >= 80 ? 'text-green-600 bg-green-50 border-green-200'
               : score >= 60 ? 'text-teal-600 bg-teal-50 border-teal-200'
               : score >= 40 ? 'text-amber-600 bg-amber-50 border-amber-200'
               :               'text-rose-600 bg-rose-50 border-rose-200'
  const bar    = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-teal-500' : score >= 40 ? 'bg-amber-400' : 'bg-rose-400'

  return (
    <div className={`rounded-xl border p-3 ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold">Nutrition Score</span>
        <span className="text-sm font-bold">{label}</span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}
