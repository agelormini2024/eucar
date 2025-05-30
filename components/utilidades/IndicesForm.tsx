"use client"
import { getIcl } from "@/actions/create-icl-action"
import { getIpc } from "@/actions/create-ipc-action"
import { IclDiario, IpcMensual } from "@/src/types"
import axios from "axios"
import { useState } from "react"
import Loading from "../ui/Loading"
import { useIndicesStore } from "@/src/stores/storeIndices"

const ANIO = "2024"

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

export default function IndicesForm({ children }: { children: React.ReactNode }) {
    const [procesando, setProcesando] = useState(false)
    const refresh = useIndicesStore(state => state.refresh)

    async function handleSubmit() {
        try {
            await ipc()
            await icl()
            refresh() // <-- refresca la tabla automáticamente
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
                    className="flex flex-col bg-white space-y-2 "
                    onSubmit={async (e) => {
                        e.preventDefault()
                        setProcesando(true)
                        await handleSubmit()
                    }}
                >
                   {!procesando ?
                        children :
                        <Loading />
                    }
                    
                    <input type="submit"
                        id="fetchIndices"
                        className="bg-red-800 hover:bg-red-600 mt-2 py-2 px-10 rounded-md text-white font-bold text-lg"
                        value="Refrescar Indices"
                    />
                </form>
            </div>
        </>
    )
}