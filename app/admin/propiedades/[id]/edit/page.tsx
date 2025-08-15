import EditPropiedadForm from "@/components/propiedades/EditPropiedadForm"
import PropiedadForm from "@/components/propiedades/PropiedadForm"
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
interface SegmentParams {
    id: string
}

export default async function EditPropiedadPage({ params }: { params: Promise<(SegmentParams)> }) {
    
    const { id } = await params
    const propiedad = await getPropiedadById(+id)

    return (
        <>
            <div className='flex justify-between'>

                <div>
                    <Headers>Editarndo la Propiedad: {propiedad.descripcion}</Headers>
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
