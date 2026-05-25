import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom'
import Buscador from './Buscador'
import Receta from './Receta'
import Login from './Login'
import Admin from './Admin'
import Semanal from './Semanal'
import Lista from './Lista'
import './Global.css'
import Favoritos from './Favoritos'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Buscador />} />
        <Route path="/receta/:id" element={<Receta />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/semanal" element={<Semanal />} />
        <Route path="/lista" element={<Lista />} />
        <Route path="/favoritos" element={<Favoritos />} />
      </Routes>
    </HashRouter>
  )
}

export default App