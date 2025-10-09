"use client"
import { getIcl } from "@/actions/create-icl-action"
import { getIpc } from "@/actions/create-ipc-action"
import { IclDiario, IpcMensual } from "@/src/types/indices"
import axios from "axios"
import { useState } from "react"
import Loading from "../ui/Loading"
import MostrarIndices, { useTipoContratoData } from "./MostrarIndices"

const ANIO = new Date().getFullYear().toString();

async function ipc() {
    const urlIpc = '/api/indices/ipc'
    const { data }: { data: { inflacionMensual: IpcMensual } } = await axios.get(urlIpc)
    const { inflacionMensual } = data
    await getIpc(inflacionMensual)
}

async function icl() {
    const anno = ANIO
    const urlIcl = `/api/indices/icl?fecha=${anno}-01-01`
    const { data }: { data: { datos: IclDiario } } = await axios.get(urlIcl)
    const { datos } = data
    await getIcl(datos)  // ✅ TAMBIÉN asegurar que ICL espere
}

export default function IndicesForm() {
    const [procesando, setProcesando] = useState(false)
    
    // 🎯 Usar el mismo hook que MostrarIndices para compartir cache
    const { mutate: refreshTipoContrato } = useTipoContratoData()

    async function handleSubmit() {
        try {
            setProcesando(true)
            
            // 1. Ejecutar ambas operaciones y ESPERAR que terminen completamente
            const [ipcResult, iclResult] = await Promise.allSettled([ipc(), icl()]);
            
            // Verificar si hubo errores
            if (ipcResult.status === 'rejected') {
                console.error('Error en IPC:', ipcResult.reason);
                alert('Error al actualizar IPC: ' + (ipcResult.reason?.message || 'Error desconocido'));
                return;
            }
            
            if (iclResult.status === 'rejected') {
                console.error('Error en ICL:', iclResult.reason);
                alert('Error al actualizar ICL: ' + (iclResult.reason?.message || 'Error desconocido'));
                return;
            }
            
            // 2. Esperar un momento para asegurar que la DB se actualizó
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // 3. Forzar revalidación completa del cache SWR
            await refreshTipoContrato();
            
            console.log('✅ Índices actualizados correctamente');
            
        } catch (error) {
            console.error('❌ Error general:', error)
            alert('Error al actualizar índices: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        } finally {
            setProcesando(false)
        }
    }

    return (
        <>
            <div className="flex flex-col justify-center shadow-2xl p-10 mt-20">
                <form
                    className="flex flex-col bg-white space-y-2"
                    onSubmit={async (e) => {
                        e.preventDefault()
                        await handleSubmit()
                    }}
                >
                   {!procesando ? (
                        <MostrarIndices />
                    ) : (
                        <Loading />
                    )}
                    
                    <input 
                        type="submit"
                        id="fetchIndices"
                        className="bg-red-800 hover:bg-red-600 mt-2 py-2 px-10 rounded-md text-white font-bold text-lg"
                        value="Refrescar Indices"
                        disabled={procesando}
                    />
                </form>
            </div>
        </>
    )
}