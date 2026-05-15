import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Admin.css'

const API_URL = 'https://recipes-api-z0gz.onrender.com'

function Admin() {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    const [nombre, setNombre] = useState('')
    const [ingredientes, setIngredientes] = useState('')
    const [categoria, setCategoria] = useState('principal')
    const [imagen, setImagen] = useState('')
    const [instruccion, setInstruccion] = useState('')
    const [tags, setTags] = useState([])
    const [mensaje, setMensaje] = useState('')

    useEffect(() => {
        if (!token) navigate('/admin/login')
    }, [])

    function toggleTag(tag) {
        setTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        )
    }

    function handleGuardar() {
        const receta = {
            name: nombre,
            ingredients: ingredientes.split(',').map(i => i.trim()),
            category: categoria,
            image: imagen,
            instruction: instruccion,
            tags
        }

        fetch(`${API_URL}/api/recipes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': token
            },
            body: JSON.stringify(receta)
        })
        .then(res => res.json())
        .then(() => {
            setMensaje('✅ Receta guardada')
            setNombre('')
            setIngredientes('')
            setImagen('')
            setInstruccion('')
            setTags([])
        })
        .catch(() => setMensaje('❌ Error al guardar'))
    }

    function handleSalir() {
        localStorage.removeItem('token')
        navigate('/')
    }

    const TAGS = ['vegano', 'vegetariano', 'sinTacc', 'sinLactosa', 'rapida', 'postre', 'bajoEnCalorias', 'altoEnProteinas']

    return (
        <div className="admin">
            <div className="admin-card">
                <div className="admin-header">
                    <h1>🍳 Panel Admin</h1>
                    <button className="btn-salir" onClick={handleSalir}>Salir</button>
                </div>

                <input placeholder="Nombre de la receta" value={nombre} onChange={e => setNombre(e.target.value)} />
                <textarea placeholder="Ingredientes separados por coma. Ej: 500g de carne, 2 huevos" value={ingredientes} onChange={e => setIngredientes(e.target.value)} />
                
                <select value={categoria} onChange={e => setCategoria(e.target.value)}>
                    <option value="principal">Principal</option>
                    <option value="entrada">Entrada</option>
                    <option value="postre">Postre</option>
                    <option value="vegetariano">Vegetariano</option>
                    <option value="salsa">Salsa</option>
                </select>

                <input placeholder="URL de imagen" value={imagen} onChange={e => setImagen(e.target.value)} />
                <textarea placeholder="Instrucciones de preparación" value={instruccion} onChange={e => setInstruccion(e.target.value)} />

                <div className="tags">
                    {TAGS.map(tag => (
                        <button
                            key={tag}
                            className={`tag ${tags.includes(tag) ? 'activo' : ''}`}
                            onClick={() => toggleTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {mensaje && <p className="mensaje">{mensaje}</p>}
                <button className="btn-guardar" onClick={handleGuardar}>Guardar receta</button>
            </div>
        </div>
    )
}

export default Admin