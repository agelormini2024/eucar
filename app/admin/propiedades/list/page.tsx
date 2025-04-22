"use client"
import { getPropiedades } from '@/actions/list-propiedades-action';
import PropiedadesTable from '@/components/propiedades/PropiedadesTable';
import ButtonGoBack from '@/components/ui/ButtonGoBack'
import Headers from '@/components/ui/Headers'
import { PropiedadesConRelaciones } from '@/src/types';

import { useEffect, useState } from 'react';

export default function ListadoPropiedadsPage() {
    const [propiedades, setPropiedades] = useState<PropiedadesConRelaciones[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        async function fetchPropiedades() {
            const data = await getPropiedades();
            setPropiedades(data);
            setIsLoading(false); // Cambiar el estado de carga a falso una vez que los datos se cargan
        }
        fetchPropiedades();
    }, []);

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
            {isLoading ? (
                    <div className="text-center">
                        <p className="text-2xl font-bold">Cargando...</p>
                        {/* Puedes reemplazar esto con un spinner si lo prefieres */}
                    </div>
                ) : (
                    <PropiedadesTable data={propiedades} />
                )}
            </div>

        </>
    )
}
