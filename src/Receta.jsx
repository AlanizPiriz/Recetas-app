import { useParams, Link, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import './Receta.css'
import { motion } from 'framer-motion'
import random from './assets/aleatorio.png'




function Receta() {
    const { id } = useParams()
    const [receta, setReceta] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()
    const from = new URLSearchParams(location.search).get('from')
    const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("recetasFavoritas")
        return saved ? JSON.parse(saved) : []
    })


    function toggleFavorito() {
    setFavorites(prev => {
        const yaEsta = prev.some(r => r._id === receta._id)
        const nuevos = yaEsta
            ? prev.filter(r => r._id !== receta._id)
            : [...prev, { _id: receta._id, name: receta.name, image: receta.image }]
        
            localStorage.setItem("recetasFavoritas", JSON.stringify(nuevos))
            return nuevos
        })
    }


    function simplificarIngrediente(ing) {
        const lower = ing.toLowerCase()
        
        // Extraer cantidad y unidad de compra
        if (lower.includes('aceite')) return '1 botella de aceite'
        if (lower.includes('sal ') || lower === 'sal') return 'Sal'
        if (lower.includes('pimienta')) return 'Pimienta'
        if (lower.includes('azúcar')) return 'Azúcar'
        if (lower.includes('harina')) return '1 paquete de harina'
        if (lower.includes('leche')) return '1 litro de leche'
        if (lower.includes('huevo')) {
            const num = ing.match(/\d+/)
            return num ? `${num[0]} huevos` : 'Huevos'
        }
        if (lower.includes('cebolla')) {
            const num = ing.match(/\d+/)
            return num ? `${num[0]} cebollas` : '1 cebolla'
        }
        if (lower.includes('ajo')) return 'Ajo'
        if (lower.includes('tomate')) {
            const num = ing.match(/\d+/)
            return num ? `${num[0]} tomates` : 'Tomates'
        }
        if (lower.includes('papa')) {
            const num = ing.match(/\d+/)
            return num ? `${num[0]} papas` : 'Papas'
        }
        if (lower.includes('zanahoria')) {
            const num = ing.match(/\d+/)
            return num ? `${num[0]} zanahorias` : 'Zanahorias'
        }
        if (lower.includes('pollo')) return '1 pollo o pechugas'
        if (lower.includes('carne')) {
            const gramos = ing.match(/\d+/)
            return gramos ? `${gramos[0]}g de carne` : 'Carne'
        }
        if (lower.includes('queso')) return '1 paquete de queso'
        if (lower.includes('jamón')) return '1 paquete de jamón'
        if (lower.includes('crema')) return '1 pote de crema'
        if (lower.includes('manteca')) return '1 paquete de manteca'
        if (lower.includes('arroz')) return '1 paquete de arroz'
        if (lower.includes('pasta') || lower.includes('fideos')) return '1 paquete de pasta'
        if (lower.includes('pan rallado')) return '1 paquete de pan rallado'
        if (lower.includes('limón')) return '1 limón'
        if (lower.includes('morrón')) return '1 morrón'

        // Si no matchea nada, devolver como está pero sin números y unidades
        return ing.replace(/^\d+\s*(g|kg|ml|l|taza|cucharada[s]?|cucharadita[s]?|feta[s]?|diente[s]?)\s*(de\s*)?/i, '')
            .replace(/^(un|una|unos|unas)\s*/i, '')
            .trim()
    }

    function generarListaCompras() {
        const items = receta.ingredients.map(simplificarIngrediente)
        const unicos = [...new Set(items)]
        return unicos
    }

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

    function irALista() {
    const items = generarListaCompras()
    localStorage.setItem('listaCompras', JSON.stringify({
        receta: receta.name,
        items
    }))
    const from = new URLSearchParams(location.search).get('from')
    navigate(`/lista${from === 'semanal' ? '?from=semanal' : ''}`)
    }   

    async function otraReceta() {
    try {
        const res = await fetch(
            `https://recipes-api-z0gz.onrender.com/api/recipes/random?exclude=${id}`
        )

        const data = await res.json()

        if (data?._id) {
            navigate(`/receta/${data._id}`)
        }

    } catch (err) {
        console.log(err)
    }
      window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    }

    return (
    <div className="detalle-receta">

        {receta && (
            <>
                <motion.div
                    className="hero-receta"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    whileTap={{ cursor: "grabbing" }}
                    onDragEnd={(event, info) => {
                        if (
                            info.offset.x > 120 ||
                            info.offset.x < -120
                        ) {
                            otraReceta()
                        }
                    }}
                >

                    <img src={receta.image} alt={receta.name} />

                    <button
                        className="back-btn"
                        onClick={() =>
                            navigate(from === 'semanal' ? '/semanal' : '/')
                        }
                    >
                        ←
                    </button>

                    <button 
                        className={`fav-btn ${favorites.some(r => r._id === receta?._id) ? "active" : ""}`}
                        onClick={toggleFavorito}
                        >
                        {favorites.some(r => r._id === receta?._id) ? "♥" : "♡"}
                    </button>

                    <div className="swipe-overlay">
                        ← Deslizá para otra receta →
                    </div>

                </motion.div>

                <div className="contenido-receta">

                    <h1>{receta.name}</h1>

                    <div className="info-receta">

                        {receta.tags?.map((tag, index) => (
                            <div key={tag} className="tag-inline">
                            
                                <span>
                                    {tag === 'vegano' && '🌱 Vegano'}
                                    {tag === 'vegetariano' && '🥦 Veggie'}
                                    {tag === 'sinTacc' && '🌾 Sin TACC'}
                                    {tag === 'sinLactosa' && '🥛 Sin lactosa'}
                                    {tag === 'rapida' && '⚡ Rápida'}
                                    {tag === 'postre' && '🍮 Postre'}
                                    {tag === 'bajoEnCalorias' && '🥗 Light'}
                                    {tag === 'altoEnProteinas' && '💪 Proteínas'}
                                </span>
                        
                            </div>
                        ))}
                    
                    </div>

                    <div className="bloque-receta">

                        <h3>Ingredientes</h3>

                        <ul className="ingredientes-lista">
                            {receta.ingredients.map((ing, index) => (
                                <li key={index}>{ing}</li>
                            ))}
                        </ul>

                        <h3>Preparación</h3>

                        <p className="preparacion">
                            {receta.instruction}
                        </p>

                    </div>

                    <button
                        className="btn-principal"
                        onClick={otraReceta}
                    >
                        <img src={random} alt="" className="icono-random" /> Otra receta
                    </button>

                    <button
                        className="btn-secundario"
                        onClick={irALista}
                    >
                        🛒 Lista de compras
                    </button>

                </div>

                <div className="bottom-nav">

                    <Link to="/" className="nav-item active">
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
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>

                        <p>Menú</p>
                    </Link>

                    <Link to="/favoritos" className="nav-item">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        <p>Favoritas</p>
                    </Link>

                </div>
            </>
        )}
    </div>
)
}

export default Receta