# 🎣 Custom Hooks

Documentación completa de los custom React hooks del proyecto EUCAR.

---

## 📋 Descripción General

Los custom hooks encapsulan lógica compleja y la hacen reutilizable entre componentes. EUCAR utiliza hooks personalizados principalmente para la gestión de recibos, donde la lógica de cálculos, validaciones y carga de datos es compleja.

**Hooks Disponibles:**

1. **useReciboData** - Carga de datos de recibos y contratos
2. **useReciboValidation** - Validaciones y cálculos automáticos

---

## 📂 Ubicación

```
src/hooks/
├── useReciboData.ts         # Carga de datos
└── useReciboValidation.ts   # Validaciones y cálculos
```

---

## 🎯 useReciboData

### Propósito

Maneja la **carga y preparación de datos** para el formulario de recibos, gestionando tanto recibos nuevos como existentes.

### Ubicación

`src/hooks/useReciboData.ts`

---

### Firma

```typescript
export function useReciboData(
  contrato: Contrato,
  recibo?: RecibosConRelaciones | null
): void
```

**Parámetros:**
- `contrato`: Objeto Contrato con todas sus relaciones
- `recibo`: (Opcional) Recibo existente a editar

**Retorno:**
- `void` - El hook actualiza el store directamente

---

### Funcionalidad Principal

El hook ejecuta **dos flujos principales**:

#### 1. Cargar Datos del Contrato

Siempre se ejecuta, carga información del contrato al formulario:

```typescript
const cargarContrato = async () => {
    const montoAlquiler = contrato.montoAlquilerUltimo === 0
        ? contrato.montoAlquilerInicial
        : contrato.montoAlquilerUltimo;

    setFormValues({
        contratoId: contrato.id,
        montoAnterior: montoAlquiler,
        tipoContratoId: contrato.tipoContratoId,
        tipoContrato: contrato.tipoContrato.descripcion,
        clientePropietario: formatFullName(
            contrato.clientePropietario.apellido, 
            contrato.clientePropietario.nombre
        ),
        clienteInquilino: formatFullName(
            contrato.clienteInquilino.apellido, 
            contrato.clienteInquilino.nombre
        ),
        propiedad: formatPropiedadAddress(contrato.propiedad),
        tipoIndice: contrato.tipoIndice.nombre,
        mesesRestaActualizar: contrato.mesesRestaActualizar,
    });
}
```

**Datos cargados:**
- IDs del contrato y tipo de contrato
- Monto de alquiler anterior (base para cálculos)
- Nombres formateados de propietario e inquilino
- Dirección de la propiedad
- Tipo de índice (IPC/ICL)
- Contador de meses para ajuste

---

#### 2. Cargar Recibo Existente (si aplica)

Si se pasa un `recibo`, carga sus datos completos:

```typescript
const cargarReciboExistente = async () => {
    if (!recibo) return

    const estadoReciboId = recibo.estadoReciboId || 1;

    setFormValues({
        contratoId: recibo.contratoId,
        estadoReciboId: estadoReciboId,
        estadoRecibo: recibo.estadoRecibo?.descripcion,
        fechaPendiente: formatDateForInput(recibo.fechaPendiente),
        fechaGenerado: formatDateForInput(recibo.fechaGenerado),
        fechaImpreso: formatDateForInput(recibo.fechaImpreso),
        fechaAnulado: formatDateForInput(recibo.fechaAnulado),
        montoAnterior: recibo.montoAnterior,
        montoTotal: recibo.montoTotal,
        montoPagado: recibo.montoPagado,
        abl: recibo.abl,
        aysa: recibo.aysa,
        luz: recibo.luz,
        gas: recibo.gas,
        otros: recibo.otros,
        expensas: recibo.expensas,
        observaciones: recibo.observaciones
    })
    
    // Cargar items del recibo
    await cargarItemsRecibo(recibo.id, estadoReciboId)
}
```

---

### Carga Inteligente de Items

**Lógica diferenciada según estado:**

```typescript
const itemsExistentes = await fetch(`/api/recibos/items/${recibo.id}`)

if (estadoReciboId === 1) {
    // ✅ PENDIENTE: Filtrar item "Alquiler", solo cargar extras
    // useReciboValidation recalculará el alquiler con índices actualizados
    const itemsAdicionales = itemsExistentes.filter(
        item => !esItemAlquiler(item)
    );
    setFormValues({ items: itemsAdicionales });
    
} else {
    // ✅ GENERADO/PAGADO/IMPRESO: Cargar todos los items tal cual
    // Datos finalizados, no recalcular
    setFormValues({ items: itemsExistentes });
}
```

