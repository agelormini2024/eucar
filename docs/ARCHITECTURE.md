# 🏗️ Arquitectura del Proyecto

Documentación completa de la estructura, patrones y convenciones del proyecto EUCAR.

---

## 📊 Visión General

EUCAR está construido con una arquitectura moderna de Next.js 14 utilizando:

- **Framework:** Next.js 14 (App Router)
- **Renderizado:** Server-Side Rendering (SSR) + Server Components
- **Estado:** Zustand (global) + React Hook Form (formularios)
- **Base de Datos:** PostgreSQL + Prisma ORM
- **Estilos:** Tailwind CSS
- **Validación:** Zod schemas
- **TypeScript:** Strict mode

---

## 📁 Estructura de Carpetas

```
eucar/
├── app/                    # Next.js App Router
│   ├── admin/             # Rutas administrativas
│   ├── api/               # API Routes
│   ├── auth/              # Autenticación
│   ├── home/              # Dashboard principal
│   ├── layout.tsx         # Layout raíz
│   ├── page.tsx           # Página de inicio
│   └── globals.css        # Estilos globales
│
├── actions/               # Server Actions (lógica de negocio)
│   ├── create-*.ts        # Creación de entidades
│   ├── update-*.ts        # Actualización de entidades
│   ├── delete-*.ts        # Eliminación de entidades
│   ├── list-*.ts          # Listado de entidades
│   └── ACTION_TEMPLATES.md
│
├── components/            # Componentes React
│   ├── clientes/          # Componentes de clientes
│   ├── contratos/         # Componentes de contratos
│   ├── propiedades/       # Componentes de propiedades
│   ├── recibos/           # Componentes de recibos
│   ├── home/              # Componentes del dashboard
│   ├── ui/                # Componentes UI reutilizables
│   └── utilidades/        # Componentes de utilidades
│
├── src/                   # Código fuente compartido
│   ├── auth/              # Lógica de autenticación
│   ├── hooks/             # Custom React Hooks
│   ├── lib/               # Librerías y utilidades
│   ├── schema/            # Zod schemas de validación
│   ├── stores/            # Zustand stores (estado global)
│   ├── types/             # TypeScript types/interfaces
│   └── utils/             # Funciones utilitarias
│
├── prisma/                # Prisma ORM
│   ├── schema.prisma      # Schema de base de datos
│   ├── migrations/        # Migraciones de BD
│   ├── seed.ts            # Datos iniciales
│   └── data/              # Archivos de datos para seed
│
├── __tests__/             # Tests unitarios
│   └── *.test.ts          # Jest tests
│
├── docs/                  # Documentación
│   ├── DATABASE.md
│   ├── RECIBOS.md
│   ├── TIPO_ITEM.md
│   ├── INDICES.md
│   ├── INSTALLATION.md
│   └── ARCHITECTURE.md    # Este archivo
│
├── public/                # Archivos estáticos
│   └── *.svg, *.jpg       # Imágenes y logos
│
└── Archivos de configuración
    ├── next.config.ts     # Configuración Next.js
    ├── tailwind.config.ts # Configuración Tailwind
    ├── tsconfig.json      # Configuración TypeScript
    ├── jest.config.js     # Configuración Jest
    ├── .env               # Variables de entorno
    └── package.json       # Dependencias
```

---

## 🎯 Módulos Principales

### 1. 👥 Módulo de Clientes

**Ubicación:** `/components/clientes` + `/actions/*-cliente-*`

```
components/clientes/
├── ClientesRoute.tsx         # Página principal (contenedor)
├── ClientesSideBar.tsx       # Navegación lateral
├── ClientesTable.tsx         # Tabla de datos
├── ClientesTableWrapper.tsx  # Wrapper con lógica
├── ClienteForm.tsx           # Formulario base
├── ClienteFormDynamic.tsx    # Formulario dinámico
├── AddClienteForm.tsx        # Formulario de creación
└── EditClienteForm.tsx       # Formulario de edición

actions/
├── create-cliente-action.ts  # Crear cliente
├── update-cliente-action.ts  # Actualizar cliente
└── list-clientes-action.ts   # Listar clientes
```

