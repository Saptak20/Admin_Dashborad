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
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        // When user signs in, ensure they're in the profiles table
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in:', session.user.email)
          
          // Try to sync the user to profiles table
          try {
            const { error: syncError } = await supabase.rpc('sync_auth_users_to_profiles')
            if (syncError) {
              console.warn('Sync function error:', syncError)
            } else {
              console.log('User sync completed')
            }
          } catch (err) {
            console.warn('Sync function not available, user should be synced by trigger')
          }
          
          // Check if user exists in profiles
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            
          if (profileError && profileError.code === 'PGRST116') {
            console.log('Profile not found, attempting manual insert...')
            // Profile doesn't exist, try to create it manually
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || 
                          session.user.user_metadata?.name || 
                          session.user.email?.split('@')[0]
              })
              
            if (insertError) {
              console.error('Failed to create profile:', insertError)
            } else {
              console.log('Profile created manually')
            }
          } else if (profile) {
            console.log('Profile found:', profile)
          }
          
          // Check admin status
          const { data: adminCheck } = await supabase.rpc('is_admin')
          console.log('Is admin:', adminCheck)
          
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
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
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
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

  const value: AuthContextType = {
    user,
    session,
    loading,
    signInWithGoogle,
  signInWithEmail,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
