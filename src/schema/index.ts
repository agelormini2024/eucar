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
    // provinciaId: z.string()
    //     .transform(value => parseInt(value))
    //     .refine(value => !isNaN(value) || value > 0, { message: "La provincia es obligatoria" }),
    provinciaId: z.number().min(1, { message: "La provincia es obligatoria" }),
    paisId: z.number().min(1, { message: "El país es obligatorio" }),
    email: z.string().email({ message: "El email no es válido" }),
    observaciones: z.string()
        .max(200, { message: "Las observaciones no pueden tener más de 200 caracteres" }),
    activo: z.boolean().default(true),
})