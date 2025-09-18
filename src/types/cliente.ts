import { Cliente } from "@prisma/client";

/**
 * Tipos y utilidades relacionadas con clientes
 * @fileoverview Definiciones de tipos para operaciones de clientes con relaciones geográficas
 * @author Alejandro
 * @since 1.0.0
 */

/**
 * Tipo para clientes con información geográfica completa
 * Incluye datos del país y provincia del cliente
 * @example
 * const clientes: ClientesConProvinciaPais[] = await getClientes()
 * console.log(clientes[0].pais.nombre) // País del cliente
 * console.log(clientes[0].provincia.nombre) // Provincia del cliente
 */
export type ClientesConProvinciaPais = Cliente & {
    pais: {
        id: number;
        nombre: string;
        sigla: string;
    }
    provincia: {
        id: number;
        nombre: string;
        paisId: number;
    }
}