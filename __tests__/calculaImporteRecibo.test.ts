import { Contrato } from "../src/schema";
import { calculaImporteRecibo } from "../src/lib/calculaImporteRecibo";

describe("calculaImporteRecibo", () => {
    it("calcula el importe usando IPC cuando tipoIndiceId es 1", () => {
        const contrato = {
            tipoIndiceId: 1,
            tipoContrato: { ipc: 1.1, icl: 1.2, icp: 1.3 },
            montoAlquilerInicial: 1000,
            montoAlquilerUltimo: 0,
            mesesRestaActualizar: 0,
        } as Contrato;
        const { montoCalculado } = calculaImporteRecibo(contrato);
        expect(montoCalculado).toBe(1100); // 1000 * 1.1
    });

    it("calcula el importe usando ICL cuando tipoIndiceId es 2", () => {
        const contrato = {
            tipoIndiceId: 2,
            tipoContrato: { ipc: 1.1, icl: 1.2, icp: 1.3 },
            montoAlquilerInicial: 1000,
            montoAlquilerUltimo: 0,
            mesesRestaActualizar: 0,
        } as Contrato;
        const { montoCalculado } = calculaImporteRecibo(contrato);
        expect(montoCalculado).toBe(1200); // 1000 * 1.2
    });

    it("devuelve el montoAlquiler y es el primer mes cuando mesesRestaActualizar no es 0", () => {
        const contrato = {
            tipoIndiceId: 1,
            tipoContrato: { ipc: 1.1, icl: 1.2, icp: 1.3 },
            montoAlquilerInicial: 1000,
            montoAlquilerUltimo: 0,
            mesesRestaActualizar: 2,
        } as Contrato;
        const { montoCalculado } = calculaImporteRecibo(contrato);
        expect(montoCalculado).toBe(1000);
    });

        it("devuelve el montoAlquiler y NO es el primer mes cuando mesesRestaActualizar no es 0", () => {
        const contrato = {
            tipoIndiceId: 1,
            tipoContrato: { ipc: 1.1, icl: 1.2, icp: 1.3 },
            montoAlquilerInicial: 1000,
            montoAlquilerUltimo: 1500,
            mesesRestaActualizar: 2,
        } as Contrato;
        const { montoCalculado } = calculaImporteRecibo(contrato);
        expect(montoCalculado).toBe(1500);
    });

});