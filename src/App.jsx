import { Toaster } from 'react-hot-toast'
import { Routes, Route } from 'react-router-dom'

// Context Providers
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

// Layout
import Layout from './components/layout/Layout'

// Route Guard
import { ProtectedRoute } from './routes/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import Rent from './pages/Rent'
import AIChat from './pages/AIChat'
import Premium from './pages/Premium'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProductDetails from './pages/ProductDetails'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import Checkout from './pages/Checkout'
import { NotFound } from './components/common/ErrorUI'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
                borderRadius: '12px',
                fontSize: '14px',
                fontFamily: 'DM Sans, sans-serif',
              },
              success: {
                iconTheme: { primary: '#0ea5e9', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />

          <Routes>
            {/* Auth pages (no layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Main layout pages */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/rent" element={<Rent />} />
              <Route path="/ai-chat" element={<AIChat />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />

              {/* Protected: authenticated users */}
              <Route path="/checkout" element={
                <ProtectedRoute><Checkout /></ProtectedRoute>
              } />
              <Route path="/dashboard/*" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />

              {/* Protected: admin only */}
              <Route path="/admin/*" element={
                <ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>
              } />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}