**Razón del filtrado:**
- **Recibo PENDIENTE**: El item "Alquiler" debe recalcularse con índices actualizados
- **Recibo GENERADO+**: Los items están finalizados, no modificar

---

### Uso

```typescript
import { useReciboData } from '@/src/hooks/useReciboData'

export function ReciboForm({ contrato, recibo }) {
  // Hook carga datos automáticamente al store
  useReciboData(contrato, recibo)
  
  // Los datos están disponibles en el store
  const formValues = useRecibosFormStore(state => state.formValues)
  
  return <form>...</form>
}
```

---

### Diagrama de Flujo

```
useReciboData
    │
    ├─► cargarContrato()
    │   └─► setFormValues({ contrato data })
    │
    └─► ¿Hay recibo?
        │
        ├─► NO  → cargarEstadoRecibo(1) // PENDIENTE
        │
        └─► SÍ  → cargarReciboExistente()
                  │
                  ├─► setFormValues({ recibo data })
                  │
                  └─► cargarItems()
                      │
                      ├─► Estado = PENDIENTE
                      │   └─► Cargar solo items extras (sin "Alquiler")
                      │
                      └─► Estado ≠ PENDIENTE
                          └─► Cargar todos los items
```

---

## 🔍 useReciboValidation

### Propósito

Maneja **validaciones y cálculos automáticos** del recibo, incluyendo:
- Verificación de índices (IPC/ICL) disponibles
- Cálculo de monto con/sin ajuste
- Creación/actualización del item "Alquiler"
- Validación de servicios del contrato

### Ubicación

`src/hooks/useReciboValidation.ts`

---

### Firma

```typescript
export function useReciboValidation(
  contrato: Contrato,
  recibo?: RecibosConRelaciones | null
): {
  selectContrato: Contrato | undefined
}
```

**Parámetros:**
- `contrato`: Contrato con relaciones completas
- `recibo`: (Opcional) Recibo existente

**Retorno:**
- `selectContrato`: Copia del contrato para comparaciones

---

### Funcionalidad Principal

#### 1. Decisión de Recálculo

```typescript
if (recibo && recibo.id && recibo.estadoReciboId !== 1) {
    // ❌ Recibo NO es PENDIENTE → NO recalcular
    console.log('Recibo finalizado, saltando recálculo');
    return;
}

// ✅ Recibo nuevo O PENDIENTE → SÍ recalcular
console.log('Ejecutando recálculo...');
```

**Regla:** Solo recalcula si:
- Es un recibo **nuevo** (no existe), O
- Es un recibo **PENDIENTE** (estadoReciboId = 1)

---

#### 2. Tres Casos de Cálculo

El hook implementa la lógica de **3 casos** documentada en [RECIBOS.md](./RECIBOS.md):

##### Caso 1A: CON Ajuste + Índices Disponibles

```typescript
if (mesesRestaActualizar === 0) {
    const indicesDisponibles = await verificaIpcActual(fechaPendiente);
    
    if (indicesDisponibles) {
        // ✅ Calcular con ajuste IPC/ICL
        const { montoCalculado } = calculaImporteRecibo(contrato);
        
        // Actualizar/crear item "Alquiler"
        const itemsActualizados = actualizarItemAlquiler(
            formValues.items,
            montoCalculado
        );
        
        setFormValues({
            montoTotal: montoCalculado,
            estadoReciboId: 2, // GENERADO
            items: itemsActualizados
        });
    }
}
```

**Resultado:**
- Monto ajustado por IPC/ICL
- Estado: **GENERADO**
- Item "Alquiler" con monto calculado

---

##### Caso 1C: CON Ajuste + SIN Índices

```typescript
if (mesesRestaActualizar === 0 && !indicesDisponibles) {
    // ⏳ Usar monto anterior temporalmente
    const montoAnterior = contrato.montoAlquilerUltimo || contrato.montoAlquilerInicial;
    
    const itemsActualizados = actualizarItemAlquiler(
        formValues.items,
        montoAnterior
    );
    
    setFormValues({
        montoTotal: montoAnterior,
        estadoReciboId: 1, // PENDIENTE
        items: itemsActualizados
    });
}
```

**Resultado:**
- Monto sin ajustar (temporal)
- Estado: **PENDIENTE** (esperando índices)
- Puede regenerarse cuando lleguen índices

