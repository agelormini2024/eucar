"use client";
import { Prisma } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { getContratos } from '@/actions/list-contratos-action';
import ContratosTable from '@/components/contratos/ContratosTable';
import Headers from '@/components/ui/Headers'
import { consultaContratos } from '@/src/types';

type ContratoConRelaciones = Prisma.ContratoGetPayload<typeof consultaContratos>;

export default function ContratosAlquilerPage() {
    const [contratos, setContratos] = useState<ContratoConRelaciones[]>([]);
    const searchParams = useSearchParams()
    const router = useRouter();

    useEffect(() => {
        if (searchParams.get("toast") === "success") {
            toast.success("Recibo Generado correctamente")
            // Limpiar el parámetro "toast" de la URL
            const params = new URLSearchParams(window.location.search);
            params.delete("toast");
            router.replace(`?${params.toString()}`);
        }
    }, [searchParams, router])

    useEffect(() => {
        async function fetchContratos() {
            const data = await getContratos()
            setContratos(data);
        }
        fetchContratos()
    }, []);

    return (
        <>
            <div className='flex justify-between'>

                <div>
                    <Headers>Contratos</Headers>
                </div>
            </div>

            <div className='mt-10'>
                <ContratosTable data={contratos} />
            </div>
        </>
    )
}

