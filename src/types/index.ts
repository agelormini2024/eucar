import { Cliente, Contrato, Propiedad, TipoContrato, TipoIndice } from "@prisma/client";

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

// Uso esta constante para que en el client component ( page.tsx ) el type sea inferido por Prisma
// Prisma.ContratoGetPayload<typeof consultaContratos>;
export const consultaContratos = {
    include: {
        tipoContrato: true,
        tipoIndice: true,
        propiedad: {
            select: {
                calle: true,
                numero: true,
                piso: true,
                departamento: true,
            }
        },
        clienteInquilino: {
            select: {
                apellido: true,
                nombre: true,
                cuit: true,
            }
        },
        clientePropietario: {
            select: {
                apellido: true,
                nombre: true,
                cuit: true,
            }
        }
    }
} as const;