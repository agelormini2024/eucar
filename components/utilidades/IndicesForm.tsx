"use client"
import { getIcl } from "@/actions/create-icl-action"
import { getIpc } from "@/actions/create-ipc-action"
import { IclDiario, IpcMensual } from "@/src/types"
import axios from "axios"

const ANIO = "2024"

async function handleSubmit() {
    ipc()
    icl()
}

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
//className='flex flex-col gap-4'

export default function IndicesForm({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex flex-col justify-center shadow-2xl p-20 mt-20">
                <form
                    className="bg-white space-y-2"
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                >
                    {children}
                    
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
