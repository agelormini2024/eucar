let reciboCreateMock: jest.Mock;
let reciboUpdateMock: jest.Mock;
let contratoUpdateMock: jest.Mock;
let contratoFindUniqueMock: jest.Mock;

jest.mock("@/src/lib/prisma", () => {
    reciboCreateMock = jest.fn();
    reciboUpdateMock = jest.fn();
    contratoFindUniqueMock = jest.fn();
    contratoUpdateMock = jest.fn();
    return {
        prisma: {
            contrato: {
                findUnique: contratoFindUniqueMock,
                update: jest.fn(),
            },
            recibo: {
                create: reciboCreateMock,
                update: jest.fn(),
            },
            $transaction: jest.fn((cb) =>
                cb({
                    contrato: {
                        update: contratoUpdateMock,
                    },
                    recibo: {
                        create: reciboCreateMock,
                        update: reciboUpdateMock,
                    },
                })
            ),
        },
    };
});

jest.mock("@/src/lib/buscarRecibo", () => ({
    buscarReciboMesActual: jest.fn(),
}));

jest.mock("@/src/schema", () => ({
    ReciboSchema: {
        safeParse: jest.fn(),
    },
}));

import { createRecibo } from "../actions/create-recibo-action";
import { ReciboSchema } from "@/src/schema";
import { buscarReciboMesActual } from "@/src/lib/buscarRecibo";

describe("createRecibo", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Debería crear un nuevo recibo cuando no existe ningún recibo para el mes actual.", async () => {
        const input = {
            contratoId: 1,
            estadoReciboId: 1,
            fechaPendiente: "2025-07-01",
            fechaGenerado: null,
            fechaImpreso: null,
            fechaAnulado: null,
            montoAnterior: 100,
            montoTotal: 150,
            expensas: true,
            abl: false,
            aysa: false,
            luz: false,
            gas: false,
            otros: false,
            observaciones: "Observaciones",
        };

        // Arrange
        (ReciboSchema.safeParse as jest.Mock).mockReturnValue({ success: true, data: input });
        (buscarReciboMesActual as jest.Mock).mockResolvedValue(null);
        (contratoFindUniqueMock.mockResolvedValue({
            id: 1,
            mesesRestaActualizar: 3,
            tipoContrato: {
                cantidadMesesActualizacion: 6,
            },
        }));
        (reciboCreateMock.mockResolvedValue({ id: 456, ...input }));

        // Act
        const result = await createRecibo(input);

        // Assert
        expect(result).toEqual({ success: true });
        expect(buscarReciboMesActual).toHaveBeenCalledWith(input.contratoId);
        expect(reciboCreateMock).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    ...input,
                    estadoReciboId: 2, // "GENERADO"
                    fechaGenerado: expect.any(String), // o expect.any(Date) según cómo lo guardes
                    fechaPendiente: expect.any(Date), // si la función convierte a Date
                }),
            })
        );
    });
    //----------------------------------------------------------------------------------------------------------
    it("Debería modificar estadoReciboId a 2 y montoTotal cuando el recibo ya existe", async () => {
        const input = {
            contratoId: 1,
            estadoReciboId: 1,
            fechaPendiente: "2025-07-01",
            fechaGenerado: null,
            fechaImpreso: null,
            fechaAnulado: null,
            montoAnterior: 100,
            montoTotal: 150,
            expensas: true,
            abl: false,
            aysa: false,
            luz: false,
            gas: false,
            otros: false,
            observaciones: "Observaciones",
        };
        // Arrange
        (ReciboSchema.safeParse as jest.Mock).mockReturnValue({ success: true, data: input });
        (buscarReciboMesActual as jest.Mock).mockResolvedValue({ id: 3, estadoReciboId: 1, montoTotal: 100 }); // Simula que ya existe

        // Act
        const result = await createRecibo(input);
        // Asserts
        expect(result).toEqual({ success: true });
        expect(buscarReciboMesActual).toHaveBeenCalledWith(input.contratoId);

        expect(reciboUpdateMock).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 3 }, // ID del recibo que se está actualizando
                data: expect.objectContaining({
                    ...input,
                    estadoReciboId: 2, // "GENERADO"
                    fechaGenerado: expect.any(String),
                    fechaPendiente: expect.any(Date),
                }),
            })
        );
        expect(contratoUpdateMock).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: input.contratoId },
                data: expect.objectContaining({
                    montoAlquilerUltimo: input.montoTotal,
                    mesesRestaActualizar: { decrement: 1 },
                    cantidadMesesDuracion: { decrement: 1 },
                }),
            })
        );
        expect(reciboCreateMock).not.toHaveBeenCalled();
    });
    //----------------------------------------------------------------------------------------------------------
    it("debería retornar < false > si ya existe un recibo para el mes con estado <GENERADO>", async () => {
        const input = {
            contratoId: 1,
            estadoReciboId: 2,
            fechaPendiente: "2025-07-01",
            fechaGenerado: null,
            fechaImpreso: null,
            fechaAnulado: null,
            montoAnterior: 100,
            montoTotal: 150,
            expensas: true,
            abl: false,
            aysa: false,
            luz: false,
            gas: false,
            otros: false,
            observaciones: "Observaciones",
        };

        // Arrange
        (ReciboSchema.safeParse as jest.Mock).mockReturnValue({ success: true, data: input });
        (buscarReciboMesActual as jest.Mock).mockResolvedValue({ estadoReciboId: 2 }); // Simula que ya existe y que está en estado "GENERADO"

        // Act
        const result = await createRecibo(input);
        // Asserts
        expect(result).toEqual({
            errors: [
                { message: "Ya existe un recibo generado para este contrato." },
                { success: false }
            ]
        });
        expect(reciboCreateMock).not.toHaveBeenCalled();
    });
    //----------------------------------------------------------------------------------------------------------
    it("Debería devolver <false> si existe el recibo y su estado es 'Pendiente' y montoTotal es 0", async () => {
        const input = {
            contratoId: 1,
            estadoReciboId: 1,
            fechaPendiente: "2025-07-01",
            fechaGenerado: null,
            fechaImpreso: null,
            fechaAnulado: null,
            montoAnterior: 100,
            montoTotal: 0,
            expensas: true,
            abl: false,
            aysa: false,
            luz: false,
            gas: false,
            otros: false,
            observaciones: "Observaciones",
        };
        // Arrange
        (ReciboSchema.safeParse as jest.Mock).mockReturnValue({ success: true, data: input });
        (buscarReciboMesActual as jest.Mock).mockResolvedValue({ estadoReciboId: 1, montoTotal: 0 }); // Simula que ya existe

        // Act
        const result = await createRecibo(input);
        // Asserts
        expect(result).toEqual({
            errors: [
                { message: "Todavía no están los Indices necesarios para generar el recibo." },
                { success: false }
            ]
        });
        expect(reciboCreateMock).not.toHaveBeenCalled();
    })
});