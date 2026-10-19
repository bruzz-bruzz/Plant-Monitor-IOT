import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>}></Route>
      </Routes>
    </BrowserRouter>
)
