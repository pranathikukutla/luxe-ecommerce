import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('luxe_cart') || '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(items))
  }, [items])

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === product._id)
      if (existing) {
        toast.success('Cart updated')
        return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i)
      }
      toast.success('Added to cart!')
      return [...prev, { ...product, quantity }]
    })
  }

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i._id !== id))
    toast.success('Removed from cart')
  }

  const updateQty = (id, quantity) => {
    if (quantity < 1) { removeItem(id); return }
    setItems(prev => prev.map(i => i._id === id ? { ...i, quantity } : i))
  }

  const clearCart = () => { setItems([]) }

  const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
