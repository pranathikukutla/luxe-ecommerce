import { useState, useEffect } from 'react'
import { Search, Clock, Info } from 'lucide-react'
import RentalCard from '../components/rental/RentalCard'
import { SkeletonCard } from '../components/common/Skeletons'
import { rentalAPI } from '../services/index'

const DEMO_RENTALS = [
  { _id: 'r1', name: 'Canon EOS R5 Camera', category: 'Photography', rentalPricePerDay: 800, depositAmount: 15000, availability: true, description: 'Professional mirrorless camera with 45MP sensor. Perfect for shoots and events.' },
  { _id: 'r2', name: 'DJI Mavic 3 Drone', category: 'Photography', rentalPricePerDay: 1200, depositAmount: 20000, availability: true, description: 'Professional drone with 4K camera and 46-min flight time.' },
  { _id: 'r3', name: 'PS5 Gaming Console', category: 'Gaming', rentalPricePerDay: 400, depositAmount: 5000, availability: false, description: 'Sony PlayStation 5 with 2 controllers and 5 games included.' },
  { _id: 'r4', name: 'MacBook Pro 16"', category: 'Laptops', rentalPricePerDay: 600, depositAmount: 10000, availability: true, description: 'Apple M3 Pro chip, 18GB RAM. Ideal for video editing and design work.' },
  { _id: 'r5', name: '4K Projector', category: 'Home Theater', rentalPricePerDay: 500, depositAmount: 8000, availability: true, description: 'Ultra-short throw 4K projector with 120" screen. Perfect for events.' },
  { _id: 'r6', name: 'Electric Scooter', category: 'Transport', rentalPricePerDay: 350, depositAmount: 3000, availability: true, description: 'OLA S1 Pro with 141km range and fast charging support.' },
]

const CATEGORIES = ['All', 'Photography', 'Gaming', 'Laptops', 'Home Theater', 'Transport', 'Events']

export default function Rent() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    rentalAPI.getAvailable()
      .then(res => setItems(res.data.items || []))
      .catch(() => setItems(DEMO_RENTALS))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(item => {
    const matchCat = category === 'All' || item.category === category
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="page-wrapper py-10">
      <div className="mb-8">
        <h1 className="section-title">Rent Premium Items</h1>
        <p className="text-slate-400 mt-2">Borrow high-end products for any duration. Flexible pricing, easy returns.</p>
      </div>

      {/* Info Banner */}
      <div className="card p-4 mb-8 flex items-start gap-3 border-brand-500/30 bg-brand-500/5">
        <Info className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-slate-300">
          <span className="font-semibold text-white">How it works: </span>
          Choose an item → select duration → pay rental fee + refundable deposit → enjoy → return to get deposit back.
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search rental items..."
          className="input-field pl-10"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              category === cat
                ? 'bg-accent/20 border-accent text-orange-300'
                : 'border-surface-border text-slate-400 hover:border-slate-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-6 text-sm text-slate-400">
        <Clock className="w-4 h-4" />
        <span>{filtered.length} items available for rent</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.map(item => <RentalCard key={item._id} item={item} />)
        }
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          No rental items found. Try a different category or search term.
        </div>
      )}
    </div>
  )
}
