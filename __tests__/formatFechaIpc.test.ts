import { formatFechaIpc } from "../src/utils/index";

describe("formatFechaIpc", () => {
    it("convierte fecha a formato YYYY-MM para enero", () => {
        const fecha = new Date(2025, 0, 15); // año, mes (0-indexado), día
        const resultado = formatFechaIpc(fecha);
        expect(resultado).toBe("2025-01");
    });

    it("convierte fecha a formato YYYY-MM para diciembre", () => {
        const fecha = new Date(2025, 11, 31); // año, mes (0-indexado), día
        const resultado = formatFechaIpc(fecha);
        expect(resultado).toBe("2025-12");
    });

    it("maneja correctamente meses de un dígito", () => {
        const fecha = new Date(2025, 5, 15); // año, mes (0-indexado), día
        const resultado = formatFechaIpc(fecha);
        expect(resultado).toBe("2025-06");
    });

    it("maneja correctamente el primer día del año", () => {
        const fecha = new Date(2024, 0, 1); // año, mes (0-indexado), día
        const resultado = formatFechaIpc(fecha);
        expect(resultado).toBe("2024-01");
    });

    it("maneja correctamente el último día del año", () => {
        const fecha = new Date(2024, 11, 31); // año, mes (0-indexado), día
        const resultado = formatFechaIpc(fecha);
        expect(resultado).toBe("2024-12");
    });
});