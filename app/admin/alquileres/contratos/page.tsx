import ButtonGoBack from '@/components/ui/ButtonGoBack'
import Headers from '@/components/ui/Headers'

export default function ContratosAlquilerPage() {
    return (
        <>
            <div className='flex justify-between'>

                <div>
                    <Headers>Contratos</Headers>
                </div>
                <div>
                    <ButtonGoBack />
                </div>
            </div>
        </>
    )
}
