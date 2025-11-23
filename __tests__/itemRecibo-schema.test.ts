import { ItemReciboSchema, ReciboSchema } from "../src/schema";

describe("ItemReciboSchema", () => {
    describe("Validación exitosa", () => {
        it("Debería validar un ítem válido correctamente", () => {
            const itemValido = {
                descripcion: "Alquiler",
                monto: 400000
            };

            const result = ItemReciboSchema.safeParse(itemValido);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(itemValido);
            }
        });

        it("Debería validar ítem con monto negativo", () => {
            const itemConMontoNegativo = {
                descripcion: "Descuento",
                monto: -50000
            };

            const result = ItemReciboSchema.safeParse(itemConMontoNegativo);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(itemConMontoNegativo);
            }
        });

        it("Debería validar ítem con descripción larga", () => {
            const itemConDescripcionLarga = {
                descripcion: "Diferencia de actualización por índice IPC correspondiente al mes anterior",
                monto: 25000
            };

            const result = ItemReciboSchema.safeParse(itemConDescripcionLarga);

            expect(result.success).toBe(true);
        });
    });

    describe("Validación fallida", () => {
        it("Debería fallar con descripción vacía", () => {
            const itemInvalido = {
                descripcion: "",
                monto: 400000
            };

            const result = ItemReciboSchema.safeParse(itemInvalido);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe("La descripción es obligatoria");
            }
        });

        it("Debería fallar con monto cero", () => {
            const itemInvalido = {
                descripcion: "Alquiler",
                monto: 0
            };

            const result = ItemReciboSchema.safeParse(itemInvalido);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe("El monto no puede ser cero");
            }
        });

        it("Debería fallar sin descripción", () => {
            const itemInvalido = {
                monto: 400000
            };

            const result = ItemReciboSchema.safeParse(itemInvalido);

            expect(result.success).toBe(false);
        });

        it("Debería fallar sin monto", () => {
            const itemInvalido = {
                descripcion: "Alquiler"
            };

            const result = ItemReciboSchema.safeParse(itemInvalido);

            expect(result.success).toBe(false);
        });

        it("Debería fallar con tipos incorrectos", () => {
            const itemInvalido = {
                descripcion: 123,  // debería ser string
                monto: "400000"    // debería ser number
            };

            const result = ItemReciboSchema.safeParse(itemInvalido);

            expect(result.success).toBe(false);
        });
    });
});

describe("ReciboSchema - Validación de items", () => {
    // Objeto base para las pruebas
    const reciboBase = {
        contratoId: 1,
        estadoReciboId: 2,
        fechaPendiente: "2025-01-01",
        fechaGenerado: null,
        fechaImpreso: null,
        montoAnterior: 300000,
        montoTotal: 400000,
        montoPagado: 400000,
        expensas: false,
        abl: false,
        aysa: false,
        luz: false,
        gas: false,
        otros: false,
        observaciones: "Test"
    };    describe("Validación exitosa de ítems", () => {
        it("Debería validar recibo con un ítem válido", () => {
            const recibo = {
                ...reciboBase,
                items: [
                    { descripcion: "Alquiler", monto: 400000 }
                ]
            };

            const result = ReciboSchema.safeParse(recibo);

            expect(result.success).toBe(true);
        });

        it("Debería validar recibo con múltiples ítems válidos", () => {
            const recibo = {
                ...reciboBase,
                items: [
                    { descripcion: "Alquiler", monto: 400000 },
                    { descripcion: "Expensas", monto: 50000 },
                    { descripcion: "ABL", monto: 15000 }
                ]
            };

            const result = ReciboSchema.safeParse(recibo);

            expect(result.success).toBe(true);
        });

        it("Debería validar recibo con ítems de monto negativo (descuentos)", () => {
            const recibo = {
                ...reciboBase,
                items: [
                    { descripcion: "Alquiler", monto: 400000 },
                    { descripcion: "Descuento", monto: -20000 }
                ]
            };

            const result = ReciboSchema.safeParse(recibo);

            expect(result.success).toBe(true);
        });
    });

    describe("Validación fallida de ítems", () => {
        it("Debería PERMITIR array vacío de ítems (backend agrega Alquiler automáticamente)", () => {
            const recibo = {
                ...reciboBase,
                items: []
            };

            const result = ReciboSchema.safeParse(recibo);

            // CAMBIO: Ahora debe PASAR porque el backend crea "Alquiler" automáticamente
            expect(result.success).toBe(true);
        });

        it("Debería fallar si no se incluye la propiedad items", () => {
            const result = ReciboSchema.safeParse(reciboBase);

            expect(result.success).toBe(false);
        });

        it("Debería fallar con ítem inválido", () => {
            const recibo = {
                ...reciboBase,
                items: [
                    { descripcion: "", monto: 0 }  // ítem inválido
                ]
            };

            const result = ReciboSchema.safeParse(recibo);

            expect(result.success).toBe(false);
        });

        it("Debería fallar con mix de ítems válidos e inválidos", () => {
            const recibo = {
                ...reciboBase,
                items: [
                    { descripcion: "Alquiler", monto: 400000 },    // válido
                    { descripcion: "", monto: 0 }                  // inválido
                ]
            };

            const result = ReciboSchema.safeParse(recibo);

            expect(result.success).toBe(false);
        });
    });

    describe("Validación de refinement de montoTotal", () => {
        it("Debería pasar validación con estadoReciboId = 1 y montoTotal = 0", () => {
            const recibo = {
                ...reciboBase,
                estadoReciboId: 1,  // Pendiente
                montoTotal: 0,
                items: [
                    { descripcion: "Alquiler", monto: 400000 }
                ]
            };

            const result = ReciboSchema.safeParse(recibo);

            expect(result.success).toBe(true);
        });

        it("Debería fallar con estadoReciboId != 1 y montoTotal = 0", () => {
            const recibo = {
                ...reciboBase,
                estadoReciboId: 2,  // Generado
                montoTotal: 0,
                items: [
                    { descripcion: "Alquiler", monto: 400000 }
                ]
            };

            const result = ReciboSchema.safeParse(recibo);

            expect(result.success).toBe(false);
        });
    });
});