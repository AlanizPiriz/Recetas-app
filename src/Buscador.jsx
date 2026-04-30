import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import './Buscador.css'
import miIcono from './assets/pngwing.com.png';



function Buscador() {
    const [busqueda, setBusqueda] = useState("beef")
    const [recetas, setRecetas] = useState([])

    



    function buscar() {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${busqueda}`)
            .then(res => res.json())
            .then(datos => { 
                setRecetas(datos.meals)
                console.log(datos.meals)
            })
    }

    useEffect(() => {
        buscar();
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
            </div>
            <div className="recetas">
            {recetas && recetas.map((item) => (
            <Link to={`/receta/${item.idMeal}`} key={item.idMeal} className="receta-card">
            <img src={item.strMealThumb} alt={item.strMeal} className="receta-img" />
            <span className="receta-titulo">{item.strMeal}</span>
            </Link>
            ))}
        </div>
        </div>
    )
    
}

export default Buscador