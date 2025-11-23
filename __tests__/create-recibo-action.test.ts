/**
 * TEST SUITE: createRecibo - Generacion y Regeneracion de Recibos
 * 
 * OBJETIVO:
 * Testear exhaustivamente todos los caminos posibles de la funcion createRecibo
 */

// SECCION 1: DECLARACION DE MOCKS

// Mocks de Prisma
let reciboCreateMock: jest.Mock;
let reciboUpdateMock: jest.Mock;
let contratoUpdateMock: jest.Mock;
let contratoFindUniqueMock: jest.Mock;
let itemReciboCreateManyMock: jest.Mock;
let itemReciboDeleteManyMock: jest.Mock;
let transactionMock: jest.Mock;

// Mocks de helpers externos
let buscarReciboMesActualMock: jest.Mock;
let getTipoAlquilerIdMock: jest.Mock;
let asegurarItemAlquilerMock: jest.Mock;
let calcularMontoPagadoMock: jest.Mock;
let validarMontoPagadoMock: jest.Mock;
let procesarItemsParaReciboMock: jest.Mock;

// Mock de Zod Schema
let reciboSchemaSafeParseMock: jest.Mock;

// SECCION 2: CONFIGURACION DE MOCKS

// Mock de Prisma Client
jest.mock("@/src/lib/prisma", () => {
    reciboCreateMock = jest.fn();
    reciboUpdateMock = jest.fn();
    contratoFindUniqueMock = jest.fn();
    contratoUpdateMock = jest.fn();
    itemReciboCreateManyMock = jest.fn();
    itemReciboDeleteManyMock = jest.fn();
    
    transactionMock = jest.fn((callback) => {
        const txClient = {
            contrato: {
                update: contratoUpdateMock,
                findUnique: contratoFindUniqueMock,
            },
            recibo: {
                create: reciboCreateMock,
                update: reciboUpdateMock,
            },
            itemRecibo: {
                createMany: itemReciboCreateManyMock,
                deleteMany: itemReciboDeleteManyMock,
            },
        };
        
        return callback(txClient);
    });

    return {
        prisma: {
            contrato: {
                findUnique: contratoFindUniqueMock,
                update: contratoUpdateMock,
            },
            recibo: {
                create: reciboCreateMock,
                update: reciboUpdateMock,
            },
            itemRecibo: {
                createMany: itemReciboCreateManyMock,
                deleteMany: itemReciboDeleteManyMock,
            },
            $transaction: transactionMock,
        },
    };
});

// Mock de buscarRecibo
jest.mock("@/src/lib/buscarRecibo", () => {
    buscarReciboMesActualMock = jest.fn();
    return {
        buscarReciboMesActual: buscarReciboMesActualMock,
    };
});

// Mock de reciboHelpers
jest.mock("@/src/utils/reciboHelpers", () => {
    getTipoAlquilerIdMock = jest.fn();
    asegurarItemAlquilerMock = jest.fn();
    calcularMontoPagadoMock = jest.fn();
    validarMontoPagadoMock = jest.fn();
    procesarItemsParaReciboMock = jest.fn();
    
    return {
        getTipoAlquilerId: getTipoAlquilerIdMock,
        asegurarItemAlquiler: asegurarItemAlquilerMock,
        calcularMontoPagado: calcularMontoPagadoMock,
        validarMontoPagado: validarMontoPagadoMock,
        procesarItemsParaRecibo: procesarItemsParaReciboMock,
    };
});

// Mock de Zod Schema
jest.mock("@/src/schema", () => {
    reciboSchemaSafeParseMock = jest.fn();
    return {
        ReciboSchema: {
            safeParse: reciboSchemaSafeParseMock,
        },
    };
});

// SECCION 3: IMPORTS

import { createRecibo } from "../actions/create-recibo-action";

// SECCION 4: DATOS DE PRUEBA

const TIPO_ALQUILER_ID = 1;

const inputReciboBase = {
    contratoId: 1,
    estadoReciboId: 2,
    fechaPendiente: "2025-11-01",
    montoAnterior: 100000,
    montoTotal: 150000,
    expensas: true,
    abl: false,
    aysa: false,
    luz: false,
    gas: false,
    otros: false,
    observaciones: "Test de recibo",
    items: [
        { descripcion: "Alquiler", monto: 150000 }
    ]
};

