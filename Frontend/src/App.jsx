import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { Profile } from '../components/Profile/Profile';
import { Posts } from '../components/projects/Posts';
import { Projects } from '../components/projects/Projects';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/:username' element={<Profile />} >
            <Route index element={<Posts />} />
            <Route path='projects' element={<Projects />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
