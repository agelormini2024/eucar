/**
 * Utilidades compartidas para la gestión de Recibos
 * Funciones reutilizables entre create-recibo-action y update-recibo-action
 */

import { prisma } from "@/src/lib/prisma"
import { esItemAlquiler, CODIGO_ALQUILER } from "./itemHelpers"

// ============================================================================
// TIPOS
// ============================================================================

export type ItemData = { 
    descripcion: string
    monto: number
    tipoItemId?: number
}

export type ItemConTipo = {
    descripcion: string
    monto: number
    tipoItemId: number
}

// ============================================================================
// CACHÉ DE TIPOS DE ITEMS
// ============================================================================

/**
 * Caché para el ID del tipo ALQUILER
 * Se mantiene en memoria durante la ejecución del servidor
 */
let cachedTipoAlquilerId: number | null = null

/**
 * Caché para IDs de otros tipos de items
 */
const cachedTipoItemIds: Record<string, number> = {}

// ============================================================================
// FUNCIONES DE ACCESO A TIPOS
// ============================================================================

/**
 * Obtiene el ID del TipoItem de ALQUILER desde la BD
 * Se cachea en memoria para optimizar performance
 * @returns ID del tipo ALQUILER
 * @throws Error si no se encuentra el tipo ALQUILER en la BD
 */
