import AddReciboForm from "@/components/recibos/AddReciboForm"
import ReciboForm from "@/components/recibos/ReciboForm"
import ButtonGoBack from "@/components/ui/ButtonGoBack"
import Headers from "@/components/ui/Headers"
import { buscarReciboMesActual } from "@/src/lib/buscarRecibo"

interface SegmentParams {
    id: string
}

export default async function AddReciboPage({ params }: { params: Promise<(SegmentParams)> }) {

    const { id } = await params // Asegurarse de que params sea awaited si es necesario
    const contrato = Number(id)
    const recibo = await buscarReciboMesActual(contrato)

    return (
        <>
            <div className="flex justify-between">
                <div>
                    <Headers>Recibos</Headers>
                </div>
            </div>
            <div>
                {recibo && (recibo.estadoReciboId === 2 || recibo.estadoReciboId === 3) ? (
                    <div>
                        <p>Ya existe un recibo generado de este contrato para este Mes.</p>
                        <ButtonGoBack />
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