import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import './Receta.css'
import { useParams, Link } from "react-router-dom"

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
                <h1>Detalle de receta</h1>
                <h2>{receta.name}</h2>
                <img src={receta.image} width="60%" />
                <p>{receta.instructions}</p>
                <ul>
                    {receta.ingredients.map((ing, index) => (
                        <li key={index}>{ing}</li>
                    ))}
                </ul>
                <Link to="/">
                    <button className="botonReceta">Volver a recetas</button>
                </Link>
            </div>
            )}
        </div>
    )
}

export default Receta