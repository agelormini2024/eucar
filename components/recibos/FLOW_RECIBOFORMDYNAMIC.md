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
ReciboFormDynamic({ contrato, recibo })
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
│   └─ 💰 Input: Monto Total
│
├─ 🧩 <ReciboServices formValues handleInputChange />
│   ├─ ☑️ Checkboxes: expensas, abl, aysa, luz, gas, otros
│   └─ 📝 Textarea: observaciones
│
└─ 🧩 <ItemsSection /> (existente)
    ├─ 🗄️ useRecibosFormStore() directo
    ├─ ➕ addItem()
    ├─ ➖ removeItem()
    ├─ ✏️ updateItem()
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