---

##### Caso 1B: SIN Ajuste

```typescript
if (mesesRestaActualizar > 0) {
    // 📋 Usar monto anterior directamente
    const montoAnterior = contrato.montoAlquilerUltimo || contrato.montoAlquilerInicial;
    
    const itemsActualizados = actualizarItemAlquiler(
        formValues.items,
        montoAnterior
    );
    
    setFormValues({
        montoTotal: montoAnterior,
        estadoReciboId: 2, // GENERADO
        items: itemsActualizados
    });
}
```

**Resultado:**
- Mismo monto del mes anterior
- Estado: **GENERADO**
- No requiere ajuste este mes

---

#### 3. Actualización Inteligente de Items

```typescript
function actualizarItemAlquiler(items: Item[], nuevoMonto: number): Item[] {
    if (items.length > 0) {
        // Hay items cargados (regeneración o recibo existente)
        const tieneAlquiler = items.some(item => esItemAlquiler(item));
        
        if (tieneAlquiler) {
            // Actualizar monto del item "Alquiler" existente
            return items.map(item => 
                esItemAlquiler(item)
                    ? { ...item, monto: nuevoMonto }
                    : item // Mantener otros items sin cambios
            );
        } else {
            // No tiene "Alquiler" → agregarlo al inicio
            return [
                { descripcion: "Alquiler", monto: nuevoMonto },
                ...items
            ];
        }
    } else {
        // No hay items → crear array con "Alquiler"
        return [{ descripcion: "Alquiler", monto: nuevoMonto }];
    }
}
```

**Lógica:**
- Preserva items extras/descuentos del usuario
- Solo actualiza/crea el item "Alquiler"
- Evita duplicados

---

#### 4. Validación de Servicios

```typescript
useEffect(() => {
    if (!selectContrato) return;
    
    const serviciosIguales = (
        selectContrato.abl === formValues.abl &&
        selectContrato.aysa === formValues.aysa &&
        selectContrato.expensas === formValues.expensas &&
        selectContrato.luz === formValues.luz &&
        selectContrato.gas === formValues.gas &&
        selectContrato.otros === formValues.otros
    );

    setHabilitarBoton(serviciosIguales);
    
}, [selectContrato, formValues.abl, /* ... */]);
```

**Propósito:**
- Validar que servicios del formulario coincidan con el contrato
- Habilitar/deshabilitar botón de guardar
- Prevenir inconsistencias

---

### Uso

```typescript
import { useReciboValidation } from '@/src/hooks/useReciboValidation'

export function ReciboForm({ contrato, recibo }) {
  // Hook ejecuta validaciones automáticamente
  const { selectContrato } = useReciboValidation(contrato, recibo)
  
  const habilitarBoton = useRecibosFormStore(s => s.habilitarBoton)
  const formValues = useRecibosFormStore(s => s.formValues)
  
  return (
    <form>
      <p>Monto Total: ${formValues.montoTotal}</p>
      <p>Estado: {formValues.estadoRecibo}</p>
      <Button disabled={!habilitarBoton}>Guardar</Button>
    </form>
  )
}
```

---

### Diagrama de Flujo

```
useReciboValidation
    │
    ├─► ¿Recibo finalizado?
    │   ├─► SÍ → RETURN (no recalcular)
    │   └─► NO → Continuar
    │
    ├─► Calcular montoAnterior
    │
    ├─► ¿mesesRestaActualizar === 0?
    │   │
    │   ├─► SÍ (corresponde ajuste)
    │   │   │
    │   │   ├─► ¿Hay índices IPC/ICL?
    │   │   │   │
    │   │   │   ├─► SÍ → CASO 1A
    │   │   │   │         - Calcular con ajuste
    │   │   │   │         - Estado: GENERADO
    │   │   │   │
    │   │   │   └─► NO → CASO 1C
    │   │   │             - Usar monto anterior
    │   │   │             - Estado: PENDIENTE
    │   │   │
    │   └─► NO (no corresponde ajuste)
    │       └─► CASO 1B
    │           - Usar monto anterior
    │           - Estado: GENERADO
    │
    ├─► Actualizar item "Alquiler"
    │   ├─► ¿Existe item "Alquiler"?
    │   │   ├─► SÍ → Actualizar monto
    │   │   └─► NO → Crear item
    │   │
    │   └─► Preservar items extras
    │
    └─► Validar servicios
        └─► Habilitar/deshabilitar botón
```

