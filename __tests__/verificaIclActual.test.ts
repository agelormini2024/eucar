/**
 * TEST SUITE: verificaIclActual - Verificacion de indices ICL
 * 
 * OBJETIVO:
 * Testear la funcion que verifica si existe un indice ICL disponible
 * para una fecha dada (dentro del mes de generacion del recibo)
 * 
 * CONCEPTO:
 * - ICL: Indice de Contratos de Locacion
 * - Se publica mensualmente (ej: ICL de octubre se publica a mediados de noviembre)
 * - La funcion busca si existe CUALQUIER ICL en el mes de la fecha dada
 */

// ============================================================================
// SECCION 1: MOCKS
// ============================================================================

let iclFindFirstMock: jest.Mock;

jest.mock("@/src/lib/prisma", () => {
    iclFindFirstMock = jest.fn();
    return {
        prisma: {
            icl: {
                findFirst: iclFindFirstMock,
            }
        }
    };
});

// ============================================================================
// IMPORTS
// ============================================================================

import { verificaIclActual } from "../src/lib/verificaIclActual";

// ============================================================================
// TESTS
// ============================================================================

describe("verificaIclActual", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TEST 1: Retornar true si existe ICL en el mes
     * 
     * ESCENARIO: 
     *   - Fecha de generacion: 15 de noviembre 2024
     *   - Existe ICL de octubre (publicado el 10 de noviembre)
     * 
     * RESULTADO ESPERADO: true (hay indice disponible)
     */
    it("deberia retornar true si existe un indice ICL en el mes de generacion", async () => {
        // ============ ARRANGE ============
        
        // Fecha de generacion del recibo: 15 de noviembre 2024
        const fechaGeneracion = new Date('2024-11-15');
        
        // Simular que existe un ICL en noviembre 2024
        iclFindFirstMock.mockResolvedValue({
            id: 1,
            fecha: new Date('2024-11-10'), // ICL publicado el 10 de noviembre
            valor: 0.025
        });
        
        // ============ ACT ============
        const resultado = await verificaIclActual(fechaGeneracion);
        
        // ============ ASSERT ============
        
        // 1. El resultado debe ser true
        expect(resultado).toBe(true);
        
        // 2. Verificar que se busco con las fechas correctas
        expect(iclFindFirstMock).toHaveBeenCalledTimes(1);
        
        // Verificar los parametros de la llamada
        const llamada = iclFindFirstMock.mock.calls[0][0];
        expect(llamada.where.fecha.gte).toEqual(new Date(2024, 10, 1)); // Mes 10 = noviembre (0-indexed)
        expect(llamada.where.fecha.lt).toEqual(new Date(2024, 11, 1));  // Mes 11 = diciembre
    });

    /**
     * TEST 2: Retornar false si NO existe ICL en el mes
     * 
     * ESCENARIO:
     *   - Fecha de generacion: 5 de noviembre 2024
     *   - NO existe ICL en noviembre (aun no se publico)
     * 
     * RESULTADO ESPERADO: false (no hay indice disponible)
     */
    it("deberia retornar false si no existe indice ICL en el mes de generacion", async () => {
        // ============ ARRANGE ============
        
        // Fecha de generacion: 5 de noviembre (muy temprano, no hay ICL aun)
        const fechaGeneracion = new Date('2024-11-05');
        
        // Simular que NO existe ICL en noviembre
        iclFindFirstMock.mockResolvedValue(null);
        
        // ============ ACT ============
        const resultado = await verificaIclActual(fechaGeneracion);
        
        // ============ ASSERT ============
        
        // 1. El resultado debe ser false
        expect(resultado).toBe(false);
        
        // 2. Se intento buscar el indice
        expect(iclFindFirstMock).toHaveBeenCalledTimes(1);
    });

    /**
     * TEST 3: Retornar false en caso de error
     * 
     * ESCENARIO:
     *   - Error en la base de datos
     * 
     * RESULTADO ESPERADO: false (por seguridad, asumir que no hay)
     */
    it("deberia retornar false si hay un error en la base de datos", async () => {
        // ============ ARRANGE ============
        
        const fechaGeneracion = new Date('2024-11-15');
        
        // Simular error de base de datos
        iclFindFirstMock.mockRejectedValue(new Error("Database connection error"));
        
        // Espiar console.error para verificar que se logea el error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        
        // ============ ACT ============
        const resultado = await verificaIclActual(fechaGeneracion);
        
        // ============ ASSERT ============
        
        // 1. Por seguridad, retorna false
        expect(resultado).toBe(false);
        
        // 2. Se logeo el error
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error al verificar índice ICL:',
            expect.any(Error)
        );
        
        // Limpiar spy
        consoleErrorSpy.mockRestore();
    });

    /**
     * TEST 4: Funcionar correctamente con diferentes meses
     * 
     * ESCENARIO:
     *   - Probar con diferentes fechas del año
     * 
     * RESULTADO ESPERADO: Buscar en el rango correcto para cada mes
     */
    it("deberia buscar en el rango correcto para diferentes meses", async () => {
        // ============ ARRANGE & ACT ============
        
        // Caso 1: Enero
        iclFindFirstMock.mockResolvedValue({ id: 1, fecha: new Date(2024, 0, 15) });
        await verificaIclActual(new Date(2024, 0, 15));
        
        let llamada = iclFindFirstMock.mock.calls[0][0];
        expect(llamada.where.fecha.gte).toEqual(new Date(2024, 0, 1));
        expect(llamada.where.fecha.lt).toEqual(new Date(2024, 1, 1));
        
        // Limpiar para siguiente caso
        jest.clearAllMocks();
        
        // Caso 2: Diciembre
        iclFindFirstMock.mockResolvedValue({ id: 2, fecha: new Date(2024, 11, 15) });
        await verificaIclActual(new Date(2024, 11, 20));
        
        llamada = iclFindFirstMock.mock.calls[0][0];
        expect(llamada.where.fecha.gte).toEqual(new Date(2024, 11, 1));
        expect(llamada.where.fecha.lt).toEqual(new Date(2025, 0, 1)); // Siguiente año
    });

    /**
     * TEST 5: Verificar que no importa el dia del mes
     * 
     * ESCENARIO:
     *   - Diferentes dias del mismo mes
     * 
     * RESULTADO ESPERADO: Siempre buscar en el mismo rango mensual
     */
    it("deberia buscar en el mismo rango sin importar el dia del mes", async () => {
        // ============ ARRANGE ============
        
        iclFindFirstMock.mockResolvedValue({ id: 1, fecha: new Date(2024, 10, 10) });
        
        // ============ ACT ============
        
        // Dia 1 del mes (mes 10 = noviembre, 0-indexed)
        await verificaIclActual(new Date(2024, 10, 1));
        const llamada1 = iclFindFirstMock.mock.calls[0][0];
        
        jest.clearAllMocks();
        
        // Dia 15 del mes
        await verificaIclActual(new Date(2024, 10, 15));
        const llamada2 = iclFindFirstMock.mock.calls[0][0];
        
        jest.clearAllMocks();
        
        // Ultimo dia del mes
        await verificaIclActual(new Date(2024, 10, 30));
        const llamada3 = iclFindFirstMock.mock.calls[0][0];
        
        // ============ ASSERT ============
        
        // Todas deben buscar en el mismo rango (1 nov - 1 dic)
        expect(llamada1.where.fecha.gte).toEqual(new Date(2024, 10, 1));
        expect(llamada1.where.fecha.lt).toEqual(new Date(2024, 11, 1));
        
        expect(llamada2.where.fecha.gte).toEqual(new Date(2024, 10, 1));
        expect(llamada2.where.fecha.lt).toEqual(new Date(2024, 11, 1));
        
        expect(llamada3.where.fecha.gte).toEqual(new Date(2024, 10, 1));
        expect(llamada3.where.fecha.lt).toEqual(new Date(2024, 11, 1));
    });
});
