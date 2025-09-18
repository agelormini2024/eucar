"use server"
import { prisma } from "@/src/lib/prisma"
import { IclFinal } from "@/src/schema"
import { formatFechaIpc } from "@/src/utils"

/**
 * Procesa datos de ICL y actualiza los índices de tipos de contrato
 * 1. Valida y almacena datos de ICL
 * 2. Calcula índices acumulados para cada tipo de contrato
 * 3. Actualiza los valores ICL en tipos de contrato
 * @param data - Array de datos ICL a procesar
 * @returns Objeto con success/error y información del procesamiento
 */
export async function getIcl(data: unknown) {
    try {
        // Validar los datos con el esquema de ICL de Zod
        const result = IclFinal.safeParse(data)

        if (!result.success) {
            return {
                success: false,
                errors: result.error.issues
            }
        }

        let registrosActualizados = 0;
        let tiposContratoActualizados = 0;

        // 1. Procesar y almacenar datos de ICL
        for (const reg of result.data) {
            await prisma.icl.upsert({
                where: { fecha: new Date(reg.fecha) },
                update: { indice: reg.indice },
                create: { fecha: new Date(reg.fecha), indice: reg.indice }
            })
            registrosActualizados++;
        }

        // 2. Obtener tipos de contrato para calcular índices
        const tiposContrato = await prisma.tipoContrato.findMany({
            select: {
                id: true,
                cantidadMesesActualizacion: true
            }
        })

        const fechaActual = new Date()

        // 3. Calcular y actualizar ICL para cada tipo de contrato
        for (const tipo of tiposContrato) {
            const meses = tipo.cantidadMesesActualizacion
            const fechaInicial = new Date(fechaActual)
            fechaInicial.setMonth(fechaInicial.getMonth() - meses)
            
            const fechaFinalStr = `${formatFechaIpc(fechaActual)}-01`
            const fechaInicialStr = `${formatFechaIpc(fechaInicial)}-01`

            // Buscar índices inicial y final
            const indicesIniFin = await prisma.icl.findMany({
                select: {
                    indice: true,
                    fecha: true
                },
                where: {
                    fecha: {
                        in: [new Date(fechaInicialStr), new Date(fechaFinalStr)]
                    }
                },
                orderBy: {
                    fecha: 'asc'
                }
            })

            const iclInicial = indicesIniFin.length > 0 ? indicesIniFin[0].indice : null
            const iclFinal = indicesIniFin.length > 1 ? indicesIniFin[1].indice : null

            // Calcular y guardar el índice ICL
            if (iclInicial && iclFinal) {
                const iclCalculado = (iclFinal / iclInicial)
                
                await prisma.tipoContrato.update({
                    where: { id: tipo.id },
                    data: { 
                        icl: iclCalculado,
                        ultimaActualizacion: new Date()
                    }
                })
                
                tiposContratoActualizados++;
                console.log(`Tipo Contrato ${tipo.id}: ICL actualizado. Inicial: ${fechaInicialStr}(${iclInicial}) - Final: ${fechaFinalStr}(${iclFinal}) = ${iclCalculado}`)
            } else {
                console.warn(`Tipo Contrato ${tipo.id}: No se pudo calcular ICL. Datos faltantes.`)
            }
        }

        return {
            success: true,
            data: {
                registrosIclProcesados: registrosActualizados,
                tiposContratoActualizados: tiposContratoActualizados,
                totalTiposContrato: tiposContrato.length
            }
        }

    } catch (error) {
        console.error("Error al procesar datos de ICL:", error)
        return {
            success: false,
            errors: [{ 
                path: ['general'], 
                message: "Error interno al procesar los datos de ICL. Intente nuevamente." 
            }]
        }
    }
}