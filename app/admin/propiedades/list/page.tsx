import { getPropiedades } from '@/actions/list-propiedades-action';
import PropiedadesTable from '@/components/propiedades/PropiedadesTable';
import Headers from '@/components/ui/Headers'

export default async function ListadoPropiedadsPage() {

    const data = await getPropiedades();

    return (
        <>
            <Headers>Listado de Propiedades</Headers>

            <PropiedadesTable data={data} />
        </>
    )
}
