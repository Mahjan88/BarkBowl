import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import BottomNav      from './components/BottomNav'
import AuthPage       from './pages/AuthPage'
import HomePage       from './pages/HomePage'
import MealsPage      from './pages/MealsPage'
import BuildBowlPage  from './pages/BuildBowlPage'
import CartPage       from './pages/CartPage'
import CheckoutPage   from './pages/CheckoutPage'
import OrdersPage     from './pages/OrdersPage'
import DogProfilePage from './pages/DogProfilePage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-4xl animate-bounce">🐾</span>
    </div>
  )
  return user ? children : <Navigate to="/auth" replace />
}

export default function App() {
  const { user } = useAuth()

  return (
    <>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />

        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/meals" element={<ProtectedRoute><MealsPage /></ProtectedRoute>} />
        <Route path="/build" element={<ProtectedRoute><BuildBowlPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><DogProfilePage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {user && <BottomNav />}
    </>
  )
}
