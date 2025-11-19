# 📝 Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [2.3.0] - 2024-11-18

### 🎉 Agregado

#### Verificación de Índices ICL
- **Nueva función**: `src/lib/verificaIclActual.ts`
  - Verifica disponibilidad de índices ICL antes de calcular montos
  - Busca índices dentro del mes de la fecha de generación
  - Retorna `true` si existe al menos un índice ICL en el mes
  - Retorna `false` si no hay índices disponibles
- **Previene cálculos prematuros** con datos ICL potencialmente incorrectos
- **Consistencia** con verificación IPC existente

#### Componente InfoAlert - Sistema de Alertas Profesional
- Nuevo componente reutilizable `components/ui/InfoAlert.tsx`
- **4 variantes** con diseño profesional y color-coded:
  - `info` (azul): Mensajes informativos
  - `warning` (amarillo): Advertencias y validaciones
  - `success` (verde): Confirmaciones exitosas
  - `error` (rojo): Errores críticos
- **Props**:
  - `title`: Título principal del mensaje
  - `message`: Mensaje descriptivo
  - `subMessage?`: Mensaje adicional opcional
  - `variant?`: Tipo de alerta (por defecto "info")
  - `showBackButton?`: Mostrar botón de volver (por defecto true)
- Íconos dinámicos según variante (Lucide React)
- Integrado botón "Volver" interno (elimina duplicación)

#### Validaciones de Edición de Recibos
- **Validación por Estado** en `/admin/recibos/[id]/edit`:
  - ❌ Error: Recibo no encontrado
  - ⚠️ Warning: Recibo no editable (estados GENERADO/PAGADO/IMPRESO/ANULADO)
  - 💡 Info: Recibo listo para regenerar (índices disponibles)
  - ✅ Success: Permite editar (PENDIENTE sin índices)

- **Validación de Índices Disponibles**:
  - Detecta cuando recibo PENDIENTE ya puede regenerarse
  - Verifica disponibilidad de IPC según `mesesRestaActualizar`
  - Bloquea edición y redirige a regenerar
  - Mensaje claro: "Los índices IPC necesarios ya están disponibles"

#### Mejoras en Alta de Recibos
- Refactorización con InfoAlert en `/admin/recibos/alta/[contratoId]`:
  - **Warning**: Recibo ya generado (estados 2/3/4)
  - **Info**: Índices no disponibles aún
- Reducción de ~24 líneas de HTML repetitivo a ~5 líneas por alerta

### 🔧 Modificado

#### Lógica de Validación de Índices
- **Actualizado**: `src/hooks/useReciboValidation.ts`
  - Agregada verificación de índices **ICL** (antes solo IPC)
  - Nueva condición: `else if (formValues.tipoIndice === 'ICL')`
  - Llama a `verificaIclActual()` con conversión de fecha
  - Import agregado: `import { verificaIclActual } from '@/src/lib/verificaIclActual'`

**Antes:**
```typescript
if (formValues.tipoIndice === 'IPC') {
    indicesDisponibles = await verificaIpcActual(formValues.fechaPendiente);
}
// ICL e ICP → quedaban en true por defecto
```

**Después:**
```typescript
if (formValues.tipoIndice === 'IPC') {
    indicesDisponibles = await verificaIpcActual(formValues.fechaPendiente);
} else if (formValues.tipoIndice === 'ICL') {
    indicesDisponibles = await verificaIclActual(new Date(formValues.fechaPendiente));
}
// Solo ICP → queda en true por defecto
```

#### Fixes en Sistema de Items
- **itemHelpers.ts** - Nuevo sistema de mapeo hardcoded:
  - `TIPO_ITEM_MAP`: Mapeo ID → código string (1='ALQUILER', 2='DESCUENTO', etc.)
  - `TIPO_ITEM_PROPS`: Mapeo ID → propiedades (esModificable, esEliminable, color)
  - `obtenerCodigoItem()`: Helper para obtener código desde tipoItem O tipoItemId
  - `obtenerPropsItem()`: Helper para obtener propiedades desde tipoItem O tipoItemId
- Todos los helpers refactorizados para trabajar con ambos formatos
- **Fix**: Eliminadas advertencias de consola "Item sin tipoItem cargado"

