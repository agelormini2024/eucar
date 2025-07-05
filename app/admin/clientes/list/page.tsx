import { getClientes } from '@/actions/list-clientes-action';
import ClientesTable from '@/components/clientes/ClientesTable'
import Headers from '@/components/ui/Headers'

export default async function ListadoClientesPage() {

    const data = await getClientes();

    return (
        <>
            <div className='flex justify-between mt-10'>
                <div>
                    <Headers>Listado de Clientes</Headers>
                </div>
            </div>

            <div className='mt-10'>
                {/* <ClientesTable data={clientes} /> */}
                <ClientesTable data={data} />
            </div>
        </>
    );
}