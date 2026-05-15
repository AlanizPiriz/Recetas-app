import { useParams, Link, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import './Receta.css'






function Receta() {
    const { id } = useParams()
    const [receta, setReceta] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()
    const from = new URLSearchParams(location.search).get('from')


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

    return (
       <div className="recetaG">
    {receta && (
    <div className="receta">
        <img src={receta.image} alt={receta.name} />
        <div className="receta-contenido">
            <h1>Receta sugerida</h1>
            <h2>{receta.name}</h2>
            <h3>Ingredientes</h3>
            <ul>
                {receta.ingredients.map((ing, index) => (
                    <li key={index}>{ing}</li>
                ))}
            </ul>
            <h3>Preparación</h3>
            <p>{receta.instruction}</p>
            <button className="botonReceta" onClick={() => navigate(from === 'semanal' ? '/semanal' : '/')}>
                ← Volver
            </button>
            <button className="botonLista" onClick={irALista}>
                🛒 Descargar lista de compras
            </button>
        </div>
    </div>
    )}
</div>
    )
}

export default Receta