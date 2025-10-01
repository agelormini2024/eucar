"use client"
import useSWR from "swr"
import axios from "axios"
import { TipoContrato } from "@prisma/client"

const fetcher = (url: string) => axios.get(url).then(res => res.data)

// Hook compartido para que otros componentes puedan usar los mismos datos
export function useTipoContratoData() {
    return useSWR<TipoContrato[]>('/api/indices/tipoContrato', fetcher)
}

export default function MostrarIndices() {
    const { data: tipoContrato, error, isLoading } = useTipoContratoData()

    if (isLoading) return <div>Cargando...</div>
    if (error) return <div>Error al cargar los datos</div>

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full w-full divide-y divide-gray-900">
                <thead>
                    <tr className="text-lg">
                        <th>Tipo de Contrato</th>
                        <th>Actualizado</th>
                        <th>(ICL)</th>
                        <th>(IPC)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                    {tipoContrato && tipoContrato.map((tipo: TipoContrato) => (
                        <tr key={tipo.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-20 text-sm font-bold text-gray-900 sm:pl-0 uppercase">
                                {tipo.descripcion}
                            </td>
                            <td className="py-4 pl-4 pr-4">
                                {tipo.ultimaActualizacion
                                    ? new Date(tipo.ultimaActualizacion).toLocaleDateString()
                                    : ""}
                            </td>
                            <td className="py-4 pl-4 pr-4">{((Number(tipo.icl) - 1) * 100).toFixed(2)}</td>
                            <td className="py-4 pl-4 pr-4">{((Number(tipo.ipc) - 1) * 100).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}