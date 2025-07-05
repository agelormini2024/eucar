import RecibosTable from "@/components/recibos/RecibosTable";
import Headers from "@/components/ui/Headers";
import { getRecibos } from "@/actions/list-recibos-action";

export default async function ListadoRecibosPage() {

    const data = await getRecibos();

    return (
        <>
            <div className='flex justify-between mt-10'>
                <div>
                    <Headers>Listado de Recibos</Headers>
                </div>
            </div>
            <div className='mt-10'>
                <RecibosTable data={data} />
            </div>
        </>
    )
}
