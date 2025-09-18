"use server"
import { buscarReciboMesActual } from "@/src/lib/buscarRecibo"
import { prisma } from "@/src/lib/prisma"
import { ReciboSchema } from "@/src/schema"

// Tipos para mejor type safety
type TransactionClient = Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
type ReciboData = {
    contratoId: number;
    estadoReciboId: number;
    fechaPendiente: Date;
    fechaGenerado?: string | null;
    fechaImpreso: Date | null;
    fechaAnulado: Date | null;
    montoTotal: number;
    montoPagado: number;
    montoAnterior: number;
    observaciones?: string | null;
    expensas: boolean;
    abl: boolean;
    aysa: boolean;
    luz: boolean;
    gas: boolean;
    otros: boolean;
}
type ItemData = { descripcion: string; monto: number }
type NuevoValorMeses = { decrement: number } | number

/**
 * Crea o actualiza un recibo en el sistema
 * Maneja la lógica compleja de:
 * 1. Validación de datos y verificación de recibos existentes
 * 2. Cálculos de montos y actualización de contratos
 * 3. Creación/actualización de recibos e ítems
 * 4. Transacciones atómicas para consistencia de datos
 * @param data - Datos del recibo a crear/actualizar
 * @returns Objeto con success/error y datos/errores correspondientes
 */
export async function createRecibo(data: unknown) {
    try {
        // 1. Validar los datos con el esquema de recibo de Zod
        const result = ReciboSchema.safeParse(data)

        if (!result.success) {
            return {
                success: false,
                errors: result.error.issues
            }
        }

        // 2. Extraer y procesar datos
        const { fechaPendiente, items, ...rest } = result.data;

        // Calcular montos
        const montoTotal = rest.montoTotal; // Monto que debería pagar
        const montoPagado = items.reduce((sum, item) => sum + item.monto, 0); // Suma de ítems

        const reciboData = {
            ...rest,
            montoTotal,
            montoPagado,
            fechaPendiente: new Date(fechaPendiente),
            fechaImpreso: null,
            fechaAnulado: null
        };

        // 3. Verificar recibo existente del mes actual
        const existeRecibo = await buscarReciboMesActual(reciboData.contratoId);

        // 4. Obtener información del contrato para cálculos
        const contratoInfo = await prisma.contrato.findUnique({
            where: { id: reciboData.contratoId },
            select: {
                mesesRestaActualizar: true,
                cantidadMesesDuracion: true,
                tipoContrato: {
                    select: {
                        cantidadMesesActualizacion: true,
                    }
                }
            }
        })

        if (!contratoInfo) {
            return {
                success: false,
                errors: [{ 
                    path: ['contratoId'], 
                    message: "El contrato especificado no existe" 
                }]
            };
        }

        // 5. Calcular nuevo valor de meses
        const mesesActual = contratoInfo.mesesRestaActualizar;
        const mesesReset = contratoInfo.tipoContrato.cantidadMesesActualizacion;

        const nuevoValorMeses = (typeof mesesActual === "number" && mesesActual > 0) 
            ? { decrement: 1 } 
            : mesesReset;

        // 6. Ejecutar transacción atómica
        const resultado = await prisma.$transaction(async (tx) => {
            // Configurar estado y fecha del recibo
            reciboData.estadoReciboId = 2; // "GENERADO"
            reciboData.fechaGenerado = new Date().toISOString();

            if (!existeRecibo) {
                // Caso: No existe recibo para este mes
                await crearNuevoRecibo(tx, reciboData, items, nuevoValorMeses);
                return { success: true };
                
            } else if (existeRecibo.estadoReciboId === 1) {
                // Caso: Existe recibo "PENDIENTE"
                if (reciboData.montoTotal === 0) {
                    return {
                        errors: [{ 
                            message: "Todavía no están los Indices necesarios para generar el recibo." 
                        }, { 
                            success: false 
                        }]
                    };
                }
                await actualizarReciboPendiente(tx, existeRecibo.id, reciboData, items, nuevoValorMeses);
                return { success: true };
                
            } else if (existeRecibo.estadoReciboId === 2) {
                // Caso: Ya existe recibo "GENERADO"
                return {
                    errors: [{ 
                        message: "Ya existe un recibo generado para este contrato." 
                    }, { 
                        success: false 
                    }]
                };
            }

            // Caso no contemplado
            return {
                success: false,
                errors: [{ 
                    path: ['estadoRecibo'], 
                    message: "Estado de recibo no válido" 
                }]
            };
        });

        return resultado;

    } catch (error) {
        console.error("Error al crear/actualizar recibo:", error)
        return {
            success: false,
            errors: [{ 
                path: ['general'], 
                message: "Error interno del servidor. Intente nuevamente." 
            }]
        }
    }
}

/**
 * Crea un nuevo recibo y actualiza el contrato si es necesario
 */
async function crearNuevoRecibo(
    tx: TransactionClient, 
    reciboData: ReciboData, 
    items: ItemData[], 
    nuevoValorMeses: NuevoValorMeses
) {
    try {
        // Si el monto total es 0, mantener como "PENDIENTE"
        if (reciboData.montoTotal === 0) {
            reciboData.estadoReciboId = 1; // "PENDIENTE"
        } else {
            // Actualizar contrato solo si hay monto
            await tx.contrato.update({
                where: { id: reciboData.contratoId },
                data: {
                    montoAlquilerUltimo: reciboData.montoPagado,
                    mesesRestaActualizar: nuevoValorMeses,
                    cantidadMesesDuracion: { decrement: 1 }
                }
            });
        }
        
        // Crear el recibo
        const nuevoRecibo = await tx.recibo.create({ data: reciboData });
        
        // Crear los ítems del recibo
        await tx.itemRecibo.createMany({
            data: items.map(item => ({
                reciboId: nuevoRecibo.id,
                descripcion: item.descripcion,
                monto: item.monto
            }))
        });
        
        return { 
            success: true, 
            data: nuevoRecibo 
        };
        
    } catch (error) {
        throw new Error(`Error al crear nuevo recibo: ${error}`);
    }
}

/**
 * Actualiza un recibo pendiente y el contrato asociado
 */
async function actualizarReciboPendiente(
    tx: TransactionClient, 
    reciboId: number, 
    reciboData: ReciboData, 
    items: ItemData[], 
    nuevoValorMeses: NuevoValorMeses
) {
    try {
        // Actualizar el recibo
        const reciboActualizado = await tx.recibo.update({
            where: { id: reciboId },
            data: reciboData
        });

        // Eliminar ítems existentes y crear los nuevos
        await tx.itemRecibo.deleteMany({
            where: { reciboId }
        });

        await tx.itemRecibo.createMany({
            data: items.map(item => ({
                reciboId,
                descripcion: item.descripcion,
                monto: item.monto
            }))
        });

        // Actualizar contrato
        await tx.contrato.update({
            where: { id: reciboData.contratoId },
            data: {
                montoAlquilerUltimo: reciboData.montoPagado,
                mesesRestaActualizar: nuevoValorMeses,
                cantidadMesesDuracion: { decrement: 1 }
            }
        });
        
        return { 
            success: true, 
            data: reciboActualizado 
        };
        
    } catch (error) {
        throw new Error(`Error al actualizar recibo pendiente: ${error}`);
    }
}