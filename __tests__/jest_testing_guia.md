# 🧑‍💻 Buenas prácticas y plantilla para tests con Jest

---

## 1. **No importes helpers de test desde Node**

- **Hacé esto:**\
  Usa las funciones globales de Jest (`describe`, `it`, `expect`, etc.) sin importarlas.

---

## 2. **Estructura básica de un test**

```typescript
describe("nombreDeLaFuncion", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada test
    });

    it("debería hacer algo", async () => {
        // Arrange: configurá los mocks y los datos de entrada
        mockFunction.mockResolvedValue(valorEsperado);

        // Act: llamá a la función a testear
        const resultado = await funcionATestear(argumentos);

        // Assert: verificá el resultado y las llamadas a los mocks
        expect(resultado).toEqual(valorEsperado);
        expect(mockFunction).toHaveBeenCalledWith(argumentosEsperados);
    });
});
```

---

## 3. **Cómo mockear módulos y funciones**

- **Mocks de Prisma y otros módulos:**

```typescript
let mockFuncion: jest.Mock;

jest.mock("@/src/lib/prisma", () => {
    mockFuncion = jest.fn();
    return {
        prisma: {
            modelo: {
                metodo: mockFuncion,
            },
            // ...otros modelos y métodos
        },
    };
});
```

- **Mocks de funciones auxiliares:**

```typescript
jest.mock("@/src/lib/miFuncion", () => ({
    miFuncion: jest.fn(),
}));
```

---

## 4. **Cómo simular distintos escenarios**

- **Simular que existe un registro:**
  ```typescript
  (mockFuncion as jest.Mock).mockResolvedValue({ id: 1, estado: "activo" });
  ```
- **Simular que NO existe:**
  ```typescript
  (mockFuncion as jest.Mock).mockResolvedValue(null);
  ```
- **Simular error de validación:**
  ```typescript
  (schemaMock.safeParse as jest.Mock).mockReturnValue({ success: false, error: { issues: [...] } });
  ```

---

## 5. **Verificar llamadas y resultados**

- **Verificar que se llamó con ciertos argumentos:**
  ```typescript
  expect(mockFuncion).toHaveBeenCalledWith(argumentosEsperados);
  ```
- **Verificar que NO se llamó:**
  ```typescript
  expect(mockFuncion).not.toHaveBeenCalled();
  ```
- **Verificar tipos de valores:**
  ```typescript
  expect(objeto).toEqual(expect.objectContaining({
      fecha: expect.any(Date),
      id: expect.any(Number),
  }));
  ```

---

## 6. **Errores comunes y cómo evitarlos**

- **No importar helpers de Node.**
- **Definir los mocks ANTES de usarlos en los bloques ****\`\`****.**
- **Asegurarse de que los mocks devuelvan lo que la función espera en cada test.**
- **Limpiar los mocks con **``**.**
- **No mezclar imports de Jest y Node para helpers de test.**

---

## 7. **Plantilla para un test de error**

```typescript
it("debería retornar error si la validación falla", async () => {
    (schemaMock.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: { issues: [{ message: "Error de validación" }] }
    });

    const result = await funcionATestear({});

    expect(result).toEqual({
        errors: [{ message: "Error de validación" }]
    });
    expect(mockFuncion).not.toHaveBeenCalled();
});
```

---

## 8. **Recursos útiles**

- [Jest: Documentación oficial](https://jestjs.io/docs/es-ES/getting-started)
- [Mock Functions en Jest](https://jestjs.io/docs/es-ES/mock-functions)
- [Testing async code](https://jestjs.io/docs/es-ES/asynchronous)

