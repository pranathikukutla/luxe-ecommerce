import { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const COLORS = ['#0ea5e9', '#f97316', '#10b981', '#8b5cf6', '#f59e0b']

function StatWidget({ label, value, change, prefix = '' }) {
  const isUp = change > 0
  const isDown = change < 0
  return (
    <div className="stat-card">
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white mb-2">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</p>
      <div className={`flex items-center gap-1 text-sm ${isUp ? 'text-emerald-400' : isDown ? 'text-red-400' : 'text-slate-400'}`}>
        {isUp ? <TrendingUp className="w-4 h-4" /> : isDown ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
        <span>{Math.abs(change)}% vs last month</span>
      </div>
    </div>
  )
}

export default function AdminAnalyticsPanel({ data }) {
  const revenue = data?.revenueChart || [
    { month: 'Jan', revenue: 42000, orders: 120 },
    { month: 'Feb', revenue: 58000, orders: 160 },
    { month: 'Mar', revenue: 51000, orders: 140 },
    { month: 'Apr', revenue: 76000, orders: 200 },
    { month: 'May', revenue: 69000, orders: 185 },
    { month: 'Jun', revenue: 92000, orders: 240 },
    { month: 'Jul', revenue: 88000, orders: 225 },
  ]

  const categories = data?.categoryBreakdown || [
    { name: 'Electronics', value: 40 },
    { name: 'Fashion', value: 25 },
    { name: 'Rentals', value: 20 },
    { name: 'Home', value: 15 },
  ]

  const stats = data?.stats || {
    totalRevenue: 476000, revenueChange: 12.5,
    totalOrders: 1270, ordersChange: 8.3,
    activeRentals: 84, rentalsChange: 21.0,
    aiQueries: 3420, aiChange: 45.2,
  }

  const tooltipStyle = {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '12px',
    color: '#f1f5f9',
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatWidget label="Total Revenue" value={stats.totalRevenue} change={stats.revenueChange} prefix="₹" />
        <StatWidget label="Total Orders" value={stats.totalOrders} change={stats.ordersChange} />
        <StatWidget label="Active Rentals" value={stats.activeRentals} change={stats.rentalsChange} />
        <StatWidget label="AI Queries" value={stats.aiQueries} change={stats.aiChange} />
      </div>

      {/* Revenue Chart */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Revenue & Orders</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={revenue}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" fill="url(#revGrad)" strokeWidth={2} name="Revenue (₹)" />
            <Area type="monotone" dataKey="orders" stroke="#f97316" fill="url(#ordGrad)" strokeWidth={2} name="Orders" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Pie */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categories} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="orders" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
