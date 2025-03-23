import ButtonGoBack from '@/components/ui/ButtonGoBack'
import Headers from '@/components/ui/Headers'

export default function ListadoClientesPage() {
    return (
        <>
            <div className='flex justify-between'>

                <div>
                    <Headers>Listado de Clientes</Headers>
                </div>
                <div>
                    <ButtonGoBack />
                </div>
            </div>
        </>
    )
}
