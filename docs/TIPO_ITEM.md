# 🏷️ Sistema TipoItem

Documentación completa del sistema de tipos de items implementado en la versión 2.0.

---

## 📋 Descripción General

El sistema `TipoItem` reemplaza las comparaciones hardcodeadas de strings por un sistema flexible y type-safe que permite:

- ✅ Configurar comportamiento de items desde base de datos
- ✅ Agregar nuevos tipos sin modificar código
- ✅ Validaciones automáticas según configuración
- ✅ UI dinámica con colores por tipo
- ✅ Type safety completo con TypeScript

---

## 🗄️ Schema de Base de Datos

### Tabla TipoItem

```prisma
model TipoItem {
  id               Int           @id @default(autoincrement())
  codigo           String        @unique @db.VarChar(50)
  nombre           String        @db.VarChar(100)
  descripcion      String?       @db.Text
  esModificable    Boolean       @default(true)
  esEliminable     Boolean       @default(true)
  permiteNegativo  Boolean       @default(false)
  esObligatorio    Boolean       @default(false)
  orden            Int           @default(0)
  color            String?       @db.VarChar(20)
  activo           Boolean       @default(true)
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  
  items            ItemRecibo[]
  
  @@index([codigo])
  @@index([activo])
}
```

### Relación con ItemRecibo

```prisma
model ItemRecibo {
  id            Int       @id @default(autoincrement())
  reciboId      Int
  tipoItemId    Int
  descripcion   String    @db.VarChar(255)
  monto         Float     @default(0) @db.DoublePrecision
  observaciones String?   @db.Text
  createdAt     DateTime  @default(now())
  
  recibo        Recibo    @relation(...)
  tipoItem      TipoItem  @relation(...)
  
  @@index([reciboId])
  @@index([tipoItemId])
}
```

---

## 🎨 Tipos Predefinidos

### 1. 🔴 ALQUILER

```typescript
{
  codigo: 'ALQUILER',
  nombre: 'Alquiler',
  descripcion: 'Monto principal del alquiler',
  esModificable: false,    // Usuario NO puede editar
  esEliminable: false,     // Usuario NO puede eliminar
  permiteNegativo: false,  // Solo valores positivos
  esObligatorio: true,     // Debe existir en todo recibo
  orden: 1,                // Siempre primero
  color: 'red',           // Rojo en UI
  activo: true
}
```

**Uso:** Item principal de alquiler calculado automáticamente.

---

### 2. 🟢 DESCUENTO

```typescript
{
  codigo: 'DESCUENTO',
  nombre: 'Descuento',
  descripcion: 'Descuentos o bonificaciones',
  esModificable: true,     // Usuario puede editar
  esEliminable: true,      // Usuario puede eliminar
  permiteNegativo: true,   // Permite montos negativos
  esObligatorio: false,    // Opcional
  orden: 10,               // Al final
  color: 'green',         // Verde en UI
  activo: true
}
```

**Uso:** Bonificaciones, descuentos, rebajas.

---

### 3. 🟡 EXTRA

```typescript
{
  codigo: 'EXTRA',
  nombre: 'Concepto Extra',
  descripcion: 'Conceptos adicionales',
  esModificable: true,     // Usuario puede editar
  esEliminable: true,      // Usuario puede eliminar
  permiteNegativo: false,  // Solo positivos
  esObligatorio: false,    // Opcional
  orden: 5,                // Medio
  color: 'yellow',        // Amarillo en UI
  activo: true
}
```

**Uso:** Conceptos adicionales genéricos.

---

### 4. 🔵 SERVICIO

```typescript
{
  codigo: 'SERVICIO',
  nombre: 'Servicio',
  descripcion: 'Servicios (ABL, Expensas, etc.)',
  esModificable: true,     // Usuario puede editar
  esEliminable: true,      // Usuario puede eliminar
  permiteNegativo: false,  // Solo positivos
  esObligatorio: false,    // Opcional
  orden: 3,                // Después de alquiler
  color: 'blue',          // Azul en UI
  activo: true
}
```

