# 🧩 Item Helpers - Sistema de Gestión de Ítems

## 🎯 Propósito

Helpers para trabajar con ítems de recibos. Proporciona funciones para identificar tipos de ítems, validar permisos de modificación/eliminación, y obtener propiedades de visualización.

---

## 📦 Exports Principales

### Constantes

#### `TIPO_ITEM_MAP`
Mapeo hardcodeado de IDs de tipo de ítem a códigos string.

```typescript
const TIPO_ITEM_MAP: Record<number, string> = {
  1: 'ALQUILER',
  2: 'DESCUENTO',
  3: 'EXTRA',
  4: 'SERVICIO',
  5: 'REINTEGRO'
}
```

**Uso**: Obtener código de tipo cuando solo tenemos el ID.

#### `TIPO_ITEM_PROPS`
Mapeo hardcodeado de IDs a propiedades del tipo de ítem.

```typescript
const TIPO_ITEM_PROPS: Record<number, {
  esModificable: boolean
  esEliminable: boolean
  color: string
}> = {
  1: { esModificable: false, esEliminable: false, color: 'bg-blue-100' },  // ALQUILER
  2: { esModificable: true, esEliminable: true, color: 'bg-red-100' },      // DESCUENTO
  3: { esModificable: true, esEliminable: true, color: 'bg-green-100' },    // EXTRA
  4: { esModificable: false, esEliminable: false, color: 'bg-yellow-100' }, // SERVICIO
  5: { esModificable: false, esEliminable: false, color: 'bg-purple-100' }  // REINTEGRO
}
```

**Razón del Hardcoding**:
- ✅ Datos estables en BD (raramente cambian)
- ✅ Evita queries adicionales a BD
- ✅ Mejora performance
- ✅ Type-safe con TypeScript
- ✅ Fácil de mantener

---

## 🔧 Funciones Helper

### `obtenerCodigoItem(item)`
Obtiene el código string del tipo de ítem.

**Parámetros:**
```typescript
item: {
  tipoItem?: { codigo: string }  // Objeto con relación cargada
  tipoItemId?: number            // Solo ID numérico
}
```

**Retorna:** `string` - Código del tipo ('ALQUILER', 'DESCUENTO', etc.)

**Ejemplo:**
```typescript
// Con relación cargada
const item1 = { tipoItem: { codigo: 'ALQUILER' } }
obtenerCodigoItem(item1) // 'ALQUILER'

// Solo con ID
const item2 = { tipoItemId: 1 }
obtenerCodigoItem(item2) // 'ALQUILER' (desde TIPO_ITEM_MAP)

// Ambos (prioriza tipoItem.codigo)
const item3 = { tipoItem: { codigo: 'ALQUILER' }, tipoItemId: 1 }
obtenerCodigoItem(item3) // 'ALQUILER'
```

---

### `obtenerPropsItem(item)`
Obtiene las propiedades del tipo de ítem.

**Parámetros:**
```typescript
item: {
  tipoItem?: {
    esModificable: boolean
    esEliminable: boolean
    color: string
  }
  tipoItemId?: number
}
```

**Retorna:** `object` - Propiedades del tipo
```typescript
{
  esModificable: boolean  // Si el ítem puede modificarse
  esEliminable: boolean   // Si el ítem puede eliminarse
  color: string           // Color de fondo para UI
}
```

**Ejemplo:**
```typescript
// Con relación cargada
const item1 = { tipoItem: { esModificable: false, esEliminable: false, color: 'bg-blue-100' } }
obtenerPropsItem(item1) 
// { esModificable: false, esEliminable: false, color: 'bg-blue-100' }

// Solo con ID
const item2 = { tipoItemId: 1 }
obtenerPropsItem(item2)
// { esModificable: false, esEliminable: false, color: 'bg-blue-100' } (desde TIPO_ITEM_PROPS)
```

---

### `esItemAlquiler(item)`
Verifica si el ítem es de tipo ALQUILER.

**Parámetros:** `item` - Objeto con tipoItem o tipoItemId

**Retorna:** `boolean` - true si es ALQUILER

**Ejemplo:**
```typescript
const item = { tipoItemId: 1 }
esItemAlquiler(item) // true

const item2 = { tipoItem: { codigo: 'EXTRA' } }
esItemAlquiler(item2) // false
```

---

### `puedeEliminarItem(item)`
Verifica si el ítem puede ser eliminado.

**Parámetros:** `item` - Objeto con tipoItem o tipoItemId

**Retorna:** `boolean` - true si esEliminable

**Ejemplo:**
```typescript
const alquiler = { tipoItemId: 1 }
puedeEliminarItem(alquiler) // false (ALQUILER no se elimina)

const extra = { tipoItemId: 3 }
puedeEliminarItem(extra) // true (EXTRA se puede eliminar)
```

---

### `puedeModificarItem(item)`
Verifica si el ítem puede ser modificado.

