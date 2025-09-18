import { Propiedad } from "@prisma/client";

/**
 * Tipos y utilidades relacionadas con propiedades
 * @fileoverview Definiciones de tipos para operaciones de propiedades con relaciones
 * @author Alejandro
 * @since 1.0.0
 */

/**
 * Tipo para propiedades con todas sus relaciones incluidas
 * Incluye datos del cliente propietario, provincia, país y tipo de propiedad
 * @example
 * const propiedades: PropiedadesConRelaciones[] = await getPropiedades()
 * console.log(propiedades[0].cliente.nombre) // Nombre del propietario
 * console.log(propiedades[0].provincia.nombre) // Provincia de la propiedad
 */
export type PropiedadesConRelaciones = Propiedad & {
    cliente: {
        id: number;
        nombre: string;
        apellido: string;
    }
    provincia: {
        id: number;
        nombre: string;
    }
    pais: {
        id: number;
        nombre: string;
        sigla: string;
    }
    tipoPropiedad: {
        id: number;
        descripcion: string;
    }
};