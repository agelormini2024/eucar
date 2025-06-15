import AddReciboForm from "@/components/recibos/AddReciboForm"
import ReciboForm from "@/components/recibos/ReciboForm"
import ButtonGoBack from "@/components/ui/ButtonGoBack"

export default async function AddReciboPage({ params }: { params: { id: string } }) {

    const { id } = await params // Asegúrate de que params sea awaited si es necesario

    const contrato = Number(id)

    return (
        <>
            <div className="flex justify-between">
                <div>
                    <ButtonGoBack />
                </div>
            </div>
            <div>
                <AddReciboForm>
                    <ReciboForm
                        contrato={contrato}
                    />
                </AddReciboForm>
            </div>

        </>
    )
}