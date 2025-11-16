# 🧾 Sistema de Recibos

Documentación completa de la lógica de negocio, estados, validaciones y flujos del sistema de generación de recibos.

---

## 📋 Descripción General

El sistema de recibos es el núcleo del negocio de EUCAR. Gestiona la generación automática de recibos de alquiler con:

- ✅ **Cálculo automático** de ajustes por IPC/ICL
- ✅ **Gestión de estados** (PENDIENTE → GENERADO → PAGADO → IMPRESO)
- ✅ **Regeneración inteligente** de recibos pendientes
- ✅ **Validaciones de negocio** robustas
- ✅ **Actualización automática** de contratos
- ✅ **Items tipificados** con inferencia automática

---

## 🔄 Estados del Recibo

### Ciclo de Vida

```
┌─────────────┐
│  PENDIENTE  │ ← Recibo creado, puede regenerarse
│   (ID: 1)   │
└──────┬──────┘
       │ Generar definitivamente
       ↓
┌─────────────┐
│  GENERADO   │ ← Recibo final, actualiza contrato
│   (ID: 2)   │   (INMUTABLE)
└──────┬──────┘
       │ Inquilino paga
       ↓
┌─────────────┐
│   PAGADO    │ ← Marcado como pagado
│   (ID: 3)   │   (INMUTABLE)
└──────┬──────┘
       │ Imprimir/Enviar
       ↓
┌─────────────┐
│  IMPRESO    │ ← Documento entregado
│   (ID: 4)   │   (INMUTABLE)
└─────────────┘

      En cualquier momento:
           ↓
┌─────────────┐
│  ANULADO    │ ← Recibo cancelado
│   (ID: 5)   │   (TERMINAL)
└─────────────┘
```

### Detalles de Estados

| Estado | ID | Descripción | ¿Mutable? | Actualiza Contrato |
|--------|----|----|-----------|-------------------|
| **PENDIENTE** | 1 | Recibo en borrador, puede regenerarse con nuevos índices | ✅ Sí | ❌ No |
| **GENERADO** | 2 | Recibo definitivo con monto final calculado | ❌ No | ✅ Sí |
| **PAGADO** | 3 | Inquilino realizó el pago | ❌ No | ❌ No |
| **IMPRESO** | 4 | Recibo impreso o enviado al inquilino | ❌ No | ❌ No |
| **ANULADO** | 5 | Recibo cancelado, no es válido | ❌ No | ⚠️ Revierte |

### Transiciones Permitidas

```typescript
// ✅ Permitidas
PENDIENTE → GENERADO
PENDIENTE → ANULADO
GENERADO → PAGADO
GENERADO → ANULADO
PAGADO → IMPRESO
PAGADO → ANULADO
IMPRESO → ANULADO

// ❌ No permitidas
GENERADO → PENDIENTE  // No se puede "desgenerar"
PAGADO → GENERADO     // No se puede retroceder
ANULADO → cualquier   // Estado terminal
```

---

## 🎯 Lógica de Generación de Recibos

### 3 Casos Principales

El sistema maneja 3 escenarios al generar un recibo:

#### Caso 1: No Existe Recibo del Mes

**Condición:** No hay recibo creado para el contrato en el mes actual.

**Acción:** Crear nuevo recibo.

```typescript
if (!existeRecibo) {
    await crearNuevoRecibo(tx, reciboData, items, nuevoValorMeses, tipoAlquilerId)
    return { success: true }
}
```

**Flujo:**
1. Crear registro en tabla `Recibo`
2. Crear items asociados (`ItemRecibo`)
3. Si estado = GENERADO → actualizar contrato
4. Si estado = PENDIENTE → no actualizar contrato

---

#### Caso 2: Existe Recibo PENDIENTE (Regeneración)

**Condición:** Ya existe un recibo en estado PENDIENTE para el mes.

**Acción:** Actualizar el recibo existente con nuevos cálculos.

```typescript
if (existeRecibo.estadoReciboId === 1) {
    await actualizarReciboPendiente(tx, existeRecibo.id, reciboData, items, nuevoValorMeses, tipoAlquilerId)
    return { success: true }
}
```

**¿Por qué regenerar?**
- El usuario puede estar esperando índices actualizados (IPC/ICL)
- Permite ajustar el recibo antes de "generarlo" definitivamente
- No afecta el contrato hasta que se marca como GENERADO

