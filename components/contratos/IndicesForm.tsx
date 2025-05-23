import { getIcl } from "@/actions/create-icl-action"
import { getIpc } from "@/actions/create-ipc-action"
import { IclDiario, IpcMensual } from "@/src/types"
import axios from "axios"

async function handleSubmit() {
    ipc()
    icl()
}

async function ipc() {
    const urlIpc = '/api/indices/ipc'
    const { data }: { data: { inflacionMensual: IpcMensual } } = await axios(urlIpc)
    const { inflacionMensual } = data
    // console.log(data)
    getIpc(inflacionMensual)
}

async function icl() {
    const anno = "2025"
    const urlIcl = `/api/indices/icl?fecha=${anno}-05-01`
    // const {datos}: { datos: { data: IclDiario }} = await axios.get(urlIcl)
    const { data }: { data: { datos: IclDiario } } = await axios.get(urlIcl)
    // console.log(data)
    const {datos} = data
    getIcl(datos)
}

export default function IndicesForm() {
    return (
        <div className="flex justify-center shadow-2xl p-20 mt-20">
            <form
                className="bg-white space-y-2"
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit()
                }}
            >
                <input type="submit"
                    id="fetchIndices"
                    className="bg-red-800 hover:bg-red-600 py-2 px-10 rounded-md text-white font-bold text-lg"
                    value="Refrescar Indices"
                />


            </form>
        </div>
    )
}
