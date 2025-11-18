# 🏗️ Esquema del Flujo de Llamadas - ReciboFormDynamic.tsx

## 📊 Visión General del Flujo

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            🎯 ReciboFormDynamic.tsx                                 │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                          │
                          ┌───────────────┼───────────────┐
                          │               │               │
                     🔗 Hooks        🧩 Components   🛠️ Utils
                          │               │               │
    ┌─────────────────────┼───────┐       │      ┌────────┼────────┐
    │                     │       │       │      │                 │
    ▼                     ▼       ▼       ▼      ▼                 ▼
useReciboData    useReciboValidation  ReciboHeader    formHandlers  formatters
    │                     │           ReciboAmounts       │             │
    │                     │           ReciboServices      │             │
    │                     │           ItemsSection        │             │
    ▼                     ▼                               ▼             ▼
🗄️ Store            🗄️ Store                          🎛️ Utils     🎨 Utils
```

## 🔄 Flujo Detallado de Ejecución

### 1️⃣ **Inicialización del Componente**
```typescript
ReciboFormDynamic({ contrato, recibo, readOnly = false })
│
├─ 🎛️ Extracción del estado global (Zustand)
│   ├─ formValues = useRecibosFormStore(state => state.formValues)
│   ├─ setFormValues = useRecibosFormStore(state => state.setFormValues)
│   └─ resetForm = useRecibosFormStore(state => state.resetForm)
│
├─ 🔗 Custom Hooks (Lógica de negocio)
│   ├─ useReciboData(contrato, recibo)
│   └─ useReciboValidation(contrato, recibo, readOnly)
│
└─ 🎛️ Handler de formulario
    └─ handleInputChange = useCallback(handleReciboInputChange)
```

### 2️⃣ **useReciboData Hook (Carga de Datos)**
```typescript
useReciboData(contrato, recibo)
│
├─ 📥 cargarContrato()
│   ├─ Calcula montoAlquiler
│   ├─ 🎨 formatFullName(apellido, nombre)
│   ├─ 🎨 formatPropiedadAddress(propiedad)
│   └─ 🗄️ setFormValues({ ...datosContrato })
│
├─ 📥 cargarEstadoRecibo()
│   ├─ 🌐 fetch(`/api/recibos/estadoRecibo/${id}`)
│   ├─ 🔍 EstadoReciboSchema.safeParse()
│   └─ 🗄️ setFormValues({ estadoRecibo })
│
└─ 📥 cargarReciboExistente() [solo si existe recibo]
    ├─ 🎨 formatDateForInput(fechas)
    ├─ 🗄️ setFormValues({ ...datosRecibo })
    ├─ 🌐 fetch(`/api/recibos/items/${recibo.id}`)
    └─ 🗄️ setFormValues({ items })
```

### 3️⃣ **useReciboValidation Hook (Validaciones)**
```typescript
useReciboValidation(contrato, recibo, readOnly)
│
├─ � Validación readOnly
│   └─ Si readOnly === true → return (no recalcular)
│
├─ 🔒 Validación estado recibo
│   └─ Si recibo existe Y NO es PENDIENTE → return (datos finalizados)
│
├─ �🔍 Validación de IPC/ICL
│   ├─ 📊 verificaIpcActual(fechaPendiente)
│   ├─ 🧮 calculaImporteRecibo(contrato)
│   └─ 🗄️ setFormValues({ montoTotal/estadoReciboId/items })
│
└─ 🔍 Validación de servicios
    ├─ Compara servicios: contrato vs formValues
    └─ 🗄️ setHabilitarBoton(serviciosIguales)
