import ViewReciboForm from "@/components/recibos/ViewReciboForm"
import ReciboForm from "@/components/recibos/ReciboForm"
import ButtonGoBack from "@/components/ui/ButtonGoBack"
import Headers from "@/components/ui/Headers"
import { buscarReciboById } from "@/src/lib/buscarReciboById"

interface SegmentParams {
    id: string
}

export default async function ViewReciboPage({ params }: { params: Promise<SegmentParams> }) {
    const { id } = await params
    const reciboId = Number(id)
    const recibo = await buscarReciboById(reciboId || 0)

    return (
        <>
            <div className="flex justify-between items-center">
                <Headers>Ver Recibo - Solo Lectura</Headers>
                {recibo && (
                    <div className="flex gap-2">
                        {/* Badge con estado del recibo */}
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                            recibo.estadoReciboId === 1 ? 'bg-yellow-100 text-yellow-800' :
                            recibo.estadoReciboId === 2 ? 'bg-green-100 text-green-800' :
                            recibo.estadoReciboId === 3 ? 'bg-blue-100 text-blue-800' :
                            recibo.estadoReciboId === 4 ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            Estado: {recibo.estadoRecibo?.descripcion || 'N/A'}
                        </span>
                    </div>
                )}
            </div>
            
            <div>
                {!recibo ? (
                    <div className="bg-white shadow-xl mt-10 px-5 py-10 rounded-md max-w-5xl mx-auto">
                        <p className="text-center text-lg text-red-600 mb-4">No se encontró el recibo.</p>
                        <div className="flex justify-center">
                            <ButtonGoBack />
                        </div>
                    </div>
                ) : (
                    <ViewReciboForm>
                        <ReciboForm
                            contrato={recibo.contratoId}
                            recibo={recibo}
                            readOnly={true}
                        />
                    </ViewReciboForm>
                )}
            </div>
        </>
    )
}
