"use server"
import { prisma } from "@/src/lib/prisma"
import { IpcFinal } from "@/src/schema"

/**
 * Procesa datos de IPC y actualiza los índices de tipos de contrato
 * 1. Valida y almacena datos de inflación mensual
 * 2. Calcula IPC acumulado para cada tipo de contrato
 * 3. Actualiza los valores IPC en tipos de contrato
 * @param inflacionMensual - Array de datos de inflación mensual a procesar
 * @returns Objeto con success/error y información del procesamiento
 */
export async function getIpc(inflacionMensual: unknown) {
    try {
        // Validar los datos con el esquema de IPC de Zod
        const result = IpcFinal.safeParse(inflacionMensual)

        if (!result.success) {
            return {
                success: false,
                errors: result.error.issues
            }
        }

        let registrosActualizados = 0;
        let tiposContratoActualizados = 0;

        // 1. Procesar y almacenar datos de IPC
        // Usar "for of" porque .map no espera a que se resuelvan las promesas
        for (const item of result.data) {
            await prisma.ipc.upsert({
                where: { annoMes: item.fecha },
                update: { porcentaje: item.inflacion },
                create: { annoMes: item.fecha, porcentaje: item.inflacion }
            })
            registrosActualizados++;
        }
        
        // 2. Obtener tipos de contrato para calcular IPC acumulado
        const tiposContrato = await prisma.tipoContrato.findMany({
            select: {
                id: true,
                cantidadMesesActualizacion: true
            }
        })

        // 3. Calcular y actualizar IPC acumulado para cada tipo de contrato
        for (const tipo of tiposContrato) {
            // Obtener los últimos N meses de IPC según el tipo de contrato
            const ipcAcumulado = await prisma.ipc.findMany({
                orderBy: { annoMes: 'desc' },
                take: tipo.cantidadMesesActualizacion,
                select: {
                    annoMes: true,
                    porcentaje: true
                }
            })

            // Si hay datos suficientes, calcular el IPC total y actualizar
            if (ipcAcumulado.length === tipo.cantidadMesesActualizacion) {
                // Calcular IPC acumulado: (1 + %/100) multiplicado por cada mes
                const ipcTotal = ipcAcumulado.reduce((acc, item) => acc * (item.porcentaje / 100 + 1), 1)
                
                await prisma.tipoContrato.update({
                    where: { id: tipo.id },
                    data: { 
                        ipc: ipcTotal,
                        ultimaActualizacion: new Date()
                    }
                })
                
                tiposContratoActualizados++;
                console.log(`Tipo Contrato ${tipo.id}: IPC actualizado (${tipo.cantidadMesesActualizacion} meses) = ${ipcTotal.toFixed(4)}`)
            } else {
                console.warn(`Tipo Contrato ${tipo.id}: Datos insuficientes para calcular IPC. Requeridos: ${tipo.cantidadMesesActualizacion}, Disponibles: ${ipcAcumulado.length}`)
            }
        }

        return {
            success: true,
            data: {
                registrosIpcProcesados: registrosActualizados,
                tiposContratoActualizados: tiposContratoActualizados,
                totalTiposContrato: tiposContrato.length
            }
        }

    } catch (error) {
        console.error("Error al procesar datos de IPC:", error)
        return {
            success: false,
            errors: [{ 
                path: ['general'], 
                message: "Error interno al procesar los datos de IPC. Intente nuevamente." 
            }]
        }
    }
}