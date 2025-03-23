import ButtonGoBack from '@/components/ui/ButtonGoBack'
import Headers from '@/components/ui/Headers'

export default function AltaClientePage() {
    return (
        <>
            <div className='flex justify-between'>

                <div>
                    <Headers>Alta de Cliente</Headers>
                </div>
                <div>
                    <ButtonGoBack />
                </div>
            </div>
        </>
    )
}
