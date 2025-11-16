# ⚙️ Server Actions

Documentación completa de las Server Actions de Next.js 14 utilizadas en EUCAR.

---

## 📋 Descripción General

**Server Actions** son funciones que se ejecutan en el servidor pero pueden ser llamadas directamente desde componentes cliente. Reemplazan la necesidad de crear API Routes para operaciones simples de CRUD.

### Ventajas

✅ **Type Safety** - TypeScript end-to-end  
✅ **Simplicidad** - No necesita API routes separados  
✅ **Performance** - Ejecuta en servidor, reduce bundle del cliente  
✅ **Seguridad** - Lógica de negocio nunca expuesta al cliente  
✅ **DX** - Llamadas directas como funciones normales  

---

## 📂 Ubicación

```
actions/
├── create-cliente-action.ts      # Crear cliente
├── update-cliente-action.ts      # Actualizar cliente
├── create-propiedad-action.ts    # Crear propiedad
├── update-propiedad-action.ts    # Actualizar propiedad
├── create-contrato-action.ts     # Crear contrato
├── update-contrato-action.ts     # Actualizar contrato
├── create-recibo-action.ts       # Crear/regenerar recibo
├── update-recibo-action.ts       # Actualizar recibo
├── delete-recibo-action.ts       # Eliminar recibo
├── list-clientes-action.ts       # Listar clientes
├── list-propiedades-action.ts    # Listar propiedades
├── list-contratos-action.ts      # Listar contratos
├── list-recibos-action.ts        # Listar recibos
├── list-tipoContrato-action.ts   # Listar tipos de contrato
├── create-ipc-action.ts          # Crear registro IPC
├── create-icl-action.ts          # Crear registro ICL
└── ACTION_TEMPLATES.md           # Templates de referencia
```

---

## 📐 Estructura Estándar

Todas las server actions siguen esta estructura:

```typescript
"use server"
import { prisma } from "@/src/lib/prisma"
import { EntitySchema } from "@/src/schema"

/**
 * JSDoc con descripción de la función
 * @param data - Datos de entrada
 * @param id - ID (opcional, solo para update/delete)
 * @returns Objeto con success/error
 */
export async function actionName(data: unknown, id?: number) {
    try {
        // 1. VALIDACIÓN con Zod
        const result = EntitySchema.safeParse(data)
        if (!result.success) {
            return {
                success: false,
                errors: result.error.issues
            }
        }

        // 2. VALIDACIONES DE NEGOCIO
        const existe = await prisma.entity.findUnique({
            where: { uniqueField: result.data.uniqueField }
        })
        if (existe) {
            return {
                success: false,
                errors: [{ message: "Ya existe" }]
            }
        }

        // 3. OPERACIÓN DE BD (con transacción si es necesario)
        const entity = await prisma.$transaction(async (tx) => {
            const created = await tx.entity.create({
                data: result.data
            })
            // Operaciones relacionadas...
            return created
        })

        // 4. RETORNO EXITOSO
        return {
            success: true,
            data: entity
        }

    } catch (error) {
        // 5. MANEJO DE ERRORES
        console.error("Error:", error)
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

---

## 📝 Tipos de Acciones

### 1. CREATE Actions

**Patrón:** `create-{entity}-action.ts`

#### Ejemplo: create-cliente-action.ts

```typescript
"use server"
import { prisma } from "@/src/lib/prisma"
import { ClienteSchema } from "@/src/schema"

