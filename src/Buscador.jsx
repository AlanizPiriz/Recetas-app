import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import './Buscador.css'
import varita from './assets/varita-magica (1).png'
import planta from './assets/planta.png'
import { useAuth } from './context/AuthContext'

const API_URL = 'https://recipes-api-z0gz.onrender.com'

function Buscador() {
    // 1. Extraer los datos y estados del AuthContext (¡Adentro del componente!)
    const { user, token, loading: authLoading } = useAuth()
    
    // 2. Todos tus estados locales agrupados
    const [receta, setReceta] = useState(null)
    const [mostrarBuscador, setMostrarBuscador] = useState(false)
    const [ingredientes, setIngredientes] = useState("")
    const [resultados, setResultados] = useState([])
    const [ultimoId, setUltimoId] = useState(null)
    const [recetaSiguiente, setRecetaSiguiente] = useState(null)
    
    const [favorites, setFavorites] = useState([])
    const [loadingFavs, setLoadingFavs] = useState(true)

    const [tagsActivos, setTagsActivos] = useState(() => {
        const guardados = localStorage.getItem('tagsActivos')
        return guardados ? JSON.parse(guardados) : []
    })
    
    const [hayLista, setHayLista] = useState(!!localStorage.getItem('listaCompras'))
    
    const [menuPreview, setMenuPreview] = useState(() => {
        const guardado = localStorage.getItem('menuSemanal')
        return guardado ? JSON.parse(guardado).slice(0, 3) : []
    })

    // 3. EFECTO PARA CARGAR FAVORITOS (Controla si está cargando el Auth)
    useEffect(() => {
        if (authLoading) return // Esperar a que el contexto verifique el token

        if (user) {
            // Usuario registrado -> API
            setLoadingFavs(true)
            fetch(`${API_URL}/api/users/${user.id}/favorites`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if (!res.ok) throw new Error('Error en respuesta de servidor')
                return res.json()
            })
            .then(data => {
                console.log("Datos crudos que llegaron a la preview de inicio:", data)
                if (Array.isArray(data)) setFavorites(data)
            })
            .catch(err => console.error('Error cargando favoritos en inicio:', err))
            .finally(() => setLoadingFavs(false))
        } else {
            // Invitado -> LocalStorage
            const saved = localStorage.getItem("recetasFavoritas")
            setFavorites(saved ? JSON.parse(saved) : [])
            setLoadingFavs(false)
        }
    }, [user, token, authLoading])

    // 4. Efecto para el menú semanal
    useEffect(() => {
        if (menuPreview.length === 0) {
            fetch(`${API_URL}/api/recipes/weekly?days=3`)
                .then(res => res.json())
                .then(datos => {
                    if (Array.isArray(datos)) setMenuPreview(datos)
                })
        }
    }, [])

    // 5. Efecto para precargar la siguiente receta random
    useEffect(() => {
        precargarSiguiente(null)
    }, [])

    function precargarSiguiente(excludeId) {
        let url = `${API_URL}/api/recipes/random`
        const params = []
        if (excludeId) params.push(`exclude=${excludeId}`)
        if (tagsActivos.length) params.push(`tags=${tagsActivos.join(',')}`)
        if (params.length) url += `?${params.join('&')}`

        fetch(url)
            .then(res => res.json())
            .then(datos => {
                if (!datos.error) {
                    const img = new Image()
                    img.src = datos.image
                    setRecetaSiguiente(datos)
                }
            })
    }
    function iluminame() {
      if (recetaSiguiente) {
        // Ya la tenemos precargada, la mostramos al instante
        setReceta(recetaSiguiente)
        setUltimoId(recetaSiguiente._id)
        setRecetaSiguiente(null)
        precargarSiguiente(recetaSiguiente._id)
      } else {
        // Primera vez, fetch normal
        let url = `${API_URL}/api/recipes/random`
        const params = []
        if (ultimoId) params.push(`exclude=${ultimoId}`)
        if (tagsActivos.length) {
            params.push(`tags=${tagsActivos.join(',')}`)}
            
        if (params.length) url += `?${params.join('&')}`
    
        fetch(url)
          .then(res => res.json())
          .then(datos => {
            if (datos.error) return
            setReceta(datos)
            setUltimoId(datos._id)
            precargarSiguiente(datos._id) // 👈 precargamos la siguiente
          })
      }
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

    function abrirBuscador() {
      setMostrarBuscador(!mostrarBuscador)
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        })
      }, 100)
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
                    {menuPreview.slice(0, 5).map((receta, index) => {
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

        {loadingFavs ? (
            <div className="menu-preview">
                <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                    Actualizando tus favoritos...
                </p>
            </div>
        ) : (
            favorites.length > 0 && (
                <div className="menu-preview">
                    <div className="menu-preview-header">
                        <div className="menu-preview-titulo">
                            <span className="menu-preview-icono">♥</span>
                            <h3>Mis favoritas</h3>
                        </div>
                        <Link to="/favoritos" className="ver-completo">Ver todas →</Link>
                    </div>
                    <div className="menu-preview-cards">
                        {favorites.slice(0, 3).map((receta) => (
                            <Link to={`/receta/${receta._id}`} key={receta._id} className="menu-preview-card">
                                <div className="menu-preview-img-wrapper">
                                    <img src={receta.image || 'https://placeholder.com'} alt={receta.name} />
                                </div>
                                <p>{receta.name || 'Receta sin título'}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )
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

            <Link to="/favoritos" className="nav-item">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <p>Favoritas</p>
            </Link>
        </div>

    </div>
)
}

export default Buscador