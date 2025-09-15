"use server"
import { prisma } from "@/src/lib/prisma"
import { IclFinal } from "@/src/schema"
import { formatFechaIpc } from "@/src/utils"

// Almacenar en una constante la fecha actual para usarla en el cálculo del ICL acumulado

export async function getIcl(data: unknown) {
    const result = IclFinal.safeParse(data)

    if (!result.success) {
        console.error("Falló la validación de Zod: ", result.error)
        return
    }
    try {

        for (const reg of result.data) {

            await prisma.icl.upsert({
                where: { fecha: new Date(reg.fecha) },
                update: { indice: reg.indice },
                create: { fecha: new Date(reg.fecha), indice: reg.indice }
            })
        }

        const cntTiposContrato = await prisma.tipoContrato.findMany({
            select: {
                id: true,
                cantidadMesesActualizacion: true
            }
        })

        const FECHA_ACTUAL = new Date()

        for (const tipo of cntTiposContrato) {
            const meses = tipo.cantidadMesesActualizacion
            const nuevaFecha = new Date(FECHA_ACTUAL)
            nuevaFecha.setMonth(nuevaFecha.getMonth() - meses)
            const fechaFinal = `${formatFechaIpc(FECHA_ACTUAL)}-01`
            const fechaInicial = `${formatFechaIpc(nuevaFecha)}-01`

            const indicesIniFin = await prisma.icl.findMany({
                select: {
                    indice: true,
                    fecha: true
                },
                where: {
                    fecha: {
                        in: [new Date(fechaInicial), new Date(fechaFinal)]
                    }
                },
                orderBy: {
                    fecha: 'asc'
                }
            })

            const iclInicial = indicesIniFin.length > 0 ? indicesIniFin[0].indice : null
            const iclFinal = indicesIniFin.length > 1 ? indicesIniFin[1].indice : null

            // Calculo del Indice para guardarlo en el campo icl de tipoContrato
            
            if (iclInicial && iclFinal) {
                const iclAGuardar = (iclFinal / iclInicial)
                await prisma.tipoContrato.update({
                    where: { id: tipo.id },
                    data: { icl: iclAGuardar,
                            ultimaActualizacion: new Date()
                     }
                })
            }

            console.log(`Inicial: ${fechaInicial} - ${iclInicial}  Final: ${fechaFinal} - ${iclFinal}`)

        }
        //---------------------------------------------------------------------------------------

    } catch (error) {
        console.error(error)
    }

}