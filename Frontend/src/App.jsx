import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import PostPage from './pages/PostPage.jsx'
import HomePage from './pages/HomePage.jsx'
import UploadPage from './pages/UploadPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import { useEffect } from 'react'
import { ensureCurrentUserProfile } from './lib/authProfile.js'
import { isSupabaseConfigured, supabase } from './lib/supabase.js'

function AuthProfileSync() {
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined

    // Keep the app profile aligned after OAuth redirects and token refreshes.
    ensureCurrentUserProfile().catch((error) => console.error(error))

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        ensureCurrentUserProfile().catch((error) => console.error(error))
      }
    })

    return () => data.subscription.unsubscribe()
  }, [])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <AuthProfileSync />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        {/* Keeps direct upload reachable while the navbar modal is the main entry */}
        <Route path="/post/new" element={<UploadPage />} />
        <Route path="/post/:id" element={<PostPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
