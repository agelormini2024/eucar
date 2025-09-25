import DeleteReciboForm from "@/components/recibos/DeleteReciboForm"
import ReciboForm from "@/components/recibos/ReciboForm"
import ButtonGoBack from "@/components/ui/ButtonGoBack"
import Headers from "@/components/ui/Headers"
import { buscarReciboById } from "@/src/lib/buscarReciboById"

interface SegmentParams {
    id: string
}

export default async function EliminarReciboPage({ params }: { params: Promise<(SegmentParams)> }) {

    const { id } = await params // Asegurarse de que params sea awaited si es necesario
    const reciboId = Number(id)
    const recibo = await buscarReciboById(reciboId)

    return (
        <>
            <div className="flex justify-between">
                <div>
                    <Headers>Eliminar Recibo !!!</Headers>
                </div>
            </div>
            <div>
                {!recibo ? (
                    <div>
                        <p>No se encontró un recibo generado de este contrato para este Mes.</p>
                        <ButtonGoBack />
                    </div>
                ) : (
                    <DeleteReciboForm>
                        <ReciboForm
                            contrato={recibo.contratoId}
                            recibo={recibo}
                        />
                    </DeleteReciboForm>
                )}
            </div>

        </>
    )
}