import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import ProductCard from '../components/shop/ProductCard'
import { SkeletonCard } from '../components/common/Skeletons'
import { ErrorUI } from '../components/common/ErrorUI'
import { productAPI } from '../services/productAPI'

const CATEGORIES = ['All', 'Electronics', 'Laptops', 'Fashion', 'Footwear', 'Home', 'Books', 'Sports']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
]

const DEMO_PRODUCTS = Array.from({ length: 12 }, (_, i) => ({
  _id: String(i + 1),
  name: ['Sony WH-1000XM5', 'MacBook Air M3', 'Nike Air Max', 'Samsung Galaxy S24', 'iPad Pro 12.9"', 'Dyson V15', 'Canon EOS R50', 'Dell XPS 15', 'JBL Charge 5', 'Apple Watch S9', 'Bose QC45', 'LG UltraWide Monitor'][i],
  category: ['Electronics', 'Laptops', 'Footwear', 'Electronics', 'Electronics', 'Home', 'Electronics', 'Laptops', 'Electronics', 'Electronics', 'Electronics', 'Electronics'][i],
  price: [24990, 114900, 8995, 74990, 109900, 52900, 68990, 139990, 14990, 41990, 26990, 64990][i],
  originalPrice: [34990, 124900, 12995, null, 119900, null, 79990, 149990, 17990, 45990, 34990, null][i],
  rating: [4.8, 4.9, 4.6, 4.7, 4.8, 4.7, 4.5, 4.8, 4.6, 4.9, 4.7, 4.6][i],
  reviewCount: [342, 189, 521, 203, 156, 98, 87, 134, 445, 278, 312, 167][i],
  stock: [12, 5, 30, 8, 3, 8, 15, 6, 25, 10, 18, 4][i],
  isNew: [true, false, false, true, false, false, true, false, false, true, false, false][i],
}))

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 200000])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await productAPI.getAll({ category: category === 'All' ? '' : category, sort, search })
      setProducts(res.data.products || [])
    } catch {
      setProducts(DEMO_PRODUCTS)
    } finally {
      setLoading(false)
    }
  }, [category, sort, search])

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300)
    return () => clearTimeout(t)
  }, [fetchProducts])

  const filtered = products.filter(p =>
    p.price >= priceRange[0] && p.price <= priceRange[1]
  )

  return (
    <div className="page-wrapper py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">Shop</h1>
        <p className="text-slate-400 mt-2">Discover {products.length}+ products across all categories</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-field pl-10 pr-10"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="input-field w-auto pr-10 appearance-none cursor-pointer min-w-48"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary gap-2 ${showFilters ? 'border-brand-500 text-white' : ''}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              category === cat
                ? 'bg-brand-500/20 border-brand-500 text-brand-300'
                : 'border-surface-border text-slate-400 hover:border-slate-500 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="card p-6 mb-6 animate-fade-up">
          <h3 className="font-semibold text-white mb-4">Price Range</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={0}
              max={200000}
              step={1000}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="flex-1 accent-brand-500"
            />
            <span className="text-white font-medium whitespace-nowrap">
              ₹0 — ₹{priceRange[1].toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-slate-400 mb-6">
        {loading ? 'Loading...' : `Showing ${filtered.length} products`}
        {(search || category !== 'All') && (
          <button
            onClick={() => { setSearch(''); setCategory('All') }}
            className="ml-3 text-brand-400 hover:text-brand-300 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      {error ? (
        <ErrorUI message={error} onRetry={fetchProducts} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filtered.map(p => <ProductCard key={p._id} product={p} />)
          }
        </div>
      )}

      {!loading && filtered.length === 0 && !error && (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">No products found for your search.</p>
          <button onClick={() => { setSearch(''); setCategory('All') }} className="mt-4 btn-secondary">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
