let itemReciboFindManyMock: jest.Mock;

jest.mock("@/src/lib/prisma", () => {
    itemReciboFindManyMock = jest.fn();
    return {
        prisma: {
            itemRecibo: {
                findMany: itemReciboFindManyMock,
            },
        },
    };
});

import { buscarItemsRecibo } from "../src/lib/buscarItemsRecibo";

describe("buscarItemsRecibo", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Debería devolver los ítems correctamente cuando el recibo tiene ítems", async () => {
        // Arrange
        const reciboId = 1;
        const mockItems = [
            { descripcion: "Alquiler", monto: 400000 },
            { descripcion: "Expensas", monto: 50000 },
            { descripcion: "ABL", monto: 15000 }
        ];

        itemReciboFindManyMock.mockResolvedValue(mockItems);

        // Act
        const result = await buscarItemsRecibo(reciboId);

        // Assert
        expect(result).toEqual(mockItems);
        expect(itemReciboFindManyMock).toHaveBeenCalledWith({
            where: {
                reciboId: reciboId
            },
            select: {
                descripcion: true,
                monto: true
            },
            orderBy: {
                id: 'asc'
            }
        });
    });

    it("Debería devolver array vacío cuando el recibo no tiene ítems", async () => {
        // Arrange
        const reciboId = 999;
        itemReciboFindManyMock.mockResolvedValue([]);

        // Act
        const result = await buscarItemsRecibo(reciboId);

        // Assert
        expect(result).toEqual([]);
        expect(itemReciboFindManyMock).toHaveBeenCalledWith({
            where: {
                reciboId: reciboId
            },
            select: {
                descripcion: true,
                monto: true
            },
            orderBy: {
                id: 'asc'
            }
        });
    });

    it("Debería devolver array vacío cuando hay error en la base de datos", async () => {
        // Arrange
        const reciboId = 1;
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        itemReciboFindManyMock.mockRejectedValue(new Error("Database connection error"));

        // Act
        const result = await buscarItemsRecibo(reciboId);

        // Assert
        expect(result).toEqual([]);
        expect(consoleErrorSpy).toHaveBeenCalledWith("Error al buscar ítems del recibo:", expect.any(Error));
        
        // Cleanup
        consoleErrorSpy.mockRestore();
    });

    it("Debería ordenar los ítems por ID ascendente", async () => {
        // Arrange
        const reciboId = 1;
        const mockItems = [
            { descripcion: "Alquiler", monto: 400000 },
            { descripcion: "Diferencia IPC", monto: 20000 },
            { descripcion: "Expensas", monto: 50000 }
        ];

        itemReciboFindManyMock.mockResolvedValue(mockItems);

        // Act
        const result = await buscarItemsRecibo(reciboId);

        // Assert
        expect(result).toEqual(mockItems);
        expect(itemReciboFindManyMock).toHaveBeenCalledWith(
            expect.objectContaining({
                orderBy: {
                    id: 'asc'
                }
            })
        );
    });

    it("Debería solo seleccionar los campos descripcion y monto", async () => {
        // Arrange
        const reciboId = 1;
        const mockItems = [
            { descripcion: "Alquiler", monto: 400000 }
        ];

        itemReciboFindManyMock.mockResolvedValue(mockItems);

        // Act
        await buscarItemsRecibo(reciboId);

        // Assert
        expect(itemReciboFindManyMock).toHaveBeenCalledWith(
            expect.objectContaining({
                select: {
                    descripcion: true,
                    monto: true
                }
            })
        );
    });
});