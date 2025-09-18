/**
 * Utilidades para formateo de datos de recibos
 */

/**
 * Formatea una fecha para mostrar en inputs de tipo date
 * @param date - Fecha a formatear
 * @returns String en formato YYYY-MM-DD o string vacío si es null
 */
export function formatDateForInput(date: Date | null | undefined): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
}

/**
 * Construye la descripción de una propiedad
 * @param propiedad - Objeto con datos de la propiedad
 * @returns String formateado con la dirección completa
 */
export function formatPropiedadAddress(propiedad: {
    calle?: string;
    numero?: number;
    piso?: string;
    departamento?: string;
}): string {
    if (!propiedad) return '';
    
    const { calle = '', numero = '', piso = '', departamento = '' } = propiedad;
    return `${calle} ${numero} - Piso: ${piso} - Dpto: ${departamento}`;
}

/**
 * Formatea el nombre completo de una persona
 * @param apellido - Apellido de la persona
 * @param nombre - Nombre de la persona
 * @returns String con formato "Apellido Nombre"
 */
export function formatFullName(apellido: string, nombre: string): string {
    return `${apellido} ${nombre}`;
}