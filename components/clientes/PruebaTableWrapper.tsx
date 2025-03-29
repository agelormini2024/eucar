"use client"
import dynamic from 'next/dynamic';

// Cargar PruebaTable dinámicamente con SSR deshabilitado
const PruebaTable = dynamic(() => import('./PruebaTable'), { ssr: false });
//const Prueba2 = dynamic(() => import('./PruebaTable'), { ssr: false });

export default PruebaTable;