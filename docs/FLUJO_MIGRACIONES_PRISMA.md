# 🔄 Flujo de Migraciones con Prisma + Vercel + Neon

**Fecha**: 22/11/2024  
**Proyecto**: EUCAR - Sistema de Gestión de Alquileres  
**Stack**: Next.js + Prisma + PostgreSQL (Neon) + Vercel  

---

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Workflow Manual (Recomendado)](#workflow-manual-recomendado)
3. [Proceso de Deploy en Vercel](#proceso-de-deploy-en-vercel)
4. [Comandos Principales](#comandos-principales)
5. [db push vs migrate](#db-push-vs-migrate)
6. [Checklist de Cambios de BD](#checklist-de-cambios-de-bd)
7. [Troubleshooting](#troubleshooting)
8. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Resumen Ejecutivo

### Decisión Tomada: **Migraciones Manuales**

**Por qué:**
- ✅ Control total sobre cambios en producción
- ✅ Seguridad: puedes hacer backup antes
- ✅ Debugging: sabes exactamente qué pasó
- ✅ Sin sorpresas: no hay cambios automáticos

### Estado Actual del Proyecto:
- ✅ BD Local y Neon sincronizadas
- ✅ TipoItem poblado con 5 registros maestros
- ✅ Sistema de recibos listo
- ✅ Workflow manual establecido

---

## 🚀 Workflow Manual (Recomendado)

### Flujo Completo Paso a Paso

```bash
# ════════════════════════════════════════════════
# PASO 1: DESARROLLO LOCAL
# ════════════════════════════════════════════════

# 1.1. Modificar schema.prisma
# Ejemplo: Agregar un nuevo campo a una tabla
code prisma/schema.prisma

# 1.2. Crear migración en LOCAL
npx prisma migrate dev --name nombre_descriptivo
# Ejemplo: npx prisma migrate dev --name agregar_campo_telefono

# 1.3. Probar localmente
npm run dev
# Verificar que todo funciona correctamente


# ════════════════════════════════════════════════
# PASO 2: MIGRAR A PRODUCCIÓN (Neon)
# ════════════════════════════════════════════════

# 2.1. Verificar estado de migraciones en Neon
npx prisma migrate status

# 2.2. Aplicar migraciones pendientes a Neon
npx prisma migrate deploy

# 2.3. Verificar datos en Neon
npx prisma studio
# O usar la consola web de Neon


# ════════════════════════════════════════════════
# PASO 3: DEPLOY EN VERCEL
# ════════════════════════════════════════════════

# 3.1. Commit y push
git add .
git commit -m "feat: agregar campo telefono"
git push origin main

# 3.2. Vercel despliega automáticamente
# Solo despliega CÓDIGO
# NO ejecuta migraciones
# La BD ya está migrada del Paso 2
```

---

## 📊 Proceso de Deploy en Vercel

### ¿Qué pasa automáticamente en cada deploy?

```
┌─────────────────────────────────────────┐
│ 1. Git Push a GitHub                    │
│    - Subes tu código con cambios        │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│ 2. Vercel detecta el cambio             │
│    - Se activa automáticamente          │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│ 3. Build Process (npm run build)        │
│    - Instala dependencias               │
│    - Ejecuta: prisma generate  ✅       │
│    - NO ejecuta: migrate deploy ❌      │
│    - Compila Next.js                    │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│ 4. Deploy de la aplicación              │
│    - App online en Vercel               │
│    - Usa la BD como está                │
│    - (Ya migrada manualmente)           │
└─────────────────────────────────────────┘
```

### ⚠️ Lo Importante

**Vercel por defecto:**
- ✅ Ejecuta `prisma generate` (genera el cliente Prisma)
- ❌ NO ejecuta `prisma migrate deploy`
- ❌ NO aplica migraciones pendientes

**Configuración actual en `package.json`:**
```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

Esto es **correcto** para el enfoque manual.

---

## 🔧 Comandos Principales

### Desarrollo Local

```bash
# Crear nueva migración
npx prisma migrate dev --name nombre_descriptivo

# Ver estado de migraciones (local)
npx prisma migrate status

# Resetear BD local (¡cuidado! borra datos)
npx prisma migrate reset

# Abrir Prisma Studio (visualizar datos)
npx prisma studio

# Generar cliente Prisma
npx prisma generate
```

### Producción (Neon)

```bash
# Aplicar migraciones pendientes
npx prisma migrate deploy

# Ver estado de migraciones
npx prisma migrate status

# Ver schema actual de Neon
npx prisma db pull --print

# Abrir Prisma Studio conectado a Neon
npx prisma studio
```

### Comparación de BDs

```bash
# Script personalizado para comparar Local vs Neon
npx ts-node compare-schemas.ts

# Ver diferencias manualmente
diff schema-local.txt schema-neon.txt
```

---

## ⚖️ db push vs migrate

### Comparación Completa

| Aspecto | `db push` | `migrate dev/deploy` |
|---------|-----------|---------------------|
| **Cuándo usar** | Desarrollo rápido | Producción |
| **Crea archivos SQL** | ❌ No | ✅ Sí |
| **Mantiene historial** | ❌ No | ✅ Completo |
| **Reversible** | ❌ Difícil | ✅ Posible con archivos SQL |
| **Para producción** | ❌ No recomendado | ✅ Recomendado |
| **Velocidad** | ⚡ Rápido | 🐢 Un poco más lento |
| **Seguridad** | ⚠️ Menos seguro | ✅ Más seguro |

### Cuándo usar cada uno

**`db push`** - Solo para:
- 🧪 Experimentación rápida en desarrollo
- 🎨 Prototipos
- 🔬 Pruebas de concepto

**`migrate dev/deploy`** - Para:
- 🏭 Cambios en producción
- 📚 Mantener historial
- 👥 Trabajo en equipo
- 🔄 Reversión de cambios

---

## ✅ Checklist de Cambios de BD

### Cada vez que modifiques `schema.prisma`:

```
📋 CHECKLIST DE MIGRACIÓN

DESARROLLO LOCAL:
□ 1. Modificar prisma/schema.prisma
□ 2. Ejecutar: npx prisma migrate dev --name nombre_cambio
□ 3. Verificar que la migración se creó en prisma/migrations/
□ 4. Probar la app localmente: npm run dev
□ 5. Verificar funcionamiento en Prisma Studio local

PREPARACIÓN PARA PRODUCCIÓN:
□ 6. Hacer backup de Neon (opcional pero recomendado)
□ 7. Commit de cambios: git add . && git commit -m "..."
□ 8. Push a GitHub: git push origin main

MIGRACIÓN A PRODUCCIÓN:
□ 9. Verificar migraciones pendientes: npx prisma migrate status
□ 10. Aplicar migraciones a Neon: npx prisma migrate deploy
□ 11. Verificar en Prisma Studio (Neon) que todo está OK
□ 12. Verificar conteo de registros (que no se perdieron datos)

DEPLOY:
□ 13. Vercel despliega automáticamente (solo código)
□ 14. Verificar app en producción: https://eucar.vercel.app
□ 15. Probar funcionalidad afectada por el cambio
```

---

## 🔧 Troubleshooting

### Problema 1: Migraciones pendientes en Neon

**Síntoma:**
```bash
npx prisma migrate status
# Following migration have not yet been applied:
# 20241122205708_agregar_tipo_item
```

**Solución:**
```bash
npx prisma migrate deploy
```

---

### Problema 2: Schema en Neon diferente al Local

**Síntoma:**
```
Error: Schema drift detected
```

**Diagnóstico:**
```bash
# Comparar schemas
npx ts-node compare-schemas.ts
```

**Soluciones:**

**Opción A - Si Neon está bien:**
```bash
# Actualizar local desde Neon
npx prisma db pull
npx prisma generate
```

**Opción B - Si Local está bien:**
```bash
# Resetear Neon y aplicar todas las migraciones
npx prisma migrate deploy
```

---

### Problema 3: Error en deploy de Vercel

**Síntoma:**
```
Build failed: Prisma Client not generated
```

**Causa:** Falta `prisma generate` en el build

**Solución:** Verificar `package.json`
```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

---

### Problema 4: Variables de entorno incorrectas

**Síntoma:**
```
Error: Cannot connect to database
```

**Verificar en Vercel:**
```
Settings → Environment Variables → DATABASE_URL
```

**Debe ser:**
```
postgresql://neondb_owner:npg_gu8D1MTqpvIc@ep-dry-bar-acbjwofx-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

---

## 🎓 Mejores Prácticas

### 1. Nombres Descriptivos de Migraciones

❌ **Mal:**
```bash
npx prisma migrate dev --name update
npx prisma migrate dev --name fix
```

✅ **Bien:**
```bash
npx prisma migrate dev --name agregar_campo_telefono_cliente
npx prisma migrate dev --name crear_tabla_tipo_item
npx prisma migrate dev --name agregar_relacion_recibo_items
```

---

### 2. Nunca Editar Migraciones Aplicadas

❌ **Nunca hagas esto:**
```bash
# Editar archivo en prisma/migrations/XXXXXX_nombre/migration.sql
# después de haberlo aplicado
```

✅ **Haz esto:**
```bash
# Crear una NUEVA migración que corrija el problema
npx prisma migrate dev --name corregir_campo_telefono
```

---

### 3. Backup Antes de Migraciones Importantes

**Siempre hacer backup antes de cambios estructurales grandes:**

```bash
# Backup completo de Neon
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup solo estructura
pg_dump --schema-only $DATABASE_URL > backup_schema_$(date +%Y%m%d).sql

# Backup solo datos
pg_dump --data-only $DATABASE_URL > backup_data_$(date +%Y%m%d).sql
```

---

### 4. Verificar Datos Después de Migrar

**Siempre verificar conteos:**

```bash
# En Prisma Studio o con queries
SELECT COUNT(*) FROM "Cliente";
SELECT COUNT(*) FROM "Recibo";
SELECT COUNT(*) FROM "ItemRecibo";
```

**Antes y después deben coincidir** (a menos que la migración inserte/elimine datos).

---

### 5. Documentar Cambios Complejos

Para migraciones complejas, agregar comentarios en el SQL:

```sql
-- Migration: Agregar tipo_item a items_recibo
-- Fecha: 2024-11-22
-- Descripción: Relaciona cada item del recibo con un tipo
-- Impacto: Todos los items existentes se marcarán como ALQUILER por defecto

-- Crear tabla TipoItem
CREATE TABLE "TipoItem" (
  id SERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL
);

-- Poblar con datos maestros
INSERT INTO "TipoItem" (id, codigo, nombre) VALUES
  (1, 'ALQUILER', 'Alquiler'),
  (2, 'EXTRA', 'Extra'),
  (3, 'DESCUENTO', 'Descuento');

-- Agregar FK a ItemRecibo
ALTER TABLE "ItemRecibo" 
ADD COLUMN "tipoItemId" INTEGER 
REFERENCES "TipoItem"(id);

-- Actualizar items existentes
UPDATE "ItemRecibo" SET "tipoItemId" = 1;
```

---

## 📚 Scripts Útiles

### Script de Comparación de Schemas

Guardado en: `compare-schemas.ts`

```typescript
import { execSync } from 'child_process'
import * as fs from 'fs'

const neonUrl = process.env.DATABASE_URL_NEON
const localUrl = process.env.DATABASE_URL_LOCAL

// ... (código completo en el archivo)
```

**Uso:**
```bash
npx ts-node compare-schemas.ts
```

---

### Script de Seed para TipoItem

Guardado en: `seed-tipoitem.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const tiposItem = [
    { id: 1, codigo: 'ALQUILER', nombre: 'Alquiler' },
    { id: 2, codigo: 'EXTRA', nombre: 'Extra' },
    // ... más tipos
  ]
  
  for (const tipo of tiposItem) {
    await prisma.tipoItem.upsert({
      where: { codigo: tipo.codigo },
      update: {},
      create: tipo
    })
  }
}

main()
```

**Uso:**
```bash
npx ts-node seed-tipoitem.ts
```

---

## 🔐 Variables de Entorno

### Archivo `.env` (Local)

```bash
# BD Local (desarrollo)
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"

# BD Neon (producción) - comentada normalmente
# DATABASE_URL="postgresql://neondb_owner:...@neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secret_aqui

# Resend (emails)
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### Vercel (Producción)

**Settings → Environment Variables:**

```
DATABASE_URL = postgresql://neondb_owner:...@neon.tech/neondb
NEXTAUTH_URL = https://eucar.vercel.app
NEXTAUTH_SECRET = (mismo que local)
RESEND_API_KEY = re_xxxxx
RESEND_FROM_EMAIL = onboarding@resend.dev
```

---

## 📖 Referencias

### Documentación Oficial

- **Prisma Migrate**: https://www.prisma.io/docs/concepts/components/prisma-migrate
- **Prisma Deploy**: https://www.prisma.io/docs/concepts/components/prisma-migrate/migrate-development-production
- **Vercel + Prisma**: https://vercel.com/guides/nextjs-prisma-postgres
- **Neon**: https://neon.tech/docs/guides/prisma

### Documentación Interna del Proyecto

- `docs/DATABASE.md` - Estructura de base de datos
- `docs/ARCHITECTURE.md` - Arquitectura del sistema
- `CHANGELOG.md` - Historial de cambios
- `docs/FIX_VERIFICACION_ICL.md` - Fix de verificación de índices

---

## 🎯 Resumen Rápido

**Para recordar rápidamente:**

```bash
# 1. Desarrollo local
npx prisma migrate dev --name cambio_x

# 2. Migrar a Neon
npx prisma migrate deploy

# 3. Deploy
git push

# ¡Eso es todo!
```

---

## ✅ Estado Actual del Proyecto (22/11/2024)

- ✅ **BD Local**: PostgreSQL en localhost:5432
- ✅ **BD Producción**: Neon (PostgreSQL en la nube)
- ✅ **Estructuras**: Idénticas (verificado con compare-schemas.ts)
- ✅ **TipoItem**: Poblado con 5 registros maestros
- ✅ **Migraciones**: 48 aplicadas, 1 pendiente (documental)
- ✅ **Workflow**: Manual (control total)
- ✅ **Deploy**: Automático vía Vercel + GitHub

---

**Última actualización**: 22/11/2024  
**Autor**: GitHub Copilot + Alejandro Gelormini  
**Versión**: 1.0
