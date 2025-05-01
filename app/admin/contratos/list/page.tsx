"use client";
import { getContratos } from '@/actions/list-contratos-action';
import ContratosTable from '@/components/contratos/ContratosTable';
import ButtonGoBack from '@/components/ui/ButtonGoBack'
import Headers from '@/components/ui/Headers'
import { consultaContratos } from '@/src/types';
import { Prisma } from '@prisma/client';
import { useEffect, useState } from 'react';

type ContratoConRelaciones = Prisma.ContratoGetPayload<typeof consultaContratos>;

export default function ContratosAlquilerPage() {
    const [contratos, setContratos] = useState<ContratoConRelaciones []>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchContratos() {
            const data = await getContratos()
            setContratos(data);
            setIsLoading(false); // Cambiar el estado de carga a falso una vez que los datos se cargan
            //            console.log(data)
        }
        fetchContratos();
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
                    <div className='text-center'>
                        <p className='text-2xl font-bold'>Cargando...</p>
                    </div>

                ) : (
                    <ContratosTable data={contratos} />
                )}
            </div>
        </>
    )
}

