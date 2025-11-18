import AddReciboForm from "@/components/recibos/AddReciboForm"
import ReciboForm from "@/components/recibos/ReciboForm"
import Headers from "@/components/ui/Headers"
import InfoAlert from "@/components/ui/InfoAlert"
import { buscarReciboMesActual } from "@/src/lib/buscarRecibo"
import { verificaIpcActual } from "@/src/lib/verificaIpcActual"
import { prisma } from "@/src/lib/prisma"

interface SegmentParams {
    contratoId: string
}

export default async function AddReciboPage({ params }: { params: Promise<SegmentParams> }) {

    const { contratoId } = await params
    const contrato = Number(contratoId)
    const recibo = await buscarReciboMesActual(contrato)

    // Verificar si están los índices necesarios cuando hay un recibo PENDIENTE
    let indicesDisponibles = true
    let tipoIndice = ""
    
    if (recibo && recibo.estadoReciboId === 1) {
        // Es un recibo PENDIENTE, verificar si ya están los índices
        const contratoInfo = await prisma.contrato.findUnique({
            where: { id: contrato },
            select: {
                mesesRestaActualizar: true,
                tipoIndice: {
                    select: {
                        nombre: true
                    }
                }
            }
        })
        
        if (contratoInfo) {
            tipoIndice = contratoInfo.tipoIndice.nombre
            
            // Solo verificar IPC si es necesario (cuando mesesRestaActualizar === 0)
            if (contratoInfo.mesesRestaActualizar === 0 && tipoIndice === 'IPC') {
                const fechaPendiente = recibo.fechaPendiente.toISOString().split('T')[0]
                indicesDisponibles = await verificaIpcActual(fechaPendiente)
            }
        }
    }

    return (
        <>
            <div className="flex justify-between">
                <div>
                    <Headers>Recibos - {recibo ? 'Regenerar' : 'Nuevo'}</Headers>
                </div>
            </div>
            <div>
                {recibo && (recibo.estadoReciboId === 2 || recibo.estadoReciboId === 3 || recibo.estadoReciboId === 4) ? (
                    <InfoAlert
                        variant="warning"
                        title="Recibo ya generado"
                        message="Ya existe un recibo generado de este contrato para este Mes."
                    />
                ) : recibo && recibo.estadoReciboId === 1 && !indicesDisponibles ? (
                    <InfoAlert
                        variant="info"
                        title="Índices no disponibles"
                        message={`Este recibo está en estado PENDIENTE porque aún no están cargados los índices ${tipoIndice} necesarios para calcular el monto actualizado del alquiler.`}
                        subMessage="Una vez que los índices estén disponibles en el sistema, podrá regenerar este recibo para actualizar el monto con el valor correcto."
                    />
                ) : (
                    <AddReciboForm>
                        <ReciboForm
                            contrato={contrato}
                            recibo={recibo}
                        />
                    </AddReciboForm>
                )}
            </div>

        </>
    )
}