---

## 🔗 Integración de Ambos Hooks

### Flujo Completo en Componente

```typescript
export function ReciboFormDynamic({ contrato, recibo }) {
  // 1. useReciboData carga datos iniciales
  useReciboData(contrato, recibo)
  
  // 2. useReciboValidation ejecuta cálculos y validaciones
  const { selectContrato } = useReciboValidation(contrato, recibo)
  
  // 3. Obtener valores del store
  const formValues = useRecibosFormStore(state => state.formValues)
  const habilitarBoton = useRecibosFormStore(state => state.habilitarBoton)
  
  return (
    <form>
      {/* Datos del contrato (de useReciboData) */}
      <p>Propietario: {formValues.clientePropietario}</p>
      <p>Inquilino: {formValues.clienteInquilino}</p>
      <p>Propiedad: {formValues.propiedad}</p>
      
      {/* Cálculos (de useReciboValidation) */}
      <p>Monto Total: ${formValues.montoTotal}</p>
      <p>Estado: {formValues.estadoRecibo}</p>
      
      {/* Items (gestionados por ambos hooks) */}
      <ItemsList items={formValues.items} />
      
      {/* Botón (validado por useReciboValidation) */}
      <Button disabled={!habilitarBoton}>
        Guardar Recibo
      </Button>
    </form>
  )
}
```

---

### Orden de Ejecución

```
Render del Componente
    │
    ├─► 1. useReciboData
    │   │
    │   ├─► cargarContrato()
    │   │   └─► Carga datos básicos al store
    │   │
    │   └─► cargarReciboExistente() (si aplica)
    │       ├─► Carga datos del recibo
    │       └─► Carga items (filtrados si PENDIENTE)
    │
    ├─► 2. useReciboValidation
    │   │
    │   ├─► ¿Debe recalcular?
    │   │   ├─► NO → Return
    │   │   └─► SÍ → Continuar
    │   │
    │   ├─► Determinar caso (1A, 1B, 1C)
    │   ├─► Calcular montoTotal
    │   ├─► Actualizar/crear item "Alquiler"
    │   ├─► Establecer estado (PENDIENTE o GENERADO)
    │   └─► Validar servicios
    │
    └─► 3. Componente renderiza con datos actualizados
```

---

## 🐛 Prevención de Race Conditions

### Problema Resuelto

**Antes (con race condition):**

```typescript
// ❌ useReciboData carga items de BD
setFormValues({ items: itemsFromDB }) // [Alquiler: 100000, Extra: 5000]

// ❌ useReciboValidation recalcula y sobrescribe
setFormValues({ items: [{ Alquiler: 105000 }] }) // Perdió el Extra!
```

**Después (sin race condition):**

```typescript
// ✅ useReciboData filtra "Alquiler" si es PENDIENTE
if (estadoReciboId === 1) {
  const itemsSinAlquiler = items.filter(i => !esItemAlquiler(i))
  setFormValues({ items: itemsSinAlquiler }) // [Extra: 5000]
}

// ✅ useReciboValidation preserva items extras
const itemsActualizados = [
  { Alquiler: 105000 }, // Nuevo cálculo
  ...formValues.items   // [Extra: 5000] preservado
]
setFormValues({ items: itemsActualizados }) // ✅ [Alquiler: 105000, Extra: 5000]
```

---

## 📊 Dependencias de useEffect

### useReciboData

```typescript
// Effect 1: Cargar datos de contrato
useEffect(() => {
  cargarContrato();
}, [contrato, recibo]);

// Effect 2: Cargar recibo existente
useEffect(() => {
  cargarReciboExistente();
  if (!recibo) cargarEstadoRecibo(1);
}, [recibo, contrato.id]);
```

**Triggers:**
- Cambio de `contrato` → Recargar datos del contrato
- Cambio de `recibo` → Recargar datos del recibo

---

### useReciboValidation

```typescript
useEffect(() => {
  async function checkMesHabilitado() { /* ... */ }
  checkMesHabilitado();
}, [
  formValues.tipoIndice,
  formValues.mesesRestaActualizar,
  formValues.fechaPendiente,
  contrato,
  recibo
]);
```

**Triggers:**
- Cambio de índice (IPC ↔ ICL)
- Cambio de meses para actualización
- Cambio de fecha pendiente
- Cambio de contrato/recibo

**⚠️ Nota:** `formValues.items` **NO** está en dependencias para evitar loop infinito.

