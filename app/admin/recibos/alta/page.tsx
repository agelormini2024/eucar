import AddReciboForm from "@/components/recibos/AddReciboForm"
import ReciboForm from "@/components/recibos/ReciboForm"
import ButtonGoBack from "@/components/ui/ButtonGoBack"
import Headers from "@/components/ui/Headers"


export default function AltaReciboPage() {
        return (
            <>
                <div className='flex justify-between'>
    
                    <div>
                        <Headers>Nuevo Recibo</Headers>
                    </div>
                    <div>
                        <ButtonGoBack />
                    </div>
                </div>

                <div>
                    <AddReciboForm>
                        <ReciboForm />
                    </AddReciboForm>
                </div>
            </>
  )
}
