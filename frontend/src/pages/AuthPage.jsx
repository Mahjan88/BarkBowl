import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const [mode, setMode]         = useState('login')  // 'login' | 'signup'
  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let result
      if (mode === 'signup') {
        if (!fullName.trim()) throw new Error('Please enter your name')
        result = await signUp(email, password, fullName)
        if (result.error) throw result.error
        // After signup, session is auto-set
        navigate('/')
      } else {
        result = await signIn(email, password)
        if (result.error) throw result.error
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-stone-50 to-amber-50
                    flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl">🐾</span>
          <h1 className="text-3xl font-extrabold text-stone-800 mt-2">BarkBowl</h1>
          <p className="text-stone-500 mt-1 text-sm">Fresh custom meals for your best friend</p>
        </div>

        <div className="card p-6">
          {/* Tab switcher */}
          <div className="flex bg-stone-100 rounded-xl p-1 mb-6">
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all capitalize
                            ${mode === m ? 'bg-white shadow-sm text-stone-800' : 'text-stone-500'}`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Your Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Sarah"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {mode === 'login' && (
            <p className="text-center text-xs text-stone-400 mt-4">
              Don't have an account?{' '}
              <button className="text-teal-600 font-medium" onClick={() => setMode('signup')}>Sign up free</button>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-stone-400 mt-6">
          Fresh meals. Happy tails. 🐶
        </p>
      </div>
    </div>
  )
}
