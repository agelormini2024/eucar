import { z } from 'zod';

export const ClienteSchema = z.object({
    nombre: z.string().min(3, { message: "El nombre es obligatorio" }),
    apellido: z.string().min(3, { message: "El apellido es obligatorio" }),
    razonSocial: z.string().optional(),
    cuit: z.string().min(1, { message: "El CUIT / CUIL es obligatorio" }),
    celular: z.string().min(1, { message: "El celular es obligatorio" }),
    telefono1: z.string().optional(),
    telefono2: z.string().optional(),
    calle: z.string().min(3, { message: "La calle es obligatoria" }),
    numero: z.number({ message: 'Debe ingresar un número sin letras' })
        .min(1, { message: "El número es obligatorio" }),
    piso: z.string().optional(),
    departamento: z.string().optional(),
    codigoPostal: z.string().min(1, { message: "El CP es obligatorio" }),
    localidad: z.string().min(3, { message: "La localidad es obligatoria" }),
    provinciaId: z.number().min(1, { message: "La provincia es obligatoria" }),
    paisId: z.number().min(1, { message: "El país es obligatorio" }),
    email: z.string().email({ message: "El email no es válido" }),
    observaciones: z.string()
        .max(200, { message: "Las observaciones no pueden tener más de 200 caracteres" }),
    activo: z.boolean().default(true),
})

export const PropiedadSchema = z.object({
    descripcion: z.string().min(3, { message: "La descripción es obligatoria" }),
    calle: z.string().min(3, { message: "La calle es obligatoria" }),
    numero: z.number({ message: 'Debe ingresar un número sin letras' })
        .min(1, { message: "El número es obligatorio" }),
    piso: z.string().optional(),
    departamento: z.string().optional(),
    localidad: z.string().min(3, { message: "La localidad es obligatoria" }),
    provinciaId: z.number().min(1, { message: "La provincia es obligatoria" }),
    paisId: z.number().min(1, { message: "El país es obligatorio" }),
    codigoPostal: z.string().min(1, { message: "El CP es obligatorio" }),
    ambientes: z.number()
        .min(1, { message: "Los ambientes son obligatorios" })
        .max(30, { message: "Los ambientes no pueden ser más de 30" }),
    dormitorios: z.number()
        .min(1, { message: "Los dormitorios son obligatorios" })
        .max(30, { message: "Los dormitorios no pueden ser más de 30" }),
    banios: z.number()
        .min(1, { message: "Los baños son obligatorios" })
        .max(30, { message: "Los baños no pueden ser más de 30" }),
    metrosCuadrados: z.number()
        .min(1, { message: "Los metros cuadrados son obligatorios" })
        .max(10000, { message: "Los metros cuadrados no pueden ser más de 10.000" }),
    metrosCubiertos: z.number()
        .min(1, { message: "Los metros cubiertos son obligatorios" })
        .max(10000, { message: "Los metros cubiertos no pueden ser más de 10.000" }),
    cochera: z.number()
        .min(0, { message: "La cochera es obligatoria" })
        .max(30, { message: "La cochera no puede ser más de 30" }),
    expensas: z.number().optional(),
    antiguedad: z.number().optional(),
    imagen: z.string().optional(),
    tipoPropiedadId: z.number().min(1, { message: "El tipo de propiedad es obligatorio" }),
    observaciones: z.string()
        .max(200, { message: "Las observaciones no pueden tener más de 200 caracteres" }),
    clienteId: z.number().min(1, { message: "El cliente es obligatorio" }),
    activo: z.boolean().default(true),
})