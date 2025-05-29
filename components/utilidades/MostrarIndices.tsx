import { prisma } from "@/src/lib/prisma"

const tipoContrato = await prisma.tipoContrato.findMany({
    orderBy: { cantidadMesesActualizacion: 'asc' }
})

export default function MostrarIndices() {

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full w-full divide-y divide-gray-900"
                >
                    <thead>
                        <tr className="text-lg"
                        >
                            <th>Tipo de Contrato</th>
                            <th>(ICL)</th>
                            <th>(IPC)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                        {tipoContrato.map((tipo) => (
                            <tr 
                                key={tipo.id}
                            >
                                <td className="whitespace-nowrap py-4 pl-4 pr-20 text-sm font-bold text-gray-900 sm:pl-0 uppercase"
                                >{tipo.descripcion}</td>
                                <td className="py-4 pl-4 pr-4">{((Number(tipo.icl) - 1) * 100).toFixed(2)}</td>
                                <td className="py-4 pl-4 pr-4">{((Number(tipo.ipc) - 1) * 100).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
