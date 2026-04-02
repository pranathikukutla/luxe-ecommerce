import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingScreen from '../components/common/LoadingScreen'

export function ProtectedRoute({ children, requireAdmin = false, requirePremium = false }) {
  const { isAuthenticated, isAdmin, isPremium, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen />

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  if (requirePremium && !isPremium) {
    return <Navigate to="/premium" replace />
  }

  return children
}
