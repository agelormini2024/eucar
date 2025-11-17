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

// Mapeo de IDs a códigos (hardcodeado pero consistente con BD)
// Estos IDs se establecieron en la migración inicial de TipoItem
const TIPO_ITEM_MAP: Record<number, string> = {
  1: CODIGO_ALQUILER,
  2: CODIGO_DESCUENTO,
  3: CODIGO_EXTRA,
  4: CODIGO_SERVICIO,
  5: CODIGO_REINTEGRO
}

// Mapeo de IDs a propiedades completas (para fallback cuando no hay tipoItem cargado)
const TIPO_ITEM_PROPS: Record<number, { esModificable: boolean; esEliminable: boolean; permiteNegativo: boolean; esObligatorio: boolean; color: string }> = {
  1: { esModificable: false, esEliminable: false, permiteNegativo: false, esObligatorio: true, color: 'red' },      // ALQUILER
  2: { esModificable: true, esEliminable: true, permiteNegativo: true, esObligatorio: false, color: 'green' },      // DESCUENTO
  3: { esModificable: true, esEliminable: true, permiteNegativo: false, esObligatorio: false, color: 'yellow' },    // EXTRA
  4: { esModificable: true, esEliminable: true, permiteNegativo: false, esObligatorio: false, color: 'blue' },      // SERVICIO
  5: { esModificable: true, esEliminable: true, permiteNegativo: true, esObligatorio: false, color: 'violet' }      // REINTEGRO
}

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
 * Obtiene el código del tipo de item
 * Funciona tanto con items que tienen tipoItem cargado como con items que solo tienen tipoItemId
 */
function obtenerCodigoItem(item: unknown): string | null {
  // Caso 1: Tiene tipoItem completo cargado (desde BD)
  if (tieneTipoCodigo(item)) {
    return item.tipoItem.codigo
  }
  
  // Caso 2: Solo tiene tipoItemId (creado en frontend)
  if (typeof item === 'object' && item !== null && 'tipoItemId' in item && typeof item.tipoItemId === 'number') {
    return TIPO_ITEM_MAP[item.tipoItemId] || null
  }
  
  // Caso 3: No tiene ni tipoItem ni tipoItemId - fallback por descripción
  return null
}

/**
 * Obtiene las propiedades del tipo de item
 * Funciona tanto con items que tienen tipoItem cargado como con items que solo tienen tipoItemId
 */
function obtenerPropsItem(item: unknown): { esModificable: boolean; esEliminable: boolean; color: string } | null {
  // Caso 1: Tiene tipoItem completo cargado (desde BD)
  if (tieneTipoCompleto(item)) {
    return {
      esModificable: item.tipoItem.esModificable,
      esEliminable: item.tipoItem.esEliminable,
      color: item.tipoItem.color || 'gray'
    }
  }
  
  // Caso 2: Solo tiene tipoItemId (creado en frontend)
  if (typeof item === 'object' && item !== null && 'tipoItemId' in item && typeof item.tipoItemId === 'number') {
    return TIPO_ITEM_PROPS[item.tipoItemId] || null
  }
  
  // Caso 3: No tiene información de tipo
  return null
}

/**
 * Verifica si un item es de tipo ALQUILER
 * @param item - ItemRecibo con relación tipoItem cargada o con tipoItemId
 */
export function esItemAlquiler(item: unknown): boolean {
  const codigo = obtenerCodigoItem(item)
  
  if (codigo) {
    return codigo === CODIGO_ALQUILER
  }
  
  // Fallback por descripción (última opción)
  if (typeof item === 'object' && item !== null && 'descripcion' in item && typeof item.descripcion === 'string') {
    return item.descripcion.toLowerCase().trim() === 'alquiler'
  }
  
  return false
}

/**
 * Verifica si un item puede ser eliminado por el usuario
 * @param item - ItemRecibo con relación tipoItem cargada o con tipoItemId
 */
export function puedeEliminarItem(item: unknown): boolean {
  const props = obtenerPropsItem(item)
  
  if (props) {
    return props.esEliminable
  }
  
  // Fallback: solo "Alquiler" no se puede eliminar
  if (typeof item === 'object' && item !== null && 'descripcion' in item && typeof item.descripcion === 'string') {
    return item.descripcion.toLowerCase().trim() !== 'alquiler'
  }
  
  return true
}

/**
 * Verifica si un item puede ser modificado por el usuario
 * @param item - ItemRecibo con relación tipoItem cargada o con tipoItemId
 */
export function puedeModificarItem(item: unknown): boolean {
  const props = obtenerPropsItem(item)
  
  if (props) {
    return props.esModificable
  }
  
  // Fallback: solo "Alquiler" no se puede modificar
  if (typeof item === 'object' && item !== null && 'descripcion' in item && typeof item.descripcion === 'string') {
    return item.descripcion.toLowerCase().trim() !== 'alquiler'
  }
  
  return true
}

/**
 * Obtiene el color asociado a un tipo de item
 * @param item - ItemRecibo con relación tipoItem cargada o con tipoItemId
 * @returns Color en formato string (ej: "red", "green", "blue")
 */
export function getColorItem(item: unknown): string {
  const props = obtenerPropsItem(item)
  
  if (props) {
    return props.color
  }
  
  // Fallback básico por monto o descripción
  if (typeof item === 'object' && item !== null && 'monto' in item && typeof item.monto === 'number') {
    if (item.monto < 0) return 'green' // descuento
  }
  if (typeof item === 'object' && item !== null && 'descripcion' in item && typeof item.descripcion === 'string') {
    if (item.descripcion.toLowerCase().includes('alquiler')) return 'red'
  }
  
  return 'yellow' // extra por defecto
}

