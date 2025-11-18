import EditReciboForm from "@/components/recibos/EditReciboForm"
import ReciboForm from "@/components/recibos/ReciboForm"
import Headers from "@/components/ui/Headers"
import InfoAlert from "@/components/ui/InfoAlert"
import { buscarReciboById } from "@/src/lib/buscarReciboById"
import { verificaIpcActual } from "@/src/lib/verificaIpcActual"
import { prisma } from "@/src/lib/prisma"

interface SegmentParams {
    id: string
}

export default async function EditReciboPage({ params }: { params: Promise<(SegmentParams)> }) {

    const { id } = await params // Asegurarse de que params sea awaited si es necesario
    const reciboId = Number(id)
    const recibo = await buscarReciboById(reciboId ? reciboId : 0)

    // Mapeo de estados para mensajes más claros
    const estadosMap: Record<number, string> = {
        2: 'GENERADO',
        3: 'PAGADO',
        4: 'IMPRESO',
        5: 'ANULADO'
    }

    // Verificar si el recibo PENDIENTE ya puede regenerarse (índices disponibles)
    let puedeRegenerar = false
    let tipoIndice = ""
    
    if (recibo && recibo.estadoReciboId === 1) {
        // Es un recibo PENDIENTE, verificar si ya están los índices disponibles
        const contratoInfo = await prisma.contrato.findUnique({
            where: { id: recibo.contratoId },
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
                puedeRegenerar = await verificaIpcActual(fechaPendiente)
            }
        }
    }

    return (
        <>
            <div className="flex justify-between">
                <div>
                    <Headers>Editar Recibo</Headers>
                </div>
            </div>
            <div>
                {!recibo ? (
                    <InfoAlert
                        variant="error"
                        title="Recibo no encontrado"
                        message="No se encontró el recibo solicitado o no existe en el sistema."
                        subMessage="Verifique que el ID del recibo sea correcto o que el recibo no haya sido eliminado."
                    />
                ) : recibo.estadoReciboId !== 1 ? (
                    <InfoAlert
                        variant="warning"
                        title="Recibo no editable"
                        message={`Este recibo está en estado ${estadosMap[recibo.estadoReciboId] || 'DESCONOCIDO'} y no puede ser editado.`}
                        subMessage="Solo los recibos en estado PENDIENTE pueden ser modificados. Los recibos generados, pagados, impresos o anulados no son editables para mantener la integridad de los registros."
                    />
                ) : puedeRegenerar ? (
                    <InfoAlert
                        variant="info"
                        title="Recibo listo para regenerar"
                        message={`Los índices ${tipoIndice} necesarios ya están disponibles en el sistema.`}
                        subMessage="Para actualizar el monto del alquiler con el valor correcto y realizar cambios, por favor dirígete a la sección de 'Regenerar Recibo' donde podrás modificar los ítems durante el proceso de regeneración."
                    />
                ) : (
                    <EditReciboForm>
                        <ReciboForm
                            contrato={recibo.contratoId}
                            recibo={recibo}
                        />
                    </EditReciboForm>
                )}
            </div>

        </>
    )
}