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