**Flujo de Regeneración:**
1. Actualizar registro de `Recibo`
2. **Eliminar** items antiguos (`deleteMany`)
3. **Crear** nuevos items con valores actualizados
4. Si pasa a GENERADO → actualizar contrato
5. Si sigue PENDIENTE → contrato sin cambios

---

#### Caso 3: Ya Existe Recibo GENERADO/PAGADO/IMPRESO

**Condición:** Ya existe un recibo en estado final para el mes.

**Acción:** Rechazar la operación.

```typescript
if (existeRecibo.estadoReciboId === 2) {
    return {
        errors: [{
            message: "Ya existe un recibo generado para este contrato."
        }],
        success: false
    }
}
```

**Razón:** Los recibos generados son **inmutables** para mantener integridad contable.

---

## ✏️ Edición de Recibos

### Reglas de Edición

⚠️ **Solo se pueden editar recibos en estado PENDIENTE**

```typescript
// ✅ PERMITIDO: Editar recibo PENDIENTE
if (recibo.estadoReciboId === 1) {
    // Se puede modificar items, observaciones, servicios
}

// ❌ NO PERMITIDO: Editar recibo GENERADO/PAGADO/IMPRESO
if (recibo.estadoReciboId === 2 || recibo.estadoReciboId === 3 || recibo.estadoReciboId === 4) {
    return {
        success: false,
        errors: [{
            message: "Solo se pueden editar recibos en estado 'Pendiente'"
        }]
    }
}
```

---

### ¿Qué se puede editar?

#### ✅ PERMITIDO

| Campo/Item | ¿Se puede editar? | Notas |
|------------|-------------------|-------|
| **Items EXTRA** | ✅ Sí | Agregar, modificar, eliminar |
| **Items REINTEGRO** | ✅ Sí | Agregar, modificar, eliminar (montos negativos) |
| **Observaciones** | ✅ Sí | Texto libre |
| **Servicios incluidos** | ✅ Sí | Checkboxes (expensas, ABL, etc.) |
| **montoPagado** | 🔄 Auto | Se recalcula automáticamente |

#### ❌ NO PERMITIDO

| Campo/Item | ¿Se puede editar? | Razón |
|------------|-------------------|-------|
| **Item Alquiler** | ❌ No | Se genera automáticamente por el sistema |
| **montoTotal** | ❌ No | Calculado por IPC/ICL |
| **montoAnterior** | ❌ No | Dato histórico inmutable |
| **contratoId** | ❌ No | No se puede cambiar de contrato |
| **Estado del contrato** | ❌ No | Solo se actualiza al GENERAR |

---

### Lógica de Edición

```typescript
export async function updateRecibo(id: number, data: unknown) {
    // 1. Validar datos
    const result = ReciboSchema.safeParse(data)
    
    // 2. Filtrar items del usuario (SIN el Alquiler)
    const itemsSinAlquiler = filtrarItemsSinAlquiler(result.data.items)
    
    // 3. Asegurar que existe el item "Alquiler" con monto correcto
    const resultadoItems = await asegurarItemAlquiler(
        itemsSinAlquiler,
        result.data.montoTotal, // Monto calculado por sistema
        tipoAlquilerId
    )
    
    // 4. Calcular montoPagado automáticamente
    const montoPagado = calcularMontoPagado(resultadoItems.items)
    // montoPagado = Item Alquiler + Items EXTRA + Items REINTEGRO
    
    // 5. Transacción
    await prisma.$transaction(async (tx) => {
        // Verificar que sea PENDIENTE
        if (existingRecibo.estadoReciboId !== 1) {
            throw new Error("Solo se pueden editar recibos PENDIENTES")
        }
        
        // Actualizar recibo (sin tocar el contrato)
        await tx.recibo.update({
            where: { id },
            data: {
                ...updateData,
                montoPagado // Automático
            }
        })
        
        // Reemplazar items
        await tx.itemRecibo.deleteMany({ where: { reciboId: id } })
        await tx.itemRecibo.createMany({
            data: itemsConTipoItemId // Con inferencia automática
        })
    })
}
```

---

### Ejemplo de Edición

**Situación inicial:**

```javascript
Recibo PENDIENTE:
  - Alquiler: $105,000 (generado por sistema)
  - Total a pagar: $105,000
```

