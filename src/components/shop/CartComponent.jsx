import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export default function CartComponent() {
  const { items, removeItem, updateQty, total, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-surface-hover flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10 text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
        <p className="text-slate-400 mb-6">Add some products to get started</p>
        <Link to="/shop" className="btn-primary">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Cart ({items.length})</h2>
        <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-300 transition-colors">
          Clear all
        </button>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.map(item => (
          <div key={item._id} className="card p-4 flex gap-4">
            <img
              src={item.image || `https://picsum.photos/seed/${item._id}/120/120`}
              alt={item.name}
              className="w-20 h-20 rounded-xl object-cover bg-surface-hover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white mb-1 truncate">{item.name}</h4>
              <p className="text-sm text-slate-400 mb-3">{item.category}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-surface rounded-lg">
                  <button onClick={() => updateQty(item._id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-medium text-white w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item._id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white">₹{(item.price * item.quantity).toLocaleString()}</span>
                  <button onClick={() => removeItem(item._id)}
                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="card p-5 space-y-3">
        <div className="flex justify-between text-sm text-slate-400">
          <span>Subtotal ({items.length} items)</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-400">
          <span>Shipping</span>
          <span className="text-emerald-400">FREE</span>
        </div>
        <div className="flex justify-between font-bold text-white text-lg border-t border-surface-border pt-3">
          <span>Total</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
        <Link to="/checkout" className="btn-primary w-full justify-center mt-2">
          Proceed to Checkout <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
