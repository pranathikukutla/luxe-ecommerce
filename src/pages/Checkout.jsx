import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Smartphone, Building2, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { orderAPI } from '../services/index'
import toast from 'react-hot-toast'

const PAYMENT_METHODS = [
  { id: 'upi', icon: Smartphone, label: 'UPI', desc: 'GPay, PhonePe, Paytm' },
  { id: 'card', icon: CreditCard, label: 'Card', desc: 'Credit / Debit card' },
  { id: 'netbanking', icon: Building2, label: 'Net Banking', desc: 'All major banks' },
]

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [payMethod, setPayMethod] = useState('upi')
  const [address, setAddress] = useState({
    name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
  })

  const set = k => e => setAddress(p => ({ ...p, [k]: e.target.value }))

  const placeOrder = async () => {
    setLoading(true)
    try {
      await orderAPI.create({ items, total, address, paymentMethod: payMethod })
      clearCart()
      setStep(3)
    } catch {
      // Demo mode
      clearCart()
      setStep(3)
      toast.success('Order placed successfully! (Demo)')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && step !== 3) {
    navigate('/cart')
    return null
  }

  return (
    <div className="page-wrapper py-10">
      <h1 className="section-title mb-8">Checkout</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-10">
        {['Delivery', 'Payment', 'Confirmed'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
              step > i + 1 ? 'bg-emerald-500 border-emerald-500 text-white' :
              step === i + 1 ? 'bg-brand-500 border-brand-500 text-white' :
              'border-surface-border text-slate-500'
            }`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${step === i + 1 ? 'text-white' : 'text-slate-500'}`}>{label}</span>
            {i < 2 && <div className={`flex-1 h-px w-8 ${step > i + 1 ? 'bg-emerald-500' : 'bg-surface-border'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="card p-6 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Delivery Address</h2>
              {[
                { key: 'name', label: 'Full Name', placeholder: 'John Doe' },
                { key: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210' },
                { key: 'line1', label: 'Address Line 1', placeholder: 'House/Flat No, Street' },
                { key: 'line2', label: 'Address Line 2 (Optional)', placeholder: 'Landmark, Area' },
                { key: 'city', label: 'City', placeholder: 'Hyderabad' },
                { key: 'state', label: 'State', placeholder: 'Telangana' },
                { key: 'pincode', label: 'Pincode', placeholder: '500001' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input
                    value={address[key]}
                    onChange={set(key)}
                    placeholder={placeholder}
                    className="input-field"
                    required={key !== 'line2'}
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  if (!address.name || !address.phone || !address.line1 || !address.city || !address.pincode) {
                    toast.error('Please fill required fields')
                    return
                  }
                  setStep(2)
                }}
                className="btn-primary w-full justify-center mt-2"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="card p-6 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Payment Method</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(({ id, icon: Icon, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => setPayMethod(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                      payMethod === id ? 'border-brand-500 bg-brand-500/10' : 'border-surface-border hover:border-slate-500'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${payMethod === id ? 'bg-brand-500 text-white' : 'bg-surface-hover text-slate-400'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{label}</p>
                      <p className="text-sm text-slate-400">{desc}</p>
                    </div>
                    <div className={`ml-auto w-5 h-5 rounded-full border-2 ${payMethod === id ? 'border-brand-500 bg-brand-500' : 'border-slate-500'}`} />
                  </button>
                ))}
              </div>

              {payMethod === 'upi' && (
                <div>
                  <label className="label">UPI ID</label>
                  <input placeholder="yourname@upi" className="input-field" />
                </div>
              )}

              {payMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="label">Card Number</label>
                    <input placeholder="1234 5678 9012 3456" className="input-field font-mono" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Expiry</label>
                      <input placeholder="MM/YY" className="input-field font-mono" maxLength={5} />
                    </div>
                    <div>
                      <label className="label">CVV</label>
                      <input placeholder="123" className="input-field font-mono" maxLength={3} type="password" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={placeOrder} disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : `Pay ₹${total.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmed */}
          {step === 3 && (
            <div className="card p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Order Placed!</h2>
              <p className="text-slate-400 mb-8">
                Your order has been placed successfully. You'll receive a confirmation email shortly.
              </p>
              <button onClick={() => navigate('/dashboard/orders')} className="btn-primary mx-auto">
                Track Your Order
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        {step < 3 && (
          <div className="card p-5 h-fit">
            <h3 className="font-semibold text-white mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item._id} className="flex items-center gap-3">
                  <img
                    src={item.image || `https://picsum.photos/seed/${item._id}/80/80`}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-surface-hover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{item.name}</p>
                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="divider pt-3 space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Subtotal</span><span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Shipping</span><span className="text-emerald-400">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-white mt-2 pt-2 border-t border-surface-border">
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
