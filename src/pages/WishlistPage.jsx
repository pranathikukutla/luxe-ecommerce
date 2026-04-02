import WishlistComponent from '../components/shop/WishlistComponent'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function WishlistPage() {
  return (
    <div className="page-wrapper py-10">
      <Link to="/shop" className="btn-ghost mb-6 inline-flex">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>
      <WishlistComponent />
    </div>
  )
}
