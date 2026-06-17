import { NavLink } from 'react-router-dom'
import { Home, ChefHat, UtensilsCrossed, ClipboardList, Dog } from 'lucide-react'
import { useCart } from '../context/CartContext'

const navItems = [
  { to: '/',        label: 'Home',    Icon: Home },
  { to: '/build',   label: 'Build',   Icon: ChefHat },
  { to: '/meals',   label: 'Meals',   Icon: UtensilsCrossed },
  { to: '/orders',  label: 'Orders',  Icon: ClipboardList },
  { to: '/profile', label: 'Profile', Icon: Dog },
]

export default function BottomNav() {
  const { count } = useCart()

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-stone-100 z-40 safe-area-bottom">
      <div className="flex max-w-lg mx-auto">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors
               ${isActive ? 'text-teal-600' : 'text-stone-400 hover:text-stone-600'}`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                  {label === 'Build' && count > 0 && (
                    <span className="absolute -top-1 -right-2 bg-teal-600 text-white text-[10px] font-bold
                                     w-4 h-4 rounded-full flex items-center justify-center">
                      {count > 9 ? '9+' : count}
                    </span>
                  )}
                </div>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