**Funcionalidades:**
- CRUD completo de clientes (propietarios/inquilinos)
- Validación de CUIT único
- Direcciones normalizadas con país/provincia
- Soft delete (campo `activo`)

---

### 2. 🏠 Módulo de Propiedades

**Ubicación:** `/components/propiedades` + `/actions/*-propiedad-*`

```
components/propiedades/
├── PropiedadesRoute.tsx
├── PropiedadesSidebar.tsx
├── PropiedadesTable.tsx
├── PropiedadForm.tsx
├── PropiedadFormDynamic.tsx
├── AddPropiedadForm.tsx
└── EditPropiedadForm.tsx

actions/
├── create-propiedad-action.ts
├── update-propiedad-action.ts
└── list-propiedades-action.ts
```

**Funcionalidades:**
- Gestión de inmuebles
- Características físicas (ambientes, m², etc.)
- Relación con propietario (Cliente)
- Historial de contratos

---

### 3. 📝 Módulo de Contratos

**Ubicación:** `/components/contratos` + `/actions/*-contrato-*`

```
components/contratos/
├── AlquileresRoute.tsx       # Ruta principal
├── AlquileresSidebar.tsx     # Navegación
├── ContratosTable.tsx        # Tabla
├── ContratoForm.tsx
├── ContratoFormDynamic.tsx
├── AddContratoForm.tsx
└── EditContratoForm.tsx

actions/
├── create-contrato-action.ts
├── update-contrato-action.ts
├── list-contratos-action.ts
└── list-tipoContrato-action.ts
```

**Funcionalidades:**
- Vincular propietario + inquilino + propiedad
- Configurar tipo de ajuste (IPC/ICL)
- Periodicidad de actualización
- Seguimiento de meses restantes

---

### 4. 🧾 Módulo de Recibos

**Ubicación:** `/components/recibos` + `/actions/*-recibo-*`

```
components/recibos/
├── RecibosTable.tsx          # Tabla de recibos
├── ReciboForm.tsx
├── ReciboFormDynamic.tsx
├── AddReciboForm.tsx
├── PDFRecibo.tsx             # Generación de PDF
└── ImprimirRecibo.tsx        # Vista de impresión

actions/
├── create-recibo-action.ts   # Lógica compleja de generación
├── update-recibo-action.ts
├── delete-recibo-action.ts
└── list-recibos-action.ts
```

**Funcionalidades:**
- Generación automática con ajustes IPC/ICL
- Estados (PENDIENTE → GENERADO → PAGADO → IMPRESO)
- Regeneración de recibos pendientes
- Items tipificados con inferencia automática
- Exportación a PDF

---

### 5. 📈 Módulo de Índices

**Ubicación:** `/actions/create-{ipc,icl}-action.ts`

```
actions/
├── create-ipc-action.ts      # Carga de IPC mensual
└── create-icl-action.ts      # Carga de ICL del BCRA
```

**Funcionalidades:**
- Carga de índices IPC (manual o automático)
- Importación de ICL desde BCRA
- Cálculos de ajuste de alquileres

---

## 🔄 Flujo de Datos

### Arquitectura de 3 Capas

```
┌─────────────────────────────────────────────┐
│          CAPA DE PRESENTACIÓN               │
│  (React Components + React Hook Form)       │
│                                             │
│  - ClienteForm.tsx                          │
│  - ReciboForm.tsx                           │
│  - Validación en cliente (Zod)             │
└──────────────┬──────────────────────────────┘
               │
               │ Server Action call
               ↓
┌─────────────────────────────────────────────┐
│          CAPA DE LÓGICA DE NEGOCIO          │
│       (Server Actions "use server")         │
│                                             │
│  - create-recibo-action.ts                  │
│  - Validación Zod                           │
│  - Lógica de negocio                        │
│  - Transacciones                            │
└──────────────┬──────────────────────────────┘
               │
               │ Prisma ORM
               ↓
┌─────────────────────────────────────────────┐
│          CAPA DE DATOS                      │
│         (PostgreSQL Database)               │
│                                             │
│  - Recibo table                             │
│  - ItemRecibo table                         │
│  - Contrato table                           │
└─────────────────────────────────────────────┘
```

