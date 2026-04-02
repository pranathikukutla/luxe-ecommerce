import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Heart, ShoppingCart, Star, Shield, Truck, RefreshCw,
  ChevronLeft, Plus, Minus, Check, Share2
} from 'lucide-react'
import { productAPI } from '../services/productAPI'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { SkeletonText } from '../components/common/Skeletons'
import { ErrorUI } from '../components/common/ErrorUI'
import toast from 'react-hot-toast'

const DEMO_PRODUCT = {
  _id: '1',
  name: 'Sony WH-1000XM5 Wireless Headphones',
  category: 'Electronics',
  brand: 'Sony',
  price: 24990,
  originalPrice: 34990,
  rating: 4.8,
  reviewCount: 342,
  stock: 12,
  description: `Experience next-level noise cancellation with the WH-1000XM5. Industry-leading noise cancellation with two processors and eight microphones for exceptional sound quality. Crystal clear hands-free calling with precise voice pickup. Up to 30 hours of battery life with quick charge (3 min for 3 hours).`,
  features: [
    'Industry-leading noise cancellation',
    '30-hour battery life',
    'Quick charge: 3 min = 3 hrs',
    'Multipoint connection (2 devices)',
    'Speak-to-chat technology',
    'Touch sensor controls',
    'Foldable design for portability',
  ],
  specs: {
    'Driver Unit': '30mm, dome type',
    'Frequency Response': '4 Hz–40,000 Hz',
    'Bluetooth Version': '5.2',
    'Battery Life': '30 hours',
    'Weight': '250g',
  },
  images: [],
  reviews: [
    { _id: 'r1', user: 'Priya S.', rating: 5, comment: 'Best headphones I have ever owned. The ANC is phenomenal!', date: new Date(Date.now() - 86400000 * 5) },
    { _id: 'r2', user: 'Rahul K.', rating: 5, comment: 'Absolutely worth every rupee. Sound quality is top notch.', date: new Date(Date.now() - 86400000 * 12) },
    { _id: 'r3', user: 'Sneha P.', rating: 4, comment: 'Great headphones but slightly tight fit initially.', date: new Date(Date.now() - 86400000 * 20) },
  ],
}

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    setLoading(true)
    productAPI.getById(id)
      .then(res => setProduct(res.data.product))
      .catch(() => setProduct(DEMO_PRODUCT))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="page-wrapper py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="grid grid-cols-4 gap-2">
            {[0,1,2,3].map(i => <div key={i} className="skeleton aspect-square rounded-xl" />)}
          </div>
        </div>
        <div className="space-y-4 pt-4">
          <SkeletonText lines={6} />
        </div>
      </div>
    </div>
  )

  if (error) return <ErrorUI message={error} onRetry={() => window.location.reload()} />
  if (!product) return null

  const wishlisted = isWishlisted(product._id)
  const images = product.images?.length
    ? product.images
    : [
        `https://picsum.photos/seed/${product._id}a/600/600`,
        `https://picsum.photos/seed/${product._id}b/600/600`,
        `https://picsum.photos/seed/${product._id}c/600/600`,
        `https://picsum.photos/seed/${product._id}d/600/600`,
      ]
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="page-wrapper py-10">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="btn-ghost mb-6">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-hover group">
            <img
              src={images[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4 badge bg-red-500 text-white border-0 text-sm">
                -{discount}%
              </div>
            )}
            <button
              onClick={() => toggle(product)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                wishlisted ? 'bg-red-500 text-white' : 'bg-surface-card text-slate-400 hover:text-red-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  activeImg === i ? 'border-brand-500' : 'border-transparent hover:border-surface-hover'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge-blue">{product.category}</span>
              {product.brand && <span className="text-slate-400 text-sm">{product.brand}</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'text-gold fill-gold' : 'text-slate-600'}`} />
                ))}
              </div>
              <span className="text-gold font-medium">{product.rating}</span>
              <span className="text-slate-400 text-sm">({product.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-white">₹{product.price?.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-slate-500 line-through">₹{product.originalPrice?.toLocaleString()}</span>
                <span className="badge-green">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">
                  {product.stock <= 5 ? `Only ${product.stock} left in stock` : 'In Stock'}
                </span>
              </>
            ) : (
              <span className="text-red-400 text-sm font-medium">Out of Stock</span>
            )}
          </div>

          {/* Qty */}
          <div>
            <label className="label">Quantity</label>
            <div className="flex items-center gap-3 w-fit">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-lg font-bold text-white">{qty}</span>
              <button
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                className="w-10 h-10 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => { addItem(product, qty); toast.success(`${qty}x added to cart!`) }}
              disabled={product.stock === 0}
              className="btn-primary flex-1 justify-center py-3 disabled:opacity-40"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={() => toggle(product)}
              className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
                wishlisted ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'border-surface-border text-slate-400 hover:text-red-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}
              className="w-12 h-12 rounded-xl border border-surface-border flex items-center justify-center text-slate-400 hover:text-white transition-all"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Shield, text: 'Secure Payment' },
              { icon: Truck, text: 'Free Delivery' },
              { icon: RefreshCw, text: '15-Day Returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-surface-hover text-center">
                <Icon className="w-4 h-4 text-brand-400" />
                <span className="text-xs text-slate-400">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-border mb-8">
        <div className="flex gap-0">
          {['description', 'specs', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-brand-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab} {tab === 'reviews' && `(${product.reviews?.length || 0})`}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'description' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="text-slate-300 leading-relaxed mb-6">{product.description}</p>
          </div>
          {product.features && (
            <div>
              <h3 className="font-semibold text-white mb-4">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <Check className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === 'specs' && product.specs && (
        <div className="card overflow-hidden max-w-lg">
          <table className="w-full">
            <tbody className="divide-y divide-surface-border">
              {Object.entries(product.specs).map(([k, v]) => (
                <tr key={k}>
                  <td className="px-5 py-3 text-sm text-slate-400 font-medium w-40">{k}</td>
                  <td className="px-5 py-3 text-sm text-white">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4 max-w-2xl">
          {(product.reviews || []).map(review => (
            <div key={review._id} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-sm">
                    {review.user?.charAt(0)}
                  </div>
                  <span className="font-medium text-white text-sm">{review.user}</span>
                </div>
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-gold fill-gold' : 'text-slate-600'}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-300 text-sm">{review.comment}</p>
              <p className="text-xs text-slate-500 mt-2">
                {new Date(review.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
