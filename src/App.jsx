import { BrowserRouter, Routes, Route, HashRouter } from 'react-router-dom'
import Buscador from './Buscador'
import Receta from './Receta'


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Buscador />} />
        <Route path="/receta/:id" element={<Receta />} />
      </Routes>
    </HashRouter>
  )
}


export default App