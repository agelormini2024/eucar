import { IpcFinal } from "../src/schema";

describe("IPC Data Validation", () => {
    it("valida datos IPC correctos con esquema Zod", () => {
        const datosValidos = [
            { fecha: "2025-01", inflacion: 2.5 },
            { fecha: "2025-02", inflacion: 3.1 },
            { fecha: "2025-03", inflacion: 1.8 }
        ];

        const resultado = IpcFinal.safeParse(datosValidos);
        expect(resultado.success).toBe(true);
        if (resultado.success) {
            expect(resultado.data).toHaveLength(3);
            expect(resultado.data[0].fecha).toBe("2025-01");
            expect(resultado.data[0].inflacion).toBe(2.5);
        }
    });

    it("rechaza datos IPC con fechas inválidas", () => {
        const datosInvalidos = [
            { fecha: 123, inflacion: 2.5 }, // fecha no es string
            { fecha: "2025-02", inflacion: 3.1 }
        ];

        const resultado = IpcFinal.safeParse(datosInvalidos);
        expect(resultado.success).toBe(false);
    });

    it("rechaza datos IPC con inflación no numérica", () => {
        const datosInvalidos = [
            { fecha: "2025-01", inflacion: "not-a-number" },
            { fecha: "2025-02", inflacion: 3.1 }
        ];

        const resultado = IpcFinal.safeParse(datosInvalidos);
        expect(resultado.success).toBe(false);
    });

    it("rechaza datos IPC con campos faltantes", () => {
        const datosInvalidos = [
            { fecha: "2025-01" }, // Missing inflacion
            { inflacion: 3.1 }     // Missing fecha
        ];

        const resultado = IpcFinal.safeParse(datosInvalidos);
        expect(resultado.success).toBe(false);
    });

    it("acepta array vacío", () => {
        const datosVacios: unknown[] = [];
        const resultado = IpcFinal.safeParse(datosVacios);
        expect(resultado.success).toBe(true);
        if (resultado.success) {
            expect(resultado.data).toHaveLength(0);
        }
    });
});