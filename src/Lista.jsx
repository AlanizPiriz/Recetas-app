import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './Lista.css'

function Lista() {
    const [lista, setLista] = useState(null)
    const [tachados, setTachados] = useState([])
    const navigate = useNavigate()
    const location = useLocation()
    const from = new URLSearchParams(location.search).get('from')

    useEffect(() => {
        const data = localStorage.getItem('listaCompras')
        if (data) setLista(JSON.parse(data))
    }, [])

    function toggleItem(item) {
        setTachados(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
        )
    }

    function compartirWhatsApp() {
        const texto = `🛒 Lista de compras - ${lista.receta}\n\n${lista.items.map(i => `• ${i}`).join('\n')}`
        const url = `https://wa.me/?text=${encodeURIComponent(texto)}`
        window.open(url, '_blank')
    }

    function limpiarLista() {
    localStorage.removeItem('listaCompras')
    navigate('/')
    }

    if (!lista) return <div className="lista-page"><p>No hay lista generada.</p></div>

    return (
        <div className="lista-page">
            <div className="lista-card">
                <h1>🛒 Lista de compras</h1>
                <p className="lista-receta">{lista.receta}</p>

                <div className="items">
                    {lista.items.map((item, index) => (
                        <div
                            key={index}
                            className={`item ${tachados.includes(item) ? 'tachado' : ''}`}
                            onClick={() => toggleItem(item)}
                        >
                            <span className="checkbox">
                                {tachados.includes(item) ? '✅' : '⬜'}
                            </span>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>

                <button className="btn-whatsapp" onClick={compartirWhatsApp}>
                    📲 Compartir por WhatsApp
                </button>

                <button className="btn-volver" onClick={() => navigate(from === 'semanal' ? '/semanal' : '/')}>
                    ← Volver
                </button>
                <button className="btn-limpiar" onClick={limpiarLista}>
                    🗑️ Limpiar lista
                </button>
            </div>
        </div>
    )
}

export default Lista