---

### Ejemplo: Crear Recibo

**1. Usuario completa formulario**

```typescript
// components/recibos/AddReciboForm.tsx
const form = useForm<ReciboFormData>({
  resolver: zodResolver(ReciboSchema)
})

const onSubmit = async (data: ReciboFormData) => {
  const result = await createRecibo(data) // ← Server Action
  if (result.success) {
    toast.success("Recibo creado")
  }
}
```

**2. Server Action procesa**

```typescript
// actions/create-recibo-action.ts
"use server"
export async function createRecibo(data: unknown) {
  // 1. Validación
  const result = ReciboSchema.safeParse(data)
  
  // 2. Lógica de negocio
  const montoTotal = await calcularMontoConAjuste(...)
  
  // 3. Transacción
  await prisma.$transaction(async (tx) => {
    const recibo = await tx.recibo.create({ data: ... })
    await tx.itemRecibo.createMany({ data: items })
    await tx.contrato.update({ data: ... })
  })
  
  return { success: true }
}
```

**3. Base de datos actualizada**

```sql
-- Prisma ejecuta:
INSERT INTO "Recibo" (...) VALUES (...);
INSERT INTO "ItemRecibo" (...) VALUES (...);
UPDATE "Contrato" SET ... WHERE id = ...;
```

---

## 🗂️ Convenciones de Código

### Nomenclatura de Archivos

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Componentes React | PascalCase.tsx | `ClienteForm.tsx` |
| Server Actions | kebab-case-action.ts | `create-recibo-action.ts` |
| Hooks | camelCase.ts | `useReciboData.ts` |
| Stores Zustand | storeName.ts | `storeRecibos.ts` |
| Schemas Zod | kebab-case-schema.ts | `recibo-schema.ts` |
| Utilities | camelCase.ts | `itemHelpers.ts` |
| Types | PascalCase.ts | `ReciboTypes.ts` |

---

### Organización de Componentes

**Patrón estándar para cada módulo:**

```typescript
// 1. Route (contenedor principal)
export default function ClientesRoute() {
  return (
    <div className="grid grid-cols-[300px_1fr]">
      <ClientesSideBar />
      <ClientesTableWrapper />
    </div>
  )
}

// 2. SideBar (navegación y acciones)
export function ClientesSideBar() {
  const [showForm, setShowForm] = useState(false)
  return (
    <aside>
      <Button onClick={() => setShowForm(true)}>
        Nuevo Cliente
      </Button>
      {showForm && <AddClienteForm />}
    </aside>
  )
}

// 3. TableWrapper (contenedor con lógica)
export function ClientesTableWrapper() {
  const { clientes } = useClientesStore()
  useEffect(() => {
    // Cargar datos
  }, [])
  return <ClientesTable data={clientes} />
}

// 4. Table (presentación pura)
export function ClientesTable({ data }: Props) {
  return (
    <table>
      {data.map(cliente => <ClienteRow {...cliente} />)}
    </table>
  )
}
```

**Razones del patrón:**
- ✅ Separación de responsabilidades
- ✅ Componentes reutilizables
- ✅ Fácil testing
- ✅ Server/Client components claramente definidos

---

### Patrones de Importación

```typescript
// 1. React primero
import { useState, useEffect } from 'react'

// 2. Next.js
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// 3. Librerías externas
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

// 4. Server Actions
import { createCliente } from '@/actions/create-cliente-action'

// 5. Stores y hooks
import { useClientesStore } from '@/src/stores/storeClientes'
import { useReciboData } from '@/src/hooks/useReciboData'

// 6. Schemas y tipos
import { ClienteSchema } from '@/src/schema/cliente-schema'
import type { Cliente } from '@/src/types/cliente'

// 7. Utilidades
import { formatCurrency } from '@/src/utils/format'
import { esItemAlquiler } from '@/src/utils/itemHelpers'

// 8. Componentes locales
import { ClienteForm } from './ClienteForm'
import { Button } from '@/components/ui/button'

// 9. Estilos (si aplica)
import styles from './Cliente.module.css'
```

---

## 🏪 Estado Global (Zustand)

