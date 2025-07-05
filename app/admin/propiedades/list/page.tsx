import { getPropiedades } from '@/actions/list-propiedades-action';
import PropiedadesTable from '@/components/propiedades/PropiedadesTable';
import Headers from '@/components/ui/Headers'

export default async function ListadoPropiedadsPage() {

    const data = await getPropiedades();

    return (
        <>
            <div className='flex justify-between mt-10'>
                <div>
                    <Headers>Listado de Propiedades</Headers>
                </div>
            </div>
            <div className='mt-10'>

                <PropiedadesTable data={data} />

            </div>

        </>
    )
}
