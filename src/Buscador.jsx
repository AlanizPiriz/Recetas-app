import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import './Buscador.css'
import miIcono from './assets/pngwing.com.png';

const API_URL = 'https://recipes-api-z0gz.onrender.com'

function Buscador() {
    const [busqueda, setBusqueda] = useState("")
    const [recetas, setRecetas] = useState([])

    function buscar() {
        fetch(`${API_URL}/api/recipes?q=${busqueda}`)
            .then(res => res.json())
            .then(datos => setRecetas(datos))
    }

    function recetaAleatoria() {
    fetch(`${API_URL}/api/recipes/random`)
        .then(res => res.json())
        .then(datos => setRecetas([datos]))
    }



    useEffect(() => {
        buscar()
    }, []);

    return (
        <div className="buscador">
            <div className="buscadorInput">
            <h1>Buscador de Recetas<img src={miIcono} alt="Icono" /></h1>
            <input 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar receta..."
            />
            <button onClick={buscar}>Buscar</button>
            <button onClick={recetaAleatoria}>🎲 Receta aleatoria</button>
            </div>
            <div className="recetas">
            {recetas && recetas.map((item) => (
            <Link to={`/receta/${item._id}`} key={item._id} className="receta-card">
                <img src={item.image} alt={item.name} className="receta-img" />
                <span className="receta-titulo">{item.name}</span>
            </Link>
            ))}
            </div>
        </div>
    )

}



export default Buscador