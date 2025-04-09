import PropiedadesTable from '@/components/propiedades/PropiedadesTable';
import ButtonGoBack from '@/components/ui/ButtonGoBack'
import Headers from '@/components/ui/Headers'
import { prisma } from '@/src/lib/prisma'

async function getPropiedades() {
    const propiedades = await prisma.propiedad.findMany({
        orderBy: {
            cliente: {
                nombre: 'asc', 
            },
        },
        include: {
            provincia: true,
            pais: true,
            tipoPropiedad: true,
            cliente: {
                select: {
                    id: true,
                    nombre: true,
                    apellido: true,
                },
            },
        },
    })
    return propiedades;
}

export default async function ListadoPropiedadsPage() {
    const propiedades = await getPropiedades();

    return (
        <>
            <div className='flex justify-between mt-10'>
                <div>
                    <Headers>Listado de Propiedades</Headers>
                </div>
                <div>
                    <ButtonGoBack />
                </div>
            </div>
            <div className='mt-10'>
                <PropiedadesTable data={propiedades} />
            </div>

        </>
    )
}
