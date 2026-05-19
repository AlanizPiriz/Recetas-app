import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import './Buscador.css'
import varita from './assets/varita-magica (1).png'
import planta from './assets/planta.png'

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

    const [menuPreview, setMenuPreview] = useState(() => {
    const guardado = localStorage.getItem('menuSemanal')
    return guardado ? JSON.parse(guardado).slice(0, 3) : []
    })

    useEffect(() => {
        if (menuPreview.length === 0) {
            fetch(`${API_URL}/api/recipes/weekly?days=3`)
                .then(res => res.json())
                .then(datos => {
                    if (Array.isArray(datos)) setMenuPreview(datos)
                })
        }
    }, [])

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
            <div className="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className="chef-avatar">👨‍🍳</div>
        </div>

        <div className="hero">
            <h1><span className="signo">¿</span>Qué cocinamos hoy?</h1>
            <p className="intro">
                Dejá de pensar, nosotros te resolvemos<br />
                  el problema más difícil del día 🍽️
            </p>
        </div>
        
        <p className="filtros-label"><img src={planta} alt="" className="icono-filtro" />Filtros rápidos</p>

        <div className="chips">
            {['vegano', 'vegetariano', 'sinTacc', 'sinLactosa', 'rapida', 'postre', 'bajoEnCalorias', 'altoEnProteinas'].map(tag => (
                <button
                    key={tag}
                    className={`chip ${tagsActivos.includes(tag) ? 'activo' : ''}`}
                    onClick={() => cambiarTag(tag)}
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

        <button className="btn-iluminame" onClick={iluminame}>
            <div className="magic-icon">
                <img src={varita} alt="varita mágica" />
            </div>
            <div className="btn-content">
                <h3>{receta ? 'Otra receta' : '¡Ilumíname!'}</h3>
                {!receta && <p>Dame una receta al azar</p>}
            </div>
            <span className="arrow">→</span>
        </button>
        {menuPreview.length > 0 && (
    <div className="menu-preview">
        <div className="menu-preview-header">
            <div className="menu-preview-titulo">
                <span className="menu-preview-icono">📅</span>
                <h3>Menú de esta semana</h3>
            </div>
            <Link to="/semanal" className="ver-completo">Ver completo →</Link>
        </div>
        <div className="menu-preview-cards">
            {menuPreview.map((receta, index) => {
                        const dias = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE']
                        return (
                            <Link to={`/receta/${receta._id}`} key={receta._id} className="menu-preview-card">
                                <div className="menu-preview-img-wrapper">
                                    <div className="dia-badge">
                                        <span className="dia-nombre">{dias[index]}</span>
                                        <span className="dia-numero">{index + 1}</span>
                                    </div>
                                    <img src={receta.image} alt={receta.name} />
                                </div>
                                <p>{receta.name}</p>
                            </Link>
                        )
                    })}
                </div>
            </div>
)}

        {mostrarBuscador && (
            <div className="buscador-ingredientes">
                <p className="instruccion">Escribí los ingredientes que tenés separados por coma.<br/>
                    <span>Ej: pollo, papa, cebolla</span>
                </p>
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

        {hayLista && (
            <Link to="/lista" className="lista-tab">
                🛒
                <span>Mi lista</span>
            </Link>
        )}
        <div className="bottom-nav">
    <Link to="/" className="nav-item active">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <p>Inicio</p>
    </Link>
    <Link to="/semanal" className="nav-item">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <p>Menú</p>
    </Link>
    <button
        className="nav-item nav-btn"
        onClick={() => setMostrarBuscador(!mostrarBuscador)}> 
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p>Buscar</p>
    </button>
    </div>

    </div>
)
}

export default Buscador