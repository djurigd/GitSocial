import { BrowserRouter, Routes, Route} from 'react-router-dom';

import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/profile" element={<h1>Profile Page</h1>} />
          <Route path="/settings" element={<h1>Settings Page</h1>} />
          <Route path="/post" element={<h1>Post Page</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
