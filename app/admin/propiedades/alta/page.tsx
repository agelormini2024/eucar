import ButtonGoBack from '@/components/ui/ButtonGoBack'
import Headers from '@/components/ui/Headers'

export default function AltaPropiedadPage() {
    return (
        <>
            <div className='flex justify-between'>

                <div>
                    <Headers>Alta de Propiedades</Headers>
                </div>
                <div>
                    <ButtonGoBack />
                </div>
            </div>
        </>
    )
}
