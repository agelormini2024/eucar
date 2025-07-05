import EditPropiedadForm from "@/components/propiedades/EditPropiedadForm"
import PropiedadForm from "@/components/propiedades/PropiedadForm"
import ButtonGoBack from "@/components/ui/ButtonGoBack"
import Headers from "@/components/ui/Headers"
import { prisma } from "@/src/lib/prisma"
import { notFound } from "next/navigation"


async function getPropiedadById(id: number) {
    const propiedad = await prisma.propiedad.findUnique({
        where: {
            id
        },
        include: {
            provincia: true,
            pais: true,
            tipoPropiedad: true,
            cliente: true
        }
    })
    if (!propiedad) {
        notFound()
    }

    return propiedad
}

export default async function EditPropiedadPage({ params }: { params: { id: string } }) {
    
    const { id } = await params; // Asegúrate de que params sea awaited si es necesario
    const propiedad = await getPropiedadById(+id)

    return (
        <>
            <div className='flex justify-between'>

                <div>
                    <Headers>Editar Propiedad: {propiedad.descripcion}</Headers>
                </div>
            </div>
            <div>
            <EditPropiedadForm>
                <PropiedadForm 
                    propiedad={propiedad}
                />
            </EditPropiedadForm>
            </div>
        </>
    )
}
