import { BrowserRouter, Routes, Route  } from 'react-router-dom'
import Buscador from './Buscador'
import Receta from './Receta'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Buscador />} />
        <Route path="/receta/:id" element={<Receta />} />
      </Routes>
    </BrowserRouter>
  )
}


export default App