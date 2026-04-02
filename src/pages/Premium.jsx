import { useState } from 'react'
import { Check, Star, Sparkles, Zap, Shield, Crown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { paymentAPI } from '../services/index'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 299,
    period: '/month',
    badge: null,
    features: [
      'Unlimited AI queries',
      'Priority customer support',
      'Early access to deals',
      'Free express delivery',
      '10% off all rentals',
      'Ad-free experience',
    ],
  },
  {
    id: 'yearly',
    name: 'Annual',
    price: 2499,
    period: '/year',
    badge: 'Best Value — Save ₹1,089',
    features: [
      'Everything in Monthly',
      '20% off all purchases',
      '15% off all rentals',
      'Exclusive loyalty rewards',
      'Referral bonus (₹100/referral)',
      'Dedicated account manager',
      'Premium product launches first',
    ],
  },
]

const PERKS = [
  { icon: Sparkles, title: 'Unlimited AI Chat', desc: 'No query limits, instant responses' },
  { icon: Zap, title: 'Flash Deals First', desc: 'Access lightning deals 24hrs early' },
  { icon: Shield, title: 'Enhanced Protection', desc: 'Extended return window to 30 days' },
  { icon: Crown, title: 'VIP Status', desc: 'Premium badge on your profile' },
  { icon: Star, title: 'Loyalty Points 2x', desc: 'Earn double points on all orders' },
]

export default function Premium() {
  const [selected, setSelected] = useState('yearly')
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated, isPremium, updateUser } = useAuth()
  const navigate = useNavigate()

  const plan = PLANS.find(p => p.id === selected)

  const handleUpgrade = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setLoading(true)
    try {
      await paymentAPI.upgradePremium({ plan: selected, amount: plan.price })
      updateUser({ isPremium: true, premiumPlan: selected })
      toast.success('🎉 Welcome to LUXE Premium!')
    } catch {
      // Demo mode
      updateUser({ isPremium: true, premiumPlan: selected })
      toast.success('🎉 Welcome to LUXE Premium! (Demo mode)')
    } finally {
      setLoading(false)
    }
  }

  if (isPremium) {
    return (
      <div className="page-wrapper py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-gold" />
          </div>
          <div className="badge-gold mb-4 mx-auto w-fit">Premium Active</div>
          <h2 className="text-2xl font-bold text-white mb-2">You're a Premium Member!</h2>
          <p className="text-slate-400 mb-8">All premium benefits are active on your account.</p>
          <div className="card p-6 text-left space-y-3 mb-8">
            {PLANS[1].features.map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                <Check className="w-4 h-4 text-gold flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn-primary w-full justify-center">
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 badge-gold mb-4">
          <Crown className="w-3 h-3" /> Premium Membership
        </div>
        <h1 className="section-title mb-4">Upgrade Your Experience</h1>
        <p className="section-subtitle mx-auto">
          Join thousands of premium members enjoying exclusive deals, AI features, and VIP treatment.
        </p>
      </div>

      {/* Perks */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {PERKS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card p-4 text-center hover:border-gold/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3">
              <Icon className="w-5 h-5 text-gold" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">{title}</p>
            <p className="text-xs text-slate-500">{desc}</p>
          </div>
        ))}
      </div>

      {/* Plan Selector */}
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {PLANS.map(plan => (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={`card p-6 text-left transition-all duration-200 hover:-translate-y-1 ${
                selected === plan.id
                  ? 'border-gold shadow-glow-gold'
                  : 'hover:border-gold/30'
              }`}
            >
              {plan.badge && (
                <div className="badge-gold text-xs mb-3 w-fit">{plan.badge}</div>
              )}
              <h3 className="font-bold text-white text-lg">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold text-gold">₹{plan.price.toLocaleString()}</span>
                <span className="text-slate-400 text-sm">{plan.period}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="card p-6 mb-6">
          <h3 className="font-semibold text-white mb-4">
            What's included in {PLANS.find(p => p.id === selected)?.name}:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PLANS.find(p => p.id === selected)?.features.map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                <Check className="w-4 h-4 text-gold flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="btn-gold w-full justify-center text-lg py-4"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-surface/30 border-t-surface rounded-full animate-spin" />
          ) : (
            <>
              <Crown className="w-5 h-5" />
              Upgrade to {PLANS.find(p => p.id === selected)?.name} — ₹{PLANS.find(p => p.id === selected)?.price.toLocaleString()}
            </>
          )}
        </button>
        <p className="text-center text-xs text-slate-500 mt-3">Cancel anytime · Secure payment · No hidden fees</p>
      </div>
    </div>
  )
}
