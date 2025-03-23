import ButtonGoBack from '@/components/ui/ButtonGoBack'
import Headers from '@/components/ui/Headers'

export default function ListadoPropiedadsPage() {
    return (
        <>
            <div className='flex justify-between'>

                <div>
                    <Headers>Listado de Propiedades</Headers>
                </div>
                <div>
                    <ButtonGoBack />
                </div>
            </div>
        </>
    )
}
