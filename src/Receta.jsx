import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import './Receta.css'


function Receta() {
    const { id } = useParams()
    const [receta, setReceta] = useState(null)
    
    useEffect(() => {
        console.log('useEffect ejecutado, id', id)
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(datos => {
            if(datos.meals) {
            setReceta(datos.meals[0])
            console.log(datos.meals)
            }
        })
        .catch(err => console.log('Error:', err))
    }, [id])

    return (
        <div className="recetaG">
            
            {receta && (
            <div className="receta">
                <h1>Detalle de receta</h1>
                <h2>{receta.strMeal}</h2>
                <img src={receta.strMealThumb} width="300" />
                <p>{receta.strInstructions}</p>
                <a href="http://localhost:5173/">
                <button>Volver a recetas</button>
                </a>
            </div>
            
            )}
            
        </div>
    )
}

export default Receta