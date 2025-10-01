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
    getIpc(inflacionMensual)
}

async function icl() {
    const anno = ANIO
    const urlIcl = `/api/indices/icl?fecha=${anno}-01-01`
    const { data }: { data: { datos: IclDiario } } = await axios.get(urlIcl)
    const { datos } = data
    getIcl(datos)
}

export default function IndicesForm() {
    const [procesando, setProcesando] = useState(false)
    
    // 🎯 Usar el mismo hook que MostrarIndices para compartir cache
    const { mutate: refreshTipoContrato } = useTipoContratoData()

    async function handleSubmit() {
        try {
            setProcesando(true)
            
            // 1. Ejecutar ambas operaciones y ESPERAR que terminen completamente
            await Promise.all([ipc(), icl()]);
            
            // 2. Esperar un poquito para asegurar que la DB se actualizó
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // 3. Refrescar usando la misma instancia de SWR que MostrarIndices
            await refreshTipoContrato();
            
        } catch (error) {
            console.error(error)
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