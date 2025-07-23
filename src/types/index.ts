import { Cliente, Propiedad, Recibo } from "@prisma/client";
import { IpcSchema } from "../schema";
import { z } from "zod";

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

export type RecibosConRelaciones = Recibo & {
    contrato: {
        mesesRestaActualizar: number,
        clienteInquilino: {
            nombre: string;
            apellido: string;
        },
        propiedad: {
            calle: string,
            numero: number,
            piso: string,
            departamento: string
        }
    }
    estadoRecibo: {
        descripcion: string;
    }
    fechaPendiente: Date;
    fechaGenerado: Date | null;
    montoAnterior: number;
    montoTotal: number;
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
        },
        recibos: {
            select: {
                id: true,
                montoTotal: true,
                fechaGenerado: true,
                fechaImpreso: true,
            }
        }
    }
} as const

export const selectContratoPropietario = {
    include: {
        clientePropietario: {
            select: {
                apellido: true,
                nombre: true,
                cuit: true,
            }
        },
    }
} as const

export const selectContratoInquilino = {
    include: {
        clienteInquilino: {
            select: {
                apellido: true,
                nombre: true,
                cuit: true,
            }
        },
    }
} as const

//--------------------------------------------------------

export type ReciboConRelaciones = {
    id: number;
    contratoId: number;
    estadoReciboId: number;
    fechaPendiente: string; // ISO string (Date serializado)
    fechaGenerado: string | null;
    fechaImpreso: string | null;
    fechaAnulado: string | null;
    montoAnterior: number;
    montoTotal: number;
    observaciones?: string | null;
    createdAt: string;
    updatedAt: string;
    expensas: boolean;
    abl: boolean;
    aysa: boolean;
    luz: boolean;
    gas: boolean;
    otros: boolean;
    contrato: {
        clienteInquilino: {
            apellido: string;
            nombre: string;
            cuit: string;
        };
        clientePropietario: {
            apellido: string;
            nombre: string;
            cuit: string;
        };
        propiedad: {
            calle: string;
            numero: number;
            piso: string | null;
            departamento: string | null;
        };
    };
};
//---------------------------------------------------------
export type Ipc = z.infer<typeof IpcSchema>;

export type IpcMensual = {
    fecha: string,
    inflacion: number
}[]

export type IclDiario = {
    fecha: string,
    indice: number
}[]