- **storeRecibos.ts**:
  - `addItem()` ahora crea items con `tipoItemId: 3` (EXTRA)
  
- **useReciboValidation.ts**:
  - Agregada constante `TIPO_ITEM_ALQUILER_ID = 1`
  - Todos los items Alquiler creados incluyen `tipoItemId: 1`

#### Fix Crítico - Totalizador de Recibo
- **useReciboData.ts** - Removido filtro condicional:
  - **Antes**: Filtraba items Alquiler para recibos PENDIENTE (causaba race condition)
  - **Después**: Carga TODOS los items tal cual están en BD
  - **Impacto**: Totalizador muestra suma correcta en view/edit/regenerar
  
- **ItemsSection.tsx** - Simplificación del totalizador:
  - Removida lógica confusa de comparación con montoTotal
  - Ahora muestra: suma simple de todos los items
  - Display limpio en verde con formato de moneda

#### Fix - Accesibilidad
- **RecibosFiltro.tsx**:
  - Cambiado `id="año"` a `id="anio"` (caracteres ASCII)
  - Fix warning: "label's for attribute doesn't match"

#### Modo View - Datos Sin Recalcular
- **useReciboValidation.ts**:
  - Agregado parámetro opcional `readOnly?: boolean`
  - Validación temprana: si `readOnly === true`, retorna sin recalcular
  - Preserva datos guardados en BD en modo visualización
  
- **ReciboFormDynamic.tsx**:
  - Pasa prop `readOnly` a `useReciboValidation()`
  - Cadena completa: view/page → ReciboForm → ReciboFormDynamic → useReciboValidation

### 📐 Arquitectura

- **Componente Reutilizable**: InfoAlert elimina duplicación en toda la app
- **Validaciones en Cadena**: 4 niveles de validación en página de edición
- **Type Safety**: Mapeos hardcoded tipados para datos estables de BD
- **SOLID**: Separación de responsabilidades (view vs edit vs regenerar)
- **DRY**: 50+ líneas de HTML reducidas a componente de 96 líneas reutilizable

### 🐛 Corregido

- Console warnings por items sin tipoItem
- Totalizador mostrando suma incorrecta en recibos existentes
- Warning de accesibilidad en labels (caracteres no-ASCII)
- Modo view recalculando montos en lugar de mostrar datos guardados
- Permitir editar recibos que deberían regenerarse
- **Error de validación en regeneración de recibos** (crítico)
- **Totalizador mostrando monto incorrecto durante regeneración** (crítico)
- **Contratos ICL calculando con datos incorrectos** (crítico)

#### Fix: Contratos ICL Calculando Sin Verificar Índices
**Problema**: Contratos con `tipoIndice = 'ICL'` calculaban `montoTotal` inmediatamente sin verificar si los índices ICL estaban disponibles en la base de datos.

**Escenario del bug**:
```
Contrato: tipoIndice = 'ICL', mesesRestaActualizar = 0
Esperado: montoAnterior = $600,000, montoTotal = $600,000 (esperar índices)
Actual:   montoAnterior = $600,000, montoTotal = $638,091 (calculado con ICL viejo/incorrecto)
```

**Causa raíz**:
```typescript
// useReciboValidation.ts - ANTES
let indicesDisponibles = true;  // ← Asume disponibles por defecto

if (formValues.tipoIndice === 'IPC') {
    indicesDisponibles = await verificaIpcActual(...);
}
// ICL e ICP → quedaban en true, calculaban inmediatamente ❌
```

**Solución implementada**:
1. **Nueva función** `verificaIclActual()` en `src/lib/verificaIclActual.ts`
   - Verifica si existe índice ICL en el mes de generación
   - Similar a `verificaIpcActual()` pero adaptada a tabla ICL
   - Usa query con `fecha >= inicioMes AND fecha < inicioMesSiguiente`

2. **Actualizado** `useReciboValidation.ts`:
   ```typescript
   // DESPUÉS
   if (formValues.tipoIndice === 'IPC') {
       indicesDisponibles = await verificaIpcActual(formValues.fechaPendiente);
   } else if (formValues.tipoIndice === 'ICL') {
       indicesDisponibles = await verificaIclActual(new Date(formValues.fechaPendiente));
   }
   // Solo ICP queda en true por defecto ✅
   ```

