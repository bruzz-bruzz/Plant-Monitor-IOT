import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import About from './components/About.tsx'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>}></Route>
        <Route path='/about' element={<About/>}></Route>
      </Routes>
    </BrowserRouter>
)