**Parámetros:** `item` - Objeto con tipoItem o tipoItemId

**Retorna:** `boolean` - true si esModificable

**Ejemplo:**
```typescript
const alquiler = { tipoItemId: 1 }
puedeModificarItem(alquiler) // false (ALQUILER no se modifica)

const descuento = { tipoItemId: 2 }
puedeModificarItem(descuento) // true (DESCUENTO se puede modificar)
```

---

### `getColorItem(item)`
Obtiene el color de fondo para el ítem en la UI.

**Parámetros:** `item` - Objeto con tipoItem o tipoItemId

**Retorna:** `string` - Clase Tailwind CSS

**Ejemplo:**
```typescript
const alquiler = { tipoItemId: 1 }
getColorItem(alquiler) // 'bg-blue-100'

const descuento = { tipoItemId: 2 }
getColorItem(descuento) // 'bg-red-100'
```

---

## 🔄 Compatibilidad

Todas las funciones trabajan con **dos formatos de ítem**:

### Formato 1: Con relación cargada (Prisma include)
```typescript
const item = {
  id: 1,
  descripcion: "Alquiler",
  monto: 50000,
  tipoItem: {
    codigo: 'ALQUILER',
    esModificable: false,
    esEliminable: false,
    color: 'bg-blue-100'
  }
}
```

### Formato 2: Solo ID (Prisma sin include)
```typescript
const item = {
  id: 1,
  descripcion: "Alquiler",
  monto: 50000,
  tipoItemId: 1  // Solo el ID, sin relación
}
```

**Estrategia de Fallback**:
1. Si existe `tipoItem.codigo`, usar esos datos (más específico)
2. Si no, usar `tipoItemId` con los mapas hardcoded (fallback)
3. Si ninguno existe, retornar valores por defecto seguros

---

## 📊 Tipos de Ítem

| ID | Código | esModificable | esEliminable | Color | Uso |
|----|--------|---------------|--------------|-------|-----|
| 1 | ALQUILER | ❌ | ❌ | Azul | Monto base del alquiler (calculado) |
| 2 | DESCUENTO | ✅ | ✅ | Rojo | Descuentos aplicados |
| 3 | EXTRA | ✅ | ✅ | Verde | Cargos adicionales |
| 4 | SERVICIO | ❌ | ❌ | Amarillo | Servicios (ABL, luz, gas, etc.) |
| 5 | REINTEGRO | ❌ | ❌ | Morado | Reintegros y devoluciones |

---

## 🐛 Fix: Warnings de Console

### Problema Original
```
⚠️ Item sin tipoItem cargado, verificando por descripción (fallback)
```

### Causa
Items creados sin incluir `tipoItemId`:
```typescript
// ❌ Antes (causaba warning)
addItem({ descripcion: "", monto: 0 })
```

### Solución
1. **storeRecibos.ts**: Agregar `tipoItemId: 3` al crear items
```typescript
// ✅ Ahora
addItem({ descripcion: "", monto: 0, tipoItemId: 3 })
```

2. **useReciboValidation.ts**: Incluir `tipoItemId: 1` en items Alquiler
```typescript
const itemsActualizados = [
  { descripcion: "Alquiler", monto: montoCalculado, tipoItemId: 1 }
]
```

3. **itemHelpers.ts**: Sistema de mapeo hardcoded como fallback
```typescript
const codigo = item.tipoItem?.codigo || TIPO_ITEM_MAP[item.tipoItemId || 0] || 'DESCONOCIDO'
```

---

## 🧹 Limpieza de Código

### Funciones Eliminadas (Sin Uso)
- ❌ `permiteMontoNegativo()` - 0 usos encontrados
- ❌ `validarMontoItem()` - 0 usos encontrados
- ❌ `esItemObligatorio()` - 0 usos encontrados

### Impacto
- Reducción: 168 → 121 líneas (-28%)
- Alcanzado: 100% tasa de uso de funciones
- Mantenibilidad: Código más limpio y enfocado

---

## 📍 Ubicación

```
src/utils/itemHelpers.ts
```

---

## 🔗 Dependencias

- **Ninguna** - Funciones puras sin dependencias externas
- Solo requiere tipos de TypeScript

---

## 🧪 Testing

### Casos de Prueba Cubiertos
✅ Items con relación `tipoItem` cargada  
✅ Items solo con `tipoItemId`  
✅ Items con ambos (prioriza relación)  
✅ Items sin ninguno (fallback a defaults)  
✅ Todos los tipos de ítem (1-5)  

---

## 📚 Referencias

- **Store**: `src/stores/storeRecibos.ts`
- **Hook**: `src/hooks/useReciboValidation.ts`
- **Componente**: `components/recibos/ItemsSection.tsx`
- **Changelog**: `CHANGELOG.md` (versión 2.3.0)

---

**Versión**: 2.3.0  
**Última actualización**: 18/11/2024  
**Autor**: Sistema de Gestión EUCAR