### Stores Disponibles

```typescript
// src/stores/storeClientes.ts
export const useClientesStore = create<ClientesState>((set) => ({
  clientes: [],
  clienteSeleccionado: null,
  setClientes: (clientes) => set({ clientes }),
  selectCliente: (id) => set({ clienteSeleccionado: id })
}))

// src/stores/storeContratos.ts
export const useContratosStore = create<ContratosState>(...)

// src/stores/storePropiedades.ts
export const usePropiedadesStore = create<PropiedadesState>(...)

// src/stores/storeRecibos.ts
export const useRecibosStore = create<RecibosState>(...)
```

### Cuándo Usar Zustand vs Props

**Usar Zustand:**
- ✅ Estado compartido entre múltiples componentes
- ✅ Datos cargados desde servidor (lista de clientes)
- ✅ Selección/filtros globales
- ✅ Estado de UI global (sidebar abierto/cerrado)

**Usar Props/State Local:**
- ✅ Estado local de un componente
- ✅ Formularios (usar React Hook Form)
- ✅ Animaciones/transiciones
- ✅ Estado temporal no compartido

---

## 🎣 Custom Hooks

### Hooks Disponibles

#### 1. useReciboData

**Ubicación:** `src/hooks/useReciboData.ts`

**Propósito:** Preparar datos de recibo para el formulario.

```typescript
export function useReciboData(recibo: Recibo | null) {
  const [datosRecibo, setDatosRecibo] = useState<ReciboFormData | null>(null)
  
  useEffect(() => {
    if (!recibo) return
    
    // Filtrar items de alquiler si está PENDIENTE
    const itemsFiltrados = recibo.estadoReciboId === 1
      ? recibo.items.filter(item => !esItemAlquiler(item))
      : recibo.items
    
    setDatosRecibo({
      ...recibo,
      items: itemsFiltrados
    })
  }, [recibo])
  
  return datosRecibo
}
```

**Uso:**
```typescript
const recibo = useRecibosStore(s => s.reciboActual)
const datosFormulario = useReciboData(recibo)
```

---

#### 2. useReciboValidation

**Ubicación:** `src/hooks/useReciboValidation.ts`

**Propósito:** Validar items del recibo según su tipo.

```typescript
export function useReciboValidation(items: ItemData[]) {
  const validarItems = useCallback(() => {
    return items.every(item => {
      // Validar montos negativos
      if (!permiteMontoNegativo(item) && item.monto < 0) {
        return false
      }
      
      // Validar item alquiler obligatorio
      const tieneAlquiler = items.some(i => esItemAlquiler(i))
      return tieneAlquiler
    })
  }, [items])
  
  return { validarItems }
}
```

---

## 📋 Server Actions

### Estructura Estándar

```typescript
"use server"
import { prisma } from "@/src/lib/prisma"
import { EntitySchema } from "@/src/schema"

export async function createEntity(data: unknown) {
  try {
    // 1. Validación con Zod
    const result = EntitySchema.safeParse(data)
    if (!result.success) {
      return {
        success: false,
        errors: result.error.issues
      }
    }
    
    // 2. Validaciones de negocio
    const existe = await prisma.entity.findUnique({
      where: { uniqueField: result.data.uniqueField }
    })
    if (existe) {
      return {
        success: false,
        errors: [{ message: "Ya existe" }]
      }
    }
    
    // 3. Ejecutar transacción (si es necesario)
    const entity = await prisma.$transaction(async (tx) => {
      const created = await tx.entity.create({
        data: result.data
      })
      
      // Otras operaciones relacionadas
      await tx.relatedEntity.update({ ... })
      
      return created
    })
    
    // 4. Retornar resultado exitoso
    return {
      success: true,
      data: entity
    }
    
  } catch (error) {
    // 5. Manejo de errores
    console.error("Error en createEntity:", error)
    return {
      success: false,
      errors: [{ 
        path: ['general'],
        message: "Error interno del servidor"
      }]
    }
  }
}
```

### Tipos de Retorno Estandarizados

