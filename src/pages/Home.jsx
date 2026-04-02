import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Shield, Truck, RefreshCw, Star, Zap, TrendingUp } from 'lucide-react'
import ProductCard from '../components/shop/ProductCard'
import { SkeletonCard } from '../components/common/Skeletons'
import { productAPI } from '../services/productAPI'

const DEMO_PRODUCTS = [
  { _id: '1', name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', price: 24990, originalPrice: 34990, rating: 4.8, reviewCount: 342, stock: 12, isNew: true },
  { _id: '2', name: 'Apple MacBook Air M3', category: 'Laptops', price: 114900, originalPrice: 124900, rating: 4.9, reviewCount: 189, stock: 5 },
  { _id: '3', name: 'Nike Air Max 270', category: 'Footwear', price: 8995, originalPrice: 12995, rating: 4.6, reviewCount: 521, stock: 30 },
  { _id: '4', name: 'Dyson V15 Detect Vacuum', category: 'Home', price: 52900, rating: 4.7, reviewCount: 98, stock: 8, isNew: true },
]

const FEATURES = [
  { icon: Sparkles, title: 'AI-Powered Search', desc: 'Smart recommendations powered by advanced AI to find exactly what you need.' },
  { icon: Shield, title: 'Secure Payments', desc: 'Bank-grade security with multiple payment options including UPI and cards.' },
  { icon: Truck, title: 'Free Delivery', desc: 'Free shipping on all orders above ₹500. Express delivery available.' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '15-day hassle-free returns and exchanges on all purchases.' },
]

const STATS = [
  { value: '50K+', label: 'Products' },
  { value: '2L+', label: 'Happy Customers' },
  { value: '500+', label: 'Brands' },
  { value: '4.9★', label: 'App Rating' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productAPI.getFeatured()
      .then(res => setFeatured(res.data.products || []))
      .catch(() => setFeatured(DEMO_PRODUCTS))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="page-wrapper relative z-10 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8 animate-fade-up">
              <Sparkles className="w-4 h-4" />
              AI-Powered Shopping Experience
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6 animate-fade-up animation-delay-100">
              Shop Smarter,<br />
              <span className="gradient-text">Rent Easier</span>
            </h1>

            <p className="text-xl text-slate-400 mb-10 leading-relaxed animate-fade-up animation-delay-200 max-w-xl">
              Discover thousands of premium products, rent high-end items for any occasion, and get personalized recommendations from our AI assistant.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up animation-delay-300">
              <Link to="/shop" className="btn-primary text-base px-8 py-4">
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/rent" className="btn-secondary text-base px-8 py-4">
                Explore Rentals
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 mt-16 animate-fade-up animation-delay-400">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-sm text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-surface-card/50">
        <div className="page-wrapper">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose LUXE?</h2>
            <p className="section-subtitle mx-auto">Everything you need for a premium shopping experience</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 hover:border-brand-500/40 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="page-wrapper">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="text-slate-400 mt-2">Handpicked just for you</p>
            </div>
            <Link to="/shop" className="btn-ghost gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : featured.map(p => <ProductCard key={p._id} product={p} />)
            }
          </div>
        </div>
      </section>

      {/* AI Banner */}
      <section className="py-20">
        <div className="page-wrapper">
          <div className="relative card overflow-hidden p-10 md:p-16">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/50 to-surface-card" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-xl">
              <div className="inline-flex items-center gap-2 badge-blue mb-4">
                <Zap className="w-3 h-3" /> AI Assistant
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Let AI Do Your Shopping Research
              </h2>
              <p className="text-slate-400 mb-8">
                Our intelligent assistant helps you find the best deals, compare products, track orders, and manage rentals — all in one chat.
              </p>
              <Link to="/ai-chat" className="btn-primary">
                Try AI Chat <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-20 bg-surface-card/50">
        <div className="page-wrapper text-center">
          <div className="inline-flex items-center gap-2 badge-gold mb-4">
            <Star className="w-3 h-3 fill-gold" /> Premium Membership
          </div>
          <h2 className="section-title mb-4">Unlock Exclusive Benefits</h2>
          <p className="section-subtitle mx-auto mb-8">
            Get access to premium-only deals, priority shipping, early product launches, and exclusive AI features.
          </p>
          <Link to="/premium" className="btn-gold text-base px-8 py-4">
            <Star className="w-5 h-5" /> Upgrade to Premium
          </Link>
        </div>
      </section>
    </div>
  )
}