**Impacto**:
- ✅ Contratos ICL esperan índices antes de calcular
- ✅ Muestra `montoAnterior` correctamente cuando `indicesDisponibles = false`
- ✅ Evita usar valores ICL obsoletos/incorrectos
- ✅ Consistencia con flujo de IPC

**Documentación técnica**: Ver `docs/FIX_VERIFICACION_ICL.md`

#### Fix: Error "El monto del alquiler no coincide" en Regeneración
**Problema**: Al regenerar un recibo PENDIENTE, se producía error de validación:
```
El monto del alquiler ($600,000) no coincide con el monto calculado ($650,730.24)
```

**Causa**: 
- Frontend enviaba items con Alquiler de monto viejo ($600,000)
- Backend validaba que coincidiera con montoTotal nuevo ($650,730.24)
- La validación rechazaba la operación

**Solución**:
- **reciboHelpers.ts** - `asegurarItemAlquiler()`:
  - Cambió de **validar** a **actualizar** el monto del Alquiler
  - Ahora siempre actualiza el item Alquiler al `montoTotal` recibido
  - Eliminado retorno de error (siempre success: true)
  - Usa `.map()` para actualizar preservando otros items
  
- **create-recibo-action.ts** y **update-recibo-action.ts**:
  - Eliminado manejo del caso de error de `asegurarItemAlquiler`
  - Simplificado flujo (ya no puede fallar)

**Resultado**: Regeneración funciona correctamente, el backend actualiza el monto automáticamente

#### Fix: Totalizador Incorrecto Durante Regeneración
**Problema**: El "Total a Cobrar" mostraba suma con monto viejo del Alquiler:
```
Items en array:
- Alquiler: $600,000    ← Monto viejo de BD
- Extra: $1,500
- Descuento: -$500
─────────────────────
Total: $601,000         ← INCORRECTO
```

Pero debería mostrar el total con el Alquiler actualizado:
```
- Alquiler: $650,730.24 ← Monto calculado con índices
- Extra: $1,500
- Descuento: -$500
─────────────────────
Total: $651,730.24      ← CORRECTO
```

**Solución**:
- **ItemsSection.tsx** - Lógica híbrida en totalizador:
  ```typescript
  // 1. Filtrar items sin Alquiler
  const itemsSinAlquiler = items.filter(item => !esItemAlquiler(item))
  const totalExtras = itemsSinAlquiler.reduce((sum, item) => sum + item.monto, 0)
  
  // 2. Usar montoTotal (con índices) + extras/descuentos
  const totalItems = formValues.montoTotal > 0 
      ? formValues.montoTotal + totalExtras  // Regeneración: Alquiler actualizado
      : items.reduce((sum, item) => sum + item.monto, 0)  // Normal: suma simple
  ```

**Ventajas**:
- ✅ En regeneración: Usa Alquiler calculado con índices
- ✅ En edición: Suma normal con cambios en tiempo real
- ✅ Considera todos los items (extras, descuentos, servicios)
- ✅ Fallback seguro si montoTotal es 0

**Resultado**: El totalizador muestra el valor correcto que se guardará en BD

---

## [2.2.0] - 2024-11-16elog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [2.2.0] - 2024-11-16

### 🎉 Agregado

#### Vista de Recibo en Solo Lectura
- Nueva funcionalidad para visualizar recibos en modo de solo lectura siguiendo el principio SOLID
- Componente `ViewReciboForm.tsx` - Wrapper para vista sin edición (sin submit)
- Ruta `/admin/recibos/[id]/view` - Página dedicada para visualización
- Prop `readOnly` en componentes de recibo:
  - `ReciboFormDynamic`: Prop opcional que se propaga a componentes hijos
  - `ReciboServices`: Deshabilita checkboxes y textarea observaciones
  - `ItemsSection`: Deshabilita inputs y oculta botones de agregar/eliminar
  - `ReciboForm`: Reenvío de prop readOnly
- Botón "Ver" en `RecibosTable.tsx`:
  - Color azul distintivo (bg-blue-700)
  - Ícono de ojo para visualización
  - Posicionado antes del botón "Imprimir"
