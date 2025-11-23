# 🔧 Actualización de Tests - 22 de Noviembre 2025

## 📊 Resumen Ejecutivo

**Objetivo:** Actualizar 12 tests obsoletos después de cambios en el modelo de datos (adición de `tipoItemId` y cambios en estructura de items).

**Resultado:** ✅ **73/73 tests pasando** (100% éxito)

---

## 📝 Archivos Actualizados

### 1. `__tests__/itemRecibo-schema.test.ts` ✅

**Problema:** Test esperaba que el schema rechazara arrays vacíos de items.

**Causa:** El schema fue actualizado para permitir `items: []` porque el backend agrega automáticamente el item "Alquiler" si está vacío.

**Cambio realizado:**
```typescript
// ❌ ANTES: Esperaba que fallara
it("Debería fallar sin ítems", () => {
    const recibo = { ...reciboBase, items: [] };
    const result = ReciboSchema.safeParse(recibo);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe("Debe tener al menos un ítem (el alquiler)");
});

// ✅ AHORA: Debe pasar porque backend crea "Alquiler" automáticamente
it("Debería PERMITIR array vacío de ítems (backend agrega Alquiler automáticamente)", () => {
    const recibo = { ...reciboBase, items: [] };
    const result = ReciboSchema.safeParse(recibo);
    expect(result.success).toBe(true);
});
```

**Tests arreglados:** 1  
**Tests actualizados:** 17 en total pasando

---

### 2. `__tests__/buscarItemsRecibo.test.ts` ✅

**Problema:** Tests esperaban que la función retornara solo `{ descripcion, monto }`, pero ahora retorna estructura completa con `tipoItemId` y relación `tipoItem`.

**Causa:** La función `buscarItemsRecibo` fue actualizada para incluir información completa del tipo de item.

**Cambios realizados:**

#### Test 1: Items correctos
```typescript
// ❌ ANTES: Solo descripcion y monto
const mockItems = [
    { descripcion: "Alquiler", monto: 400000 },
    { descripcion: "Expensas", monto: 50000 }
];

// ✅ AHORA: Incluye tipoItemId y tipoItem completo
const mockItems = [
    { 
        descripcion: "Alquiler", 
        monto: 400000,
        tipoItemId: 1,
        tipoItem: {
            id: 1,
            codigo: "ALQUILER",
            nombre: "Alquiler",
            descripcion: "Monto del alquiler",
            esModificable: false,
            esEliminable: false,
            permiteNegativo: false,
            esObligatorio: true,
            orden: 1,
            color: "#3b82f6",
            activo: true
        }
    },
    // ... más items
];
```

#### Test 2: Verificación de select
```typescript
// ❌ ANTES: Solo verificaba descripcion y monto
select: {
    descripcion: true,
    monto: true
}

// ✅ AHORA: Verifica todos los campos incluyendo relación
select: {
    descripcion: true,
    monto: true,
    tipoItemId: true,
    tipoItem: {
        select: {
            id: true,
            codigo: true,
            nombre: true,
            descripcion: true,
            esModificable: true,
            esEliminable: true,
            permiteNegativo: true,
            esObligatorio: true,
            orden: true,
            color: true,
            activo: true
        }
    }
}
```

**Tests arreglados:** 3  
**Tests actualizados:** 5 en total pasando

---

### 3. `__tests__/storeRecibos-items.test.ts` ✅

**Problema:** Tests asumían que el estado inicial del store tenía `items: [{ descripcion: "Alquiler", monto: 0 }]`, pero fue cambiado a `items: []` (vacío).

**Causa:** El store fue actualizado para NO tener items por defecto. Los items ahora se cargan desde `useReciboValidation` hook o desde la base de datos.

**Cambios realizados:**

#### Test 1: Estado inicial
```typescript
// ❌ ANTES: Esperaba item Alquiler por defecto
it('Debería inicializar con un ítem de Alquiler por defecto', () => {
    expect(result.current.formValues.items).toEqual([
        { descripcion: "Alquiler", monto: 0 }
    ])
})

// ✅ AHORA: Array vacío (items se cargan desde hook/BD)
it('Debería inicializar con array vacío de items (se cargarán desde hook o BD)', () => {
    expect(result.current.formValues.items).toEqual([])
})
```