const contratoInfoMock = {
    id: 1,
    mesesRestaActualizar: 3,
    cantidadMesesDuracion: 12,
    tipoContrato: {
        cantidadMesesActualizacion: 6,
    }
};

// SUITE PRINCIPAL DE TESTS

describe("createRecibo - Suite Completa", () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Validaciones", () => {
        
        it("TEST SIMPLE - verificar que los mocks funcionan", () => {
            // Este test verifica que el setup de mocks está correcto
            expect(getTipoAlquilerIdMock).toBeDefined();
            expect(asegurarItemAlquilerMock).toBeDefined();
            expect(reciboCreateMock).toBeDefined();
        });
        
        it("deberia rechazar si el contrato no existe", async () => {
            // ARRANGE
            reciboSchemaSafeParseMock.mockReturnValue({ 
                success: true, 
                data: inputReciboBase 
            });
            getTipoAlquilerIdMock.mockResolvedValue(TIPO_ALQUILER_ID);
            asegurarItemAlquilerMock.mockResolvedValue({
                items: inputReciboBase.items
            });
            calcularMontoPagadoMock.mockReturnValue(150000);
            validarMontoPagadoMock.mockReturnValue({ success: true });
            buscarReciboMesActualMock.mockResolvedValue(null);
            contratoFindUniqueMock.mockResolvedValue(null);
            
            // ACT
            const result = await createRecibo(inputReciboBase);
            
            // ASSERT
            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
            expect(result.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        path: ['contratoId'],
                        message: "El contrato especificado no existe"
                    })
                ])
            );
            expect(reciboCreateMock).not.toHaveBeenCalled();
        });

        it("deberia rechazar si montoPagado es cero", async () => {
            // ARRANGE
            reciboSchemaSafeParseMock.mockReturnValue({ 
                success: true, 
                data: inputReciboBase 
            });
            getTipoAlquilerIdMock.mockResolvedValue(TIPO_ALQUILER_ID);
            asegurarItemAlquilerMock.mockResolvedValue({
                items: [{ descripcion: "Alquiler", monto: 0 }]
            });
            calcularMontoPagadoMock.mockReturnValue(0);
            validarMontoPagadoMock.mockReturnValue({
                success: false,
                error: "El monto a pagar debe ser mayor a cero"
            });
            
            // ACT
            const result = await createRecibo(inputReciboBase);
            
            // ASSERT
            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
            expect(result.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        path: ['items'],
                        message: "El monto a pagar debe ser mayor a cero"
                    })
                ])
            );
            expect(contratoFindUniqueMock).not.toHaveBeenCalled();
        });

        it("deberia rechazar si montoPagado es negativo", async () => {
            // ARRANGE
            const inputConDescuento = {
                ...inputReciboBase,
                items: [
                    { descripcion: "Alquiler", monto: 100000 },
                    { descripcion: "Descuento excesivo", monto: -150000 }
                ]
            };
            
            reciboSchemaSafeParseMock.mockReturnValue({ 
                success: true, 
                data: inputConDescuento 
            });
            getTipoAlquilerIdMock.mockResolvedValue(TIPO_ALQUILER_ID);
            asegurarItemAlquilerMock.mockResolvedValue({
                items: inputConDescuento.items
            });
            calcularMontoPagadoMock.mockReturnValue(-50000);
            validarMontoPagadoMock.mockReturnValue({
                success: false,
                error: "El monto a pagar no puede ser negativo"
            });
            
            // ACT
            const result = await createRecibo(inputConDescuento);
            
            // ASSERT
            expect(result.success).toBe(false);
            expect(result.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        message: "El monto a pagar no puede ser negativo"
                    })
                ])
            );
        });
    });

    // ========================================================================
    // GRUPO 2: CREACION DE RECIBOS NUEVOS (CASOS EXITOSOS)
    // ========================================================================
    
    describe("Creacion de Recibos Nuevos", () => {
        
        /**
         * TEST 4: Crear recibo GENERADO (primera vez)
         * 
         * ESCENARIO: No existe recibo para este mes, crear uno GENERADO
         * FLUJO:
         *   1. Validar datos (Zod)
         *   2. Procesar items
         *   3. Verificar que NO existe recibo previo
         *   4. Obtener info del contrato
         *   5. TRANSACCION:
         *      - Crear recibo con fechaGenerado
         *      - Crear items
         *      - Actualizar contrato (meses y monto)
         * 
         * RESULTADO ESPERADO: 
         *   - success: true
         *   - Recibo creado
         *   - Items creados
         *   - Contrato actualizado
         */
        it("deberia crear un recibo GENERADO cuando no existe ninguno para el mes", async () => {
            // ============ ARRANGE ============
            
            // 1. Configurar validacion de Zod (exitosa)
            reciboSchemaSafeParseMock.mockReturnValue({ 
                success: true, 
                data: inputReciboBase 
            });
            
            // 2. Configurar helpers (procesamiento de items)
            getTipoAlquilerIdMock.mockResolvedValue(TIPO_ALQUILER_ID);
            asegurarItemAlquilerMock.mockResolvedValue({
                items: inputReciboBase.items
            });
            calcularMontoPagadoMock.mockReturnValue(150000);
            validarMontoPagadoMock.mockReturnValue({ success: true });
            
            // 3. Simular que NO existe recibo previo
            buscarReciboMesActualMock.mockResolvedValue(null);
            
            // 4. Simular info del contrato (existe y tiene datos validos)
            contratoFindUniqueMock.mockResolvedValue(contratoInfoMock);
            
            // 5. Configurar respuestas de la transaccion
            reciboCreateMock.mockResolvedValue({ 
                id: 999, 
                contratoId: 1,
                montoTotal: 150000,
                montoPagado: 150000
            });
            
            procesarItemsParaReciboMock.mockResolvedValue([
                { 
                    reciboId: 999,
                    descripcion: "Alquiler", 
                    monto: 150000,
                    tipoItemId: TIPO_ALQUILER_ID
                }
            ]);
            
            itemReciboCreateManyMock.mockResolvedValue({ count: 1 });
            contratoUpdateMock.mockResolvedValue({ id: 1 });
            
            // ============ ACT ============
            const result = await createRecibo(inputReciboBase);
            
            // ============ ASSERT ============
            
            // 1. Verificar que el resultado es exitoso
            expect(result.success).toBe(true);
            
            // 2. Verificar que se llamo a la transaccion
            expect(transactionMock).toHaveBeenCalledTimes(1);
            
            // 3. Verificar que se creo el recibo con los datos correctos
            expect(reciboCreateMock).toHaveBeenCalledTimes(1);
            expect(reciboCreateMock).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    contratoId: inputReciboBase.contratoId,
                    estadoReciboId: 2, // GENERADO
                    montoTotal: inputReciboBase.montoTotal,
                    montoPagado: 150000,
                    fechaGenerado: expect.any(String), // Debe tener fecha de generacion
                    fechaPendiente: expect.any(Date),
                })
            });
            
            // 4. Verificar que se procesaron y crearon los items
            expect(procesarItemsParaReciboMock).toHaveBeenCalledWith(
                inputReciboBase.items,
                999, // ID del recibo creado
                TIPO_ALQUILER_ID
            );
            expect(itemReciboCreateManyMock).toHaveBeenCalledTimes(1);
            
            // 5. Verificar que se actualizo el contrato (CLAVE: solo si es GENERADO)
            expect(contratoUpdateMock).toHaveBeenCalledTimes(1);
            expect(contratoUpdateMock).toHaveBeenCalledWith({
                where: { id: inputReciboBase.contratoId },
                data: expect.objectContaining({
                    montoAlquilerUltimo: inputReciboBase.montoTotal,
                    mesesRestaActualizar: { decrement: 1 },
                    cantidadMesesDuracion: { decrement: 1 }
                })
            });
        });

        /**
         * TEST 5: Crear recibo PENDIENTE (sin actualizar contrato)
         * 
         * ESCENARIO: No existe recibo para este mes, crear uno PENDIENTE
         * DIFERENCIA CON TEST 4: 
         *   - estadoReciboId = 1 (PENDIENTE)
         *   - NO debe actualizar el contrato
         *   - fechaGenerado debe ser null
         * 
         * RESULTADO ESPERADO:
         *   - success: true
         *   - Recibo creado SIN fechaGenerado
         *   - Items creados
         *   - Contrato NO actualizado
         */
        it("deberia crear un recibo PENDIENTE sin actualizar el contrato", async () => {
            // ============ ARRANGE ============
            
            // Input con estado PENDIENTE
            const inputPendiente = {
                ...inputReciboBase,
                estadoReciboId: 1, // PENDIENTE (clave)
            };
            
            // 1. Validacion de Zod
            reciboSchemaSafeParseMock.mockReturnValue({ 
                success: true, 
                data: inputPendiente 
            });
            
            // 2. Helpers
            getTipoAlquilerIdMock.mockResolvedValue(TIPO_ALQUILER_ID);
            asegurarItemAlquilerMock.mockResolvedValue({
                items: inputPendiente.items
            });
            calcularMontoPagadoMock.mockReturnValue(150000);
            validarMontoPagadoMock.mockReturnValue({ success: true });
            
            // 3. No existe recibo previo
            buscarReciboMesActualMock.mockResolvedValue(null);
            
            // 4. Info del contrato
            contratoFindUniqueMock.mockResolvedValue(contratoInfoMock);
            
            // 5. Respuestas de transaccion
            reciboCreateMock.mockResolvedValue({ 
                id: 888, 
                contratoId: 1,
                estadoReciboId: 1 // PENDIENTE
            });
            
            procesarItemsParaReciboMock.mockResolvedValue([
                { 
                    reciboId: 888,
                    descripcion: "Alquiler", 
                    monto: 150000,
                    tipoItemId: TIPO_ALQUILER_ID
                }
            ]);
            
            itemReciboCreateManyMock.mockResolvedValue({ count: 1 });
            
            // ============ ACT ============
            const result = await createRecibo(inputPendiente);
            
            // ============ ASSERT ============
            
            // 1. Resultado exitoso
            expect(result.success).toBe(true);
            
            // 2. Recibo creado con fechaGenerado = null (PENDIENTE)
            expect(reciboCreateMock).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    contratoId: inputPendiente.contratoId,
                    estadoReciboId: 1, // PENDIENTE
                    fechaGenerado: null, // CLAVE: sin fecha de generacion
                })
            });
            
            // 3. Items creados
            expect(itemReciboCreateManyMock).toHaveBeenCalledTimes(1);
            
            // 4. CLAVE: El contrato NO debe actualizarse (porque es PENDIENTE)
            expect(contratoUpdateMock).not.toHaveBeenCalled();
        });
    });

    // ========================================================================
    // GRUPO 3: REGENERACION DE RECIBOS
    // ========================================================================
    
    describe("Regeneracion de Recibos", () => {
        
        /**
         * TEST 6: Actualizar recibo PENDIENTE a GENERADO (regeneracion exitosa)
         * 
         * ESCENARIO: 
         *   - Ya existe un recibo PENDIENTE del mes actual
         *   - Llegaron los indices necesarios
         *   - Regenero el recibo con el monto correcto
         * 
         * FLUJO:
         *   1. Validar datos
         *   2. Procesar items
         *   3. Verificar que SÍ existe recibo PENDIENTE
         *   4. TRANSACCION:
         *      - ACTUALIZAR recibo existente (no crear)
         *      - BORRAR items antiguos (deleteMany)
         *      - CREAR items nuevos (createMany)
         *      - ACTUALIZAR contrato (porque ahora es GENERADO)
         * 
         * RESULTADO ESPERADO:
         *   - success: true
         *   - Recibo actualizado (update, no create)
         *   - Items reemplazados
         *   - Contrato actualizado
         */
        it("deberia actualizar un recibo PENDIENTE a GENERADO (regeneracion)", async () => {
            // ============ ARRANGE ============
            
            // Simular que existe un recibo PENDIENTE previo
            const reciboPendienteExistente = {
                id: 777,
                contratoId: 1,
                estadoReciboId: 1, // PENDIENTE
                montoTotal: 100000, // Monto viejo (estimado)
                fechaGenerado: null
            };
            
            // Input con nuevo monto (regeneracion)
            const inputRegeneracion = {
                ...inputReciboBase,
                estadoReciboId: 2, // Ahora pasa a GENERADO
                montoTotal: 150000, // Nuevo monto calculado
            };
            
            // 1. Validacion de Zod
            reciboSchemaSafeParseMock.mockReturnValue({ 
                success: true, 
                data: inputRegeneracion 
            });
            
            // 2. Helpers
            getTipoAlquilerIdMock.mockResolvedValue(TIPO_ALQUILER_ID);
            asegurarItemAlquilerMock.mockResolvedValue({
                items: inputRegeneracion.items
            });
            calcularMontoPagadoMock.mockReturnValue(150000);
            validarMontoPagadoMock.mockReturnValue({ success: true });
            
            // 3. CLAVE: Existe recibo PENDIENTE
            buscarReciboMesActualMock.mockResolvedValue(reciboPendienteExistente);
            
            // 4. Info del contrato
            contratoFindUniqueMock.mockResolvedValue(contratoInfoMock);
            
            // 5. Respuestas de transaccion
            reciboUpdateMock.mockResolvedValue({ 
                id: 777, // Mismo ID (actualizado)
                contratoId: 1,
                estadoReciboId: 2, // Ahora GENERADO
                montoTotal: 150000
            });
            
            procesarItemsParaReciboMock.mockResolvedValue([
                { 
                    reciboId: 777,
                    descripcion: "Alquiler", 
                    monto: 150000,
                    tipoItemId: TIPO_ALQUILER_ID
                }
            ]);
            
            itemReciboDeleteManyMock.mockResolvedValue({ count: 1 });
            itemReciboCreateManyMock.mockResolvedValue({ count: 1 });
            contratoUpdateMock.mockResolvedValue({ id: 1 });
            
            // ============ ACT ============
            const result = await createRecibo(inputRegeneracion);
            
            // ============ ASSERT ============
            
            // 1. Resultado exitoso
            expect(result.success).toBe(true);
            
            // 2. CLAVE: Se actualizo el recibo (NO se creo uno nuevo)
            expect(reciboUpdateMock).toHaveBeenCalledTimes(1);
            expect(reciboUpdateMock).toHaveBeenCalledWith({
                where: { id: 777 }, // ID del recibo existente
                data: expect.objectContaining({
                    contratoId: inputRegeneracion.contratoId,
                    estadoReciboId: 2, // Ahora GENERADO
                    montoTotal: 150000, // Nuevo monto
                    montoPagado: 150000,
                    fechaGenerado: expect.any(String), // Ahora tiene fecha
                })
            });
            
            // 3. NO se creo recibo nuevo
            expect(reciboCreateMock).not.toHaveBeenCalled();
            
            // 4. CLAVE: Se borraron items viejos y se crearon nuevos
            expect(itemReciboDeleteManyMock).toHaveBeenCalledTimes(1);
            expect(itemReciboDeleteManyMock).toHaveBeenCalledWith({
                where: { reciboId: 777 } // Borrar items del recibo existente
            });
            
            expect(itemReciboCreateManyMock).toHaveBeenCalledTimes(1);
            
            // 5. Se actualizo el contrato (porque paso a GENERADO)
            expect(contratoUpdateMock).toHaveBeenCalledTimes(1);
            expect(contratoUpdateMock).toHaveBeenCalledWith({
                where: { id: inputRegeneracion.contratoId },
                data: expect.objectContaining({
                    montoAlquilerUltimo: inputRegeneracion.montoTotal,
                    mesesRestaActualizar: { decrement: 1 },
                    cantidadMesesDuracion: { decrement: 1 }
                })
            });
        });

        /**
         * TEST 7: Actualizar recibo PENDIENTE que sigue PENDIENTE
         * 
         * ESCENARIO:
         *   - Existe recibo PENDIENTE
         *   - Regenero pero SIGUE siendo PENDIENTE (monto = 0 porque no hay indices)
         * 
         * DIFERENCIA CON TEST 6:
         *   - estadoReciboId sigue siendo 1
         *   - NO debe actualizar el contrato
         * 
         * RESULTADO ESPERADO:
         *   - Recibo actualizado
         *   - Items reemplazados
         *   - Contrato NO actualizado
         */
        it("deberia actualizar un recibo PENDIENTE que sigue PENDIENTE", async () => {
            // ============ ARRANGE ============
            
            const reciboPendienteExistente = {
                id: 666,
                contratoId: 1,
                estadoReciboId: 1,
                montoTotal: 0
            };
            
            // Input que sigue PENDIENTE
            const inputSiguePendiente = {
                ...inputReciboBase,
                estadoReciboId: 1, // Sigue PENDIENTE
                montoTotal: 0,
                items: [{ descripcion: "Alquiler", monto: 0 }]
            };
            
            // Validacion y helpers
            reciboSchemaSafeParseMock.mockReturnValue({ 
                success: true, 
                data: inputSiguePendiente 
            });
            
            getTipoAlquilerIdMock.mockResolvedValue(TIPO_ALQUILER_ID);
            asegurarItemAlquilerMock.mockResolvedValue({
                items: inputSiguePendiente.items
            });
            calcularMontoPagadoMock.mockReturnValue(0);
            
            // NOTA: Esto normalmente fallaría la validación, pero para este test
            // asumimos que hay una excepción para recibos PENDIENTES con monto 0
            validarMontoPagadoMock.mockReturnValue({ success: true });
            
            buscarReciboMesActualMock.mockResolvedValue(reciboPendienteExistente);
            contratoFindUniqueMock.mockResolvedValue(contratoInfoMock);
            
            reciboUpdateMock.mockResolvedValue({ 
                id: 666,
                estadoReciboId: 1
            });
            
            procesarItemsParaReciboMock.mockResolvedValue([
                { 
                    reciboId: 666,
                    descripcion: "Alquiler", 
                    monto: 0,
                    tipoItemId: TIPO_ALQUILER_ID
                }
            ]);
            
            itemReciboDeleteManyMock.mockResolvedValue({ count: 1 });
            itemReciboCreateManyMock.mockResolvedValue({ count: 1 });
            
            // ============ ACT ============
            const result = await createRecibo(inputSiguePendiente);
            
            // ============ ASSERT ============
            
            // 1. Exitoso
            expect(result.success).toBe(true);
            
            // 2. Recibo actualizado
            expect(reciboUpdateMock).toHaveBeenCalledTimes(1);
            expect(reciboUpdateMock).toHaveBeenCalledWith({
                where: { id: 666 },
                data: expect.objectContaining({
                    estadoReciboId: 1, // Sigue PENDIENTE
                    fechaGenerado: null, // Sin fecha de generacion
                })
            });
            
            // 3. Items reemplazados
            expect(itemReciboDeleteManyMock).toHaveBeenCalledTimes(1);
            expect(itemReciboCreateManyMock).toHaveBeenCalledTimes(1);
            
            // 4. CLAVE: Contrato NO actualizado (sigue PENDIENTE)
            expect(contratoUpdateMock).not.toHaveBeenCalled();
        });

        /**
         * TEST 8: Rechazar si el recibo ya esta GENERADO
         * 
         * ESCENARIO:
         *   - Existe recibo GENERADO (ya cobrado o listo para cobrar)
         *   - Intento regenerarlo
         * 
         * RESULTADO ESPERADO:
         *   - Error: "Ya existe un recibo generado"
         *   - NO se modifica nada
         */
        it("deberia rechazar si ya existe un recibo GENERADO para el mes", async () => {
            // ============ ARRANGE ============
            
            // Simular que existe recibo GENERADO
            const reciboGeneradoExistente = {
                id: 555,
                contratoId: 1,
                estadoReciboId: 2, // GENERADO
                montoTotal: 150000
            };
            
            // Validacion y helpers
            reciboSchemaSafeParseMock.mockReturnValue({ 
                success: true, 
                data: inputReciboBase 
            });
            
            getTipoAlquilerIdMock.mockResolvedValue(TIPO_ALQUILER_ID);
            asegurarItemAlquilerMock.mockResolvedValue({
                items: inputReciboBase.items
            });
            calcularMontoPagadoMock.mockReturnValue(150000);
            validarMontoPagadoMock.mockReturnValue({ success: true });
            
            // CLAVE: Existe recibo GENERADO
            buscarReciboMesActualMock.mockResolvedValue(reciboGeneradoExistente);
            
            contratoFindUniqueMock.mockResolvedValue(contratoInfoMock);
            
            // ============ ACT ============
            const result = await createRecibo(inputReciboBase);
            
            // ============ ASSERT ============
            
            // 1. Resultado es error
            expect(result.success).toBeUndefined(); // No tiene success: true
            expect(result.errors).toBeDefined();
            expect(result.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        message: "Ya existe un recibo generado para este contrato."
                    })
                ])
            );
            
            // 2. NO se modifico nada
            expect(reciboUpdateMock).not.toHaveBeenCalled();
            expect(reciboCreateMock).not.toHaveBeenCalled();
            expect(itemReciboDeleteManyMock).not.toHaveBeenCalled();
            expect(itemReciboCreateManyMock).not.toHaveBeenCalled();
            expect(contratoUpdateMock).not.toHaveBeenCalled();
        });
    });
});