```typescript
// Success
type SuccessResponse<T> = {
  success: true
  data: T
}

// Error
type ErrorResponse = {
  success: false
  errors: Array<{
    path?: string[]
    message: string
  }>
}

type ActionResponse<T> = SuccessResponse<T> | ErrorResponse
```

---

## 🎨 Componentes UI Reutilizables

### Ubicación: `/components/ui`

Componentes base construidos con Tailwind CSS y shadcn/ui:

```
components/ui/
├── button.tsx              # Botones con variantes
├── input.tsx               # Inputs de formulario
├── select.tsx              # Selectores
├── dialog.tsx              # Modales
├── table.tsx               # Tablas
├── card.tsx                # Tarjetas
├── badge.tsx               # Badges/etiquetas
├── toast.tsx               # Notificaciones
└── form.tsx                # Componentes de formulario
```

**Ejemplo de uso:**

```typescript
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

<Button variant="primary" size="lg">
  Guardar
</Button>

<Input 
  type="text" 
  placeholder="Nombre"
  {...register("nombre")}
/>
```

---

## 🔐 Autenticación

### Estructura

```
src/auth/
├── config.ts               # Configuración NextAuth
├── middleware.ts           # Protección de rutas
└── utils.ts                # Utilidades de auth

app/auth/
├── login/
│   └── page.tsx           # Página de login
└── register/
    └── page.tsx           # Página de registro
```

### Flujo de Autenticación

```typescript
// 1. Usuario ingresa credenciales
const handleLogin = async (email: string, password: string) => {
  const result = await signIn('credentials', {
    email,
    password,
    redirect: false
  })
  
  if (result?.ok) {
    router.push('/home')
  }
}

// 2. NextAuth valida credenciales
// config.ts
export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email }
        })
        
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return user
        }
        return null
      }
    })
  ]
}

// 3. Middleware protege rutas
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('next-auth.session-token')
  
  if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect('/auth/login')
  }
}
```

---

## 📦 Schemas de Validación (Zod)

### Ubicación: `/src/schema`

```typescript
// src/schema/recibo-schema.ts
import { z } from 'zod'

export const ItemSchema = z.object({
  descripcion: z.string().min(1, "Descripción requerida"),
  monto: z.number(),
  tipoItemId: z.number().optional()
})

export const ReciboSchema = z.object({
  contratoId: z.number(),
  estadoReciboId: z.number(),
  montoTotal: z.number().positive("Monto debe ser positivo"),
  montoPagado: z.number(),
  montoAnterior: z.number(),
  fechaPendiente: z.date(),
  items: z.array(ItemSchema).min(1, "Debe tener al menos un item"),
  observaciones: z.string().optional()
})

export type ReciboFormData = z.infer<typeof ReciboSchema>
```

**Ventajas:**
- ✅ Type safety automático
- ✅ Validación en cliente y servidor
- ✅ Mensajes de error claros
- ✅ Integración con React Hook Form

---

## 🧪 Testing

### Estructura

```
__tests__/
├── calculaImporteRecibo.test.ts   # Test de cálculo de importes
├── create-recibo-action.test.ts   # Test de server action
├── formatFecha.test.ts            # Test de utilidades
├── verificaIpcActual.test.ts      # Test de validación IPC
└── jest_testing_guia.md           # Guía de testing
```

### Ejemplo de Test

```typescript
import { calcularImporteRecibo } from '@/src/utils/recibo'

describe('calcularImporteRecibo', () => {
  it('debe calcular correctamente con IPC', () => {
    const result = calcularImporteRecibo({
      montoAnterior: 100000,
      ipcs: [2.4, 3.73, 2.78],
      tipoIndice: 'IPC'
    })
    
    expect(result).toBeCloseTo(108.98, 2)
  })
  
  it('debe calcular correctamente con ICL', () => {
    const result = calcularImporteRecibo({
      montoAnterior: 100000,
      iclInicio: 1.123456,
      iclActual: 1.234567,
      tipoIndice: 'ICL'
    })
    
    expect(result).toBeCloseTo(109900, 0)
  })
})
```

---

## 🚀 Optimizaciones de Performance

### 1. Server Components por Defecto

