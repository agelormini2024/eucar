
import Prueba2 from '@/components/clientes/Prueba2';
import PruebaTable from '@/components/clientes/PruebaTableWrapper'
import ButtonGoBack from '@/components/ui/ButtonGoBack'
import Headers from '@/components/ui/Headers'
import { prisma } from '@/src/lib/prisma'

async function getClientes() {
    const clientes = await prisma.cliente.findMany();
    return clientes; // Mantén las fechas como objetos Date
}

export default async function ListadoClientesPage() {
    const clientes = await getClientes();

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

            <div className='mt-10'>
                <PruebaTable data={clientes} />
            </div>
        </>
    );
}