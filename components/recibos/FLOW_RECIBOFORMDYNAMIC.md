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
│   └─ useReciboValidation(contrato)
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
useReciboValidation(contrato)
│
├─ 🔍 Validación de IPC/ICL
│   ├─ 📊 verificaIpcActual(fechaPendiente)
│   ├─ 🧮 calculaImporteRecibo(contrato)
│   └─ 🗄️ setFormValues({ montoTotal/estadoReciboId })
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

````
```