**Uso:** ABL, expensas, AYSA, luz, gas, agua.

---

### 5. 🟣 REINTEGRO

```typescript
{
  codigo: 'REINTEGRO',
  nombre: 'Reintegro',
  descripcion: 'Reintegros o devoluciones',
  esModificable: true,     // Usuario puede editar
  esEliminable: true,      // Usuario puede eliminar
  permiteNegativo: true,   // Permite negativos
  esObligatorio: false,    // Opcional
  orden: 8,                // Antes de descuentos
  color: 'violet',        // Violeta en UI
  activo: true
}
```

**Uso:** Reintegros, devoluciones de gastos.

---

## 🛠️ Helpers TypeScript

### Archivo: `src/utils/itemHelpers.ts`

#### Constantes

```typescript
export const CODIGO_ALQUILER = 'ALQUILER'
export const CODIGO_DESCUENTO = 'DESCUENTO'
export const CODIGO_EXTRA = 'EXTRA'
export const CODIGO_SERVICIO = 'SERVICIO'
export const CODIGO_REINTEGRO = 'REINTEGRO'
```

#### Funciones Principales

##### 1. `esItemAlquiler(item: unknown): boolean`

Verifica si un item es de tipo ALQUILER.

```typescript
if (esItemAlquiler(item)) {
  // Item es de alquiler - no modificable
}
```

**Fallback:** Si no tiene `tipoItem` cargado, verifica por descripción.

---

##### 2. `puedeEliminarItem(item: unknown): boolean`

Determina si el usuario puede eliminar el item.

```typescript
if (puedeEliminarItem(item)) {
  // Mostrar botón eliminar
}
```

**Retorna:** `item.tipoItem.esEliminable`

---

##### 3. `puedeModificarItem(item: unknown): boolean`

Determina si el usuario puede modificar descripción/monto.

```typescript
<input
  disabled={!puedeModificarItem(item)}
  value={item.descripcion}
/>
```

**Retorna:** `item.tipoItem.esModificable`

---

##### 4. `permiteMontoNegativo(item: unknown): boolean`

Verifica si el tipo permite montos negativos.

```typescript
if (!permiteMontoNegativo(item) && monto < 0) {
  // Error: tipo no permite negativos
}
```

**Retorna:** `item.tipoItem.permiteNegativo`

---

##### 5. `getColorItem(item: unknown): string`

Obtiene el color del tipo para la UI.

```typescript
const color = getColorItem(item)
// Retorna: 'red' | 'green' | 'yellow' | 'blue' | 'violet' | 'gray'
```

**Uso en componente:**
```typescript
const colorClasses = {
  red: 'bg-red-100 border-red-300',
  green: 'bg-green-100 border-green-300',
  yellow: 'bg-yellow-100 border-yellow-300',
  // ...
}

<div className={colorClasses[getColorItem(item)]}>
```

---

##### 6. `validarMontoItem(item: unknown, monto: number): boolean`

Valida que un monto sea coherente con el tipo.

```typescript
if (!validarMontoItem(item, nuevoMonto)) {
  // Error: monto no válido para este tipo
}
```

**Lógica:**
- Monto 0: siempre válido
- `permiteNegativo === true`: cualquier valor válido
- `permiteNegativo === false`: solo positivos válidos

---

## 🤖 Inferencia Automática de Tipos

### Descripción

A partir de la versión 2.0, el sistema **determina automáticamente** el tipo de cada item basándose en su contenido, sin necesidad de que el usuario lo seleccione manualmente.

### Lógica de Inferencia

La función `determinarTipoItem()` en `create-recibo-action.ts` aplica las siguientes reglas:

```typescript
async function determinarTipoItem(item: ItemData, tipoAlquilerId: number): Promise<number> {
    // 1. Si ya tiene tipoItemId asignado → respetarlo
    if (item.tipoItemId) {
        return item.tipoItemId
    }
    
    // 2. Si es el item de Alquiler → ALQUILER
    if (esItemAlquiler(item)) {
        return tipoAlquilerId
    }
    
    // 3. Si el monto es negativo → REINTEGRO
    if (item.monto < 0) {
        return await getTipoItemId('REINTEGRO')
    }
    
    // 4. Por defecto → EXTRA
    return await getTipoItemId('EXTRA')
}
```

