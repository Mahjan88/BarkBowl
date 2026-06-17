import React, { createContext, useContext, useReducer } from 'react'

const CartContext = createContext(null)

const initialState = { items: [] }

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
      }
    case 'UPDATE_QTY': {
      if (action.payload.qty <= 0) {
        return {
          ...state,
          items: state.items.filter(i => i.id !== action.payload.id),
        }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.qty } : i
        ),
      }
    }
    case 'CLEAR':
      return { ...state, items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const addItem    = (item)           => dispatch({ type: 'ADD_ITEM',    payload: item })
  const removeItem = (id)             => dispatch({ type: 'REMOVE_ITEM', payload: id })
  const updateQty  = (id, qty)        => dispatch({ type: 'UPDATE_QTY',  payload: { id, qty } })
  const clearCart  = ()               => dispatch({ type: 'CLEAR' })

  const total = state.items.reduce((sum, i) => sum + i.base_price * i.quantity, 0)
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      total,
      count,
      addItem,
      removeItem,
      updateQty,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
