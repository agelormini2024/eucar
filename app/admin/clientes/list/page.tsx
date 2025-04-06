
import ClientesTable from '@/components/clientes/ClientesTable'
import ButtonGoBack from '@/components/ui/ButtonGoBack'
import Headers from '@/components/ui/Headers'
import { prisma } from '@/src/lib/prisma'

async function getClientes() {
    const clientes = await prisma.cliente.findMany({
        orderBy: {
            apellido: 'asc',
        },
        include: {
            provincia: true,
            pais: true,
        },
    })
    return clientes; 
}

export type ClientesConProvinciaPais = Awaited<ReturnType<typeof getClientes>>

export default async function ListadoClientesPage() {
    const clientes = await getClientes();

    return (
        <>
            <div className='flex justify-between mt-10'>
                <div>
                    <Headers>Listado de Clientes</Headers>
                </div>

                <div>
                    <ButtonGoBack />
                </div>
            </div>

            <div className='mt-10'>
                <ClientesTable data={clientes} />
            </div>
        </>
    );
}