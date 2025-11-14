"use server"
import { prisma } from "@/src/lib/prisma"
import { ReciboSchema } from "@/src/schema"

export async function deleteRecibo(id: number, data: unknown) {

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

            // 3. Validaciones de negocio para la eliminación
            if (existingRecibo.estadoReciboId === 3 || existingRecibo.estadoReciboId === 4) { //  3 es "Pagado" y 4 es "Impreso"
                return {
                    success: false,
                    errors: [{
                        path: ['estadoReciboId'],
                        message: "No se puede eliminar un recibo en estado 'Pagado' o 'Impreso'"
                    }]
                };
            }
            
            // 4. Eliminar ítems existentes
            await tx.itemRecibo.deleteMany({
                where: { reciboId: id } // Corregir: usar reciboId en lugar de id
            });
            
            // 5. Eliminar el recibo 
            const reciboEliminado = await tx.recibo.delete({
                where: { id: id }
            });

            // 6. Buscar el último recibo impreso del mes anterior del mismo contrato
            const fechaActual = new Date();
            const fechaMesAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1);
            const fechaFinMesAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 0);
            
            const ultimoRecibo = await tx.recibo.findFirst({
                where: { 
                    contratoId: existingRecibo.contratoId,
                    id: { not: id },
                    estadoReciboId: 4, // Solo recibos impresos
                    fechaImpreso: {
                        gte: fechaMesAnterior, // Mayor o igual al inicio del mes anterior
                        lte: fechaFinMesAnterior // Menor o igual al final del mes anterior
                    }
                },
                orderBy: { fechaImpreso: 'desc' } // El más reciente primero
            });

            // 7. Modificar mesesRestaActualizar en el contrato asociado

            const contratoEncontrado = await tx.contrato.findFirst({
                where: { id: existingRecibo.contratoId }
            });

            if (!contratoEncontrado) {
                return {
                    success: false,
                    errors: [{
                        path: ['contratoId'],
                        message: "El contrato especificado no existe"
                    }]
                };
            }

            const tc = await tx.tipoContrato.findFirst({
                where: { id: contratoEncontrado.tipoContratoId }
            });

            if (!tc) {
                return {
                    success: false,
                    errors: [{
                        path: ['tipoContratoId'],
                        message: "El tipo de contrato especificado no existe"
                    }]
                };
            }

            // Determinar el nuevo valor de mesesRestaActualizar basado en la condición
            const nuevoMesesRestaActualizar = tc.cantidadMesesActualizacion === contratoEncontrado.mesesRestaActualizar 
                ? 0 
                : contratoEncontrado.mesesRestaActualizar + 1;

            await tx.contrato.update({
                where: { id: existingRecibo.contratoId },
                data: {
                    mesesRestaActualizar: nuevoMesesRestaActualizar,
                    cantidadMesesDuracion: { increment: 1 },
                    // Spreading condicional: solo agrega montoAlquilerUltimo si ultimoRecibo existe
                    ...(ultimoRecibo 
                        ? { montoAlquilerUltimo: ultimoRecibo.montoTotal }
                        : { montoAlquilerUltimo: 0 }
                    )
                }
            });

            return {
                success: true,
                data: reciboEliminado
            }
        });

        return resultado;
    
    } catch (error) {
        console.error("Error al eliminar Recibo....:", error)
        return {
            success: false,
            errors: [{
                path: ['general'],
                message: "Error interno del servidor. Intente nuevamente."
            }]
        }
    }
}