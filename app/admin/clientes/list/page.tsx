"use client"
import { getClientes } from '@/actions/list-clientes-action';
import ClientesTable from '@/components/clientes/ClientesTable'
import ButtonGoBack from '@/components/ui/ButtonGoBack'
import Headers from '@/components/ui/Headers'
import { ClientesConProvinciaPais } from '@/src/types';
import { useEffect, useState } from 'react';
import Loading from './loading';



export default function ListadoClientesPage() {
    const [clientes, setClientes] = useState<ClientesConProvinciaPais[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchClientes() {
            const data = await getClientes();
            setClientes(data);
            setIsLoading(false); // Cambiar el estado de carga a falso una vez que los datos se cargan
        }
        fetchClientes();
    }
        , []);

    return (
        <>
            <div className='flex justify-between mt-10'>
                <div>
                    <Headers>Listado de Clientes</Headers>
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
                    <ClientesTable data={clientes} />
                )}
            </div>
        </>
    );
}