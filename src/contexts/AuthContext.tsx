import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signInWithEmail: (email: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  bypassAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        // First, check if there's a session in the URL (for OAuth callbacks)
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        } else {
          console.log('Initial session:', session ? 'Found' : 'None')
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session ? 'Session exists' : 'No session')
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', session?.user?.email)
          // Clear any auth-related URL fragments after successful sign-in
          if (window.location.hash.includes('access_token') || window.location.hash.includes('error')) {
            window.history.replaceState({}, document.title, window.location.pathname)
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out')
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed for:', session?.user?.email)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      // Use the current origin, which will be the correct URL in both dev and production
      const redirectTo = "https://admindashboards1231.netlify.app/dashboard"
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signInWithEmail = async (email: string) => {
    try {
      // Use the current origin, which will be the correct URL in both dev and production
      const redirectTo = "https://admindashboards1231.netlify.app/dashboard"
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const bypassAuth = () => {
    // Create a simplified mock user for development bypass
    const mockUser = {
      id: 'dev-bypass-user',
      email: 'dev@nextstop.admin',
      user_metadata: { full_name: 'Development User' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      role: 'authenticated',
      updated_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      phone: '',
      is_anonymous: false
    } as User

    const mockSession = {
      access_token: 'dev-access-token',
      refresh_token: 'dev-refresh-token',
      expires_in: 3600,
      expires_at: Date.now() / 1000 + 3600,
      token_type: 'bearer',
      user: mockUser
    }

    setUser(mockUser)
    setSession(mockSession as any)
    console.log('Development bypass activated')
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signOut,
    bypassAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