#### Test 2: addItem
```typescript
// ❌ ANTES: Sin tipoItemId
expect(result.current.formValues.items).toEqual([
    { descripcion: "Alquiler", monto: 0 },
    { descripcion: "", monto: 0 }
])

// ✅ AHORA: Con tipoItemId: 3 (EXTRA)
expect(result.current.formValues.items).toEqual([
    { descripcion: "", monto: 0, tipoItemId: 3 }
])
```

#### Test 3: removeItem
```typescript
// ❌ ANTES: Asumía item Alquiler inicial + 2 agregados
act(() => {
    result.current.addItem()
    result.current.addItem()
})
// Tenía 3 items (1 inicial + 2 agregados)

// ✅ AHORA: Agrega 3 items explícitamente
act(() => {
    result.current.addItem()
    result.current.addItem()
    result.current.addItem()
})
// Tiene 3 items (0 inicial + 3 agregados)
```

#### Test 4: updateItem
```typescript
// ❌ ANTES: Actualizaba item inicial que ya existía
const nuevoItem: ItemRecibo = { descripcion: "Expensas", monto: 50000 }
act(() => {
    result.current.updateItem(0, nuevoItem)
})

// ✅ AHORA: Primero agrega un item, luego actualiza
act(() => {
    result.current.addItem()  // <-- NUEVO: Agregar item primero
})
const nuevoItem: ItemRecibo = { descripcion: "Expensas", monto: 50000, tipoItemId: 2 }
act(() => {
    result.current.updateItem(0, nuevoItem)
})
```

#### Test 5: resetForm
```typescript
// ❌ ANTES: Reseteaba a item Alquiler
expect(result.current.formValues.items).toEqual([
    { descripcion: "Alquiler", monto: 0 }
])

// ✅ AHORA: Resetea a array vacío
expect(result.current.formValues.items).toEqual([])
```

**Tests arreglados:** 8  
**Tests actualizados:** 12 en total pasando

---

## 📊 Resumen de Cambios en el Código de Producción

### 1. Schema (src/schema/index.ts)
```typescript
// ANTES:
items: z.array(ItemReciboSchema).min(1, { 
    message: "Debe tener al menos un ítem (el alquiler)" 
})

// AHORA:
items: z.array(ItemReciboSchema)
// No requerir mínimo de 1 ítem porque el backend crea "Alquiler" automáticamente
```

### 2. buscarItemsRecibo (src/lib/buscarItemsRecibo.ts)
```typescript
// ANTES:
select: {
    descripcion: true,
    monto: true
}

// AHORA:
select: {
    descripcion: true,
    monto: true,
    tipoItemId: true,
    tipoItem: {
        select: {
            id: true,
            codigo: true,
            nombre: true,
            // ... todos los campos de tipoItem
        }
    }
}
```

### 3. Store Recibos (src/stores/storeRecibos.ts)

#### Tipo ItemRecibo
```typescript
// ANTES:
export type ItemRecibo = {
    descripcion: string
    monto: number
}

// AHORA:
export type ItemRecibo = {
    descripcion: string
    monto: number
    tipoItemId?: number
    tipoItem?: TipoItem
}
```

#### Estado inicial
```typescript
// ANTES:
items: [{ descripcion: "Alquiler", monto: 0 }]

// AHORA:
items: [] // Sin ítems iniciales - se cargarán desde useReciboValidation o BD
```

#### addItem
```typescript
// ANTES:
addItem: () => set((state) => ({
    formValues: {
        ...state.formValues,
        items: [...state.formValues.items, { descripcion: "", monto: 0 }]
    }
}))

// AHORA:
addItem: () => set((state) => ({
    formValues: {
        ...state.formValues,
        items: [...state.formValues.items, { 
            descripcion: "", 
            monto: 0, 
            tipoItemId: 3  // <-- NUEVO: tipoItemId: 3 = EXTRA
        }]
    }
}))
```

---

## 🎯 Patrones de Testing Aplicados