**Usuario agrega servicios:**

```javascript
Items editados por usuario:
  - ABL: $5,000
  - Gastos de limpieza: $3,000
  - Descuento pago anticipado: -$2,000
```

**Resultado final:**

```javascript
Items finales del recibo:
  - Alquiler: $105,000 (automático, NO modificado por usuario)
  - ABL: $5,000
  - Gastos de limpieza: $3,000
  - Descuento pago anticipado: -$2,000
  
montoTotal: $105,000 (inmutable, calculado por IPC/ICL)
montoPagado: $111,000 (automático: 105000 + 5000 + 3000 - 2000)
```

---

### Diferencia: Edición vs Regeneración

| Aspecto | **Edición** | **Regeneración** |
|---------|------------|------------------|
| **Acción** | `updateRecibo()` | `createRecibo()` con estado PENDIENTE |
| **¿Cuándo?** | Modificar items/servicios | Aplicar nuevos índices IPC/ICL |
| **Item Alquiler** | Mantiene monto actual | Recalcula con nuevos índices |
| **montoTotal** | No cambia | ✅ Cambia si hay nuevo índice |
| **Actualiza contrato** | ❌ No | ❌ No (solo GENERADO actualiza) |
| **Típico uso** | Agregar servicios extras | Esperar índices actualizados |

**Ejemplo:**

```typescript
// EDICIÓN: Solo cambia items extras
// montoTotal sigue siendo $105,000
await updateRecibo(reciboId, {
    items: [
        { descripcion: "ABL", monto: 5000 }
    ]
})

// REGENERACIÓN: Recalcula montoTotal con nuevo IPC
// Si IPC subió 3% → montoTotal pasa a $108,150
await createRecibo({
    contratoId,
    estadoReciboId: 1 // PENDIENTE
})
```

---

## 💰 Cálculo de Montos

### Tres Montos Diferentes

Un recibo tiene 3 montos con propósitos distintos:

```typescript
{
  montoTotal: 105000,    // Alquiler calculado por sistema
  montoAnterior: 100000, // Alquiler del mes anterior (referencia)
  montoPagado: 108000    // Total a pagar (suma de items)
}
```

#### 1. `montoTotal` - Alquiler Calculado

**Cálculo:** Sistema aplica fórmula según tipo de índice.

**3 Escenarios:**

##### A) Primer Recibo (sin historial)

```typescript
montoTotal = contrato.montoAlquilerInicial
montoAnterior = contrato.montoAlquilerInicial
```

**Ejemplo:**
- Contrato nuevo con alquiler inicial de $100,000
- `montoTotal = $100,000`
- `montoAnterior = $100,000`

---

##### B) Recibo CON Ajuste (mesesRestaActualizar = 0)

**Fórmula IPC (anual):**

```typescript
// Obtener IPC de últimos N meses
const mesesActualizacion = contrato.tipoContrato.cantidadMesesActualizacion

// Ejemplo: 12 meses
const ipcs = await obtenerIPCUltimosMeses(mesesActualizacion)
// [2.4, 3.73, 2.78, 4.2, 3.5, 2.9, 3.1, 2.6, 3.8, 2.5, 3.2, 2.7]

// Convertir porcentajes a coeficientes
const coeficientes = ipcs.map(ipc => 1 + (ipc / 100))
// [1.024, 1.0373, 1.0278, 1.042, ...]

// Multiplicar todos los coeficientes
const coeficienteAcumulado = coeficientes.reduce((acc, coef) => acc * coef, 1)
// ≈ 1.385

// Aplicar al alquiler anterior
montoTotal = montoAnterior * coeficienteAcumulado
// = 100000 * 1.385 = 138500

// Actualizar contador
contrato.mesesRestaActualizar = mesesActualizacion // Reset a 12
```

**Fórmula ICL (semestral):**

```typescript
// Obtener ICL de fecha de inicio del contrato
const iclInicio = await obtenerICL(contrato.fechaInicio)
// iclInicio.indice = 1.123456

// Obtener ICL actual (mes del recibo)
const iclActual = await obtenerICL(fechaRecibo)
// iclActual.indice = 1.234567

// Calcular ajuste
const coeficienteICL = iclActual.indice / iclInicio.indice
// = 1.234567 / 1.123456 ≈ 1.099

montoTotal = montoAnterior * coeficienteICL
// = 100000 * 1.099 = 109900

// Actualizar contador
contrato.mesesRestaActualizar = mesesActualizacion // Reset a 6
```

