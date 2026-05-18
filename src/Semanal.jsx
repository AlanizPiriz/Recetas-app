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
    const tag = localStorage.getItem('tagActivo') || ''
    const url = `${API_URL}/api/recipes/weekly?days=${dias}${tag ? `&tag=${tag}` : ''}`

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

            <button className="btn-generar" onClick={generarMenu}>
                {cargando ? 'Generando...' : '✨ Generar menú'}
            </button>

            <div className="lista-semanal">
                {recetas.map((receta, index) => (
                    <Link to={`/receta/${receta._id}?from=semanal`} key={receta._id} className="card-semanal">
                        <span className="dia-label">Día {index + 1}</span>
                        <img src={receta.image} alt={receta.name} />
                        <span className="nombre">{receta.name}</span>
                    </Link>
                ))}
            </div>
            {recetas.length > 0 && (
            <button className="btn-lista-semanal" onClick={irAListaSemanal}>
                🛒 Lista de compras semanal
            </button>
            )}
            <Link to="/">
                <button className="botonReceta">← Volver</button>
            </Link>
        </div>
    )
}

export default Semanal