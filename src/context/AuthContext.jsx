import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/authAPI'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(() => localStorage.getItem('luxe_token'))

  const loadUser = useCallback(async () => {
    if (!token) { setLoading(false); return }
    try {
      const res = await authAPI.getMe()
      setUser(res.data.user)
    } catch {
      localStorage.removeItem('luxe_token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { loadUser() }, [loadUser])

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })
    const { token: t, user: u } = res.data
    localStorage.setItem('luxe_token', t)
    setToken(t)
    setUser(u)
    toast.success(`Welcome back, ${u.name}!`)
    return u
  }

  const register = async (data) => {
    const res = await authAPI.register(data)
    const { token: t, user: u } = res.data
    localStorage.setItem('luxe_token', t)
    setToken(t)
    setUser(u)
    toast.success('Account created successfully!')
    return u
  }

  const logout = () => {
    localStorage.removeItem('luxe_token')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }))

  const isAdmin = user?.role === 'admin'
  const isPremium = user?.isPremium || user?.role === 'admin'
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{
      user, loading, token, isAuthenticated, isAdmin, isPremium,
      login, register, logout, updateUser, loadUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