---

##### C) Recibo SIN Ajuste (mesesRestaActualizar > 0)

```typescript
montoTotal = montoAnterior
contrato.mesesRestaActualizar-- // Decrementar contador
```

**Ejemplo:**
- Alquiler mes anterior: $100,000
- Faltan 8 meses para ajuste
- `montoTotal = $100,000`
- `mesesRestaActualizar = 7` (se decrementa)

---

#### 2. `montoPagado` - Total a Pagar

**Cálculo:** Suma de **todos** los items del recibo.

```typescript
const montoPagado = items.reduce((sum, item) => sum + item.monto, 0)
```

**Ejemplo:**

```javascript
Items:
  - Alquiler: $105,000
  - ABL: $5,000
  - Descuento pago anticipado: -$2,000
  - Gastos de limpieza: $3,000
  
montoPagado = 105000 + 5000 - 2000 + 3000 = $111,000
```

**Diferencia con `montoTotal`:**
- `montoTotal`: Solo el alquiler base
- `montoPagado`: Incluye extras, descuentos, servicios

---

#### 3. `montoAnterior` - Referencia Histórica

**Valor:** Último `montoTotal` del mes anterior.

**Uso:**
- Base para calcular el nuevo ajuste
- Referencia visual para el usuario
- Auditoría de evolución del alquiler

```typescript
montoAnterior = ultimoRecibo?.montoTotal || contrato.montoAlquilerInicial
```

---

## 🏷️ Items del Recibo

### Item ALQUILER (Automático)

Cada recibo **siempre** incluye un item "Alquiler" generado automáticamente:

```typescript
const itemAlquiler = {
    descripcion: "Alquiler",
    monto: montoTotal, // Calculado con ajuste IPC/ICL
    tipoItemId: tipoAlquilerId
}

const itemsFinales = [
    itemAlquiler,
    ...itemsDelUsuario  // Items extras, descuentos, servicios
]
```

**Características:**
- `esModificable: false` - Usuario no puede editar
- `esEliminable: false` - Usuario no puede eliminar
- `permiteNegativo: false` - Siempre positivo
- `esObligatorio: true` - Debe existir en todo recibo

---

### Items Adicionales (Opcionales)

El usuario puede agregar:

| Tipo | Ejemplos | Monto | tipoItemId |
|------|----------|-------|-----------|
| **EXTRA** | Gastos de limpieza, reparaciones | Positivo | Automático (monto ≥ 0) |
| **REINTEGRO** | Descuentos, bonificaciones, devoluciones | Negativo | Automático (monto < 0) |
| **SERVICIO** | ABL, expensas, AYSA, luz, gas | Positivo | Manual (futuro) |

---

### Inferencia Automática de Tipos

Al crear/actualizar un recibo, el sistema **determina automáticamente** el tipo de cada item:

```typescript
async function determinarTipoItem(item: ItemData, tipoAlquilerId: number): Promise<number> {
    // 1. Si ya tiene tipo → respetarlo
    if (item.tipoItemId) return item.tipoItemId
    
    // 2. Si es "Alquiler" → ALQUILER
    if (esItemAlquiler(item)) return tipoAlquilerId
    
    // 3. Si monto < 0 → REINTEGRO
    if (item.monto < 0) return await getTipoItemId('REINTEGRO')
    
    // 4. Por defecto → EXTRA
    return await getTipoItemId('EXTRA')
}
```

**Reglas:**
- ✅ Descripción = "Alquiler" → `ALQUILER`
- ✅ Monto negativo → `REINTEGRO`
- ✅ Monto positivo (no alquiler) → `EXTRA`

---

## ✅ Validaciones de Negocio

### 1. Validación de Monto Total

```typescript
if (montoPagado < 0) {
    return {
        success: false,
        errors: [{
            path: ['items'],
            message: "El monto total a pagar debe ser mayor o igual a cero. Verifique los descuentos aplicados."
        }]
    }
}
```

**Razón:** Un recibo nunca puede tener total negativo (el sistema le debe al inquilino).

---

### 2. Validación de Contrato Existente

