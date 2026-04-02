import { useState, useEffect } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Package, Clock, Bot, AlertTriangle,
  Shield, Search, Trash2, Edit, MoreHorizontal, Plus
} from 'lucide-react'
import AdminAnalyticsPanel from '../components/admin/AdminAnalyticsPanel'
import { adminAPI } from '../services/index'
import { SkeletonRow } from '../components/common/Skeletons'
import toast from 'react-hot-toast'

function AdminOverview() {
  const [data, setData] = useState(null)
  useEffect(() => {
    adminAPI.getDashboard().then(r => setData(r.data)).catch(() => setData({}))
  }, [])
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Analytics Overview</h2>
      <AdminAnalyticsPanel data={data} />
    </div>
  )
}

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    adminAPI.getUsers()
      .then(r => setUsers(r.data.users || []))
      .catch(() => setUsers([
        { _id: 'u1', name: 'Priya Sharma', email: 'priya@example.com', role: 'user', isPremium: true, createdAt: new Date(), orders: 12 },
        { _id: 'u2', name: 'Rahul Kumar', email: 'rahul@example.com', role: 'user', isPremium: false, createdAt: new Date(), orders: 5 },
        { _id: 'u3', name: 'Admin User', email: 'admin@luxe.com', role: 'admin', isPremium: true, createdAt: new Date(), orders: 0 },
        { _id: 'u4', name: 'Sneha Patel', email: 'sneha@example.com', role: 'user', isPremium: false, createdAt: new Date(), orders: 3 },
        { _id: 'u5', name: 'Arjun Nair', email: 'arjun@example.com', role: 'user', isPremium: true, createdAt: new Date(), orders: 28 },
      ]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const togglePremium = (id) => {
    setUsers(prev => prev.map(u => u._id === id ? { ...u, isPremium: !u.isPremium } : u))
    toast.success('User updated')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">User Management</h2>
        <span className="badge-blue">{users.length} total</span>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="input-field pl-10" />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-surface-border">
            <tr className="text-left">
              {['User', 'Role', 'Premium', 'Orders', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}><td colSpan={5}><SkeletonRow /></td></tr>
              ))
              : filtered.map(user => (
                <tr key={user._id} className="hover:bg-surface-hover/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={user.role === 'admin' ? 'badge-gold' : 'badge-blue'}>{user.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePremium(user._id)}
                      className={`w-10 h-5 rounded-full transition-colors ${user.isPremium ? 'bg-brand-500' : 'bg-surface-hover'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white mx-0.5 transition-transform ${user.isPremium ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{user.orders}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

function InventoryAlerts() {
  const [inventory, setInventory] = useState([])
  useEffect(() => {
    adminAPI.getInventory()
      .then(r => setInventory(r.data.items || []))
      .catch(() => setInventory([
        { _id: 'p1', name: 'Sony WH-1000XM5', stock: 2, threshold: 5, category: 'Electronics' },
        { _id: 'p2', name: 'MacBook Air M3', stock: 0, threshold: 3, category: 'Laptops' },
        { _id: 'p3', name: 'iPad Pro 12.9"', stock: 1, threshold: 4, category: 'Electronics' },
        { _id: 'p4', name: 'DJI Mavic 3', stock: 3, threshold: 5, category: 'Photography' },
      ]))
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Inventory Alerts</h2>
      <div className="space-y-3">
        {inventory.map(item => (
          <div key={item._id} className={`card p-4 flex items-center justify-between border ${item.stock === 0 ? 'border-red-500/40 bg-red-500/5' : 'border-gold/30 bg-gold/5'}`}>
            <div className="flex items-center gap-3">
              <AlertTriangle className={`w-5 h-5 ${item.stock === 0 ? 'text-red-400' : 'text-gold'}`} />
              <div>
                <p className="font-medium text-white">{item.name}</p>
                <p className="text-xs text-slate-400">{item.category}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`badge ${item.stock === 0 ? 'badge-red' : 'badge-gold'}`}>
                {item.stock === 0 ? 'Out of Stock' : `${item.stock} left`}
              </span>
              <p className="text-xs text-slate-500 mt-1">Min threshold: {item.threshold}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AIStats() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">AI Usage Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Queries', value: '3,420', change: '+45%' },
          { label: 'Avg Response Time', value: '1.2s', change: '-12%' },
          { label: 'Satisfaction Rate', value: '94%', change: '+3%' },
          { label: 'Premium Queries', value: '1,890', change: '+67%' },
        ].map(({ label, value, change }) => (
          <div key={label} className="stat-card">
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="text-xs text-emerald-400 mt-1">{change} this month</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const NAV = [
  { to: '', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: 'users', label: 'Users', icon: Users },
  { to: 'inventory', label: 'Inventory', icon: AlertTriangle },
  { to: 'ai-stats', label: 'AI Stats', icon: Bot },
]

export default function AdminDashboard() {
  return (
    <div className="page-wrapper py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
          <Shield className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm">Manage your entire platform</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <nav className="card overflow-hidden">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={label} to={to} end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-surface-border last:border-0 ${
                    isActive ? 'text-white bg-gold/10 border-l-2 border-gold pl-[14px]' : 'text-slate-400 hover:text-white hover:bg-surface-hover'
                  }`
                }
              >
                <Icon className="w-4 h-4" /> {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="inventory" element={<InventoryAlerts />} />
            <Route path="ai-stats" element={<AIStats />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
