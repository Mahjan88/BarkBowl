import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const ACTIVITY_LEVELS = [
  { value: 'low',       label: 'Low',       note: 'Mostly rests' },
  { value: 'moderate',  label: 'Moderate',  note: 'Daily walks'  },
  { value: 'high',      label: 'High',      note: 'Very active'  },
  { value: 'very_high', label: 'Very High', note: 'Working/sport' },
]

const HEALTH_GOALS = [
  'Weight control', 'Shiny coat', 'Joint health', 'Digestive support',
  'High energy', 'Immune support', 'Senior wellness',
]

const COMMON_ALLERGIES = ['Chicken', 'Beef', 'Grain', 'Dairy', 'Fish', 'Eggs', 'Soy']

const EMPTY_FORM = { name: '', breed: '', age_years: '', weight_lbs: '', activity_level: 'moderate', allergies: [], health_goals: [] }

export default function DogProfilePage() {
  const [dogs,    setDogs]    = useState([])
  const [editing, setEditing] = useState(null)   // null | 'new' | dog.id
  const [form,    setForm]    = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')

  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/dogs').then(setDogs).finally(() => setLoading(false))
  }, [])

  const startNew = () => {
    setForm(EMPTY_FORM)
    setEditing('new')
    setError('')
  }

  const startEdit = (dog) => {
    setForm({
      name:           dog.name,
      breed:          dog.breed || '',
      age_years:      dog.age_years || '',
      weight_lbs:     dog.weight_lbs || '',
      activity_level: dog.activity_level || 'moderate',
      allergies:      dog.allergies || [],
      health_goals:   dog.health_goals || [],
    })
    setEditing(dog.id)
    setError('')
  }

  const handleSave = async () => {
    if (!form.name.trim()) return setError('Dog name is required')
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        age_years:  form.age_years  ? parseFloat(form.age_years)  : null,
        weight_lbs: form.weight_lbs ? parseFloat(form.weight_lbs) : null,
      }
      if (editing === 'new') {
        const dog = await api.post('/dogs', payload)
        setDogs(prev => [...prev, dog])
      } else {
        const dog = await api.put(`/dogs/${editing}`, payload)
        setDogs(prev => prev.map(d => d.id === editing ? dog : d))
      }
      setEditing(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (dogId) => {
    if (!confirm('Remove this dog profile?')) return
    await api.delete(`/dogs/${dogId}`)
    setDogs(prev => prev.filter(d => d.id !== dogId))
  }

  const toggleArrayItem = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }))
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <div className="pb-24 max-w-lg mx-auto">
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-2xl font-extrabold text-stone-800">My Dogs</h1>
        <p className="text-stone-500 text-sm">Manage profiles for personalized meals</p>
      </div>

      <div className="px-4 space-y-4">
        {/* Dog cards */}
        {!loading && dogs.map(dog => (
          <div key={dog.id} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl">
                🐶
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-stone-800">{dog.name}</p>
                <p className="text-sm text-stone-500">
                  {[dog.breed, dog.age_years && `${dog.age_years}y`, dog.weight_lbs && `${dog.weight_lbs} lbs`]
                    .filter(Boolean).join(' · ')}
                </p>
                {dog.health_goals?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {dog.health_goals.map(g => (
                      <span key={g} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{g}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(dog)} className="text-stone-400 hover:text-teal-600">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(dog.id)} className="text-stone-400 hover:text-rose-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add dog button */}
        {editing === null && (
          <button
            onClick={startNew}
            className="w-full card p-4 flex items-center gap-3 border-dashed border-2 border-teal-200
                       bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
          >
            <Plus size={20} />
            <span className="font-semibold">Add a dog</span>
          </button>
        )}

        {/* Dog form */}
        {editing !== null && (
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-stone-800">
                {editing === 'new' ? 'New Dog Profile' : 'Edit Profile'}
              </h2>
              <button onClick={() => setEditing(null)} className="text-stone-400">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-medium text-stone-600 mb-1 block">Dog's Name *</label>
                <input className="input" placeholder="e.g. Bella" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1 block">Breed</label>
                <input className="input" placeholder="e.g. Labrador" value={form.breed}
                  onChange={e => setForm(p => ({ ...p, breed: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1 block">Age (years)</label>
                <input className="input" type="number" step="0.5" min="0" placeholder="e.g. 3" value={form.age_years}
                  onChange={e => setForm(p => ({ ...p, age_years: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-stone-600 mb-1 block">Weight (lbs)</label>
                <input className="input" type="number" step="0.5" min="0" placeholder="e.g. 45" value={form.weight_lbs}
                  onChange={e => setForm(p => ({ ...p, weight_lbs: e.target.value }))} />
              </div>
            </div>

            {/* Activity level */}
            <div>
              <label className="text-xs font-medium text-stone-600 mb-2 block">Activity Level</label>
              <div className="grid grid-cols-2 gap-2">
                {ACTIVITY_LEVELS.map(lvl => (
                  <button
                    key={lvl.value}
                    onClick={() => setForm(p => ({ ...p, activity_level: lvl.value }))}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all
                                ${form.activity_level === lvl.value
                                  ? 'border-teal-500 bg-teal-50'
                                  : 'border-stone-100 hover:border-stone-300'}`}
                  >
                    <p className="text-sm font-semibold text-stone-800">{lvl.label}</p>
                    <p className="text-xs text-stone-500">{lvl.note}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div>
              <label className="text-xs font-medium text-stone-600 mb-2 block">Known Allergies</label>
              <div className="flex flex-wrap gap-2">
                {COMMON_ALLERGIES.map(a => (
                  <button
                    key={a}
                    onClick={() => toggleArrayItem('allergies', a)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-all
                                ${form.allergies.includes(a)
                                  ? 'border-rose-400 bg-rose-50 text-rose-700'
                                  : 'border-stone-200 text-stone-600 hover:border-stone-300'}`}
                  >
                    {form.allergies.includes(a) && <span className="mr-1">✕</span>}
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Health goals */}
            <div>
              <label className="text-xs font-medium text-stone-600 mb-2 block">Health Goals</label>
              <div className="flex flex-wrap gap-2">
                {HEALTH_GOALS.map(g => (
                  <button
                    key={g}
                    onClick={() => toggleArrayItem('health_goals', g)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition-all
                                ${form.health_goals.includes(g)
                                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                                  : 'border-stone-200 text-stone-600 hover:border-stone-300'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
              {saving ? 'Saving…' : (
                <span className="flex items-center justify-center gap-2">
                  <Check size={16} />
                  {editing === 'new' ? 'Create Profile' : 'Save Changes'}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Account section */}
        <div className="card p-4 mt-6">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">Account</p>
          <p className="text-sm text-stone-600 mb-3">Signed in as {user?.email}</p>
          <button
            onClick={handleSignOut}
            className="w-full border border-rose-200 text-rose-600 font-medium py-2.5 rounded-xl
                       hover:bg-rose-50 transition-colors text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
