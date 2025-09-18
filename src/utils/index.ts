/**
 * Utilidades comunes para formateo y manipulación de datos
 * @fileoverview Funciones helper para formateo de moneda, fechas y operaciones de tiempo
 * @author Alejandro
 * @since 1.0.0
 */

/**
 * Formatea un número como moneda en dólares estadounidenses
 * @param amount - El monto numérico a formatear
 * @returns String formateado como moneda USD (ej: "$1,234.56")
 * @example
 * formatCurrency(1234.56) // Returns: "$1,234.56"
 * formatCurrency(0) // Returns: "$0.00"
 * formatCurrency(999999.99) // Returns: "$999,999.99"
 */
export function formatCurrency(amount: number) {
    return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    })
}

/**
 * Formatea una fecha en formato día-mes-año (DD-MM-YYYY)
 * @param fecha - Objeto Date a formatear
 * @returns String en formato "DD-MM-YYYY"
 * @example
 * formatFecha(new Date('2025-06-15')) // Returns: "15-06-2025"
 * formatFecha(new Date('2025-01-01')) // Returns: "01-01-2025"
 */
export function formatFecha(fecha: Date) {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${dia}-${mes}-${anio}`;
}

/**
 * Formatea una fecha en formato ISO para índices ICL (YYYY-MM-DD)
 * @param fecha - Objeto Date a formatear
 * @returns String en formato "YYYY-MM-DD" compatible con índices ICL
 * @example
 * formatFechaIcl(new Date('2025-06-15')) // Returns: "2025-06-15"
 * formatFechaIcl(new Date('2025-01-01')) // Returns: "2025-01-01"
 */
export function formatFechaIcl(fecha: Date) {
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${anio}-${mes}-${dia}`;
}

/**
 * Formatea una fecha en formato año-mes para índices IPC (YYYY-MM)
 * @param fecha - Objeto Date a formatear
 * @returns String en formato "YYYY-MM" compatible con índices IPC
 * @example
 * formatFechaIpc(new Date('2025-06-15')) // Returns: "2025-06"
 * formatFechaIpc(new Date('2025-12-31')) // Returns: "2025-12"
 */
export function formatFechaIpc(fecha: Date) {
    const d = new Date(fecha);
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${anio}-${mes}`;
}

/**
 * Resta un mes a una fecha dada en formato string
 * Maneja correctamente los cambios de año y los diferentes días del mes
 * @param fecha - Fecha en formato "YYYY-MM-DD"
 * @returns Nueva fecha con un mes restado en formato "YYYY-MM-DD"
 * @example
 * restarUnMes("2025-06-10") // Returns: "2025-05-10"
 * restarUnMes("2025-01-15") // Returns: "2024-12-15"
 * restarUnMes("2025-03-31") // Returns: "2025-02-28" (o "2025-02-29" en año bisiesto)
 * @note Evita errores de zona horaria trabajando directamente con componentes de fecha
 */
export function restarUnMes(fecha: string): string {
    const [anio, mes, dia] = fecha.split('-').map(Number); // Esto es para evitar errores con la zona horaria
    const fechaObj = new Date(anio, mes - 1, dia);
    fechaObj.setMonth(fechaObj.getMonth() - 1);
    const yyyy = fechaObj.getFullYear();
    const mm = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

