import { useParams, Link} from "react-router-dom"
import { useState, useEffect } from "react"
import './Receta.css'


function Receta() {
    const { id } = useParams()
    const [receta, setReceta] = useState(null)
    
    useEffect(() => {
        fetch(`https://recipes-api-z0gz.onrender.com/api/recipes/${id}`)
        .then(res => res.json())
        .then(datos => {
            if(datos) {
                setReceta(datos)
            }
        })
        .catch(err => console.log('Error:', err))
    }, [id])

    return (
       <div className="recetaG">
    {receta && (
    <div className="receta">
        <img src={receta.image} alt={receta.name} />
        <div className="receta-contenido">
            <h1>Receta sugerida</h1>
            <h2>{receta.name}</h2>
            <h3>Ingredientes</h3>
            <ul>
                {receta.ingredients.map((ing, index) => (
                    <li key={index}>{ing}</li>
                ))}
            </ul>
            <h3>Preparación</h3>
            <p>{receta.instruction}</p>
            <Link to="/">
                <button className="botonReceta">← Volver</button>
            </Link>
        </div>
    </div>
    )}
</div>
    )
}

export default Receta