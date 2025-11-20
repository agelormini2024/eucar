# 📚 Documentación Técnica - EUCAR

Índice completo de la documentación del sistema de gestión de alquileres EUCAR.

---

## 📂 Estructura de Documentación

### 🏗️ Arquitectura y Diseño

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura general del sistema
- **[DATABASE.md](./DATABASE.md)** - Estructura de base de datos y esquemas
- **[HOOKS.md](./HOOKS.md)** - Custom hooks de React y su funcionamiento
- **[ACTIONS.md](./ACTIONS.md)** - Server actions y flujos de datos

### 🔐 Autenticación y Seguridad

- **[SISTEMA-AUTENTICACION.md](./SISTEMA-AUTENTICACION.md)** - Sistema de autenticación con NextAuth
- **[GUIA_USUARIO_AUTENTICACION.md](./GUIA_USUARIO_AUTENTICACION.md)** - Guía de usuario para registro y login

### 💰 Módulo de Recibos

- **[RECIBOS.md](./RECIBOS.md)** - Sistema completo de generación de recibos
- **[INDICES.md](./INDICES.md)** - Gestión de índices IPC/ICL/ICP
- **[TIPO_ITEM.md](./TIPO_ITEM.md)** - Tipos de ítems en recibos
- **[GENERACION_RECIBO.pdf](./GENERACION_RECIBO.pdf)** - Diagrama de flujo de generación

### 🔧 Fixes y Resolución de Problemas

#### 🐛 Bugs Críticos Resueltos (v2.3.0)

1. **[FIX_REGENERACION_RECIBOS.md](./FIX_REGENERACION_RECIBOS.md)** - Error de validación en regeneración
   - Problema: "El monto del alquiler no coincide" al regenerar
   - Solución: Cambio de validación a actualización automática
   - Archivos: `reciboHelpers.ts`, actions
   - **Fecha**: 18/11/2024

2. **[FIX_TOTALIZADOR_REGENERACION.md](./FIX_TOTALIZADOR_REGENERACION.md)** - Totalizador mostrando monto incorrecto
   - Problema: Total a Cobrar mostraba valor incorrecto durante regeneración
   - Solución: Lógica híbrida (montoTotal + extras)
   - Archivos: `ItemsSection.tsx`
   - **Fecha**: 18/11/2024

3. **[FIX_VERIFICACION_ICL.md](./FIX_VERIFICACION_ICL.md)** - Contratos ICL calculando sin verificar índices
   - Problema: ICL calculaba inmediatamente sin verificar disponibilidad
   - Solución: Nueva función `verificaIclActual()` + actualización hook
   - Archivos: `verificaIclActual.ts`, `useReciboValidation.ts`
   - **Fecha**: 18/11/2024

### 🚀 Instalación y Setup

- **[INSTALLATION.md](./INSTALLATION.md)** - Guía de instalación del proyecto

### 🎓 Guías Didácticas

- **[MODAL_SELECCION_PROPIEDAD.md](./MODAL_SELECCION_PROPIEDAD.md)** - Explicación completa del modal de selección con búsqueda
  - Conceptos fundamentales (State, useMemo, Modal)
  - Estructura paso a paso del código
  - Flujo de funcionamiento completo
  - Ejemplos prácticos de búsqueda
  - Mejores prácticas y optimización

---

## 🗂️ Documentos por Módulo

### Módulo: Clientes
- ARCHITECTURE.md (sección Clientes)
- DATABASE.md (tabla `Cliente`)

### Módulo: Propiedades
- ARCHITECTURE.md (sección Propiedades)
- DATABASE.md (tabla `Propiedad`)

### Módulo: Contratos
- ARCHITECTURE.md (sección Contratos)
- DATABASE.md (tabla `Contrato`, `TipoContrato`)

### Módulo: Recibos
- **Documentación principal**: RECIBOS.md
- **Soporte**: INDICES.md, TIPO_ITEM.md
- **Diagrama**: GENERACION_RECIBO.pdf
- **Fixes**:
  - FIX_REGENERACION_RECIBOS.md
  - FIX_TOTALIZADOR_REGENERACION.md
  - FIX_VERIFICACION_ICL.md
- **Hooks**: HOOKS.md (useReciboValidation, useReciboData)
- **Actions**: ACTIONS.md (create-recibo, update-recibo)

### Módulo: Autenticación
- SISTEMA-AUTENTICACION.md
- GUIA_USUARIO_AUTENTICACION.md

---

## 📊 Changelog y Versiones

Para ver el historial completo de cambios, consulta:
- **[../CHANGELOG.md](../CHANGELOG.md)** - Registro completo de versiones

**Versión actual**: 2.3.0 (18/11/2024)

---

## 🔍 Búsqueda Rápida

### ¿Cómo generar un recibo?
→ [RECIBOS.md](./RECIBOS.md) + [GENERACION_RECIBO.pdf](./GENERACION_RECIBO.pdf)

### ¿Qué son los índices IPC/ICL/ICP?
→ [INDICES.md](./INDICES.md)

### ¿Cómo funciona la autenticación?
→ [SISTEMA-AUTENTICACION.md](./SISTEMA-AUTENTICACION.md)

### ¿Cómo regenerar un recibo sin errores?
→ [FIX_REGENERACION_RECIBOS.md](./FIX_REGENERACION_RECIBOS.md)

### ¿Por qué el total muestra un valor diferente?
→ [FIX_TOTALIZADOR_REGENERACION.md](./FIX_TOTALIZADOR_REGENERACION.md)

### ¿Por qué los contratos ICL no calculan correctamente?
→ [FIX_VERIFICACION_ICL.md](./FIX_VERIFICACION_ICL.md)

### ¿Cómo funciona el modal de selección con búsqueda?
→ [MODAL_SELECCION_PROPIEDAD.md](./MODAL_SELECCION_PROPIEDAD.md)

### ¿Qué estructura tiene la base de datos?
→ [DATABASE.md](./DATABASE.md)

### ¿Qué custom hooks existen?
→ [HOOKS.md](./HOOKS.md)

---

## 📝 Convenciones de Documentación

### Nomenclatura de Archivos

- **MAYÚSCULAS.md**: Documentación general o de sistema
- **FIX_*.md**: Documentación de bugs resueltos
- **GUIA_*.md**: Guías de usuario o tutoriales

### Estructura de FIX_*.md

Todos los documentos de fixes siguen esta estructura:

1. 📋 **Resumen Ejecutivo**
2. 🐛 **Problema Identificado**
3. 🔍 **Análisis Técnico**
4. ✅ **Solución Implementada**
5. 🧪 **Ejemplos de Comportamiento**
6. 📊 **Impacto y Beneficios**
7. 🔒 **Preservación de Fixes Anteriores**
8. 🧪 **Testing**
9. 📚 **Referencias**
10. 🎯 **Conclusión**

---

## 🔗 Enlaces Útiles

- **Repositorio**: [GitHub - agelormini2024/eucar](https://github.com/agelormini2024/eucar)
- **Prisma Schema**: `../prisma/schema.prisma`
- **Configuración Next.js**: `../next.config.ts`
- **Variables de entorno**: `../.env.local` (no versionado)

---

## 👥 Contribución

Al crear nueva documentación:

1. Seguir la estructura establecida
2. Incluir ejemplos de código cuando sea relevante
3. Mantener secciones claras con emojis
4. Actualizar este índice (README.md)
5. Referenciar en CHANGELOG.md si aplica

---

**Última actualización**: 18/11/2024  
**Versión documentación**: 2.3.0
