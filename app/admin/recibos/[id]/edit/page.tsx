import EditReciboForm from "@/components/recibos/EditReciboForm"
import ReciboForm from "@/components/recibos/ReciboForm"
import ButtonGoBack from "@/components/ui/ButtonGoBack"
import Headers from "@/components/ui/Headers"
import { buscarReciboById } from "@/src/lib/buscarReciboById"

interface SegmentParams {
    id: string
}

export default async function EditReciboPage({ params }: { params: Promise<(SegmentParams)> }) {

    const { id } = await params // Asegurarse de que params sea awaited si es necesario
    const reciboId = Number(id)
    const recibo = await buscarReciboById(reciboId ? reciboId : 0)

    return (
        <>
            <div className="flex justify-between">
                <div>
                    <Headers>Editar Recibo</Headers>
                </div>
            </div>
            <div>
                {!recibo ? (
                    <div>
                        <p>No se encontró un recibo de este contrato para el mes actual que se pueda editar.</p>
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