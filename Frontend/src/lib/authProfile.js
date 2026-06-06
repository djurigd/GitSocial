import { useEffect, useState } from 'react'

import { isSupabaseConfigured, supabase } from './supabase.js'

// Supabase Auth owns the session; GitSocial profile rows own app-facing identity.
export async function getCurrentAuthUser() {
  if (!isSupabaseConfigured) return null

  const { data, error } = await supabase.auth.getUser()

  if (error) {
    return null
  }

  return data?.user ?? null
}

export async function getCurrentUserProfile() {
  const user = await getCurrentAuthUser()

  if (!user) return null

  const { data: profile, error } = await supabase
    .from('users')
    .select('id, username, email, github_username, avatar_url, bio')
    .eq('email', user.email)
    .maybeSingle()

  if (error) {
    throw error
  }

  localStorage.removeItem('pending_username')
  return profile
}

export const ensureCurrentUserProfile = getCurrentUserProfile

// Write paths need the GitSocial users.id value, not the Supabase auth user id.
export async function getCurrentAppUserId() {
  const user = await getCurrentAuthUser()

  if (!user) {
    throw new Error('Sign in required.')
  }

  const profile = await getCurrentUserProfile()

  if (!profile?.id) {
    throw new Error('Profile setup is incomplete.')
  }

  return profile.id
}

export async function signOut() {
  if (!isSupabaseConfigured) return

  localStorage.removeItem('pending_username')
  await supabase.auth.signOut()
}

// Shared hook for components that need both the session and GitSocial profile.
export function useAuthProfile() {
  const [authUser, setAuthUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadAuthProfile() {
      if (!isSupabaseConfigured) {
        if (mounted) setLoading(false)
        return
      }

      try {
        if (mounted) setLoading(true)

        const user = await getCurrentAuthUser()
        const userProfile = user ? await getCurrentUserProfile() : null

        if (mounted) {
          setAuthUser(user)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error(error)
        if (mounted) {
          setAuthUser(null)
          setProfile(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadAuthProfile()

    if (!isSupabaseConfigured) {
      return () => {
        mounted = false
      }
    }

    const { data } = supabase.auth.onAuthStateChange(() => {
      loadAuthProfile()
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  return { authUser, profile, loading }
}
