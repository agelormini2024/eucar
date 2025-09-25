"use server"
import { prisma } from "@/src/lib/prisma"
import { ReciboSchema } from "@/src/schema"


/**
 * Actualiza un Recibo existente en el sistema
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
        // 6. Ejecutar transacción atómica
        const resultado = await prisma.$transaction(async (tx) => {
            // 2. Verificar que el registro existe
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

            // 3. Validaciones de negocio para actualización
            // Ejemplo: verificar que no se duplique con otros registros

            // 4. Preparar datos para actualización (excluir campos de relación e items)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { contratoId: _contratoId, items, ...reciboData } = result.data;
            
            const updateData = {
                ...reciboData,
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

            // 5. Actualizar el recibo (sin contratoId ni items)
            const reciboActualizado = await tx.recibo.update({
                where: { id: id },
                data: updateData
            });

            // 6. Eliminar ítems existentes y crear los nuevos
            await tx.itemRecibo.deleteMany({
                where: { reciboId: id } // Corregir: usar reciboId en lugar de id
            });

            // 7. Crear nuevos ítems
            if (items && items.length > 0) {
                await tx.itemRecibo.createMany({
                    data: items.map(item => ({
                        reciboId: id,
                        descripcion: item.descripcion,
                        monto: item.monto
                    }))
                });

            }

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