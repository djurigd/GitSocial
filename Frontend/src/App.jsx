import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import PostPage from './pages/PostPage.jsx'
import HomePage from './pages/HomePage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<h1>Profile Page</h1>} />
        <Route path="/settings" element={<h1>Settings Page</h1>} />
        <Route path="/post/:id" element={<PostPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