```

### 4️⃣ **Renderizado de Componentes**
```typescript
return (
  <div className="space-y-6">
│
├─ 🧩 <ReciboHeader contrato formValues handleInputChange />
│   ├─ 📝 Input: Contrato (disabled)
│   ├─ 📝 Input: Propiedad (disabled)
│   ├─ 📝 Input: Tipo Contrato (disabled)
│   ├─ 📝 Input: Propietario (disabled)
│   └─ 📝 Input: Inquilino (disabled)
│
├─ 🧩 <ReciboAmounts formValues handleInputChange setFormValues />
│   ├─ 📝 Input: Estado Recibo (disabled)
│   ├─ 📅 Input: Fecha (disabled)
│   ├─ 💰 Input: Monto Anterior (disabled)
│   └─ 💰 Input: Monto Total (disabled) 
│
├─ 🧩 <ReciboServices formValues handleInputChange readOnly />
│   ├─ ☑️ Checkboxes: expensas, abl, aysa, luz, gas, otros (disabled={readOnly})
│   └─ 📝 Textarea: observaciones (disabled={readOnly})
│
└─ 🧩 <ItemsSection readOnly />
    ├─ 🗄️ useRecibosFormStore() directo
    ├─ ➕ addItem() (oculto si readOnly)
    ├─ ➖ removeItem() (oculto si readOnly)
    ✏️ updateItem() (disabled si readOnly)
    └─ 🧮 Cálculo automático de totales
```

## 🌊 Flujo de Datos (Data Flow)

### 📤 **Flujo de Entrada (Props → State)**
```
User Props (contrato, recibo)
         ↓
   Custom Hooks
         ↓
   Zustand Store
         ↓
   Components (formValues)
```

### 📥 **Flujo de Salida (User Input → State)**
```
User Input (onChange)
         ↓
   handleInputChange
         ↓
   handleReciboInputChange(utils)
         ↓
   setFormValues (Zustand)
         ↓
   State Update
         ↓
   Re-render Components
```

## 🔗 **Dependencias y Importaciones**

```typescript
```typescript
ReciboFormDynamic.tsx
├─ React: { useEffect, useCallback }
├─ Prisma: { Recibo }
├─ Schema: { Contrato }
├─ Store: useRecibosFormStore
├─ Hooks: { useReciboData, useReciboValidation }
├─ Utils: { handleReciboInputChange }
├─ Components: { ReciboHeader, ReciboAmounts, ReciboServices, ItemsSection }
└─ Types: { ReciboFormValues, ReciboFormSetValues }
```

---

## 👁️ **Modo Solo Lectura (Read-Only Mode)**

### Props

```typescript
interface ReciboFormDynamicProps {
  contrato: number
  recibo?: Recibo
  readOnly?: boolean  // Prop opcional, default: false
}
```

### Comportamiento

Cuando `readOnly={true}`:

#### ReciboServices
- ✅ Checkboxes deshabilitados: `disabled={readOnly}`
- ✅ Textarea deshabilitado: `disabled={readOnly}`
- 🎨 Apariencia: Gris (estado disabled nativo)

#### ItemsSection
- ✅ Inputs deshabilitados: `disabled={readOnly || !esModificable}`
- 🚫 Botón "Agregar Ítem" oculto: `{!readOnly && <button>}`
- 🚫 Botones eliminar ocultos: `{!readOnly && esEliminable && <button>}`
- 🎨 Solo visualización de items existentes

#### ReciboHeader
- ℹ️ No requiere prop readOnly (todos los campos siempre disabled)

#### ReciboAmounts
- ℹ️ No usa prop readOnly (todos los campos siempre disabled por diseño)

### Uso

```typescript
// Vista de solo lectura
<ReciboFormDynamic 
  contrato={contratoId} 
  recibo={reciboData}
  readOnly={true}  // Activa modo visualización
/>

// Vista editable (por defecto)
<ReciboFormDynamic 
  contrato={contratoId} 
  recibo={reciboData}
/>
```

### Rutas

- **Edición**: `/admin/recibos/[id]/edit`
- **Solo Lectura**: `/admin/recibos/[id]/view`

### Arquitectura SOLID

- 🔄 **95% reutilización de código**: Mismo componente para edición y visualización
- 📦 **Single Responsibility**: Componente único con comportamiento dual controlado por prop
- 🎯 **Consistencia**: Misma estructura, estilos y validaciones
- ✨ **Mantenibilidad**: Cambios en una vista se reflejan automáticamente en ambas

---

## 🛡️ **Validaciones en Páginas de Recibo**

### Validaciones en Edición (`/admin/recibos/[id]/edit`)

La página de edición implementa **4 validaciones en cadena** usando el componente `InfoAlert`:

```typescript
// 1. Recibo no existe
if (!recibo) {
  return <InfoAlert 
    variant="error"
    title="Recibo no encontrado"
    message="No se encontró el recibo solicitado..."
  />
}

// 2. Recibo NO está en estado PENDIENTE
if (recibo.estadoReciboId !== 1) {
  return <InfoAlert 
    variant="warning"
    title="Recibo no editable"
    message={`Este recibo está en estado ${estadosMap[estadoReciboId]}...`}
  />
}

// 3. Recibo PENDIENTE pero índices disponibles (debe regenerarse)
if (puedeRegenerar) {
  return <InfoAlert 
    variant="info"
    title="Recibo listo para regenerar"
    message={`Los índices ${tipoIndice} necesarios ya están disponibles...`}
  />
}

// 4. Permite editar (PENDIENTE sin índices disponibles)
return <EditReciboForm>...</EditReciboForm>
```

### Validaciones en Alta/Regenerar (`/admin/recibos/alta/[contratoId]`)

```typescript
// 1. Recibo ya generado (estados 2/3/4)
if (recibo && estadoReciboId !== 1) {
  return <InfoAlert 
    variant="warning"
    title="Recibo ya generado"
    message="Ya existe un recibo generado..."
  />
}

// 2. Recibo PENDIENTE sin índices disponibles
if (recibo && estadoReciboId === 1 && !indicesDisponibles) {
  return <InfoAlert 
    variant="info"
    title="Índices no disponibles"
    message={`Aún no están cargados los índices ${tipoIndice}...`}
  />
}

// 3. Permite crear/regenerar
return <AddReciboForm>...</AddReciboForm>
```

### Componente InfoAlert

**Props:**
```typescript
interface InfoAlertProps {
  title: string           // Título principal
  message: string         // Mensaje descriptivo
  subMessage?: string     // Mensaje adicional opcional
  variant?: "info" | "warning" | "success" | "error"  // Tipo de alerta
  showBackButton?: boolean  // Mostrar botón volver (default: true)
}
```

**Variantes:**

| Variante | Color | Ícono | Uso |
|----------|-------|-------|-----|
| `info` | Azul | ℹ️ Info | Mensajes informativos, índices no disponibles |
| `warning` | Amarillo | ⚠️ AlertTriangle | Advertencias, recibo no editable |
| `success` | Verde | ✓ CheckCircle | Confirmaciones exitosas |
| `error` | Rojo | ✗ XCircle | Errores críticos, recibo no encontrado |

**Ventajas:**
- ✅ Componente reutilizable en toda la app
- ✅ Diseño profesional y consistente
- ✅ Elimina duplicación de código
- ✅ Botón "Volver" integrado
- ✅ Mensajes claros y color-coded

---

## 🔄 **Modo Read-Only: Preservación de Datos**

### Problema Resuelto

**Antes**: En modo view, `useReciboValidation` recalculaba el `montoTotal` si el recibo era PENDIENTE y los índices estaban disponibles.

**Solución**: Parámetro `readOnly` en `useReciboValidation` que previene recálculos.

### Flujo de Datos en Modo View

```
view/page.tsx (readOnly=true)
    ↓
ReciboForm (recibe readOnly, lo pasa)
    ↓
ReciboFormDynamic (recibe readOnly, lo pasa al hook)
    ↓
useReciboValidation (recibe readOnly, retorna temprano si es true)
    ↓
NO recalcula montoTotal ✅
    ↓
Muestra los datos TAL CUAL están en la BD ✅
```

### Comportamiento por Modo

| Modo | `readOnly` | useReciboValidation | Comportamiento |
|------|-----------|---------------------|----------------|
| **View** | `true` | Retorna temprano | Muestra datos guardados SIN recalcular |
| **Edit** | `false` | Ejecuta validaciones | Recalcula si es PENDIENTE sin índices |
| **Alta/Regenerar** | `false` | Ejecuta validaciones | Recalcula según índices disponibles |

### Código

```typescript
// En useReciboValidation.ts
export function useReciboValidation(
  contrato: Contrato, 
  recibo?: RecibosConRelaciones | null,
  readOnly?: boolean  // Parámetro para modo view
) {
  useEffect(() => {
    async function checkMesHabilitado() {
      // Si es readOnly (modo view), NO recalcular nada
      if (readOnly) {
        return;  // Preserva datos guardados
      }
      
      // ... resto de validaciones y recálculos
    }
    
    checkMesHabilitado();
  }, [..., readOnly])  // readOnly en dependencias
}
```

---

## 📊 **Resumen de Arquitectura**

### Componentes

| Componente | Responsabilidad | Recibe readOnly |
|------------|----------------|-----------------|
| `ReciboForm` | Server Component - Carga contrato | ✅ Pasa |
| `ReciboFormDynamic` | Client - Orquestador principal | ✅ Pasa |
| `ReciboServices` | Checkboxes servicios | ✅ Usa |
| `ItemsSection` | Gestión de ítems | ✅ Usa |
| `ReciboHeader` | Datos contrato/propiedad | ❌ Siempre disabled |
| `ReciboAmounts` | Montos y fechas | ❌ Siempre disabled |

### Hooks

| Hook | Parámetros | Responsabilidad |
|------|-----------|----------------|
| `useReciboData` | `(contrato, recibo)` | Carga datos desde BD |
| `useReciboValidation` | `(contrato, recibo, readOnly)` | Validaciones y recálculos |

### Utilities

| Utilidad | Propósito |
|----------|-----------|
| `handleReciboInputChange` | Handler onChange genérico |
| `formatters` | Formateo de fechas, nombres, direcciones |
| `verificaIpcActual` | Verifica disponibilidad de índices IPC |
| `calculaImporteRecibo` | Calcula monto con índices |

---

## 🎯 **Principios de Diseño**

1. **DRY (Don't Repeat Yourself)**
   - Componente único para view/edit
   - InfoAlert reutilizable para alertas
   - Helpers compartidos

2. **SOLID**
   - Single Responsibility: Cada componente/hook una función
   - Open/Closed: Extensible via props (readOnly)
   - Dependency Inversion: Hooks abstraen lógica

3. **Type Safety**
   - TypeScript estricto
   - Validación con Zod
   - Tipos compartidos

4. **User Experience**
   - Validaciones claras con InfoAlert
   - Mensajes descriptivos
   - Navegación intuitiva

````
```
