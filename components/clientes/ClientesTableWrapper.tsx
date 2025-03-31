"use client"
import dynamic from 'next/dynamic';

// Cargar ClientesTable dinámicamente con SSR deshabilitado
const ClientesTable = dynamic(() => import('./ClientesTable'), { ssr: false });

export default ClientesTable;