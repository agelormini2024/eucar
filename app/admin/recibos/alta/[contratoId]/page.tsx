import AddReciboForm from "@/components/recibos/AddReciboForm"
import ReciboForm from "@/components/recibos/ReciboForm"
import ButtonGoBack from "@/components/ui/ButtonGoBack"
import Headers from "@/components/ui/Headers"
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
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto mt-8">
                        <p className="text-gray-700 text-lg">Ya existe un recibo generado de este contrato para este Mes.</p>
                        <ButtonGoBack />
                    </div>
                ) : recibo && recibo.estadoReciboId === 1 && !indicesDisponibles ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto mt-8">
                        <div className="flex items-start">
                            <svg className="h-6 w-6 text-blue-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Índices no disponibles
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    Este recibo está en estado PENDIENTE porque aún no están cargados los índices {tipoIndice} necesarios 
                                    para calcular el monto actualizado del alquiler.
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Una vez que los índices estén disponibles en el sistema, podrá regenerar este recibo 
                                    para actualizar el monto con el valor correcto.
                                </p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <ButtonGoBack />
                        </div>
                    </div>
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
