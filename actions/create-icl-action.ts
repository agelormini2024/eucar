"use server"

import { IclFinal } from "@/src/schema"


export async function getIcl(data: unknown) {
    const result = IclFinal.safeParse(data)

    if (!result.success) {
        console.error("Falló la validación de Zod: ", result.error)
        return
    }
    try {

    } catch (error) {

    }

}