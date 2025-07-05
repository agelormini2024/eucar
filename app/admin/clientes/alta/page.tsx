import AddClienteForm from '@/components/clientes/AddClienteForm'
import ClienteForm from '@/components/clientes/ClienteForm'
import Headers from '@/components/ui/Headers'

export default function AltaClientePage() {
    return (
        <>
            <div className='flex justify-between'>

                <div>
                    <Headers>Alta de Cliente</Headers>
                </div>
            </div>
            <div>
                <AddClienteForm>
                    <ClienteForm />
                </AddClienteForm>
            </div>
        </>
    )
}
