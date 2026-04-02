import CartComponent from '../components/shop/CartComponent'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function CartPage() {
  return (
    <div className="page-wrapper py-10">
      <Link to="/shop" className="btn-ghost mb-6 inline-flex">
        <ArrowLeft className="w-4 h-4" /> Continue Shopping
      </Link>
      <div className="max-w-2xl">
        <CartComponent />
      </div>
    </div>
  )
}
