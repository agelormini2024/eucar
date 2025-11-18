"use server"
import { prisma } from "@/src/lib/prisma"
import { ReciboSchema } from "@/src/schema"
import { 
    getTipoAlquilerId,
    filtrarItemsSinAlquiler,
    asegurarItemAlquiler,
    calcularMontoPagado,
    validarMontoPagado,
    procesarItemsParaRecibo
} from "@/src/utils/reciboHelpers"


/**
 * Actualiza un Recibo existente en el sistema
 * 
 * REGLAS DE EDICIÓN:
 * - Solo se pueden editar recibos en estado PENDIENTE (estadoReciboId = 1)
 * - No se puede modificar el item "Alquiler" (se genera automáticamente)
 * - Se pueden agregar/editar/eliminar items EXTRA y REINTEGRO
 * - El montoPagado se recalcula automáticamente
 * - No se modifica el contrato (eso solo ocurre en creación/generación)
 * 
 * @param id - ID del Recibo a actualizar
 * @param data - Datos actualizados del Recibo
 * @returns Objeto con success/error y datos/errores correspondientes
 */
export async function updateRecibo(id: number, data: unknown) {
    try {
        // 1. Validar los datos
        const result = ReciboSchema.safeParse(data)        

        if (!result.success) {
            return {
                success: false,
                errors: result.error.issues
            }
        }

        // 2. Extraer datos validados
        const { items, ...rest } = result.data;

        // 3. Obtener el ID del tipo ALQUILER
        const tipoAlquilerId = await getTipoAlquilerId();

        // 4. Filtrar items del usuario (sin el Alquiler, que se genera automáticamente)
        const itemsSinAlquiler = filtrarItemsSinAlquiler(items);

        // 5. Asegurar que existe el item "Alquiler" con el monto correcto
        const resultadoItems = await asegurarItemAlquiler(itemsSinAlquiler, rest.montoTotal, tipoAlquilerId);
        const itemsFinales = resultadoItems.items;

        // 6. Calcular montoPagado automáticamente
        const montoPagado = calcularMontoPagado(itemsFinales);

        // 7. Validar que el monto sea razonable
        const validacionMonto = validarMontoPagado(montoPagado);
        if (!validacionMonto.success) {
            return {
                success: false,
                errors: [{
                    path: ['items'],
                    message: validacionMonto.error!
                }]
            };
        }

        // 8. Ejecutar transacción atómica
        const resultado = await prisma.$transaction(async (tx) => {
            // Verificar que el registro existe
            const existingRecibo = await tx.recibo.findUnique({
                where: { id }
            });
            
            if (!existingRecibo) {
                return {
                    success: false,
                    errors: [{
                        path: ['id'],
                        message: "El Recibo no existe"
                    }]
                };
            }

            // VALIDACIÓN CRÍTICA: Solo permitir editar recibos PENDIENTES
            if (existingRecibo.estadoReciboId !== 1) {
                return {
                    success: false,
                    errors: [{
                        path: ['estadoReciboId'],
                        message: "Solo se pueden editar recibos en estado 'Pendiente'"
                    }]
                };
            }

            // Preparar datos para actualización (excluir contratoId e items)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { contratoId: _contratoId, items: _items, ...reciboData } = result.data;
            
            const updateData = {
                ...reciboData,
                montoPagado, // Usar el calculado automáticamente
                fechaPendiente: new Date(result.data.fechaPendiente),
                fechaGenerado: result.data.fechaGenerado && result.data.fechaGenerado.trim() !== '' 
                    ? new Date(result.data.fechaGenerado) 
                    : null,
                fechaImpreso: result.data.fechaImpreso && result.data.fechaImpreso.trim() !== '' 
                    ? new Date(result.data.fechaImpreso) 
                    : null,
                fechaAnulado: result.data.fechaAnulado && result.data.fechaAnulado.trim() !== '' 
                    ? new Date(result.data.fechaAnulado) 
                    : null,
            };

            // Actualizar el recibo (sin tocar el contrato)
            const reciboActualizado = await tx.recibo.update({
                where: { id },
                data: updateData
            });

            // Eliminar ítems existentes
            await tx.itemRecibo.deleteMany({
                where: { reciboId: id }
            });

            // Crear nuevos ítems con tipoItemId asignado automáticamente
            const itemsParaInsertar = await procesarItemsParaRecibo(itemsFinales, id, tipoAlquilerId);

            await tx.itemRecibo.createMany({
                data: itemsParaInsertar
            });

            return {
                success: true,
                data: reciboActualizado
            }
        });

        return resultado;
    } catch (error) {
        console.error("Error al actualizar Recibo:", error)
        return {
            success: false,
            errors: [{
                path: ['general'],
                message: "Error interno del servidor. Intente nuevamente."
            }]
        }
    }
}