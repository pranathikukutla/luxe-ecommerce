import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()

  if (!product) return null

  const wishlisted = isWishlisted(product._id)
  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="card group hover:border-brand-500/40 transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-glow-blue">
      {/* Image */}
      <div className="relative overflow-hidden bg-surface-hover aspect-square">
        <img
          src={product.image || `https://picsum.photos/seed/${product._id}/400/400`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && <span className="badge-blue text-xs">NEW</span>}
          {discountPct > 0 && (
            <span className="badge bg-red-500/90 text-white text-xs border-0">-{discountPct}%</span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="badge-red text-xs">Low Stock</span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-slate-700 text-slate-300 border-0 text-xs">Sold Out</span>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <button
            onClick={() => toggle(product)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-90 ${
              wishlisted ? 'bg-red-500 text-white' : 'bg-surface-card text-slate-300 hover:text-red-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
          <Link
            to={`/products/${product._id}`}
            className="w-9 h-9 rounded-xl bg-surface-card flex items-center justify-center text-slate-300 hover:text-white shadow-lg transition-all active:scale-90"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">{product.category}</div>
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-white hover:text-brand-400 transition-colors line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? 'text-gold fill-gold' : 'text-slate-600'}`} />
              ))}
            </div>
            <span className="text-xs text-slate-400">({product.reviewCount || 0})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-slate-500 line-through">₹{product.originalPrice?.toLocaleString()}</span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="p-2 rounded-xl bg-brand-500/20 hover:bg-brand-500 text-brand-400 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-90"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
