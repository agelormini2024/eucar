/**
 * Utilidades para trabajar con ItemRecibo y TipoItem
 * Reemplaza las comparaciones hardcodeadas de strings por funciones type-safe
 */

import { TipoItem } from '@/src/stores/storeRecibos'

// Códigos de tipos de item (deben coincidir con BD)
export const CODIGO_ALQUILER = 'ALQUILER'
export const CODIGO_DESCUENTO = 'DESCUENTO'
export const CODIGO_EXTRA = 'EXTRA'
export const CODIGO_SERVICIO = 'SERVICIO'
export const CODIGO_REINTEGRO = 'REINTEGRO'

/**
 * Tipo para item con tipoItem parcial (solo codigo, para type guard)
 */
type ItemConTipoCodigo = {
  tipoItem: Pick<TipoItem, 'codigo'>
  descripcion?: string
  monto?: number
}

/**
 * Tipo para item con tipoItem completo
 */
type ItemConTipoCompleto = {
  tipoItem: TipoItem
  descripcion?: string
  monto?: number
}

// Type guard para verificar si un item tiene tipoItem con codigo
export function tieneTipoCodigo(item: unknown): item is ItemConTipoCodigo {
  return (
    item !== null &&
    typeof item === 'object' && 
    'tipoItem' in item && 
    item.tipoItem !== null &&
    typeof item.tipoItem === 'object' &&
    'codigo' in item.tipoItem
  )
}

// Type guard para verificar si un item tiene tipoItem completo
export function tieneTipoCompleto(item: unknown): item is ItemConTipoCompleto {
  return (
    tieneTipoCodigo(item) &&
    'esModificable' in item.tipoItem &&
    'esEliminable' in item.tipoItem &&
    'permiteNegativo' in item.tipoItem &&
    'esObligatorio' in item.tipoItem &&
    'color' in item.tipoItem
  )
}

/**
 * Verifica si un item es de tipo ALQUILER
 * @param item - ItemRecibo con relación tipoItem cargada
 */
export function esItemAlquiler(item: unknown): boolean {
  if (!tieneTipoCodigo(item)) {
    console.warn('Item sin tipoItem cargado, verificando por descripción (fallback)')
    if (typeof item === 'object' && item !== null && 'descripcion' in item && typeof item.descripcion === 'string') {
      return item.descripcion.toLowerCase().trim() === 'alquiler'
    }
    return false
  }
  return item.tipoItem.codigo === CODIGO_ALQUILER
}

/**
 * Verifica si un item puede ser eliminado por el usuario
 * @param item - ItemRecibo con relación tipoItem cargada
 */
export function puedeEliminarItem(item: unknown): boolean {
  if (!tieneTipoCompleto(item)) {
    // Fallback: solo "Alquiler" no se puede eliminar
    if (typeof item === 'object' && item !== null && 'descripcion' in item && typeof item.descripcion === 'string') {
      return item.descripcion.toLowerCase().trim() !== 'alquiler'
    }
    return true
  }
  return item.tipoItem.esEliminable === true
}

/**
 * Verifica si un item puede ser modificado por el usuario
 * @param item - ItemRecibo con relación tipoItem cargada
 */
export function puedeModificarItem(item: unknown): boolean {
  if (!tieneTipoCompleto(item)) {
    // Fallback: solo "Alquiler" no se puede modificar
    if (typeof item === 'object' && item !== null && 'descripcion' in item && typeof item.descripcion === 'string') {
      return item.descripcion.toLowerCase().trim() !== 'alquiler'
    }
    return true
  }
  return item.tipoItem.esModificable === true
}

/**
 * Verifica si un tipo de item permite montos negativos
 * @param item - ItemRecibo con relación tipoItem cargada
 */
export function permiteMontoNegativo(item: unknown): boolean {
  if (!tieneTipoCompleto(item)) {
    // Fallback: permitir negativos para items con monto < 0
    if (typeof item === 'object' && item !== null && 'monto' in item && typeof item.monto === 'number') {
      return item.monto < 0
    }
    return false
  }
  return item.tipoItem.permiteNegativo === true
}

/**
 * Valida que el monto de un item sea coherente con su tipo
 * @param item - ItemRecibo con relación tipoItem cargada
 * @param monto - Monto a validar
 * @returns true si el monto es válido, false si no
 */
export function validarMontoItem(item: unknown, monto: number): boolean {
  // Montos cero siempre válidos
  if (monto === 0) return true
  
  // Si permite negativos, cualquier valor es válido
  if (permiteMontoNegativo(item)) return true
  
  // Si no permite negativos, debe ser positivo
  return monto > 0
}

/**
 * Obtiene el color asociado a un tipo de item
 * @param item - ItemRecibo con relación tipoItem cargada
 * @returns Color en formato string (ej: "red", "green", "blue")
 */
export function getColorItem(item: unknown): string {
  if (!tieneTipoCompleto(item)) {
    // Fallback básico
    if (typeof item === 'object' && item !== null && 'monto' in item && typeof item.monto === 'number') {
      if (item.monto < 0) return 'green' // descuento
    }
    if (typeof item === 'object' && item !== null && 'descripcion' in item && typeof item.descripcion === 'string') {
      if (item.descripcion.toLowerCase().includes('alquiler')) return 'red'
    }
    return 'yellow' // extra
  }
  return item.tipoItem.color || 'gray'
}

/**
 * Verifica si un item es obligatorio (debe existir en todo recibo)
 * @param item - ItemRecibo con relación tipoItem cargada
 */
export function esItemObligatorio(item: unknown): boolean {
  if (!tieneTipoCompleto(item)) {
    // Fallback: solo "Alquiler" es obligatorio
    if (typeof item === 'object' && item !== null && 'descripcion' in item && typeof item.descripcion === 'string') {
      return item.descripcion.toLowerCase().trim() === 'alquiler'
    }
    return false
  }
  return item.tipoItem.esObligatorio === true
}

