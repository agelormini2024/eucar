"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

type RecibosFiltroProps = {
    mesActual: number
    añoActual: number
}

export default function RecibosFiltro({ mesActual, añoActual }: RecibosFiltroProps) {
    const router = useRouter()
    const [mes, setMes] = useState(mesActual)
    const [año, setAño] = useState(añoActual)

    // Generar array de años (últimos 5 años y próximos 2)
    const añoActualCompleto = new Date().getFullYear()
    const años = Array.from({ length: 8 }, (_, i) => añoActualCompleto - 5 + i)

    // Meses del año
    const meses = [
        { valor: 1, nombre: "Enero" },
        { valor: 2, nombre: "Febrero" },
        { valor: 3, nombre: "Marzo" },
        { valor: 4, nombre: "Abril" },
        { valor: 5, nombre: "Mayo" },
        { valor: 6, nombre: "Junio" },
        { valor: 7, nombre: "Julio" },
        { valor: 8, nombre: "Agosto" },
        { valor: 9, nombre: "Septiembre" },
        { valor: 10, nombre: "Octubre" },
        { valor: 11, nombre: "Noviembre" },
        { valor: 12, nombre: "Diciembre" }
    ]

    const handleFiltrar = () => {
        // Navegar con los parámetros de búsqueda
        const searchParams = new URLSearchParams()
        searchParams.set('mes', mes.toString())
        searchParams.set('año', año.toString())
        
        router.push(`/admin/recibos/list?${searchParams.toString()}`)
    }

    const handleLimpiar = () => {
        // Navegar sin parámetros (mostrar todos)
        router.push('/admin/recibos/list')
    }

    return (
        <div className="m-4">
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-xl font-bold text-gray-700 mb-3">
                Filtrar Recibos
            </h3>
            
            <div className="flex gap-4 items-end">
                {/* Selector de Mes */}
                <div className="flex-1">
                    <label htmlFor="mes" className="block text-sm font-medium text-gray-700 mb-1">
                        Mes
                    </label>
                    <select
                        id="mes"
                        value={mes}
                        onChange={(e) => setMes(Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold"
                    >
                        {meses.map(mesItem => (
                            <option key={mesItem.valor} value={mesItem.valor}>
                                {mesItem.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selector de Año */}
                <div className="flex-1">
                    <label htmlFor="año" className="block text-sm font-medium text-gray-700 mb-1">
                        Año
                    </label>
                    <select
                        id="año"
                        value={año}
                        onChange={(e) => setAño(Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold"
                    >
                        {años.map(añoItem => (
                            <option key={añoItem} value={añoItem}>
                                {añoItem}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botones */}
                <div className="flex gap-2">
                    <button
                        onClick={handleFiltrar}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-bold"
                    >
                        Filtrar
                    </button>
                    <button
                        onClick={handleLimpiar}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors font-bold"
                    >
                        Ver Todos
                    </button>
                </div>
            </div>

            {/* Información actual */}
            <div className="mt-3 text-sm text-gray-600">
                Mostrando recibos de: <span className="font-semibold">
                    {meses.find(m => m.valor === mes)?.nombre} {año}
                </span>
            </div>
        </div>
        </div>
    )
}