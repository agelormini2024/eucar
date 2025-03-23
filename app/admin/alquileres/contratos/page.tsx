import ButtonGoBack from '@/components/ui/ButtonGoBack'
import Headers from '@/components/ui/Headers'
import Heading from '@/components/ui/Heading'

export default function ContratosAlquileresPage() {
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

            <div>
                <Heading />
            </div>
        </>
    )
}
