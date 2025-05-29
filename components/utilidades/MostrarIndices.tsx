
import { prisma } from "@/src/lib/prisma"

    const tipoContrato = await prisma.tipoContrato.findMany({
        orderBy: { cantidadMesesActualizacion: 'asc' }})




export default function MostrarIndices() {


    return (
        <div>
            { tipoContrato.map((tipo) => (
                <div key={tipo.id} className="p-4 border-b">
                    <h2 className="text-lg font-semibold">{tipo.descripcion}</h2>
                    <p>Icl: {tipo.icl}</p>
                    <p>Ipc: {tipo.ipc}</p>
                    
                </div>
            ))}
        </div>
    )
}
