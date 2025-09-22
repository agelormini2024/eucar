import EditReciboForm from "@/components/recibos/EditReciboForm"
import ReciboForm from "@/components/recibos/ReciboForm"
import ButtonGoBack from "@/components/ui/ButtonGoBack"
import Headers from "@/components/ui/Headers"
import { buscarReciboMesActual } from "@/src/lib/buscarRecibo"

interface SegmentParams {
    id: string
}

export default async function EditReciboPage({ params }: { params: Promise<(SegmentParams)> }) {

    const { id } = await params // Asegurarse de que params sea awaited si es necesario
    const reciboId = Number(id)
    const recibo = await buscarReciboMesActual(reciboId ? reciboId : 0)

    return (
        <>
            <div className="flex justify-between">
                <div>
                    <Headers>Recibos</Headers>
                </div>
            </div>
            <div>
                {!recibo ? (
                    <div>
                        <p>No se encontró un recibo generado de este contrato para este Mes.</p>
                        <ButtonGoBack />
                    </div>
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