```typescript
const contratoInfo = await prisma.contrato.findUnique({
    where: { id: reciboData.contratoId }
})

if (!contratoInfo) {
    return {
        success: false,
        errors: [{
            path: ['contratoId'],
            message: "El contrato especificado no existe"
        }]
    }
}
```

---

### 3. Validación de Recibo Duplicado

```typescript
const existeRecibo = await buscarReciboMesActual(reciboData.contratoId)

if (existeRecibo && existeRecibo.estadoReciboId !== 1) {
    return {
        success: false,
        errors: [{
            message: "Ya existe un recibo generado para este contrato."
        }]
    }
}
```

**Excepción:** Se permite si el recibo existente está en estado PENDIENTE (regeneración).

---

### 4. Validación de Items

```typescript
// Item ALQUILER es obligatorio
const tieneAlquiler = items.some(item => esItemAlquiler(item))
if (!tieneAlquiler) {
    // Se agrega automáticamente
}

// Montos coherentes con tipo
items.forEach(item => {
    if (!permiteMontoNegativo(item) && item.monto < 0) {
        throw new Error(`Item ${item.descripcion} no permite montos negativos`)
    }
})
```

---

## 🔄 Actualización del Contrato

### Cuándo se Actualiza

El contrato se actualiza **solo cuando un recibo pasa a estado GENERADO (ID: 2)**.

```typescript
if (reciboData.estadoReciboId === 2) {
    await tx.contrato.update({
        where: { id: reciboData.contratoId },
        data: {
            montoAlquilerUltimo: reciboData.montoTotal,
            mesesRestaActualizar: nuevoValorMeses,
            cantidadMesesDuracion: { decrement: 1 }
        }
    })
}
```

### Campos Actualizados

#### 1. `montoAlquilerUltimo`

```typescript
montoAlquilerUltimo = reciboData.montoTotal
```

**Propósito:**
- Guardar el último monto calculado
- Usar como base para próximo recibo
- Historial de evolución del alquiler

---

#### 2. `mesesRestaActualizar`

**Lógica:**

```typescript
const mesesActual = contrato.mesesRestaActualizar
const mesesReset = contrato.tipoContrato.cantidadMesesActualizacion

const nuevoValorMeses = (mesesActual > 0)
    ? { decrement: 1 }  // Decrementar contador
    : mesesReset        // Resetear después de ajuste
```

**Ejemplo con TipoContrato Anual (12 meses):**

| Recibo | mesesRestaActualizar (antes) | ¿Ajusta? | mesesRestaActualizar (después) |
|--------|------------------------------|----------|--------------------------------|
| 1      | 11                           | ❌ No    | 10                             |
| 2      | 10                           | ❌ No    | 9                              |
| ...    | ...                          | ...      | ...                            |
| 11     | 1                            | ❌ No    | 0                              |
| 12     | 0                            | ✅ **Sí** | 12 (reset)                   |
| 13     | 11                           | ❌ No    | 10                             |

---

#### 3. `cantidadMesesDuracion`

```typescript
cantidadMesesDuracion: { decrement: 1 }
```

**Propósito:**
- Contador de meses restantes del contrato
- Al llegar a 0 → contrato vencido
- Alertas de renovación

**Ejemplo:**
- Contrato de 24 meses
- Después de recibo 1: `cantidadMesesDuracion = 23`
- Después de recibo 24: `cantidadMesesDuracion = 0` → **Vencido**

---

## 🗑️ Eliminación de Recibos

### Lógica de Delete

**Archivo:** `delete-recibo-action.ts`

#### Validaciones

```typescript
// 1. No se puede eliminar si está PAGADO o IMPRESO
if (recibo.estadoReciboId === 3 || recibo.estadoReciboId === 4) {
    return {
        success: false,
        errors: [{ message: "No se puede eliminar un recibo en estado 'Pagado' o 'Impreso'" }]
    }
}
```

#### Reversión del Contrato

Al eliminar un recibo GENERADO, se **revierte** la actualización del contrato:

