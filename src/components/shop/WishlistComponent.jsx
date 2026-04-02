import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'

export default function WishlistComponent() {
  const { items, remove } = useWishlist()
  const { addItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-surface-hover flex items-center justify-center mb-4">
          <Heart className="w-10 h-10 text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Your wishlist is empty</h3>
        <p className="text-slate-400 mb-6">Save items you love for later</p>
        <Link to="/shop" className="btn-primary">Discover Products</Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Wishlist ({items.length})</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item._id} className="card overflow-hidden group">
            <div className="aspect-square bg-surface-hover relative overflow-hidden">
              <img
                src={item.image || `https://picsum.photos/seed/${item._id}/400/400`}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button
                onClick={() => remove(item._id)}
                className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-surface-card/90 flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs text-slate-500 mb-1">{item.category}</p>
              <h4 className="font-medium text-white mb-2 line-clamp-2">{item.name}</h4>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">₹{item.price?.toLocaleString()}</span>
                <button
                  onClick={() => { addItem(item); remove(item._id) }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/20 hover:bg-brand-500 text-brand-400 hover:text-white rounded-lg transition-all text-sm"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
