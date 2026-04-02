import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ErrorUI({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Oops!</h3>
      <p className="text-slate-400 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  )
}

export function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl font-bold gradient-text mb-4">404</div>
      <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
      <p className="text-slate-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <button onClick={() => navigate('/')} className="btn-primary">
        <Home className="w-4 h-4" />
        Back to Home
      </button>
    </div>
  )
}
