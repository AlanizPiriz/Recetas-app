import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom'
import Buscador from './Buscador'
import Receta from './Receta'
import Login from './Login'
import Admin from './Admin'
import Semanal from './Semanal'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Buscador />} />
        <Route path="/receta/:id" element={<Receta />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/semanal" element={<Semanal />} />
      </Routes>
    </HashRouter>
  )
}

export default App