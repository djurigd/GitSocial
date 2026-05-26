import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { LogIn } from './components/LogIn';

import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogIn />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
