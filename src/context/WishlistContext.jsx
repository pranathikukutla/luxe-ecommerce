import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('luxe_wishlist') || '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('luxe_wishlist', JSON.stringify(items))
  }, [items])

  const toggle = (product) => {
    setItems(prev => {
      const exists = prev.find(i => i._id === product._id)
      if (exists) {
        toast.success('Removed from wishlist')
        return prev.filter(i => i._id !== product._id)
      }
      toast.success('Added to wishlist!')
      return [...prev, product]
    })
  }

  const isWishlisted = (id) => items.some(i => i._id === id)
  const remove = (id) => setItems(prev => prev.filter(i => i._id !== id))

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, remove, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
