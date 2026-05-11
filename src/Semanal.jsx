import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Semanal.css'

const API_URL = 'https://recipes-api-z0gz.onrender.com'

function Semanal() {
    const [dias, setDias] = useState(5)
    const [recetas, setRecetas] = useState([])
    const [cargando, setCargando] = useState(false)

    function generarMenu() {
        setCargando(true)
        const tag = localStorage.getItem('tagActivo') || ''
        const url = `${API_URL}/api/recipes/weekly?days=${dias}${tag ? `&tag=${tag}` : ''}`

        fetch(url)
            .then(res => res.json())
            .then(datos => {
                if (Array.isArray(datos)) {
                setRecetas(datos)
            }
                setCargando(false)
        })
            .catch(() => setCargando(false))
    }

    return (
        <div className="semanal">
            <h1>📅 Menú semanal</h1>
            <p className="intro">Recetas que comparten ingredientes para optimizar tu semana</p>

            <div className="selector-dias">
                {[3, 5, 7].map(d => (
                    <button
                        key={d}
                        className={`dia-btn ${dias === d ? 'activo' : ''}`}
                        onClick={() => setDias(d)}
                    >
                        {d} días
                    </button>
                ))}
            </div>

            <button className="btn-generar" onClick={generarMenu}>
                {cargando ? 'Generando...' : '✨ Generar menú'}
            </button>

            <div className="lista-semanal">
                {recetas.map((receta, index) => (
                    <Link to={`/receta/${receta._id}`} key={receta._id} className="card-semanal">
                        <span className="dia-label">Día {index + 1}</span>
                        <img src={receta.image} alt={receta.name} />
                        <span className="nombre">{receta.name}</span>
                    </Link>
                ))}
            </div>
            <Link to="/">
                <button className="botonReceta">← Volver</button>
            </Link>
        </div>
    )
}

export default Semanal