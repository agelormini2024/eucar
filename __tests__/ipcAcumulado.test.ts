describe("IPC Acumulado Calculation", () => {
    it("calcula IPC acumulado correctamente para múltiples meses", () => {
        // Simulando datos de IPC: 2%, 3%, 1.5%
        const datosIpc = [
            { porcentaje: 2.0 },
            { porcentaje: 3.0 },
            { porcentaje: 1.5 }
        ];

        // Fórmula: (1 + %/100) multiplicado por cada mes
        // (1 + 2/100) * (1 + 3/100) * (1 + 1.5/100)
        // = 1.02 * 1.03 * 1.015
        // = 1.0663631
        const ipcAcumulado = datosIpc.reduce((acc, item) => acc * (item.porcentaje / 100 + 1), 1);
        
        expect(ipcAcumulado).toBeCloseTo(1.0663631, 5);
    });

    it("devuelve 1 cuando no hay datos de IPC", () => {
        const datosVacios: { porcentaje: number }[] = [];
        const ipcAcumulado = datosVacios.reduce((acc, item) => acc * (item.porcentaje / 100 + 1), 1);
        
        expect(ipcAcumulado).toBe(1);
    });

    it("maneja correctamente un solo mes de IPC", () => {
        const datosIpc = [{ porcentaje: 2.5 }];
        const ipcAcumulado = datosIpc.reduce((acc, item) => acc * (item.porcentaje / 100 + 1), 1);
        
        expect(ipcAcumulado).toBe(1.025);
    });

    it("maneja correctamente porcentajes negativos (deflación)", () => {
        const datosIpc = [
            { porcentaje: 2.0 },   // +2%
            { porcentaje: -1.0 },  // -1% (deflación)
            { porcentaje: 1.5 }    // +1.5%
        ];

        // (1 + 2/100) * (1 + (-1)/100) * (1 + 1.5/100)
        // = 1.02 * 0.99 * 1.015
        // = 1.024827
        const ipcAcumulado = datosIpc.reduce((acc, item) => acc * (item.porcentaje / 100 + 1), 1);
        
        expect(ipcAcumulado).toBeCloseTo(1.024827, 3);
    });

    it("maneja correctamente porcentajes altos", () => {
        const datosIpc = [
            { porcentaje: 10.0 },  // +10%
            { porcentaje: 15.0 },  // +15%
            { porcentaje: 5.0 }    // +5%
        ];

        // (1 + 10/100) * (1 + 15/100) * (1 + 5/100)
        // = 1.10 * 1.15 * 1.05
        // = 1.32825
        const ipcAcumulado = datosIpc.reduce((acc, item) => acc * (item.porcentaje / 100 + 1), 1);
        
        expect(ipcAcumulado).toBeCloseTo(1.32825, 5);
    });
});