```typescript
const tc = await tx.tipoContrato.findFirst({
    where: { id: contrato.tipoContratoId }
})

// Calcular nuevo valor de mesesRestaActualizar
const nuevoMesesRestaActualizar = 
    tc.cantidadMesesActualizacion === contrato.mesesRestaActualizar 
        ? 0  // Si se había reseteado → volver a 0
        : contrato.mesesRestaActualizar + 1  // Sino → incrementar

await tx.contrato.update({
    where: { id: recibo.contratoId },
    data: {
        mesesRestaActualizar: nuevoMesesRestaActualizar,
        cantidadMesesDuracion: { increment: 1 },  // Restaurar mes
        montoAlquilerUltimo: ultimoRecibo?.montoTotal || 0  // Volver a monto anterior
    }
})
```

#### Eliminar Items

```typescript
// Cascade delete configurado en schema
await tx.itemRecibo.deleteMany({
    where: { reciboId: id }
})

await tx.recibo.delete({
    where: { id }
})
```

---

## 📊 Ejemplos Completos

### Ejemplo 1: Primer Recibo (Sin Ajuste)

**Contexto:**
- Contrato nuevo
- Alquiler inicial: $100,000
- TipoContrato: Anual (12 meses)
- Sin historial

**Cálculo:**

```typescript
// 1. No hay recibo anterior
montoAnterior = contrato.montoAlquilerInicial // $100,000

// 2. No hay ajuste (mesesRestaActualizar = 11, no es 0)
montoTotal = montoAnterior // $100,000

// 3. Items
items = [
    { descripcion: "Alquiler", monto: 100000, tipoItemId: ALQUILER }
]

// 4. Total a pagar
montoPagado = 100000

// 5. Actualización de contrato (si GENERADO)
contrato.montoAlquilerUltimo = 100000
contrato.mesesRestaActualizar = 10 (decrement: 11 → 10)
contrato.cantidadMesesDuracion = 23 (decrement: 24 → 23)
```

**Resultado:**
```json
{
  "montoTotal": 100000,
  "montoAnterior": 100000,
  "montoPagado": 100000,
  "items": [
    { "descripcion": "Alquiler", "monto": 100000 }
  ]
}
```

---

### Ejemplo 2: Recibo con Ajuste IPC (Mes 12)

**Contexto:**
- Mes 12 del contrato
- `mesesRestaActualizar = 0`
- IPC acumulado últimos 12 meses: 38.5%
- Alquiler anterior: $100,000

**Cálculo:**

```typescript
// 1. Obtener IPC de 12 meses
const ipcs = [2.4, 3.73, 2.78, 4.2, 3.5, 2.9, 3.1, 2.6, 3.8, 2.5, 3.2, 2.7]

// 2. Convertir a coeficientes
const coefs = ipcs.map(ipc => 1 + ipc/100)
// [1.024, 1.0373, 1.0278, ...]

// 3. Multiplicar
const coefAcumulado = coefs.reduce((a, c) => a * c, 1) // ≈ 1.385

// 4. Aplicar ajuste
montoTotal = 100000 * 1.385 // $138,500
montoAnterior = 100000

// 5. Items (usuario agregó descuento)
items = [
    { descripcion: "Alquiler", monto: 138500, tipoItemId: ALQUILER },
    { descripcion: "Descuento pago anual", monto: -5000, tipoItemId: REINTEGRO }
]

// 6. Total a pagar
montoPagado = 138500 - 5000 // $133,500

// 7. Actualización de contrato
contrato.montoAlquilerUltimo = 138500
contrato.mesesRestaActualizar = 12 // Reset
contrato.cantidadMesesDuracion = 12 (decrement: 13 → 12)
```

**Resultado:**
```json
{
  "montoTotal": 138500,
  "montoAnterior": 100000,
  "montoPagado": 133500,
  "items": [
    { "descripcion": "Alquiler", "monto": 138500 },
    { "descripcion": "Descuento pago anual", "monto": -5000 }
  ]
}
```

---

### Ejemplo 3: Regeneración de Recibo PENDIENTE

**Contexto:**
- Recibo creado en estado PENDIENTE hace 5 días
- Se publicó nuevo IPC → recibo debe regenerarse
- Monto anterior: $100,000
- Nuevo IPC disponible cambia cálculo

**Flujo:**

