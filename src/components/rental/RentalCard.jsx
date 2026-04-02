import { useState } from 'react'
import { Clock, Calendar, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import { addDays, format } from 'date-fns'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { rentalAPI } from '../../services/index'
import toast from 'react-hot-toast'

const DURATIONS = [
  { label: '1 Day', days: 1 },
  { label: '3 Days', days: 3 },
  { label: '1 Week', days: 7 },
  { label: '2 Weeks', days: 14 },
  { label: '1 Month', days: 30 },
]

export default function RentalCard({ item }) {
  const [duration, setDuration] = useState(DURATIONS[1])
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const returnDate = addDays(new Date(), duration.days)
  const totalFee = (item.rentalPricePerDay * duration.days).toFixed(0)

  const handleRent = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setLoading(true)
    try {
      await rentalAPI.create({
        productId: item._id,
        durationDays: duration.days,
        totalFee: Number(totalFee),
      })
      toast.success('Rental booked successfully!')
      navigate('/dashboard/rentals')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book rental')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card overflow-hidden group hover:border-accent/40 transition-all duration-300">
      <div className="relative aspect-video overflow-hidden bg-surface-hover">
        <img
          src={item.image || `https://picsum.photos/seed/${item._id}/600/400`}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="badge bg-accent/90 text-white border-0">FOR RENT</span>
        </div>
        {item.availability === false && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Currently Rented</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{item.category}</div>
        <h3 className="font-semibold text-white text-lg mb-1">{item.name}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{item.description}</p>

        {/* Rental Price */}
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-accent" />
          <span className="text-accent font-bold text-lg">₹{item.rentalPricePerDay}/day</span>
          {item.depositAmount && (
            <span className="text-xs text-slate-500">(+ ₹{item.depositAmount} deposit)</span>
          )}
        </div>

        {/* Duration Selector */}
        <div className="mb-4">
          <label className="label">Rental Duration</label>
          <div className="grid grid-cols-5 gap-1">
            {DURATIONS.map(d => (
              <button
                key={d.days}
                onClick={() => setDuration(d)}
                className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                  duration.days === d.days
                    ? 'bg-accent/20 border-accent text-accent'
                    : 'border-surface-border text-slate-400 hover:border-slate-500'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-surface rounded-xl p-3 space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Return Date
            </span>
            <span className="text-white font-medium">{format(returnDate, 'dd MMM yyyy')}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Duration
            </span>
            <span className="text-white font-medium">{duration.label}</span>
          </div>
          <div className="flex items-center justify-between font-semibold border-t border-surface-border pt-2">
            <span className="text-slate-300">Total Fee</span>
            <span className="text-white text-lg">₹{Number(totalFee).toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={handleRent}
          disabled={loading || item.availability === false}
          className="btn-primary w-full justify-center disabled:opacity-50"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : item.availability === false ? 'Not Available' : 'Book Now'}
        </button>
      </div>
    </div>
  )
}
