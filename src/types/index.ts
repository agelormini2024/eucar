import { Cliente, Propiedad } from "@prisma/client";

export type PropiedadesConRelaciones = Propiedad & {
    cliente: {
        id: number;
        nombre: string;
        apellido: string;
    };
    provincia: {
        id: number;
        nombre: string;
    };
    pais: {
        id: number;
        nombre: string;
        sigla: string;
    };
    tipoPropiedad: {
        id: number;
        nombre: string;
    };
};

export type ClientesConProvinciaPais = Cliente & {
    pais: {
        id: number;
        nombre: string;
        sigla: string;
    };
    provincia: {
        id: number;
        nombre: string;
        paisId: number;
    };
}