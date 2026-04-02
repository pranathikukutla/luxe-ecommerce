import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, Zap, Phone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  const fields = [
    { key: 'name', type: 'text', label: 'Full Name', placeholder: 'John Doe', icon: User },
    { key: 'email', type: 'email', label: 'Email Address', placeholder: 'you@example.com', icon: Mail },
    { key: 'phone', type: 'tel', label: 'Phone Number', placeholder: '+91 98765 43210', icon: Phone },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">LUX<span className="text-brand-400">E</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-slate-400 mt-1">Join LUXE for free today</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handle} className="space-y-4">
            {fields.map(({ key, type, label, placeholder, icon: Icon }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={type}
                    value={form[key]}
                    onChange={set(key)}
                    placeholder={placeholder}
                    className="input-field pl-10"
                    required={key !== 'phone'}
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 6 characters"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  placeholder="Repeat password"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <input type="checkbox" required className="mt-1 accent-brand-500 w-4 h-4" />
              <label className="text-sm text-slate-400">
                I agree to the{' '}
                <Link to="/terms" className="text-brand-400 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-brand-400 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