### Patrón 1: Actualizar mocks cuando cambia la estructura de datos
```typescript
// Cuando una función retorna más campos, los mocks deben reflejar eso
const mockCompleto = {
    descripcion: "Alquiler",
    monto: 400000,
    tipoItemId: 1,  // <-- Nuevo campo
    tipoItem: { ... } // <-- Nueva relación
}
```

### Patrón 2: Tests reflejan el comportamiento real, no el ideal
```typescript
// ❌ MAL: Test espera comportamiento que ya no existe
expect(items).toEqual([{ descripcion: "Alquiler", monto: 0 }])

// ✅ BIEN: Test refleja el comportamiento actual
expect(items).toEqual([]) // Porque ahora se inicializa vacío
```

### Patrón 3: Agregar setup explícito cuando cambió el estado inicial
```typescript
// ANTES: Item inicial existía por defecto
it("test", () => {
    // Ya había un item, solo actualizo
    updateItem(0, nuevoItem)
})

// AHORA: Sin estado inicial, hay que crearlo
it("test", () => {
    addItem() // <-- Setup explícito
    updateItem(0, nuevoItem)
})
```

---

## ✅ Lecciones Aprendidas

### 1. **Tests obsoletos son normales en proyectos activos**
Los tests reflejan el comportamiento del código en un momento específico. Cuando el código evoluciona, los tests deben evolucionar también.

### 2. **Leer el código de producción primero**
Antes de arreglar un test, siempre revisar:
- ¿Qué cambió en el código real?
- ¿Cuál es el nuevo comportamiento esperado?
- ¿Los tests reflejan ese nuevo comportamiento?

### 3. **Comentarios en el código son pistas valiosas**
```typescript
// "No requerir mínimo de 1 ítem porque el backend crea "Alquiler" automáticamente"
// "Sin ítems iniciales - se cargarán desde useReciboValidation o BD"
```
Estos comentarios explican **por qué** cambió el comportamiento.

### 4. **Actualizar tests en grupo por archivo**
En lugar de arreglar test por test:
1. Leer TODOS los tests del archivo
2. Identificar el patrón común de cambio
3. Actualizarlos todos juntos

### 5. **Verificar la suite completa al final**
Arreglar tests de un archivo puede afectar otros. Siempre ejecutar la suite completa al terminar.

---

## 🚀 Próximos Pasos Sugeridos

### Tests Adicionales (Opcional)
1. **Tests de integración**: Verificar flujo completo desde store → action → BD
2. **Tests de tipos**: Verificar que `tipoItemId` esté presente donde debe
3. **Tests de migración**: Verificar que datos antiguos (sin tipoItemId) se manejan correctamente

### Documentación
1. ✅ Crear guía de migración para items (este documento)
2. Actualizar README con nueva estructura de ItemRecibo
3. Documentar tabla `tipoItem` en esquema de BD

### Refactoring (Opcional)
1. Considerar hacer `tipoItemId` obligatorio (no opcional) en el tipo
2. Agregar validación de tipoItemId en el schema de Zod
3. Crear constantes para IDs de tipos (ALQUILER=1, EXPENSAS=2, EXTRA=3)

---

## 📈 Métricas Finales

| Métrica | Valor |
|---------|-------|
| Tests totales | 73 |
| Tests pasando | 73 ✅ |
| Tests fallando | 0 ✅ |
| Archivos actualizados | 3 |
| Tests arreglados | 12 |
| % de éxito | **100%** 🎉 |

---

## 🎓 Conclusión

La actualización de tests después de cambios en el modelo de datos es una parte normal del ciclo de desarrollo. Los cambios principales fueron:

1. **tipoItemId agregado** a la estructura de items
2. **Estado inicial vacío** en lugar de item Alquiler por defecto
3. **Validación flexible** en schema (permite arrays vacíos)
4. **Datos completos** en queries (incluye relación tipoItem)

Todos los tests fueron actualizados exitosamente para reflejar estos cambios, manteniendo 100% de cobertura y funcionalidad.

**La regla de oro:** Los tests deben reflejar la realidad del código, no nuestras suposiciones del pasado.

---

**Autor**: GitHub Copilot + Alejandro Gelormini  
**Fecha**: 22 de Noviembre de 2025  
**Versión**: 1.0
