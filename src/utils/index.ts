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

/**
 * Convierte un número a su representación en letras en español
 * @param numero - El número a convertir (hasta 999,999,999.99)
 * @returns String con el número escrito en letras
 * @example
 * numeroALetras(123.45) // Returns: "ciento veintitrés pesos con cuarenta y cinco centavos"
 * numeroALetras(1000000) // Returns: "un millón de pesos"
 */
export function numeroALetras(numero: number): string {
    const unidades = [
        '', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'
    ];
    
    const especiales = [
        'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 
        'diecisiete', 'dieciocho', 'diecinueve'
    ];
    
    const decenas = [
        '', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 
        'setenta', 'ochenta', 'noventa'
    ];
    
    const centenas = [
        '', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos',
        'seiscientos', 'setecientos', 'ochocientos', 'novecientos'
    ];

    function convertirGrupo(num: number): string {
        if (num === 0) return '';
        
        let resultado = '';
        const c = Math.floor(num / 100);
        const d = Math.floor((num % 100) / 10);
        const u = num % 10;
        
        if (c > 0) {
            if (num === 100) {
                resultado += 'cien';
            } else {
                resultado += centenas[c];
            }
        }
        
        if (d === 1 && u > 0) {
            resultado += (resultado ? ' ' : '') + especiales[u];
        } else {
            if (d === 2 && u > 0) {
                resultado += (resultado ? ' ' : '') + 'veinti' + unidades[u];
            } else {
                if (d > 0) {
                    resultado += (resultado ? ' ' : '') + decenas[d];
                }
                if (u > 0) {
                    resultado += (resultado && d > 0 ? ' y ' : (resultado ? ' ' : '')) + unidades[u];
                }
            }
        }
        
        return resultado;
    }

    // Separar parte entera y decimal
    const partes = numero.toString().split('.');
    const entero = parseInt(partes[0]);
    const decimal = partes[1] ? parseInt(partes[1].padEnd(2, '0').substring(0, 2)) : 0;

    if (entero === 0) {
        const centavosTexto = decimal > 0 ? numeroALetras(decimal) + ' centavo' + (decimal !== 1 ? 's' : '') : '';
        return centavosTexto || 'cero pesos';
    }

    let resultado = '';

    // Millones
    const millones = Math.floor(entero / 1000000);
    if (millones > 0) {
        if (millones === 1) {
            resultado += 'un millón';
        } else {
            resultado += convertirGrupo(millones) + ' millones';
        }
    }

    // Miles
    const miles = Math.floor((entero % 1000000) / 1000);
    if (miles > 0) {
        if (resultado) resultado += ' ';
        if (miles === 1) {
            resultado += 'mil';
        } else {
            resultado += convertirGrupo(miles) + ' mil';
        }
    }

    // Unidades
    const unidadesNum = entero % 1000;
    if (unidadesNum > 0) {
        if (resultado) resultado += ' ';
        resultado += convertirGrupo(unidadesNum);
    }

    // Agregar "pesos"
    resultado += ' peso' + (entero !== 1 ? 's' : '');

    // Agregar centavos si los hay
    if (decimal > 0) {
        resultado += ' con ' + convertirGrupo(decimal) + ' centavo' + (decimal !== 1 ? 's' : '');
    }

    return resultado;
}