```typescript
// 1. Buscar recibo existente
const existeRecibo = await buscarReciboMesActual(contratoId)
// { id: 123, estadoReciboId: 1 (PENDIENTE), ... }

// 2. Recalcular con nuevo IPC
const nuevoMontoTotal = calcularConNuevoIPC() // $105,000 (antes era $102,000)

// 3. Actualizar recibo existente
await tx.recibo.update({
    where: { id: 123 },
    data: {
        montoTotal: 105000,
        montoPagado: 105000,
        updatedAt: new Date()
    }
})

// 4. Eliminar items viejos
await tx.itemRecibo.deleteMany({
    where: { reciboId: 123 }
})

// 5. Crear items nuevos
await tx.itemRecibo.createMany({
    data: [
        { reciboId: 123, descripcion: "Alquiler", monto: 105000, tipoItemId: 1 }
    ]
})

// 6. NO actualizar contrato (sigue PENDIENTE)
// Solo se actualiza cuando pasa a GENERADO
```

---

## 🔍 Búsqueda de Recibos

### Función: buscarReciboMesActual

```typescript
export async function buscarReciboMesActual(contratoId: number) {
    const fechaActual = new Date()
    const anio = fechaActual.getFullYear()
    const mes = fechaActual.getMonth() + 1
    
    return await prisma.recibo.findFirst({
        where: {
            contratoId,
            AND: [
                { fechaPendiente: { gte: new Date(anio, mes - 1, 1) } },
                { fechaPendiente: { lt: new Date(anio, mes, 1) } }
            ]
        }
    })
}
```

**Lógica:**
- Busca por `fechaPendiente` dentro del mes actual
- Un contrato solo puede tener 1 recibo por mes
- No importa el estado (puede ser PENDIENTE, GENERADO, etc.)

---

## 📈 Performance y Optimizaciones

### Transacciones Atómicas

Todas las operaciones de recibo usan `$transaction`:

```typescript
const resultado = await prisma.$transaction(async (tx) => {
    // 1. Crear/actualizar recibo
    // 2. Crear/actualizar items
    // 3. Actualizar contrato
    // Todo o nada
})
```

**Beneficios:**
- ✅ Consistencia de datos
- ✅ Rollback automático en errores
- ✅ Prevención de race conditions

---

### Caché de TipoItem IDs

```typescript
const cachedTipoItemIds: Record<string, number> = {}

async function getTipoItemId(codigo: string): Promise<number> {
    if (cachedTipoItemIds[codigo]) {
        return cachedTipoItemIds[codigo] // ← Cache hit
    }
    
    const tipo = await prisma.tipoItem.findUnique({ where: { codigo } })
    cachedTipoItemIds[codigo] = tipo.id
    return tipo.id
}
```

**Mejora:** Reduce queries en creación de items con muchos tipos diferentes.

---

### Índices de Base de Datos

```prisma
model ItemRecibo {
  // ...
  @@index([reciboId])      // JOIN rápido Recibo → Items
  @@index([tipoItemId])    // Filtrar por tipo
}

model Recibo {
  // Índices implícitos en foreign keys
  contratoId Int           // ← Indexed automáticamente
  estadoReciboId Int       // ← Indexed automáticamente
}
```

---

## 🧪 Testing

### Test de Cálculo de Recibo

```typescript
describe('Cálculo de recibo', () => {
    it('debe calcular correctamente el primer recibo', async () => {
        const recibo = await crearRecibo({
            contratoId: 1,
            montoAlquilerInicial: 100000,
            mesesRestaActualizar: 11
        })
        
        expect(recibo.montoTotal).toBe(100000)
        expect(recibo.montoAnterior).toBe(100000)
    })
    
    it('debe aplicar ajuste IPC en el mes correcto', async () => {
        // Mock de IPC
        const ipcs = [2.4, 3.73, 2.78, ...] // 12 meses
        
        const recibo = await crearRecibo({
            contratoId: 1,
            montoAnterior: 100000,
            mesesRestaActualizar: 0  // ← Debe ajustar
        })
        
        expect(recibo.montoTotal).toBeGreaterThan(100000)
    })
})
```

---

## 📚 Referencias

- [create-recibo-action.ts](../actions/create-recibo-action.ts) - Lógica principal
- [delete-recibo-action.ts](../actions/delete-recibo-action.ts) - Eliminación
- [INDICES.md](./INDICES.md) - Cálculos IPC e ICL
- [TIPO_ITEM.md](./TIPO_ITEM.md) - Sistema de tipos de items
- [DATABASE.md](./DATABASE.md) - Schema de base de datos

---

[⬅️ Volver al README principal](../README.md)