- Badge de estado del recibo en vista de solo lectura:
  - Color dinámico según estadoReciboId
  - Amarillo: PENDIENTE, Verde: GENERADO, Azul: PAGADO, Morado: IMPRESO, Gris: ANULADO
  - Muestra descripción del estado desde BD

#### Mejoras en itemHelpers.ts
- Limpieza de código: eliminadas 3 funciones no utilizadas
  - Removido `permiteMontoNegativo()` (0 usos)
  - Removido `validarMontoItem()` (0 usos)
  - Removido `esItemObligatorio()` (0 usos)
- Reducción de 168 a 121 líneas (-28%)
- Alcanzado 100% de tasa de uso de funciones

### 🔧 Modificado

- `buscarReciboById.ts`:
  - Incluye relación `estadoRecibo` con campo `descripcion`
  - Fix: corregido campo de `nombre` a `descripcion` (schema correcto)
- `app/admin/recibos/[id]/view/page.tsx`:
  - Usa directamente `recibo.estadoRecibo?.descripcion` en lugar de mapeo hardcodeado

### 📐 Arquitectura

- **Reutilización de código del 95%**: Solo 2 archivos nuevos necesarios
- **Patrón SOLID aplicado**: Single Responsibility Principle
- **Jerarquía de componentes**:
  ```
  ViewReciboForm → ReciboForm → ReciboFormDynamic → Componentes hijos
  ```
- **Renderizado condicional**: `{!readOnly && <Component />}` para botones de acción
- **Props opcionales**: `readOnly?: boolean = false` mantiene compatibilidad

### 🐛 Corregido

- Error de tipo TypeScript en `buscarReciboById.ts`: campo `nombre` no existía en `EstadoRecibo`
- Prop `readOnly` innecesaria en `ReciboAmounts` (todos los campos ya estaban disabled por diseño)

### 📚 Documentación

- Actualizado `CHANGELOG.md` con nueva funcionalidad de vista de solo lectura
- Documentación de arquitectura y patrón de reutilización de componentes

---

## [2.1.0] - 2024-11-13

### 🎉 Agregado

#### Inferencia Automática de TipoItem
- Sistema inteligente de asignación automática de tipos de items
- Función `determinarTipoItem()` en `create-recibo-action.ts`
- Función `getTipoItemId()` con caché de tipos para performance
- Lógica simple y efectiva:
  - Monto < 0 → REINTEGRO (descuentos, devoluciones)
  - Monto >= 0 → EXTRA (gastos adicionales)
  - Descripción "Alquiler" → ALQUILER
- Documentación completa en `docs/TIPO_ITEM.md` (sección Inferencia Automática)

#### Mejoras en Eliminación de Recibos
- Cálculo dinámico de `mesesRestaActualizar` en `delete-recibo-action.ts`
- Lógica condicional mejorada para actualización de contratos
- Fix de asignación incorrecta usando strings en lugar de valores

### 🔧 Modificado

- `create-recibo-action.ts`:
  - Usa `Promise.all` para determinar tipos en paralelo
  - Aplica inferencia en `crearNuevoRecibo` y `actualizarReciboPendiente`
  - Eliminado fallback hardcodeado `item.tipoItemId || tipoAlquilerId`
- `delete-recibo-action.ts`:
  - Cálculo de `nuevoMesesRestaActualizar` basado en condiciones de negocio
  - Código simplificado y más legible
- `docs/TIPO_ITEM.md`:
  - Nueva sección completa sobre inferencia automática
  - Ejemplos prácticos con casos de uso reales
  - Documentación de caché y optimizaciones

### 🐛 Corregido

- **Bug crítico:** Todos los items se guardaban con `tipoItemId = 1` (ALQUILER)
  - Causa: Fallback incorrecto `item.tipoItemId || tipoAlquilerId`
  - Solución: Inferencia automática basada en monto
- **Bug en delete-recibo:** Variable `sumarMes` como string no funcionaba en Prisma
  - Causa: Intentar usar string para construir objeto Prisma
  - Solución: Calcular valor numérico directamente
- Tipo `any` → `unknown` en `useReciboData.ts` línea 98

