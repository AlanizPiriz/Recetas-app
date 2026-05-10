import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const API_URL = 'https://recipes-api-z0gz.onrender.com'

function Login() {
    const [usuario, setUsuario] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    function handleLogin() {
        fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password })
        })
        .then(res => res.json())
        .then(datos => {
            if (datos.token) {
                localStorage.setItem('token', datos.token)
                navigate('/admin')
            } else {
                setError('Usuario o contraseña incorrectos')
            }
        })
        .catch(() => setError('Error al conectar con el servidor'))
    }

    return (
        <div className="login">
            <div className="login-card">
                <h1>🔐 Admin</h1>
                <input
                    type="text"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={e => setUsuario(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                {error && <p className="error">{error}</p>}
                <button onClick={handleLogin}>Entrar</button>
            </div>
        </div>
    )
}

export default Login