export async function getTipoAlquilerId(): Promise<number> {
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
 * Obtiene el ID de un TipoItem por su código
 * Se cachea en memoria para optimizar performance
 * @param codigo - Código del TipoItem (ej: 'EXTRA', 'REINTEGRO')
 * @returns ID del tipo solicitado
 * @throws Error si no se encuentra el tipo en la BD
 */
export async function getTipoItemId(codigo: string): Promise<number> {
    if (cachedTipoItemIds[codigo]) {
        return cachedTipoItemIds[codigo]
    }
    
    const tipo = await prisma.tipoItem.findUnique({
        where: { codigo },
        select: { id: true }
    })
    
    if (!tipo) {
        throw new Error(`TipoItem con código ${codigo} no encontrado en la base de datos`)
    }
    
    cachedTipoItemIds[codigo] = tipo.id
    return tipo.id
}

// ============================================================================
// LÓGICA DE DETERMINACIÓN DE TIPOS
// ============================================================================

/**
 * Determina el tipoItemId correcto para un item según su contenido
 * Lógica de inferencia automática:
 * - Si ya tiene tipoItemId asignado → usarlo
 * - Si es ALQUILER (por descripción) → tipoAlquilerId
 * - Si monto < 0 → REINTEGRO (descuento/devolución)
 * - Resto → EXTRA
 * 
 * @param item - Item a procesar
 * @param tipoAlquilerId - ID del tipo ALQUILER (se pasa para evitar búsquedas repetidas)
 * @returns ID del tipo determinado
 */
export async function determinarTipoItem(item: ItemData, tipoAlquilerId: number): Promise<number> {
    // Si ya tiene tipoItemId asignado, usarlo
    if (item.tipoItemId) {
        return item.tipoItemId
    }
    
    // Si es el item de Alquiler (por descripción)
    if (esItemAlquiler(item)) {
        return tipoAlquilerId
    }
    
    // Si el monto es negativo → REINTEGRO
    if (item.monto < 0) {
        return await getTipoItemId('REINTEGRO')
    }
    
    // Por defecto → EXTRA
    return await getTipoItemId('EXTRA')
}

// ============================================================================
// VALIDACIÓN Y PROCESAMIENTO DE ITEMS
// ============================================================================

/**
 * Valida que el item "Alquiler" existe y su monto coincide con el esperado
 * @param items - Array de items a validar
 * @param montoEsperado - Monto que debería tener el item Alquiler
 * @returns Objeto con success y error si falla la validación
 */
export function validarItemAlquiler(
    items: ItemData[], 
    montoEsperado: number
): { success: boolean; error?: string } {
    const itemAlquiler = items.find(item => esItemAlquiler(item))
    
    if (!itemAlquiler) {
        return { 
            success: false, 
            error: "Falta el ítem 'Alquiler'. Por favor, recargue el formulario." 
        }
    }
    
    // Verificar que el monto coincida (tolerancia de 0.01 para decimales)
    if (Math.abs(itemAlquiler.monto - montoEsperado) > 0.01) {
        return {
            success: false,
            error: `El monto del alquiler ($${itemAlquiler.monto}) no coincide con el monto calculado ($${montoEsperado}). Por favor, recargue el formulario.`
        }
    }
    
    return { success: true }
}

/**
 * Calcula el monto total a pagar sumando todos los items
 * Incluye items positivos (extras) y negativos (reintegros/descuentos)
 * @param items - Array de items del recibo
 * @returns Monto total calculado
 */
export function calcularMontoPagado(items: ItemData[]): number {
    return items.reduce((sum, item) => sum + item.monto, 0)
}

/**
 * Asegura que el item "Alquiler" existe en el array de items
 * Si no existe, lo crea con el monto especificado
 * Si existe, valida que su monto sea correcto
 * 
 * @param items - Array original de items
 * @param montoTotal - Monto que debería tener el item Alquiler
 * @param tipoAlquilerId - ID del tipo ALQUILER
 * @returns Objeto con items procesados o error
 */
export async function asegurarItemAlquiler(
    items: ItemData[],
    montoTotal: number,
    tipoAlquilerId: number
): Promise<{ success: true; items: ItemData[] } | { success: false; error: string }> {
    
    const itemAlquiler = items.find(item => esItemAlquiler(item))
    
    if (!itemAlquiler) {
        // Si no existe, crear el ítem "Alquiler" con el montoTotal
        const itemsConAlquiler: ItemData[] = [
            { descripcion: "Alquiler", monto: montoTotal, tipoItemId: tipoAlquilerId },
            ...items
        ]
        return { success: true, items: itemsConAlquiler }
    }
    
    // Si existe, validar que el monto coincida
    const validacion = validarItemAlquiler(items, montoTotal)
    if (!validacion.success) {
        return { success: false, error: validacion.error! }
    }
    
    return { success: true, items }
}

/**
 * Procesa un array de items asignando tipoItemId automáticamente a cada uno
 * Convierte ItemData[] en ItemConTipo[] listo para insertar en BD
 * 
 * @param items - Array de items a procesar
 * @param tipoAlquilerId - ID del tipo ALQUILER
 * @returns Array de items con tipoItemId asignado
 */
export async function procesarItemsConTipo(
    items: ItemData[],
    tipoAlquilerId: number
): Promise<ItemConTipo[]> {
    return await Promise.all(
        items.map(async (item) => ({
            descripcion: item.descripcion,
            monto: item.monto,
            tipoItemId: await determinarTipoItem(item, tipoAlquilerId)
        }))
    )
}

/**
 * Procesa items para un recibo específico, asignando reciboId y tipoItemId
 * @param items - Array de items a procesar
 * @param reciboId - ID del recibo al que pertenecen los items
 * @param tipoAlquilerId - ID del tipo ALQUILER
 * @returns Array de items listos para createMany
 */
export async function procesarItemsParaRecibo(
    items: ItemData[],
    reciboId: number,
    tipoAlquilerId: number
): Promise<Array<ItemConTipo & { reciboId: number }>> {
    const itemsConTipo = await procesarItemsConTipo(items, tipoAlquilerId)
    
    return itemsConTipo.map(item => ({
        ...item,
        reciboId
    }))
}

// ============================================================================
// VALIDACIONES DE NEGOCIO
// ============================================================================

/**
 * Valida que el montoPagado sea razonable (>= 0)
 * El montoPagado nunca debería ser negativo porque siempre hay un ítem "Alquiler"
 * @param montoPagado - Monto total calculado
 * @returns Objeto con success y error si falla
 */
export function validarMontoPagado(montoPagado: number): { success: boolean; error?: string } {
    if (montoPagado < 0) {
        return {
            success: false,
            error: "El monto total a pagar debe ser mayor o igual a cero. Verifique los descuentos aplicados."
        }
    }
    
    return { success: true }
}

/**
 * Filtra los items removiendo el item "Alquiler"
 * Útil para la edición donde el Alquiler se genera automáticamente
 * @param items - Array de items
 * @returns Array sin el item Alquiler
 */
export function filtrarItemsSinAlquiler(items: ItemData[]): ItemData[] {
    return items.filter(item => !esItemAlquiler(item))
}