### ✨ Mejoras de Performance

- Caché de IDs de tipos (`cachedTipoItemIds`) reduce queries a BD
- Queries paralelas con `Promise.all` en asignación de tipos
- Función `getTipoAlquilerId()` mantiene caché existente

### 📚 Documentación

- Actualizado `docs/TIPO_ITEM.md` con sección de inferencia automática
- Ejemplos prácticos de uso en diferentes escenarios
- Documentación de mejoras futuras (UI selector de tipos)

---

## [2.0.0] - 2024-11-13

### 🎉 Agregado

#### Sistema TipoItem
- Nueva tabla `TipoItem` para tipos de items configurables
- 5 tipos predefinidos: ALQUILER, DESCUENTO, EXTRA, SERVICIO, REINTEGRO
- Campo `tipoItemId` obligatorio en `ItemRecibo`
- Helpers type-safe en `src/utils/itemHelpers.ts`:
  - `esItemAlquiler()`
  - `puedeEliminarItem()`
  - `puedeModificarItem()`
  - `permiteMontoNegativo()`
  - `getColorItem()`
  - `validarMontoItem()`
- UI con colores dinámicos según tipo de item
- Script de migración de datos existentes (`prisma/migrate-items.ts`)

#### Mejoras en Recibos
- Lógica de 3 casos para generación/regeneración
- Fix de race condition entre `useReciboData` y `useReciboValidation`
- Filtrado inteligente de items en recibos PENDIENTE
- Validación de montos con tolerancia de 0.01

#### Documentación
- README.md completamente renovado
- Documentación técnica en carpeta `docs/`:
  - `INSTALLATION.md` - Guía de instalación
  - `INDICES.md` - Cálculos IPC e ICL
  - `TIPO_ITEM.md` - Sistema de tipos
  - `CHANGELOG.md` - Este archivo

### 🔧 Modificado

- `useReciboValidation`: Usa helpers en lugar de comparaciones de string
- `useReciboData`: Filtra items ALQUILER en recibos PENDIENTE
- `create-recibo-action`: Obtiene `tipoItemId` automáticamente
- `buscarItemsRecibo`: Incluye relación `tipoItem` en query
- `ItemsSection`: UI dinámica basada en configuración de tipos
- Estado ANULADO corregido de 4 a 5 en múltiples archivos

### 🐛 Corregido

- Race condition donde items de BD sobreescribían cálculos
- Comparaciones frágiles de string "Alquiler" (typos, case sensitivity)
- Estado ANULADO incorrecto en validaciones
- Items duplicados en regeneración de recibos PENDIENTE

### 🗑️ Deprecado

- Comparaciones directas de `item.descripcion === "Alquiler"` (usar `esItemAlquiler()`)
- Hardcodeo de descripción "Alquiler" en creación de items

### ⚠️ Notas de Migración

**Breaking Changes:**
- Items ahora requieren `tipoItemId` (campo obligatorio)
- Tests que mockean items deben incluir `tipoItem`

**Migración:**
```bash
# 1. Ejecutar migraciones
npx prisma migrate dev

# 2. Ejecutar seed para crear tipos
npx prisma db seed

# 3. Migrar items existentes
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/migrate-items.ts
```

---

## [1.5.0] - 2024-10-XX

### 🎉 Agregado

- Sistema de autenticación con NextAuth.js
- Gestión de clientes (propietarios e inquilinos)
- Gestión de propiedades
- Gestión de contratos con IPC/ICL

### 🔧 Modificado

- Migración a Next.js 14 con App Router
- Actualización de dependencias principales

---

## [1.0.0] - 2024-XX-XX

### 🎉 Inicial

- Versión inicial del sistema
- Cálculo de IPC e ICL
- Generación básica de recibos
- Panel de administración

---

## Tipos de Cambios

- **Agregado** - Para nuevas funcionalidades
- **Modificado** - Para cambios en funcionalidades existentes
- **Deprecado** - Para funcionalidades que serán eliminadas
- **Eliminado** - Para funcionalidades eliminadas
- **Corregido** - Para corrección de bugs
- **Seguridad** - En caso de vulnerabilidades

---

[⬅️ Volver al README principal](../README.md)
