import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.item.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items
          .map(i => i.id === action.id ? { ...i, quantity: action.qty } : i)
          .filter(i => i.quantity > 0),
      }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addItem    = (item)      => dispatch({ type: 'ADD_ITEM',    item })
  const removeItem = (id)        => dispatch({ type: 'REMOVE_ITEM', id })
  const updateQty  = (id, qty)   => dispatch({ type: 'UPDATE_QTY',  id, qty })
  const clearCart  = ()          => dispatch({ type: 'CLEAR' })

  const total    = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count    = state.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items: state.items, total, count, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
