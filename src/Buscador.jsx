import { useState } from "react";
import { Link } from 'react-router-dom'
import './Buscador.css'

const API_URL = 'https://recipes-api-z0gz.onrender.com'

function Buscador() {
    const [receta, setReceta] = useState(null)
    const [mostrarBuscador, setMostrarBuscador] = useState(false)
    const [ingredientes, setIngredientes] = useState("")
    const [resultados, setResultados] = useState([])
    const [ultimoId, setUltimoId] = useState(null)
    const [tagActivo, setTagActivo] = useState(localStorage.getItem('tagActivo') || null)

    function iluminame() {
    console.log('tag activo:', tagActivo)
    let url = `${API_URL}/api/recipes/random`
    const params = []
    if (ultimoId) params.push(`exclude=${ultimoId}`)
    if (tagActivo) params.push(`tag=${tagActivo}`)
    if (params.length) url += `?${params.join('&')}`

    fetch(url)
        .then(res => res.json())
        .then(datos => {
            if (datos.error) return
            setReceta(datos)
            setUltimoId(datos._id)
        })
    }

    function cambiarTag(tag) {
    if (tag) {
        localStorage.setItem('tagActivo', tag)
    } else {
        localStorage.removeItem('tagActivo')
    }
    setTagActivo(tag)
    setReceta(null)
    setUltimoId(null)
    }

    function buscarPorIngredientes() {
        const lista = ingredientes.split(',').map(i => i.trim()).join(',')
        fetch(`${API_URL}/api/recipes?q=${lista}`)
            .then(res => res.json())
            .then(datos => setResultados(datos))
    }

    return (
    <div className="home">
        <div className="navbar">
            <h1>¿Qué cocinamos hoy?</h1>
            {!receta && !mostrarBuscador && (
            <p className="intro">
                Dejá de pensar, nosotros te resolvemos<br />
                el problema más difícil del día 🍽️
            </p>
        )}
        </div>

        <div className="chips">
    {['vegano', 'vegetariano', 'sinTacc', 'sinLactosa', 'rapida', 'postre'].map(tag => (
        <button
            key={tag}
            className={`chip ${tagActivo === tag ? 'activo' : ''}`}
            onClick={() => cambiarTag(tagActivo === tag ? null : tag)}
        >
            {tag === 'vegano' && '🌱 Vegano'}
            {tag === 'vegetariano' && '🥦 Veggie'}
            {tag === 'sinTacc' && '🌾 Sin TACC'}
            {tag === 'sinLactosa' && '🥛 Sin lactosa'}
            {tag === 'rapida' && '⚡ Rápidas'}
            {tag === 'postre' && '🍮 Postres'}
        </button>
    ))}
    </div>

        {tagActivo && (
            <p className="filtro-activo">Filtrando: <strong>{tagActivo}</strong></p>
        )}

        {receta && (
            <div className="receta-sugerida">
                <Link to={`/receta/${receta._id}`}>
                    <div className="imagen-container">
                        <img src={receta.image} alt={receta.name} />
                        <span className="hover-texto">Ver receta</span>
                    </div>
                </Link>
                <h2>{receta.name}</h2>
            </div>
        )}

        <button className="btn-principal" onClick={iluminame}>
            {receta ? 'Otra?' : '✨ ¡Ilumíname!'}
        </button>

        <button className="btn-secundario" onClick={() => setMostrarBuscador(!mostrarBuscador)}>
            🥕 Buscar por ingredientes
        </button>

        {mostrarBuscador && (
            <div className="buscador-ingredientes">
                <p className="instruccion">Escribí los ingredientes que tenés separados por coma.<br/>
                <span>Ej: pollo, papa, cebolla</span></p>
                <input
                    value={ingredientes}
                    onChange={(e) => setIngredientes(e.target.value)}
                    placeholder="pollo, papa, cebolla..."
                />
                <button onClick={buscarPorIngredientes}>Buscar</button>
                <div className="resultados">
                    {resultados.map(item => (
                        <Link to={`/receta/${item._id}`} key={item._id} className="receta-card">
                            <img src={item.image} alt={item.name} />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        )}
        <Link to="/semanal">
            <button className="btn-secundario">📅 Menú semanal</button>
        </Link>
    </div>
)
}

export default Buscador