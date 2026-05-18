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
    const [tagsActivos, setTagsActivos] = useState(() => {
    const guardados = localStorage.getItem('tagsActivos')
        return guardados ? JSON.parse(guardados) : []
    })
    const [hayLista, setHayLista] = useState(!!localStorage.getItem('listaCompras'))

    function iluminame() {
    let url = `${API_URL}/api/recipes/random`
    const params = []
    if (ultimoId) params.push(`exclude=${ultimoId}`)
    if (tagsActivos.length) params.push(`tags=${tagsActivos.join(',')}`)
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
    const nuevos = tagsActivos.includes(tag)
        ? tagsActivos.filter(t => t !== tag)
        : [...tagsActivos, tag]
    
    localStorage.setItem('tagsActivos', JSON.stringify(nuevos))
    setTagsActivos(nuevos)
    setReceta(null)
    setUltimoId(null)
    }

    function buscarPorIngredientes() {
        const lista = ingredientes.split(',').map(i => i.trim()).join(',')
        fetch(`${API_URL}/api/recipes?q=${lista}`)
            .then(res => res.json())
            .then(datos => setResultados(datos))
    }

    function formatearTag(tag) {
    const tags = {
        vegano: '🌱 Vegano',
        vegetariano: '🥦 Vegetariano',
        sinTacc: '🌾 Sin TACC',
        sinLactosa: '🥛 Sin lactosa',
        rapida: '⚡ Rápidas',
        postre: '🍮 Postres',
        bajoEnCalorias: '🥗 Bajo en calorías',
        altoEnProteinas: '💪 Alto en proteínas'
    }
    return tags[tag] || tag
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
        <div className="emojis-fondo">
            <span className="emoji-flotante">🍗</span>
            <span className="emoji-flotante">🥕</span>
            <span className="emoji-flotante">🍳</span>
            <span className="emoji-flotante">🧅</span>
            <span className="emoji-flotante">🥩</span>
            <span className="emoji-flotante">🫕</span>
            <span className="emoji-flotante">🧄</span>
            <span className="emoji-flotante">🥚</span>
            <span className="emoji-flotante">🍅</span>
            <span className="emoji-flotante">👨‍🍳</span>
        </div>

        <div className="chips">
    {['vegano', 'vegetariano', 'sinTacc', 'sinLactosa', 'rapida', 'postre', 'bajoEnCalorias', 'altoEnProteinas'].map(tag => (
        <button
            key={tag}
            className={`chip ${tagsActivos.includes(tag) ? 'activo' : ''}`}
            onClick={() => cambiarTag(tagsActivos === tag ? null : tag)}
        >
            {tag === 'vegano' && '🌱 Vegano'}
            {tag === 'vegetariano' && '🥦 Veggie'}
            {tag === 'sinTacc' && '🌾 Sin TACC'}
            {tag === 'sinLactosa' && '🥛 Sin lactosa'}
            {tag === 'rapida' && '⚡ Rápidas'}
            {tag === 'postre' && '🍮 Postres'}
            {tag === 'bajoEnCalorias' && '🥗 Bajo en calorías'}
            {tag === 'altoEnProteinas' && '💪 Alto en proteínas'}
        </button>
    ))}
    </div>

        {tagsActivos.length > 0 && (
            <p className="filtro-activo">
                Filtrando: {tagsActivos.map(t => <strong key={t}>{formatearTag(t)} </strong>)}
            </p>
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
        {hayLista && (
            <Link to="/lista" className="lista-tab">
                🛒
                <span>Mi lista</span>
            </Link>
        )}
    </div>
)
}

export default Buscador