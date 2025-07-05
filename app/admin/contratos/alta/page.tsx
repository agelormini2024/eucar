import AddContratoForm from '@/components/contratos/AddContratoForm'
import ContratoForm from '@/components/contratos/ContratoForm'
import Headers from '@/components/ui/Headers'

export default function AltaAlquilerPage() {
    return (
        <>
            <div className='flex justify-between'>

                <div>
                    <Headers>Nuevo Contrato</Headers>
                </div>
            </div>
            <div>
                <AddContratoForm>
                    <ContratoForm />
                </AddContratoForm>
            </div>
        </>
    )
}
