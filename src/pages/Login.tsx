import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext-safe'

const Login: React.FC = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { signInWithGoogle, signInWithEmail, loading, isAuthenticated, user, supabaseAvailable } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  // Handle authentication state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is authenticated, redirecting to dashboard')
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  // Also check URL parameters for session (OAuth callback)
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const accessToken = urlParams.get('access_token')
      const refreshToken = urlParams.get('refresh_token')
      
      if (accessToken || refreshToken) {
        console.log('OAuth callback detected, waiting for session...')
        // Clear the URL parameters
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }

    handleOAuthCallback()
  }, [])

  const onGoogle = async () => {
    console.log('Starting Google sign in...')
    const { error } = await signInWithGoogle()
    if (error) {
      console.error('Google sign in error:', error)
    }
  }

  const onEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    const { error } = await signInWithEmail(email)
    if (!error) setSent(true)
  }

  // Show loading while checking authentication state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-6 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900'
        : 'bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50'
    }`}>
      <div className={`w-full max-w-md rounded-2xl p-8 shadow-2xl backdrop-blur-xl border ${
        theme === 'dark'
          ? 'bg-gray-900/50 border-gray-800'
          : 'bg-white/70 border-gray-200'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-purple-500 to-cyan-600'
              : 'bg-gradient-to-br from-blue-500 to-indigo-600'
          }`}>
            N
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              NextStop Admin
            </h1>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign in to continue
            </p>
          </div>
        </div>

        <form onSubmit={onEmail} className="space-y-3 mb-6">
          <label className={`block text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Work email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={`w-full px-4 py-3 rounded-xl outline-none border ${
              theme === 'dark' ? 'bg-gray-800/70 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl transition-all duration-300 hover:scale-[1.01] ${
              theme === 'dark' ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {sent ? 'Magic link sent ✓' : loading ? 'Sending…' : 'Email me a magic link'}
          </button>
        </form>

        <div className={`relative my-4`}>
          <div className={`absolute inset-0 flex items-center`}>
            <div className={`${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} w-full border-t`}></div>
          </div>
          <div className={`relative flex justify-center text-xs`}>
            <span className={`${theme === 'dark' ? 'bg-gray-900/50 text-gray-400' : 'bg-white/70 text-gray-500'} px-2`}>or</span>
          </div>
        </div>

        <button
          onClick={onGoogle}
          disabled={loading}
          className={`w-full flex items-center justify-center space-x-3 py-3 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
            theme === 'dark'
              ? 'bg-gray-800/70 border-gray-700 hover:bg-gray-800 text-white'
              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-800'
          }`}
        >
          <FcGoogle size={22} />
          <span>{loading ? 'Preparing…' : 'Continue with Google'}</span>
        </button>

        <p className={`text-xs mt-4 text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  )
}

export default Login
