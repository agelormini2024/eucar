let ipcFindUniqueMock: jest.Mock;

jest.mock("@/src/lib/prisma", () => {
    ipcFindUniqueMock = jest.fn();
    return {
        prisma: {
            ipc: {
                findUnique: ipcFindUniqueMock,
                where: jest.fn(),
            }
        }
    }
});

//----------------------------- Fin del mock -----------------------------------------------
import { verificaIpcActual } from "../src/lib/verificaIpcActual";

// const fechaPendiente = new Date().toISOString().split('T')[0]

describe("verificaIpcActual", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("debería verificar si el IPC actual existe para fechaPendiente", async () => {
        const input = '2025-07-01'; // Cambia esta fecha según tus datos de prueba
        // Arrange
        
        (ipcFindUniqueMock as jest.Mock).mockImplementation(({ where }) => {
            if (where.annoMes === "2025-06-01") {
                return Promise.resolve({ where });
            }
            return Promise.resolve(null);
        });

        // Act
        const resultado = await verificaIpcActual(input);
        // Assert
        expect(resultado).toBe(true); // Asumiendo que el IPC existe para la fecha actual
    });

    it("debería retornar false si el IPC no existe para una fecha futura", async () => {
        const fechaFutura = "2025-08-01"; // Cambiar esta fecha según tus datos de prueba
        // Arrange
        (ipcFindUniqueMock as jest.Mock).mockImplementation(({ where }) => {
            if (where.annoMes === "2025-07-01") {
                return Promise.resolve(null);
            }
            return Promise.resolve({ where });
        });

        // Act
        const resultado = await verificaIpcActual(fechaFutura);
        // Assert
        expect(resultado).toBe(false); // Asumiendo que no hay IPC para esta fecha
    });
});