import ClienteForm from "@/components/clientes/ClienteForm";
import EditClienteForm from "@/components/clientes/EditClienteForm";
import Headers from "@/components/ui/Headers";
import { prisma } from "@/src/lib/prisma"
import { notFound } from "next/navigation";

// Server component
async function getClienteById(id: number) {
    const cliente = await prisma.cliente.findUnique({
        where: {
            id
        },
        include: {
            provincia: true,
            pais: true
        }
    })
    if (!cliente) {
        notFound()
    }

    return cliente
}

interface SegmentParams {
    id: string
}

export default async function EditClientePage({ params }: { params: Promise<(SegmentParams)> }) {

    const { id } = await params

    const cliente = await getClienteById(+id)

    return (
        <>
            <div className='flex justify-between'>
                <div>
                    <Headers>Editar Cliente: {cliente.apellido + ' ' + cliente.nombre}</Headers>
                </div>
            </div>
            <div>
                <EditClienteForm>
                    <ClienteForm
                        cliente={cliente}
                    />
                </EditClienteForm>
            </div>
        </>
    )
}