### Reglas de Asignación

| Condición | Tipo Asignado | Razón |
|-----------|---------------|-------|
| Item con `tipoItemId` definido | **Respeta el tipo** | Ya fue asignado previamente |
| Descripción = "Alquiler" | **ALQUILER** | Item principal del recibo |
| `monto < 0` | **REINTEGRO** | Descuentos, devoluciones, bonificaciones |
| `monto >= 0` (y no es Alquiler) | **EXTRA** | Gastos adicionales, servicios, cargos |

### Ejemplos Prácticos

#### Ejemplo 1: Recibo Simple

```typescript
const items = [
  { descripcion: "Alquiler", monto: 100000 },
  { descripcion: "Descuento pago anticipado", monto: -5000 },
  { descripcion: "Gastos de limpieza", monto: 3000 }
]

// Resultado automático:
// ✅ "Alquiler" → ALQUILER (tipoItemId = 1)
// ✅ "Descuento..." (monto < 0) → REINTEGRO (tipoItemId = 3)
// ✅ "Gastos..." (monto > 0) → EXTRA (tipoItemId = 5)
```

#### Ejemplo 2: Múltiples Items Negativos

```typescript
const items = [
  { descripcion: "Alquiler", monto: 150000 },
  { descripcion: "Bonificación inquilino antiguo", monto: -10000 },
  { descripcion: "Reintegro reparación", monto: -8000 },
  { descripcion: "ABL", monto: 5000 }
]

// Resultado:
// ✅ "Alquiler" → ALQUILER
// ✅ "Bonificación..." → REINTEGRO (automático por monto < 0)
// ✅ "Reintegro..." → REINTEGRO (automático por monto < 0)
// ✅ "ABL" → EXTRA (monto positivo)
```

### ¿Cuándo se Aplica?

La inferencia automática se ejecuta en dos momentos:

1. **Creación de recibo nuevo** (`crearNuevoRecibo`)
2. **Actualización de recibo PENDIENTE** (`actualizarReciboPendiente`)

```typescript
// En create-recibo-action.ts
const itemsConTipo = await Promise.all(
    items.map(async (item) => ({
        reciboId: nuevoRecibo.id,
        descripcion: item.descripcion,
        monto: item.monto,
        tipoItemId: await determinarTipoItem(item, tipoAlquilerId) // ← Inferencia
    }))
);

await tx.itemRecibo.createMany({
    data: itemsConTipo
});
```

### Optimización: Caché de Tipos

Para evitar consultas repetidas a la BD, los IDs de tipos se cachean en memoria:

```typescript
const cachedTipoItemIds: Record<string, number> = {}

async function getTipoItemId(codigo: string): Promise<number> {
    if (cachedTipoItemIds[codigo]) {
        return cachedTipoItemIds[codigo] // ← Retorna desde caché
    }
    
    const tipo = await prisma.tipoItem.findUnique({
        where: { codigo }
    })
    
    cachedTipoItemIds[codigo] = tipo.id // ← Guarda en caché
    return tipo.id
}
```

### Ventajas

✅ **Simplicidad:** Usuario no necesita seleccionar tipo manualmente  
✅ **Automático:** Funciona "out of the box" sin configuración  
✅ **Inteligente:** Detecta descuentos por signo del monto  
✅ **Extensible:** Fácil agregar más reglas en el futuro  
✅ **Performance:** Caché reduce queries a la BD  

### Mejora Futura: UI Selector

Para casos más complejos, se puede agregar un selector manual en el formulario:

```typescript
// Futuro: ItemsSection.tsx
<select
  value={item.tipoItemId}
  onChange={(e) => updateItemTipo(index, e.target.value)}
>
  <option value={tipoAlquilerId}>Alquiler</option>
  <option value={tipoReintegroId}>Reintegro</option>
  <option value={tipoExtraId}>Extra</option>
  <option value={tipoServicioId}>Servicio</option>
</select>
```

