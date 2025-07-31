import { formatFecha, restarUnMes } from "../src/utils/index";

describe("formatFecha", () => {
    it("debería formatear una fecha correctamente", () => {
        const fecha = new Date(2025, 6, 24); // Mes 6 = Julio (los meses empiezan en 0)
        const resultado = formatFecha(fecha);
        expect(resultado).toBe("24-07-2025");
    });

    it("debería formatear el 1 de enero correctamente", () => {
        const fecha = new Date(2025, 0, 1); // Enero
        const resultado = formatFecha(fecha);
        expect(resultado).toBe("01-01-2025");
    });
});

describe("restarUnMes", () => {
    it("debería restar un mes correctamente", () => {
        const fecha = '2025-03-01' // Julio
        const resultado = restarUnMes(fecha);
        expect(resultado).toBe("2025-02-01");
    });

    it("debería manejar el cambio de año al restar un mes", () => {
        const fecha = '2025-01-01' // Julio
        const resultado = restarUnMes(fecha);
        expect(resultado).toBe("2024-12-01");    });
});