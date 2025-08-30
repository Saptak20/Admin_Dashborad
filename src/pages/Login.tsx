import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

const Login: React.FC = () => {
  const { theme } = useTheme()
  const { signInWithGoogle, loading } = useAuth()

  const onGoogle = async () => {
    await signInWithGoogle()
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
