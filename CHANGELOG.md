# 📝 Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

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
