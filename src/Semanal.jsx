import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Semanal.css'

const API_URL = 'https://recipes-api-z0gz.onrender.com'

function Semanal() {
    const [recetas, setRecetas] = useState(() => {
    const guardadas = localStorage.getItem('menuSemanal')
    return guardadas ? JSON.parse(guardadas) : []
    })

    const [dias, setDias] = useState(() => {
        return parseInt(localStorage.getItem('diasSemanal')) || 5
    })

    const [cargando, setCargando] = useState(false)
    const navigate = useNavigate()

    function irAListaSemanal() {
    const todos = recetas.flatMap(r => r.ingredients)
    
    // Extraer solo el ingrediente sin cantidad
    const simplificados = todos.map(ing => 
        ing.replace(/^\d+[\d,./]*\s*(g|kg|ml|litros?|tazas?|cucharadas?|cucharaditas?|fetas?|dientes?|hojas?|potes?|latas?|botellas?|paquetes?|unidades?)\s*(de\s*)?/i, '')
        .replace(/^(un|una|unos|unas|\d+)\s*/i, '')
        .trim()
        .toLowerCase()
    )
    
    // Deduplicar
    const unicos = [...new Set(simplificados)].map(i => 
        i.charAt(0).toUpperCase() + i.slice(1)
    )
    
    localStorage.setItem('listaCompras', JSON.stringify({
        receta: `Menú semanal (${dias} días)`,
        items: unicos
    }))
    navigate('/lista?from=semanal')
    }

    function generarMenu() {
    setCargando(true)
    const tagsActivos = JSON.parse(localStorage.getItem('tagsActivos') || '[]')
    const url = `${API_URL}/api/recipes/weekly?days=${dias}${tagsActivos.length ? `&tags=${tagsActivos.join(',')}` : ''}`

    fetch(url)
        .then(res => res.json())
        .then(datos => {
            if (Array.isArray(datos)) {
                setRecetas(datos)
                localStorage.setItem('menuSemanal', JSON.stringify(datos))
                localStorage.setItem('diasSemanal', dias)
            }
            setCargando(false)
        })
        .catch(() => setCargando(false))
    }

    return (
       <div className="home semanal">

            <div className="navbar">
                <div className="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div className="chef-avatar">👨‍🍳</div>
            </div>

            <div className="hero">
                <h1>📅 Menú semanal</h1>

                <p className="intro">
                    Recetas inteligentes que comparten ingredientes
                    para simplificar tu semana 🍽️
                </p>
            </div>

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
                <Link
                    to={`/receta/${receta._id}?from=semanal`}
                    key={receta._id}
                    className="card-semanal"
                >
                    {/* El indicador del día se queda suelto para alinearse perfectamente a la izquierda */}
                    <span className="dia-label">
                        Día {index + 1}
                    </span>
                                
                    {/* NUEVO CONTENEDOR: Agrupa la imagen y los textos de la receta */}
                    <div className="card-body-wrapper">
                        <img src={receta.image} alt={receta.name} />
                                    
                        <div className="info-card-semanal">
                            <span className="nombre">
                                {receta.name}
                            </span>
                                    
                            <div className="mini-tags">
                                {receta.tags?.map(tag => (
                                    <span key={tag} className="mini-tag">
                                        {tag === 'vegano' && '🌱 Vegano'}
                                        {tag === 'vegetariano' && '🥦 Veggie'}
                                        {tag === 'sinTacc' && '🌾 Sin TACC'}
                                        {tag === 'sinLactosa' && '🥛 Sin lactosa'}
                                        {tag === 'rapida' && '⚡ Rápida'}
                                        {tag === 'postre' && '🍮 Postre'}
                                        {tag === 'bajoEnCalorias' && '🥗 Light'}
                                        {tag === 'altoEnProteinas' && '💪 Proteínas'}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                            
                </Link>
            ))}

            </div>
            {recetas.length > 0 && (
            <button className="btn-lista-semanal" onClick={irAListaSemanal}>
                🛒 Lista de compras semanal
            </button>
            )}
            <div className="bottom-nav">

                <Link to="/" className="nav-item">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>

                    <p>Inicio</p>
                </Link>

                <Link to="/semanal" className="nav-item active">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>

                    <p>Menú</p>
                </Link>
            </div>
        </div>
    )
}

export default Semanal