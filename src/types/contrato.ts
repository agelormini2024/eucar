/**
 * Tipos y utilidades relacionadas con contratos
 * @fileoverview Definiciones de tipos para operaciones de contratos y consultas Prisma
 * @author Alejandro
 * @since 1.0.0
 */

/**
 * Configuración de consulta Prisma para contratos con todas las relaciones
 * Incluye tipo de contrato, índice, propiedad, clientes (inquilino y propietario) y recibos
 * @example
 * const contratos = await prisma.contrato.findMany(consultaContratos)
 * type ContratoCompleto = Prisma.ContratoGetPayload<typeof consultaContratos>
 */
export const consultaContratos = {
    include: {
        tipoContrato: true,
        tipoIndice: true,
        propiedad: {
            select: {
                calle: true,
                numero: true,
                piso: true,
                departamento: true,
            }
        },
        clienteInquilino: {
            select: {
                apellido: true,
                nombre: true,
                cuit: true,
            }
        },
        clientePropietario: {
            select: {
                apellido: true,
                nombre: true,
                cuit: true,
            }
        }
    }
} as const

/**
 * Configuración de consulta Prisma para contratos con datos del propietario
 * @example
 * const contrato = await prisma.contrato.findUnique({
 *   where: { id: contratoId },
 *   ...selectContratoPropietario
 * })
 */
export const selectContratoPropietario = {
    include: {
        clientePropietario: {
            select: {
                apellido: true,
                nombre: true,
                cuit: true,
            }
        },
    }
} as const

/**
 * Configuración de consulta Prisma para contratos con datos del inquilino
 * @example
 * const contrato = await prisma.contrato.findUnique({
 *   where: { id: contratoId },
 *   ...selectContratoInquilino
 * })
 */
export const selectContratoInquilino = {
    include: {
        clienteInquilino: {
            select: {
                apellido: true,
                nombre: true,
                cuit: true,
            }
        },
    }
} as const