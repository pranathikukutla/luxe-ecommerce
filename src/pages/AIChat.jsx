import { useAuth } from '../context/AuthContext'
import AIChatUI from '../components/chat/AIChatUI'
import { Link } from 'react-router-dom'
import { Sparkles, MessageSquare, Zap, History } from 'lucide-react'

export default function AIChat() {
  const { isAuthenticated, isPremium } = useAuth()

  return (
    <div className="page-wrapper py-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 badge-blue mb-4">
            <Sparkles className="w-3 h-3" /> Powered by Advanced AI
          </div>
          <h1 className="section-title mb-3">AI Shopping Assistant</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Your personal AI that finds products, compares prices, manages orders, and answers any question about LUXE.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { icon: MessageSquare, text: 'Product Search' },
            { icon: Zap, text: 'Price Comparison' },
            { icon: History, text: 'Order Tracking' },
            { icon: Sparkles, text: 'Rental Help' },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 px-3 py-1.5 bg-surface-card border border-surface-border rounded-full text-sm text-slate-400"
            >
              <Icon className="w-3.5 h-3.5 text-brand-400" />
              {text}
            </div>
          ))}
        </div>

        {/* ✅ AI CHAT ALWAYS VISIBLE */}
        <div className="card overflow-hidden">
          <AIChatUI isGuest={!isAuthenticated} />
        </div>

        {/* ✅ Guest Notice (instead of blocking) */}
        {!isAuthenticated && (
          <div className="mt-6 text-center">
            <p className="text-yellow-400 text-sm mb-3">
              ⚡ You are using Guest Mode. Login for full AI features.
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary">Create Account</Link>
            </div>
          </div>
        )}

        {/* ✅ Premium Banner */}
        {!isPremium && isAuthenticated && (
          <div className="mt-6 card p-4 flex items-center justify-between gap-4 border-gold/30 bg-gold/5">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-gold" />
              <div>
                <p className="text-sm font-semibold text-white">Upgrade to Premium</p>
                <p className="text-xs text-slate-400">
                  Get unlimited AI queries and priority responses
                </p>
              </div>
            </div>
            <Link to="/premium" className="btn-gold text-sm py-2 px-4 whitespace-nowrap">
              Upgrade
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}