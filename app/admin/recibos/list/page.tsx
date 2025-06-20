"use client"
import RecibosTable from "@/components/recibos/RecibosTable";
import Loading from "./loading";
import ButtonGoBack from "@/components/ui/ButtonGoBack";
import Headers from "@/components/ui/Headers";
import { useEffect, useState } from "react";
import { getRecibos } from "@/actions/list-recibos-action";
import { RecibosConRelaciones } from "@/src/types";

export default function ListadoRecibosPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [recibos, setRecibos] = useState<RecibosConRelaciones[]>([])
    
    useEffect(() => {
        async function fetchRecibos() {
            const data = await getRecibos();
            // Mapear para asegurar que piso y departamento sean string, no null
            const mappedData = data.map(recibo => ({
                ...recibo,
                contrato: {
                    ...recibo.contrato,
                    propiedad: {
                        ...recibo.contrato.propiedad,
                        piso: recibo.contrato.propiedad.piso ?? "",
                        departamento: recibo.contrato.propiedad.departamento ?? "",
                    }
                }
            }));
            setRecibos(mappedData);
            setIsLoading(false); // Cambiar el estado de carga a falso una vez que los datos se cargan
        }
        fetchRecibos();
    }, []);

    return (
        <>
            <div className='flex justify-between mt-10'>
                <div>
                    <Headers>Listado de Recibos</Headers>
                </div>
                <div>
                    <ButtonGoBack />
                </div>
            </div>
            <div className='mt-10'>
                {isLoading ? (
                    <div className="text-center text-3xl font-bold">
                        <Loading />
                        {/* Puedes Incluir en el componente Loading un spinner si lo prefieres */}
                    </div>
                ) : (
                    <RecibosTable data={recibos} />
                )}
            </div>

        </>
    )
}