export async function createCliente(data: unknown) {
    try {
        // 1. Validar datos
        const result = ClienteSchema.safeParse(data)
        if (!result.success) {
            return {
                success: false,
                errors: result.error.issues
            }
        }

        // 2. Verificar CUIT único
        const existingCliente = await prisma.cliente.findUnique({
            where: { cuit: result.data.cuit }
        });

        if (existingCliente) {
            return {
                success: false,
                errors: [{ 
                    path: ['cuit'], 
                    message: "El CUIT ya está registrado" 
                }]
            };
        }

        // 3. Crear cliente
        const nuevoCliente = await prisma.cliente.create({
            data: result.data
        })

        return {
            success: true,
            data: nuevoCliente
        }

    } catch (error) {
        console.error("Error al crear cliente:", error)
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

**Uso en componente:**

```typescript
"use client"
import { createCliente } from '@/actions/create-cliente-action'

export function AddClienteForm() {
  const handleSubmit = async (data: ClienteFormData) => {
    const result = await createCliente(data)
    
    if (result.success) {
      toast.success("Cliente creado exitosamente")
      router.push('/admin/clientes')
    } else {
      result.errors.forEach(error => {
        toast.error(error.message)
      })
    }
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

---

### 2. UPDATE Actions

**Patrón:** `update-{entity}-action.ts`

#### Ejemplo: update-cliente-action.ts

```typescript
"use server"
import { prisma } from "@/src/lib/prisma"
import { ClienteSchema } from "@/src/schema"

export async function updateCliente(data: unknown, id: number) {
    try {
        // 1. Validar datos
        const result = ClienteSchema.safeParse(data);
        if (!result.success) {
            return {
                success: false,
                errors: result.error.issues
            };
        }

        // 2. Validar ID
        if (!id || isNaN(id) || id <= 0) {
            return {
                success: false,
                errors: [{ 
                    path: ['id'], 
                    message: "ID de cliente no válido" 
                }]
            };
        }

        // 3. Transacción atómica
        const resultado = await prisma.$transaction(async (tx) => {
            // Verificar existencia
            const clienteExistente = await tx.cliente.findUnique({
                where: { id }
            });

            if (!clienteExistente) {
                return {
                    success: false,
                    errors: [{ message: "Cliente no encontrado" }]
                };
            }

            // Verificar CUIT único (excluyendo este cliente)
            const clienteConMismoCuit = await tx.cliente.findFirst({
                where: {
                    AND: [
                        { cuit: result.data.cuit },
                        { id: { not: id } }
                    ]
                }
            });

            if (clienteConMismoCuit) {
                return {
                    success: false,
                    errors: [{ 
                        path: ['cuit'], 
                        message: "El CUIT ya está registrado en otro cliente" 
                    }]
                };
            }

            // Actualizar
            const clienteActualizado = await tx.cliente.update({
                where: { id },
                data: result.data
            });

            return {
                success: true,
                data: clienteActualizado
            };
        });

        return resultado;

    } catch (error) {
        console.error("Error al actualizar cliente:", error)
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

**Características:**
- ✅ Valida que el registro existe
- ✅ Verifica constraints únicos (excluyendo el registro actual)
- ✅ Usa transacciones para atomicidad

---

### 3. DELETE Actions

**Patrón:** `delete-{entity}-action.ts`

#### Ejemplo: delete-recibo-action.ts

```typescript
"use server"
import { prisma } from "@/src/lib/prisma"
import { ReciboSchema } from "@/src/schema"

export async function deleteRecibo(id: number, data: unknown) {
    try {
        // 1. Validar datos
        const result = ReciboSchema.safeParse(data)
        if (!result.success) {
            return {
                success: false,
                errors: result.error.issues
            }
        }

        // 2. Transacción
        const resultado = await prisma.$transaction(async (tx) => {
            // Verificar existencia
            const existingRecibo = await tx.recibo.findUnique({
                where: { id }
            });

            if (!existingRecibo) {
                return {
                    success: false,
                    errors: [{ message: "El Recibo no existe" }]
                };
            }

            // 3. Validaciones de negocio
            if (existingRecibo.estadoReciboId === 3 || existingRecibo.estadoReciboId === 4) {
                return {
                    success: false,
                    errors: [{ 
                        message: "No se puede eliminar un recibo en estado 'Pagado' o 'Impreso'" 
                    }]
                };
            }

            // 4. Eliminar items (cascade)
            await tx.itemRecibo.deleteMany({
                where: { reciboId: id }
            });

            // 5. Eliminar recibo
            const reciboEliminado = await tx.recibo.delete({
                where: { id }
            });

            // 6. Revertir cambios en contrato
            await tx.contrato.update({
                where: { id: existingRecibo.contratoId },
                data: {
                    mesesRestaActualizar: { increment: 1 },
                    cantidadMesesDuracion: { increment: 1 }
                }
            });

            return {
                success: true,
                data: reciboEliminado
            }
        });

        return resultado;

    } catch (error) {
        console.error("Error al eliminar Recibo:", error)
        return {
            success: false,
            errors: [{ message: "Error interno del servidor" }]
        }
    }
}
```

**Características:**
- ✅ Valida reglas de negocio antes de eliminar
- ✅ Elimina registros relacionados (cascade manual o DB)
- ✅ Revierte operaciones en otras tablas si es necesario

---

### 4. LIST Actions

**Patrón:** `list-{entities}-action.ts`

#### Ejemplo: list-clientes-action.ts

```typescript
"use server"
import { prisma } from "@/src/lib/prisma";

export async function getClientes() {
    try {
        const clientes = await prisma.cliente.findMany({
            orderBy: {
                apellido: 'asc',
            },
            include: {
                provincia: true,
                pais: true,
            },
        })
        return clientes;
    } catch (error) {
        console.error("Error al obtener clientes:", error)
        return []
    }
}
```

**Características:**
- ✅ Incluye relaciones necesarias
- ✅ Ordenamiento predeterminado
- ✅ Retorna array vacío en caso de error (no rompe la UI)

---

## 🔐 Validación con Zod

### Schema Básico

```typescript
// src/schema/cliente-schema.ts
import { z } from 'zod'

export const ClienteSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  apellido: z.string().min(1, "Apellido requerido"),
  cuit: z.string()
    .min(11, "CUIT debe tener 11 dígitos")
    .max(11, "CUIT debe tener 11 dígitos")
    .regex(/^\d+$/, "CUIT debe contener solo números"),
  email: z.string().email("Email inválido"),
  celular: z.string().min(1, "Celular requerido"),
  paisId: z.number().positive("País requerido"),
  provinciaId: z.number().positive("Provincia requerida"),
  // ... otros campos
})

export type ClienteFormData = z.infer<typeof ClienteSchema>
```

### Uso en Action

```typescript
const result = ClienteSchema.safeParse(data)

if (!result.success) {
  return {
    success: false,
    errors: result.error.issues
  }
}

// result.data está tipado como ClienteFormData
const nuevoCliente = await prisma.cliente.create({
  data: result.data
})
```

---

## 🔄 Transacciones

### ¿Cuándo usar transacciones?

**Usar cuando:**
- ✅ Múltiples operaciones relacionadas
- ✅ Necesitas rollback automático si algo falla
- ✅ Operaciones en múltiples tablas

**No usar cuando:**
- ❌ Una sola operación simple
- ❌ Operaciones independientes

### Ejemplo: create-recibo-action.ts

```typescript
const resultado = await prisma.$transaction(async (tx) => {
  // 1. Crear recibo
  const nuevoRecibo = await tx.recibo.create({ 
    data: reciboData 
  })

  // 2. Crear items del recibo
  await tx.itemRecibo.createMany({
    data: itemsConTipo
  })

  // 3. Actualizar contrato
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

  return {
    success: true,
    data: nuevoRecibo
  }
})
```

**Beneficio:** Si falla cualquier operación, TODAS se revierten automáticamente.

---

## 📊 Tipos de Retorno

### Success Response

```typescript
type SuccessResponse<T> = {
  success: true
  data: T
}
```

**Ejemplo:**
```typescript
{
  success: true,
  data: {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    // ... resto de datos
  }
}
```

---

### Error Response

```typescript
type ErrorResponse = {
  success: false
  errors: Array<{
    path?: string[]
    message: string
  }>
}
```

**Ejemplo de error de validación:**
```typescript
{
  success: false,
  errors: [
    {
      path: ['cuit'],
      message: "El CUIT ya está registrado"
    },
    {
      path: ['email'],
      message: "Email inválido"
    }
  ]
}
```

**Ejemplo de error general:**
```typescript
{
  success: false,
  errors: [
    {
      path: ['general'],
      message: "Error interno del servidor"
    }
  ]
}
```

---

## 🎯 Acciones Especiales

### create-recibo-action.ts

La action más compleja del sistema. Maneja:

1. **3 casos de generación** (ver [RECIBOS.md](./RECIBOS.md))
2. **Cálculo automático de montos** con IPC/ICL
3. **Inferencia de tipos de items**
4. **Regeneración de recibos PENDIENTE**
5. **Actualización de contratos**

```typescript
export async function createRecibo(data: unknown) {
  // 1. Validación
  const result = ReciboSchema.safeParse(data)
  
  // 2. Obtener TipoItem de ALQUILER
  const tipoAlquilerId = await getTipoAlquilerId()
  
  // 3. Preparar items con inferencia automática
  const itemsFinales = await prepararItems(items, tipoAlquilerId)
  
  // 4. Buscar recibo existente del mes
  const existeRecibo = await buscarReciboMesActual(contratoId)
  
  // 5. Transacción según caso
  const resultado = await prisma.$transaction(async (tx) => {
    if (!existeRecibo) {
      // CASO 1: Crear nuevo recibo
      return await crearNuevoRecibo(tx, reciboData, itemsFinales, tipoAlquilerId)
      
    } else if (existeRecibo.estadoReciboId === 1) {
      // CASO 2: Regenerar recibo PENDIENTE
      return await actualizarReciboPendiente(tx, existeRecibo.id, reciboData, itemsFinales, tipoAlquilerId)
      
    } else {
      // CASO 3: Ya existe recibo GENERADO
      return {
        success: false,
        errors: [{ message: "Ya existe un recibo generado" }]
      }
    }
  })
  
  return resultado
}
```

**Funciones auxiliares:**

```typescript
// Caché de TipoItem IDs
let cachedTipoAlquilerId: number | null = null
async function getTipoAlquilerId(): Promise<number> {
  if (cachedTipoAlquilerId !== null) {
    return cachedTipoAlquilerId
  }
  // Query BD y cachear...
}

// Inferencia de tipo de item
async function determinarTipoItem(item: ItemData, tipoAlquilerId: number) {
  if (item.tipoItemId) return item.tipoItemId
  if (esItemAlquiler(item)) return tipoAlquilerId
  if (item.monto < 0) return await getTipoItemId('REINTEGRO')
  return await getTipoItemId('EXTRA')
}
```

---

### delete-recibo-action.ts

Maneja la **reversión de operaciones**:

```typescript
// 1. Calcular nuevo mesesRestaActualizar
const tc = await tx.tipoContrato.findFirst({
  where: { id: contrato.tipoContratoId }
})

const nuevoMesesRestaActualizar = 
  tc.cantidadMesesActualizacion === contrato.mesesRestaActualizar 
    ? 0  // Si se había reseteado → volver a 0
    : contrato.mesesRestaActualizar + 1  // Sino → incrementar

// 2. Revertir cambios en contrato
await tx.contrato.update({
  where: { id: recibo.contratoId },
  data: {
    mesesRestaActualizar: nuevoMesesRestaActualizar,
    cantidadMesesDuracion: { increment: 1 },
    montoAlquilerUltimo: ultimoRecibo?.montoTotal || 0
  }
})
```

---

### update-recibo-action.ts

**Reglas de edición específicas:**

⚠️ **Solo se pueden editar recibos en estado PENDIENTE** (estadoReciboId = 1)  
🔒 **El item "Alquiler" NO se puede modificar** (se genera automáticamente)  
✏️ **Se pueden agregar/editar/eliminar items EXTRA y REINTEGRO**  
🔄 **El montoPagado se recalcula automáticamente**  
📋 **NO se modifica el contrato** (solo en creación/generación)

```typescript
export async function updateRecibo(id: number, data: unknown) {
  try {
    // 1. Validar datos
    const result = ReciboSchema.safeParse(data)
    if (!result.success) {
      return { success: false, errors: result.error.issues }
    }

    // 2. Obtener ID del tipo ALQUILER
    const tipoAlquilerId = await getTipoAlquilerId()

    // 3. Filtrar items del usuario (sin el Alquiler)
    const itemsSinAlquiler = filtrarItemsSinAlquiler(result.data.items)

    // 4. Asegurar que existe el item "Alquiler" con monto correcto
    const resultadoItems = await asegurarItemAlquiler(
      itemsSinAlquiler, 
      result.data.montoTotal, 
      tipoAlquilerId
    )
    
    if (!resultadoItems.success) {
      return {
        success: false,
        errors: [{ path: ['items'], message: resultadoItems.error }]
      }
    }

    // 5. Calcular montoPagado automáticamente
    const montoPagado = calcularMontoPagado(resultadoItems.items)

    // 6. Validar que el monto sea razonable
    const validacionMonto = validarMontoPagado(montoPagado)
    if (!validacionMonto.success) {
      return {
        success: false,
        errors: [{ path: ['items'], message: validacionMonto.error! }]
      }
    }

    // 7. Transacción atómica
    const resultado = await prisma.$transaction(async (tx) => {
      // Verificar existencia
      const existingRecibo = await tx.recibo.findUnique({ where: { id } })
      
      if (!existingRecibo) {
        return {
          success: false,
          errors: [{ path: ['id'], message: "El Recibo no existe" }]
        }
      }

      // VALIDACIÓN CRÍTICA: Solo permitir editar PENDIENTES
      if (existingRecibo.estadoReciboId !== 1) {
        return {
          success: false,
          errors: [{
            path: ['estadoReciboId'],
            message: "Solo se pueden editar recibos en estado 'Pendiente'"
          }]
        }
      }

      // Actualizar recibo (sin tocar el contrato)
      const reciboActualizado = await tx.recibo.update({
        where: { id },
        data: {
          ...updateData,
          montoPagado // Usar el calculado automáticamente
        }
      })

      // Reemplazar items
      await tx.itemRecibo.deleteMany({ where: { reciboId: id } })
      
      const itemsParaInsertar = await procesarItemsParaRecibo(
        resultadoItems.items, 
        id, 
        tipoAlquilerId
      )
      
      await tx.itemRecibo.createMany({ data: itemsParaInsertar })

      return { success: true, data: reciboActualizado }
    })

    return resultado
  } catch (error) {
    console.error("Error al actualizar Recibo:", error)
    return {
      success: false,
      errors: [{ path: ['general'], message: "Error interno del servidor" }]
    }
  }
}
```

**Utilidades compartidas** (en `src/utils/reciboHelpers.ts`):

```typescript
// Filtrar items sin el Alquiler
export function filtrarItemsSinAlquiler(items: ItemData[]): ItemData[] {
  return items.filter(item => !esItemAlquiler(item))
}

// Asegurar que existe el item Alquiler
export async function asegurarItemAlquiler(
  items: ItemData[],
  montoTotal: number,
  tipoAlquilerId: number
): Promise<{ success: true; items: ItemData[] } | { success: false; error: string }> {
  const itemAlquiler = items.find(item => esItemAlquiler(item))
  
  if (!itemAlquiler) {
    // Si no existe, crear el ítem "Alquiler"
    return {
      success: true,
      items: [
        { descripcion: "Alquiler", monto: montoTotal, tipoItemId: tipoAlquilerId },
        ...items
      ]
    }
  }
  
  // Si existe, validar monto
  const validacion = validarItemAlquiler(items, montoTotal)
  return validacion.success 
    ? { success: true, items } 
    : { success: false, error: validacion.error! }
}

// Calcular monto total a pagar
export function calcularMontoPagado(items: ItemData[]): number {
  return items.reduce((sum, item) => sum + item.monto, 0)
}

// Procesar items para recibo (asigna reciboId y tipoItemId)
export async function procesarItemsParaRecibo(
  items: ItemData[],
  reciboId: number,
  tipoAlquilerId: number
): Promise<Array<ItemConTipo & { reciboId: number }>> {
  const itemsConTipo = await procesarItemsConTipo(items, tipoAlquilerId)
  return itemsConTipo.map(item => ({ ...item, reciboId }))
}
```

**Diferencias clave con createRecibo:**

| Aspecto | createRecibo | updateRecibo |
|---------|-------------|--------------|
| Estados permitidos | PENDIENTE o nuevo | Solo PENDIENTE |
| Item Alquiler | Se genera automáticamente | Se genera automáticamente |
| Otros items | Se pueden agregar | Se pueden modificar |
| Actualiza contrato | ✅ Sí (mesesRestaActualizar, etc.) | ❌ No |
| Regeneración | ✅ Permite regenerar PENDIENTES | ❌ No aplica |
| Validación tipoItemId | Inferencia automática | Inferencia automática |

---

## 🧪 Testing de Server Actions

### Test Básico

```typescript
import { createCliente } from '@/actions/create-cliente-action'
import { prismaMock } from '@/tests/mocks/prisma'

describe('createCliente', () => {
  it('debe crear un cliente con datos válidos', async () => {
    const mockCliente = {
      nombre: 'Juan',
      apellido: 'Pérez',
      cuit: '20123456789',
      email: 'juan@email.com',
      celular: '1234567890',
      // ... otros campos
    }

    prismaMock.cliente.findUnique.mockResolvedValue(null) // No existe
    prismaMock.cliente.create.mockResolvedValue({
      id: 1,
      ...mockCliente
    })

    const result = await createCliente(mockCliente)

    expect(result.success).toBe(true)
    expect(result.data?.id).toBe(1)
  })

  it('debe retornar error si CUIT ya existe', async () => {
    const mockCliente = { /* ... */ }

    prismaMock.cliente.findUnique.mockResolvedValue({
      id: 2,
      cuit: '20123456789',
      // ... otros campos
    })

    const result = await createCliente(mockCliente)

    expect(result.success).toBe(false)
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        path: ['cuit'],
        message: expect.stringContaining('ya está registrado')
      })
    )
  })
})
```

---

### Test de Transacciones

```typescript
describe('createRecibo', () => {
  it('debe crear recibo y actualizar contrato en transacción', async () => {
    const mockRecibo = { /* ... */ }

    const result = await createRecibo(mockRecibo)

    expect(result.success).toBe(true)
    
    // Verificar que se creó el recibo
    expect(prismaMock.recibo.create).toHaveBeenCalled()
    
    // Verificar que se crearon items
    expect(prismaMock.itemRecibo.createMany).toHaveBeenCalled()
    
    // Verificar que se actualizó contrato
    expect(prismaMock.contrato.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          montoAlquilerUltimo: expect.any(Number)
        })
      })
    )
  })

  it('debe hacer rollback si falla alguna operación', async () => {
    prismaMock.itemRecibo.createMany.mockRejectedValue(new Error('DB Error'))

    const result = await createRecibo(mockRecibo)

    expect(result.success).toBe(false)
    // Verificar que no se creó nada (rollback automático)
  })
})
```

---

## 🎓 Buenas Prácticas

### 1. Validar SIEMPRE en Servidor

```typescript
// ❌ Malo: Confiar en validación del cliente
export async function createCliente(data: any) {
  // Sin validación!
  await prisma.cliente.create({ data })
}

// ✅ Bueno: Validar en servidor
export async function createCliente(data: unknown) {
  const result = ClienteSchema.safeParse(data)
  if (!result.success) {
    return { success: false, errors: result.error.issues }
  }
  // Ahora sí...
}
```

---

### 2. Usar Transacciones para Operaciones Múltiples

```typescript
// ❌ Malo: Sin transacción
const recibo = await prisma.recibo.create({ data })
await prisma.itemRecibo.createMany({ data: items })
await prisma.contrato.update({ where: { id }, data: updates })
// Si falla contrato.update, quedaron recibo e items huérfanos!

// ✅ Bueno: Con transacción
await prisma.$transaction(async (tx) => {
  const recibo = await tx.recibo.create({ data })
  await tx.itemRecibo.createMany({ data: items })
  await tx.contrato.update({ where: { id }, data: updates })
})
// Todo o nada
```

---

### 3. Retornar Tipos Consistentes

```typescript
// ❌ Malo: Tipos inconsistentes
export async function createCliente(data: unknown) {
  if (error) return null
  if (exists) return false
  return cliente
}

// ✅ Bueno: Siempre mismo tipo
export async function createCliente(data: unknown): Promise<ActionResponse<Cliente>> {
  if (error) return { success: false, errors: [...] }
  if (exists) return { success: false, errors: [...] }
  return { success: true, data: cliente }
}
```

---

### 4. Manejar Errores Apropiadamente

```typescript
export async function createCliente(data: unknown) {
  try {
    // Operaciones...
    
  } catch (error) {
    // Log del error (servidor)
    console.error("Error al crear cliente:", error)
    
    // Mensaje genérico para el cliente (seguridad)
    return {
      success: false,
      errors: [{
        path: ['general'],
        message: "Error interno del servidor. Intente nuevamente."
      }]
    }
  }
}
```

---

### 5. Documentar con JSDoc

```typescript
/**
 * Crea un nuevo cliente en el sistema
 * 
 * Valida los datos con Zod y verifica que el CUIT sea único.
 * El cliente se crea con estado activo por defecto.
 * 
 * @param data - Datos del cliente a crear (validados con ClienteSchema)
 * @returns Objeto con success=true y el cliente creado, o success=false con errores
 * 
 * @example
 * const result = await createCliente({
 *   nombre: "Juan",
 *   apellido: "Pérez",
 *   cuit: "20123456789",
 *   // ...
 * })
 * 
 * if (result.success) {
 *   console.log("Cliente creado:", result.data.id)
 * }
 */
export async function createCliente(data: unknown) {
  // ...
}
```

---

## 📚 Referencias

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Prisma Transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
- [Zod Validation](https://zod.dev/)
- [RECIBOS.md](./RECIBOS.md) - Lógica de negocio de recibos
- [DATABASE.md](./DATABASE.md) - Schema de base de datos
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura del proyecto

---

## 📝 Checklist para Nuevas Actions

Al crear una nueva server action, asegúrate de:

- [ ] Incluir `"use server"` al inicio
- [ ] Validar datos con Zod
- [ ] Manejar errores con try/catch
- [ ] Usar transacciones si modifica múltiples tablas
- [ ] Verificar constraints únicos antes de crear/actualizar
- [ ] Retornar tipo consistente `{ success, data?, errors? }`
- [ ] Documentar con JSDoc
- [ ] Agregar tests unitarios
- [ ] Log de errores en servidor (no exponer detalles al cliente)
- [ ] Validaciones de negocio específicas

---

[⬅️ Volver al README principal](../README.md)
