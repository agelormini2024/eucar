"use server"
import { buscarReciboMesActual } from "@/src/lib/buscarRecibo"
import { prisma } from "@/src/lib/prisma"
import { ReciboSchema } from "@/src/schema"
import { esItemAlquiler, CODIGO_ALQUILER } from "@/src/utils/itemHelpers"

// Tipos para mejor type safety
type TransactionClient = Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">
type ReciboData = {
    contratoId: number;
    estadoReciboId: number;
    fechaPendiente: Date;
    fechaGenerado: Date | string | null;
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
type ItemData = { 
    descripcion: string
    monto: number
    tipoItemId?: number
}
type NuevoValorMeses = { decrement: number } | number

/**
 * Obtiene el ID del TipoItem de ALQUILER desde la BD
 * Se cachea en memoria durante la ejecución del servidor
 */
let cachedTipoAlquilerId: number | null = null
async function getTipoAlquilerId(): Promise<number> {
    if (cachedTipoAlquilerId !== null) {
        return cachedTipoAlquilerId
    }
    
    const tipoAlquiler = await prisma.tipoItem.findUnique({
        where: { codigo: CODIGO_ALQUILER },
        select: { id: true }
    })
    
    if (!tipoAlquiler) {
        throw new Error(`TipoItem con código ${CODIGO_ALQUILER} no encontrado en la base de datos`)
    }
    
    cachedTipoAlquilerId = tipoAlquiler.id
    return cachedTipoAlquilerId
}

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

        // Obtener el ID del tipo ALQUILER
        const tipoAlquilerId = await getTipoAlquilerId();

        // Asegurar que SIEMPRE exista el ítem "Alquiler" con el monto correcto
        let itemsFinales = [...items];
        const itemAlquiler = items.find(item => esItemAlquiler(item));
        
        if (!itemAlquiler) {
            // Si no existe, crear el ítem "Alquiler" con el montoTotal
            itemsFinales = [
                { descripcion: "Alquiler", monto: rest.montoTotal, tipoItemId: tipoAlquilerId } as ItemData,
                ...items
            ];
        } else {
            // VALIDACIÓN: Si existe, verificar que coincida con montoTotal
            // Usamos tolerancia de 0.01 para evitar problemas con decimales
            if (Math.abs(itemAlquiler.monto - rest.montoTotal) > 0.01) {
                return {
                    success: false,
                    errors: [{
                        path: ['items'],
                        message: `El monto del alquiler ($${itemAlquiler.monto}) no coincide con el monto calculado ($${rest.montoTotal}). Por favor, recargue el formulario.`
                    }]
                };
            }
        }

        // Calcular montos (puede incluir ítems negativos para descuentos/reintegros)
        const montoPagado = itemsFinales.reduce((sum, item) => sum + item.monto, 0);

        // VALIDACIÓN: Verificar que montoPagado sea razonable (mayor a cero)
        // El montoPagado nunca debería ser 0 porque siempre hay un ítem "Alquiler"
        // con el monto calculado (o montoAnterior si no hay índice)
        if (montoPagado < 0) {
            return {
                success: false,
                errors: [{
                    path: ['items'],
                    message: "El monto total a pagar debe ser mayor o igual a cero. Verifique los descuentos aplicados."
                }]
            };
        }

        const reciboData: ReciboData = {
            ...rest,
            montoTotal: rest.montoTotal, // Mantener el calculado
            montoPagado, // Suma de ítems (puede ser diferente a montoTotal por extras/descuentos)
            fechaPendiente: new Date(fechaPendiente),
            fechaGenerado: null, // Inicializar como null, se establecerá después según el estado
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
            // Establecer fechaGenerado según el estado del recibo
            if (reciboData.estadoReciboId === 2) {
                // Si es GENERADO, establecer fecha de generación
                reciboData.fechaGenerado = new Date().toISOString();
            } else {
                // Si es PENDIENTE u otro estado, asegurar que fechaGenerado sea null
                reciboData.fechaGenerado = null;
            }

            if (!existeRecibo) {
                // Caso: No existe recibo para este mes
                await crearNuevoRecibo(tx, reciboData, itemsFinales, nuevoValorMeses, tipoAlquilerId);
                return { success: true };

            } else if (existeRecibo.estadoReciboId === 1) {
                // Caso: Existe recibo "PENDIENTE" - se está regenerando con nuevo índice
                await actualizarReciboPendiente(tx, existeRecibo.id, reciboData, itemsFinales, nuevoValorMeses, tipoAlquilerId);
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
        // Log detallado del error para debugging
        if (error instanceof Error) {
            console.error("Error message:", error.message)
            console.error("Error stack:", error.stack)
        }
        return {
            success: false,
            errors: [{
                path: ['general'],
                message: `Error interno del servidor: ${error instanceof Error ? error.message : 'Error desconocido'}`
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
    nuevoValorMeses: NuevoValorMeses,
    tipoAlquilerId: number
) {
    try {
        // Solo actualizar contrato si el recibo está GENERADO (no PENDIENTE)
        if (reciboData.estadoReciboId === 2) {
            await tx.contrato.update({
                where: { id: reciboData.contratoId },
                data: {
                    montoAlquilerUltimo: reciboData.montoTotal,
                    mesesRestaActualizar: nuevoValorMeses,
                    cantidadMesesDuracion: { decrement: 1 }
                }
            });
        }

        // Crear el recibo
        const nuevoRecibo = await tx.recibo.create({ data: reciboData });

        // Crear los ítems del recibo - asegurar que todos tengan tipoItemId
        await tx.itemRecibo.createMany({
            data: items.map(item => ({
                reciboId: nuevoRecibo.id,
                descripcion: item.descripcion,
                monto: item.monto,
                tipoItemId: item.tipoItemId || tipoAlquilerId // Fallback a ALQUILER si no se especifica
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
    nuevoValorMeses: NuevoValorMeses,
    tipoAlquilerId: number
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
                monto: item.monto,
                tipoItemId: item.tipoItemId || tipoAlquilerId // Fallback a ALQUILER si no se especifica
            }))
        });

        // Solo actualizar contrato si el recibo pasó a estado GENERADO
        // Si sigue PENDIENTE, no actualizar el contrato
        if (reciboData.estadoReciboId === 2) {
            await tx.contrato.update({
                where: { id: reciboData.contratoId },
                data: {
                    montoAlquilerUltimo: reciboData.montoTotal,
                    mesesRestaActualizar: nuevoValorMeses,
                    cantidadMesesDuracion: { decrement: 1 }
                }
            });
        }

        return {
            success: true,
            data: reciboActualizado
        };

    } catch (error) {
        throw new Error(`Error al actualizar recibo pendiente: ${error}`);
    }
}