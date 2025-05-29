"use client"
import { getIcl } from "@/actions/create-icl-action"
import { getIpc } from "@/actions/create-ipc-action"
import { IclDiario, IpcMensual } from "@/src/types"
import axios from "axios"
import { useState } from "react"
import Loading from "../ui/Loading"

const ANIO = "2024"

// TODO: Actualizar la última fecha de proceso en la tabla tipoContrato
//      y pasar la lógica de actualización a un hook personalizado

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

    async function handleSubmit() {

        try {
            await ipc()
            await icl()
        } catch (error) {
            // Puedes manejar el error aquí si quieres
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
                    <div className="text-lg mb-6">
                        <p>Ultima Fecha de actualización: <span className="font-bold text-xl">{new Date().toISOString().slice(0, 10)}</span> </p>
                    </div>
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
