"use server"
import { prisma } from "@/src/lib/prisma"
import { restarUnMes } from "../utils"

export async function verificaIpcActual(fecha: string) {

    console.log('fecha:   ' + fecha)
    const fechaAnterior = restarUnMes(fecha)
    const mesAnterior = fechaAnterior.substring(0, 7) + '-01'
    console.log(mesAnterior)
   
    const result = await prisma.ipc.findUnique({
        where: { annoMes: mesAnterior } // Reemplazar el parámetro fecha por el que corresponda 
    })

    return result ? true : false;
}