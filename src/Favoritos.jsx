import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import './Favoritos.css'
import { useAuth } from './context/AuthContext' // 1. Importar el contexto de autenticación

const API_URL = 'https://recipes-api-z0gz.onrender.com'

function Favoritos() {
    const navigate = useNavigate()
    const { user, token } = useAuth() // 2. Obtener el usuario y token actuales
    
    // Inicializar vacío, se llenará dinámicamente
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)

    // 3. Efecto para cargar favoritos desde la API o desde LocalStorage
    useEffect(() => {
        if (user) {
            // Caso con cuenta -> API
            setLoading(true)
            fetch(`${API_URL}/api/users/${user.id}/favorites`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setFavorites(data)
            })
            .catch(err => console.error('Error cargando favoritos de la API:', err))
            .finally(() => setLoading(false))
        } else {
            // Caso sin cuenta -> LocalStorage
            const saved = localStorage.getItem("recetasFavoritas")
            setFavorites(saved ? JSON.parse(saved) : [])
            setLoading(false)
        }
    }, [user, token])

    // 4. Modificar función para eliminar según el origen de los datos
    async function quitarFavorito(id) {
        if (user) {
            // Optimistic update en la interfaz
            setFavorites(prev => prev.filter(r => r._id !== id))
            
            // Petición de borrado a la API
            await fetch(`${API_URL}/api/users/${user.id}/favorites/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch(err => {
                console.error(err)
                // Aquí podrías recargar si falla para restaurar el estado anterior
            })
        } else {
            // Borrado local tradicional
            const nuevos = favorites.filter(r => r._id !== id)
            setFavorites(nuevos)
            localStorage.setItem("recetasFavoritas", JSON.stringify(nuevos))
        }
    }

    // 5. Mostrar pantalla de carga opcional mientras responde la API
    if (loading) {
        return <div className="favoritos-page"><p className="loading-txt">Cargando tus recetas favoritas...</p></div>
    }

    return (
        <div className="favoritos-page">

            <div className="favoritos-header">
                <h1>Mis favoritas</h1>
                <span className="fav-count">{favorites.length} recetas</span>
            </div>

            {favorites.length === 0 ? (
                <div className="favoritos-vacio">
                    <span className="corazon-vacio">♡</span>
                    <p>Todavía no guardaste ninguna receta.</p>
                    <button className="btn-principal" onClick={() => navigate('/')}>
                        Explorar recetas
                    </button>
                </div>
            ) : (
                <div className="favoritos-grid">
                    {favorites.map(receta => (
                        <div key={receta._id} className="fav-card">

                            <Link to={`/receta/${receta._id}`}>
                                <div className="imagen-container">
                                    <img src={receta.image} alt={receta.name} />
                                    <div className="hover-texto">{receta.name}</div>
                                </div>
                            </Link>

                            <button
                                className="fav-card-quitar"
                                onClick={() => quitarFavorito(receta._id)}
                            >
                                ♥
                            </button>

                        </div>
                    ))}
                </div>
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

                <Link to="/semanal" className="nav-item">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" height="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <p>Menú</p>
                </Link>

                <Link to="/favoritos" className="nav-item active">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <p>Favoritas</p>
                </Link>
            </div>

        </div>
    )
}

export default Favoritos