```typescript
// ✅ Server Component (por defecto)
export default async function RecibosPage() {
  const recibos = await prisma.recibo.findMany()
  return <RecibosTable data={recibos} />
}

// ⚠️ Client Component (solo si necesita interactividad)
"use client"
export function ReciboForm() {
  const [value, setValue] = useState("")
  return <input value={value} onChange={e => setValue(e.target.value)} />
}
```

### 2. Streaming y Suspense

```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <RecibosTable />
    </Suspense>
  )
}
```

### 3. Caché de Datos

```typescript
// Caché de TipoItem IDs
const cachedTipoItemIds: Record<string, number> = {}

async function getTipoItemId(codigo: string): Promise<number> {
  if (cachedTipoItemIds[codigo]) {
    return cachedTipoItemIds[codigo]
  }
  
  const tipo = await prisma.tipoItem.findUnique({ where: { codigo } })
  cachedTipoItemIds[codigo] = tipo.id
  return tipo.id
}
```

### 4. Índices de Base de Datos

```prisma
model ItemRecibo {
  // ...
  @@index([reciboId])
  @@index([tipoItemId])
}
```

---

## 🔧 Configuración

### Next.js Config

```typescript
// next.config.ts
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true
  },
  images: {
    domains: ['localhost']
  }
}
```

### Tailwind Config

```typescript
// tailwind.config.ts
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: { ... },
        secondary: { ... }
      }
    }
  }
}
```

### TypeScript Config

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "preserve"
  }
}
```

---

## 📝 Buenas Prácticas

### 1. Separar Lógica de Presentación

```typescript
// ❌ Malo: Todo en un componente
export function ReciboForm() {
  const [recibo, setRecibo] = useState(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    // Cargar datos
    // Calcular montos
    // Validar
    // ...100 líneas de lógica
  }, [])
  
  return <form>...</form>
}

// ✅ Bueno: Lógica en hook, presentación en componente
export function ReciboForm() {
  const { recibo, loading, handleSubmit } = useReciboForm()
  
  return (
    <form onSubmit={handleSubmit}>
      {loading ? <Spinner /> : <ReciboFields data={recibo} />}
    </form>
  )
}
```

### 2. Usar TypeScript Estricto

```typescript
// ❌ Malo
function calcular(monto: any, porcentaje: any) {
  return monto * porcentaje
}

// ✅ Bueno
function calcular(monto: number, porcentaje: number): number {
  return monto * porcentaje
}
```

### 3. Validar Siempre en Servidor

```typescript
// ❌ Malo: Solo validación en cliente
"use client"
export function ClienteForm() {
  const onSubmit = async (data) => {
    // Sin validación en servidor
    await createCliente(data)
  }
}

// ✅ Bueno: Validación en ambos lados
"use server"
export async function createCliente(data: unknown) {
  // Validar en servidor SIEMPRE
  const result = ClienteSchema.safeParse(data)
  if (!result.success) {
    return { success: false, errors: result.error.issues }
  }
  // ...
}
```

### 4. Usar Transacciones para Operaciones Múltiples

```typescript
// ✅ Bueno
await prisma.$transaction(async (tx) => {
  const recibo = await tx.recibo.create({ data: reciboData })
  await tx.itemRecibo.createMany({ data: items })
  await tx.contrato.update({ where: { id }, data: updates })
})
// Todo o nada - consistencia garantizada
```

### 5. Manejar Errores Apropiadamente

```typescript
try {
  await createRecibo(data)
} catch (error) {
  if (error instanceof PrismaClientKnownRequestError) {
    // Error de BD conocido
    toast.error("Error de base de datos")
  } else if (error instanceof ZodError) {
    // Error de validación
    toast.error("Datos inválidos")
  } else {
    // Error desconocido
    console.error(error)
    toast.error("Error inesperado")
  }
}
```

---

## 📚 Referencias

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🔄 Historial de Cambios

### v2.1.0 (13 Nov 2025)
- Inferencia automática de TipoItem
- Mejoras en delete-recibo-action

### v2.0.0 (13 Nov 2025)
- Sistema TipoItem implementado
- Migración a App Router completa
- Documentación arquitectónica

---

[⬅️ Volver al README principal](../README.md)
