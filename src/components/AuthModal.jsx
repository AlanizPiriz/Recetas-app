import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './AuthModal.css'

const API_URL = 'https://recipes-api-z0gz.onrender.com'

function AuthModal({ onClose }) {
    const [tab, setTab] = useState('login') // 'login' o 'register'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()

    async function handleSubmit() {
        setError('')
        setLoading(true)

        const endpoint = tab === 'login' 
            ? '/api/auth/user/login' 
            : '/api/auth/register'

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Algo salió mal')
                return
            }

            // 1. Iniciar sesión inmediatamente en el contexto global de React
            // Esto cambia el estado de 'user' y 'token' de forma instantánea
            login(data.user, data.token)

            // 2. Migrar favoritos del localStorage a la API en segundo plano
            const favsLocales = JSON.parse(localStorage.getItem('recetasFavoritas') || '[]')
            if (favsLocales.length > 0) {
                try {
                    await Promise.all(favsLocales.map(fav =>
                        fetch(`${API_URL}/api/users/${data.user.id}/favorites`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${data.token}`
                            },
                            body: JSON.stringify({ recipeId: fav._id })
                        })
                    ))
                    // Limpiar el almacenamiento local solo si las peticiones se completaron
                    localStorage.removeItem('recetasFavoritas')
                } catch (syncErr) {
                    console.error("Error sincronizando favoritos:", syncErr)
                }
            }

            // 3. Cerrar el modal una vez que la sesión ya cambió y arrancó la carga
            onClose()

        } catch (err) {
            setError('Error de conexión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>

                <button className="modal-close" onClick={onClose}>✕</button>

                <div className="modal-tabs">
                    <button 
                        className={tab === 'login' ? 'active' : ''}
                        onClick={() => setTab('login')}
                    >
                        Entrar
                    </button>
                    <button 
                        className={tab === 'register' ? 'active' : ''}
                        onClick={() => setTab('register')}
                    >
                        Registrarse
                    </button>
                </div>

                <div className="modal-body">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    {error && <p className="modal-error">{error}</p>}

                    <button 
                        className="modal-submit"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : tab === 'login' ? 'Entrar' : 'Crear cuenta'}
                    </button>
                </div>

            </div>
        </div>
    )
}

export default AuthModal
