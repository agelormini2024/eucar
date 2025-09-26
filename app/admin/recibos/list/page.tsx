import RecibosTable from "@/components/recibos/RecibosTable";
import Headers from "@/components/ui/Headers";
import RecibosFiltro from "@/components/recibos/RecibosFiltro";
import { getRecibos } from "@/actions/list-recibos-action";

type SearchParams = {
    mes?: string;
    año?: string;
}

export default async function ListadoRecibosPage({ 
    searchParams 
}: { 
    searchParams: Promise<SearchParams> 
}) {
    const params = await searchParams;
    
    // Obtener mes y año actual como default
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1; // getMonth() devuelve 0-11
    const añoActual = fechaActual.getFullYear();
    
    // Usar parámetros de URL o valores por defecto (mes actual)
    const mes = params.mes ? parseInt(params.mes) : mesActual;
    const año = params.año ? parseInt(params.año) : añoActual;
    
    // Obtener datos filtrados
    const data = await getRecibos(mes, año);

    return (
        <>
            <div className='flex justify-between'>
                <div>
                    <Headers>Listado de Recibos</Headers>
                </div>
            </div>
            
            {/* Componente de filtro */}
            <div className='mt-6'>
                <RecibosFiltro 
                    mesActual={mes}
                    añoActual={año}
                />
            </div>
            
            <div className='mt-4'>
                <RecibosTable data={data} />
            </div>
        </>
    )
}