---

## 🧪 Testing de Hooks

### Test de useReciboData

```typescript
import { renderHook } from '@testing-library/react'
import { useReciboData } from '@/src/hooks/useReciboData'

describe('useReciboData', () => {
  it('debe cargar datos del contrato correctamente', () => {
    const mockContrato = {
      id: 1,
      montoAlquilerUltimo: 100000,
      clientePropietario: { nombre: 'Juan', apellido: 'Pérez' },
      // ...
    }
    
    renderHook(() => useReciboData(mockContrato))
    
    const formValues = useRecibosFormStore.getState().formValues
    expect(formValues.contratoId).toBe(1)
    expect(formValues.montoAnterior).toBe(100000)
    expect(formValues.clientePropietario).toBe('Pérez Juan')
  })
  
  it('debe filtrar item Alquiler en recibos PENDIENTE', async () => {
    const mockRecibo = {
      id: 1,
      estadoReciboId: 1, // PENDIENTE
      items: [
        { descripcion: 'Alquiler', monto: 100000 },
        { descripcion: 'Extra', monto: 5000 }
      ]
    }
    
    renderHook(() => useReciboData(mockContrato, mockRecibo))
    
    await waitFor(() => {
      const items = useRecibosFormStore.getState().formValues.items
      expect(items).toHaveLength(1)
      expect(items[0].descripcion).toBe('Extra')
    })
  })
})
```

---

### Test de useReciboValidation

```typescript
describe('useReciboValidation', () => {
  it('debe calcular con ajuste IPC cuando corresponde', async () => {
    const mockContrato = {
      mesesRestaActualizar: 0, // Corresponde ajuste
      tipoIndice: { nombre: 'IPC' },
      // ...
    }
    
    // Mock de verificaIpcActual
    jest.mock('@/src/lib/verificaIpcActual', () => ({
      verificaIpcActual: jest.fn().mockResolvedValue(true)
    }))
    
    renderHook(() => useReciboValidation(mockContrato))
    
    await waitFor(() => {
      const formValues = useRecibosFormStore.getState().formValues
      expect(formValues.estadoReciboId).toBe(2) // GENERADO
      expect(formValues.montoTotal).toBeGreaterThan(0)
    })
  })
  
  it('debe marcar como PENDIENTE sin índices', async () => {
    const mockContrato = {
      mesesRestaActualizar: 0,
      tipoIndice: { nombre: 'IPC' }
    }
    
    jest.mock('@/src/lib/verificaIpcActual', () => ({
      verificaIpcActual: jest.fn().mockResolvedValue(false) // Sin índices
    }))
    
    renderHook(() => useReciboValidation(mockContrato))
    
    await waitFor(() => {
      const formValues = useRecibosFormStore.getState().formValues
      expect(formValues.estadoReciboId).toBe(1) // PENDIENTE
    })
  })
})
```

---

## 🎓 Buenas Prácticas

### 1. Un Hook, Una Responsabilidad

```typescript
// ✅ Bueno: Cada hook tiene propósito claro
useReciboData()       // Solo carga datos
useReciboValidation() // Solo valida y calcula

// ❌ Malo: Hook hace demasiado
useRecibo() // Carga, valida, calcula, envía, imprime...
```

---

### 2. Evitar Loops Infinitos

```typescript
// ❌ Malo: Loop infinito
useEffect(() => {
  setItems([...items, newItem])
}, [items]) // items cambia → effect ejecuta → items cambia...

// ✅ Bueno: Dependencias específicas
useEffect(() => {
  setItems([...items, newItem])
}, [newItem]) // Solo cuando newItem cambia
```

---

### 3. Manejar Estados de Carga

```typescript
export function useReciboData(contrato, recibo) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    async function cargar() {
      try {
        setLoading(true)
        await cargarDatos()
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])
  
  return { loading, error }
}
```

---

### 4. Cleanup de Effects

```typescript
useEffect(() => {
  const controller = new AbortController()
  
  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(data => setData(data))
  
  // Cleanup: cancelar request si componente se desmonta
  return () => controller.abort()
}, [])
```

---

## 📚 Referencias

- [React Hooks Docs](https://react.dev/reference/react)
- [Custom Hooks Guide](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [useEffect Deep Dive](https://react.dev/reference/react/useEffect)
- [RECIBOS.md](./RECIBOS.md) - Lógica de negocio de recibos
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura del proyecto

---

[⬅️ Volver al README principal](../README.md)
