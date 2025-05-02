import ClienteForm from "@/components/clientes/ClienteForm";
import EditClienteForm from "@/components/clientes/EditClienteForm";
import ButtonGoBack from "@/components/ui/ButtonGoBack";
import Headers from "@/components/ui/Headers";
import { prisma } from "@/src/lib/prisma"
import { notFound } from "next/navigation";

// This is a server component
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

export default async function EditClientePage({ params }: { params: { id: string } }) {

    const { id } = await params // Asegúrate de que params sea awaited si es necesario

    const cliente = await getClienteById(+id)

    return (
        <>
            <div className='flex justify-between'>
                <div>
                    <Headers>Editar Cliente: {cliente.apellido + ' ' + cliente.nombre}</Headers>
                </div>
                <div>
                    <ButtonGoBack />
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