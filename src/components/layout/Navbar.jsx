import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import {
  ShoppingCart, Heart, Menu, X, Zap,
  LayoutDashboard, LogOut, Shield, ChevronDown, Sparkles, Search
} from 'lucide-react'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isPremium, logout } = useAuth()
  const { count: cartCount } = useCart()
  const { count: wishCount } = useWishlist()

  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const searchInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/rent', label: 'Rent' },
    { to: '/ai-chat', label: 'AI Chat' },
    { to: '/premium', label: 'Premium' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${
      scrolled ? 'bg-black/90 backdrop-blur border-b' : 'bg-transparent'
    }`}>
      <div className="flex items-center justify-between h-16 px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Zap className="text-white" />
          <span className="text-white font-bold">LUXE</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-4">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} className="text-gray-300 hover:text-white">
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex bg-gray-800 px-2 py-1 rounded">
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white outline-none px-2"
                placeholder="Search..."
              />
              <button type="submit">
                <Search className="w-4 h-4 text-white" />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)}>
              <Search className="text-white" />
            </button>
          )}

          {/* Wishlist */}
          <Link to="/wishlist" className="relative">
            <Heart className="text-white" />
            {wishCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                {wishCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-blue-500 text-white rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setUserOpen(!userOpen)} className="text-white">
                {user?.name || 'User'}
              </button>

              {userOpen && (
                <div className="absolute right-0 mt-2 bg-gray-800 p-2 rounded">
                  <Link to="/dashboard" className="block text-white">Dashboard</Link>

                  {isAdmin && (
                    <Link to="/admin" className="block text-yellow-400">Admin</Link>
                  )}

                  <button onClick={logout} className="block text-red-400">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-white">Login</Link>
              <Link to="/register" className="text-white">Sign Up</Link>
            </>
          )}

          {/* Mobile Menu */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Links */}
      {menuOpen && (
        <div className="md:hidden bg-black p-4 space-y-2">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} className="block text-white">
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}