Esta mejora permitirá que el usuario sobrescriba la inferencia automática cuando sea necesario.

---

## 💻 Uso en Componentes

### Ejemplo: ItemsSection.tsx

```typescript
import { 
  esItemAlquiler, 
  puedeEliminarItem, 
  puedeModificarItem, 
  getColorItem 
} from '@/src/utils/itemHelpers'

export default function ItemsSection() {
  const { items } = useRecibosFormStore()
  
  return (
    <>
      {items.map((item, index) => {
        const isAlquiler = esItemAlquiler(item)
        const esModificable = puedeModificarItem(item)
        const esEliminable = puedeEliminarItem(item)
        const color = getColorItem(item)
        
        return (
          <div className={`bg-${color}-100 border-${color}-300`}>
            <input
              value={item.descripcion}
              disabled={!esModificable}
            />
            <input
              value={item.monto}
              disabled={!esModificable}
            />
            {esEliminable && (
              <button onClick={() => removeItem(index)}>
                Eliminar
              </button>
            )}
          </div>
        )
      })}
    </>
  )
}
```

---

## 🔄 Migración de Datos Existentes

### Script de Migración

**Archivo:** `prisma/migrate-items.ts`

Actualiza items existentes según patrones en descripción:

```sql
-- 1. Items "Alquiler" → ALQUILER
UPDATE "ItemRecibo" 
SET "tipoItemId" = (SELECT id FROM "TipoItem" WHERE codigo = 'ALQUILER')
WHERE LOWER(TRIM(descripcion)) = 'alquiler';

-- 2. Descuentos → DESCUENTO
UPDATE "ItemRecibo" 
SET "tipoItemId" = (SELECT id FROM "TipoItem" WHERE codigo = 'DESCUENTO')
WHERE descripcion LIKE '%descuento%' OR monto < 0;

-- 3. Servicios → SERVICIO
UPDATE "ItemRecibo" 
SET "tipoItemId" = (SELECT id FROM "TipoItem" WHERE codigo = 'SERVICIO')
WHERE descripcion LIKE '%abl%' OR descripcion LIKE '%expensa%';

-- 4. Resto → EXTRA
UPDATE "ItemRecibo" 
SET "tipoItemId" = (SELECT id FROM "TipoItem" WHERE codigo = 'EXTRA')
WHERE "tipoItemId" IS NULL;
```

**Ejecutar:**
```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/migrate-items.ts
```

---

## 🎯 Ventajas del Sistema

### Antes (Hardcoded)

```typescript
// ❌ Frágil
if (item.descripcion === "Alquiler") {
  // Problemas: typos, espacios, case sensitivity
}

// ❌ No extensible
if (item.descripcion === "Descuento" || 
    item.descripcion === "Bonificación" || 
    item.descripcion === "Rebaja") {
  // Cada nuevo caso requiere código
}
```

### Ahora (TipoItem)

```typescript
// ✅ Type-safe
if (esItemAlquiler(item)) {
  // Usa tipoItem.codigo, no strings
}

// ✅ Extensible
// Agregar nuevo tipo en BD → sin cambios de código

// ✅ Configurable
if (puedeModificarItem(item)) {
  // Comportamiento definido en BD
}
```

---

## 🧪 Testing

### Mockear TipoItem

```typescript
const mockItemAlquiler = {
  descripcion: 'Alquiler',
  monto: 100000,
  tipoItemId: 1,
  tipoItem: {
    codigo: 'ALQUILER',
    esModificable: false,
    esEliminable: false,
    permiteNegativo: false,
    color: 'red'
  }
}

expect(esItemAlquiler(mockItemAlquiler)).toBe(true)
expect(puedeEliminarItem(mockItemAlquiler)).toBe(false)
```

---

## 📚 Referencias

- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [TypeScript Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
- [Zustand Store](https://github.com/pmndrs/zustand)

---

[⬅️ Volver al README principal](../README.md)
