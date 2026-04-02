import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Clock, Heart, Star, Share2,
  User, Settings, ChevronRight, Copy, Check, Trophy, TrendingUp, Sparkles
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import WishlistComponent from '../components/shop/WishlistComponent'
import { orderAPI, rentalAPI } from '../services/index'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

function Overview({ user }) {
  const [orders, setOrders] = useState([])
  const [rentals, setRentals] = useState([])

  useEffect(() => {
    orderAPI.getMyOrders().then(r => setOrders(r.data.orders || [])).catch(() =>
      setOrders([
        { _id: 'o1', createdAt: new Date(), total: 24990, status: 'delivered', itemCount: 1 },
        { _id: 'o2', createdAt: new Date(Date.now() - 86400000 * 3), total: 8995, status: 'shipped', itemCount: 2 },
      ])
    )
    rentalAPI.getUserRentals().then(r => setRentals(r.data.rentals || [])).catch(() =>
      setRentals([
        { _id: 'rent1', productName: 'Canon EOS R5', returnDate: new Date(Date.now() + 86400000 * 3), status: 'active', totalFee: 2400 },
      ])
    )
  }, [])

  const statusColor = { delivered: 'badge-green', shipped: 'badge-blue', pending: 'badge-gold', cancelled: 'badge-red' }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Package, label: 'Orders', value: orders.length, color: 'text-brand-400' },
          { icon: Clock, label: 'Active Rentals', value: rentals.filter(r => r.status === 'active').length, color: 'text-accent' },
          { icon: Star, label: 'Loyalty Points', value: user?.loyaltyPoints || 250, color: 'text-gold' },
          { icon: TrendingUp, label: 'Total Saved', value: `₹${(user?.totalSaved || 1890).toLocaleString()}`, color: 'text-emerald-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="stat-card">
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-sm text-slate-400">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-surface-border flex items-center justify-between">
          <h3 className="font-semibold text-white">Recent Orders</h3>
          <NavLink to="orders" className="text-sm text-brand-400 hover:text-brand-300">View all</NavLink>
        </div>
        <div className="divide-y divide-surface-border">
          {orders.slice(0, 3).map(order => (
            <div key={order._id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Order #{order._id.slice(-6).toUpperCase()}</p>
                <p className="text-xs text-slate-500">{format(new Date(order.createdAt), 'dd MMM yyyy')} · {order.itemCount} item{order.itemCount > 1 ? 's' : ''}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-white">₹{order.total?.toLocaleString()}</p>
                <span className={`text-xs ${statusColor[order.status] || 'badge-blue'}`}>{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Rentals */}
      {rentals.filter(r => r.status === 'active').length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-surface-border">
            <h3 className="font-semibold text-white">Active Rentals</h3>
          </div>
          {rentals.filter(r => r.status === 'active').map(r => (
            <div key={r._id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">{r.productName}</p>
                <p className="text-xs text-slate-500">Return by {format(new Date(r.returnDate), 'dd MMM yyyy')}</p>
              </div>
              <span className="badge-green">Active</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const statusColor = { delivered: 'badge-green', shipped: 'badge-blue', pending: 'badge-gold', cancelled: 'badge-red' }

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(r => setOrders(r.data.orders || []))
      .catch(() => setOrders([
        { _id: 'o1', createdAt: new Date(), total: 24990, status: 'delivered', itemCount: 1, items: ['Sony Headphones'] },
        { _id: 'o2', createdAt: new Date(Date.now() - 86400000 * 3), total: 8995, status: 'shipped', itemCount: 2, items: ['Nike Air Max', 'Socks'] },
        { _id: 'o3', createdAt: new Date(Date.now() - 86400000 * 10), total: 52900, status: 'delivered', itemCount: 1, items: ['Dyson V15'] },
      ]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">My Orders</h2>
      {orders.map(order => (
        <div key={order._id} className="card p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-white">Order #{order._id.slice(-6).toUpperCase()}</p>
              <p className="text-sm text-slate-400">{format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
            </div>
            <span className={statusColor[order.status] || 'badge-blue'}>{order.status}</span>
          </div>
          <div className="text-sm text-slate-400 mb-3">
            {order.items?.join(', ')} · {order.itemCount} item{order.itemCount > 1 ? 's' : ''}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-white">₹{order.total?.toLocaleString()}</span>
            <button className="btn-ghost text-sm">View Details <ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      ))}
    </div>
  )
}

function Rentals() {
  const [rentals, setRentals] = useState([])
  useEffect(() => {
    rentalAPI.getUserRentals()
      .then(r => setRentals(r.data.rentals || []))
      .catch(() => setRentals([
        { _id: 'rent1', productName: 'Canon EOS R5 Camera', returnDate: new Date(Date.now() + 86400000 * 3), status: 'active', totalFee: 2400, depositAmount: 15000 },
        { _id: 'rent2', productName: 'DJI Mavic 3 Drone', returnDate: new Date(Date.now() - 86400000 * 5), status: 'returned', totalFee: 6000, depositAmount: 20000 },
      ]))
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">My Rentals</h2>
      {rentals.map(r => (
        <div key={r._id} className="card p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-white">{r.productName}</h3>
            <span className={r.status === 'active' ? 'badge-green' : 'badge-blue'}>{r.status}</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div><p className="text-slate-500">Return Date</p><p className="text-white">{format(new Date(r.returnDate), 'dd MMM yyyy')}</p></div>
            <div><p className="text-slate-500">Rental Fee</p><p className="text-white">₹{r.totalFee?.toLocaleString()}</p></div>
            <div><p className="text-slate-500">Deposit</p><p className="text-white">₹{r.depositAmount?.toLocaleString()}</p></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Referral({ user }) {
  const [copied, setCopied] = useState(false)
  const code = user?.referralCode || 'LUXE' + (user?._id?.slice(-4).toUpperCase() || 'DEMO')
  const link = `${window.location.origin}/register?ref=${code}`

  const copy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    toast.success('Referral link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Referral Program</h2>
      <div className="card p-8 text-center">
        <Trophy className="w-12 h-12 text-gold mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Earn ₹100 per Referral</h3>
        <p className="text-slate-400 mb-6">Share your link and earn when friends sign up and make their first purchase.</p>
        <div className="flex items-center gap-2 bg-surface rounded-xl p-3 mb-4 max-w-sm mx-auto">
          <p className="flex-1 text-sm text-slate-300 truncate font-mono">{link}</p>
          <button onClick={copy} className="w-8 h-8 flex items-center justify-center text-brand-400 hover:text-white transition-colors">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-sm text-slate-500">Your referral code: <span className="text-white font-mono font-bold">{code}</span></p>
      </div>
    </div>
  )
}

const NAV = [
  { to: '', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: 'orders', label: 'Orders', icon: Package },
  { to: 'rentals', label: 'Rentals', icon: Clock },
  { to: 'wishlist', label: 'Wishlist', icon: Heart },
  { to: 'referral', label: 'Referral', icon: Share2 },
  { to: 'profile', label: 'Profile', icon: User },
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="page-wrapper py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-60 flex-shrink-0">
          {/* User Card */}
          <div className="card p-5 mb-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <p className="font-semibold text-white">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            {user?.isPremium && (
              <div className="badge-gold mt-2 mx-auto w-fit">
                <Sparkles className="w-3 h-3" /> Premium
              </div>
            )}
          </div>

          <nav className="card overflow-hidden">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={label}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-surface-border last:border-0 ${
                    isActive ? 'text-white bg-brand-500/20 border-l-2 border-brand-500 pl-[14px]' : 'text-slate-400 hover:text-white hover:bg-surface-hover'
                  }`
                }
              >
                <Icon className="w-4 h-4" /> {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          <Routes>
            <Route index element={<Overview user={user} />} />
            <Route path="orders" element={<Orders />} />
            <Route path="rentals" element={<Rentals />} />
            <Route path="wishlist" element={<WishlistComponent />} />
            <Route path="referral" element={<Referral user={user} />} />
            <Route path="profile" element={<div className="text-slate-400">Profile settings coming soon...</div>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
