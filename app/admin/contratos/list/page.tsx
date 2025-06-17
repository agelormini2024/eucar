"use client";
import { getContratos } from '@/actions/list-contratos-action';
import ContratosTable from '@/components/contratos/ContratosTable';
import ButtonGoBack from '@/components/ui/ButtonGoBack'
import Headers from '@/components/ui/Headers'
import { consultaContratos } from '@/src/types';
import { Prisma } from '@prisma/client';
import { useEffect, useState } from 'react';
import Loading from './loading';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

type ContratoConRelaciones = Prisma.ContratoGetPayload<typeof consultaContratos>;

export default function ContratosAlquilerPage() {
    const [contratos, setContratos] = useState<ContratoConRelaciones[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams()
    const router = useRouter();

    useEffect(() => {
        if (searchParams.get("toast") === "success") {
            toast.success("Recibo Generado correctamente")
            // Limpiar el parámetro "toast" de la URL
            const params = new URLSearchParams(window.location.search);
            console.log('Params....',params)
            params.delete("toast");
            router.replace(`?${params.toString()}`);
        }
    }, [searchParams])

    useEffect(() => {
        async function fetchContratos() {
            const data = await getContratos()
            setContratos(data);
            setIsLoading(false); // Cambiar el estado de carga a falso una vez que los datos se cargan
            //            console.log(data)
        }
        fetchContratos()
    }, []);

    return (
        <>
            <div className='flex justify-between'>

                <div>
                    <Headers>Contratos</Headers>
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
                    <ContratosTable data={contratos} />
                )}
            </div>
        </>
    )
}

