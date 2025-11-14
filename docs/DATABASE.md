# 🗄️ Base de Datos - EUCAR

Documentación completa del schema de base de datos PostgreSQL con Prisma ORM.

---

## 📊 Visión General

### Tecnologías

- **Base de Datos:** PostgreSQL 14+
- **ORM:** Prisma 5.x
- **Lenguaje:** TypeScript
- **Migraciones:** Prisma Migrate

### Estructura General

El sistema está organizado en **10 módulos principales**:

1. 👤 **Autenticación** - Usuarios, invitaciones, tokens
2. 🌍 **Geografía** - Países, provincias
3. 👥 **Clientes** - Propietarios e inquilinos
4. 🏠 **Propiedades** - Inmuebles bajo administración
5. 📝 **Contratos** - Acuerdos de alquiler
6. 🧾 **Recibos** - Generación y gestión de pagos
7. 🏷️ **Items** - Sistema tipificado de conceptos
8. 📈 **Índices** - IPC e ICL para ajustes
9. ⚙️ **Configuración** - Tipos y estados
10. 🔐 **Seguridad** - Tokens y validaciones

---

## 🔐 Módulo de Autenticación

### Usuario

**Propósito:** Gestión de usuarios del sistema con autenticación.

```prisma
model Usuario {
  id         Int          @id @default(autoincrement())
  email      String       @unique
  password   String
  nombre     String
  confirmado Boolean      @default(false)
  createdAt  DateTime     @default(now())
  rol        String       @default("usuario")
  
  Invitacion         Invitacion[]
  PasswordResetToken PasswordResetToken[]
}
```

**Campos Importantes:**
- `confirmado`: Usuario ha verificado su email
- `rol`: Permisos del usuario (usuario, admin, etc.)
- `password`: Hash bcrypt, nunca en texto plano

**Índices:**
- `email` (unique) - Login rápido

---

### PasswordResetToken

**Propósito:** Tokens temporales para recuperación de contraseña.

```prisma
model PasswordResetToken {
  id        Int      @id @default(autoincrement())
  email     String   
  token     String   @unique
  expiresAt DateTime
  usado     Boolean  @default(false)
  createdAt DateTime @default(now())
  
  usuario   Usuario  @relation(fields: [email], references: [email])
  
  @@index([email])
  @@index([token])
}
```

**Seguridad:**
- Tokens expiran después de período definido
- Flag `usado` previene reutilización
- Índice en `token` para validación rápida

---

### Invitacion

**Propósito:** Sistema de invitaciones para registro de nuevos usuarios.

```prisma
model Invitacion {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  codigo    String    @unique
  creadoPor Int
  createdAt DateTime  @default(now())
  expiresAt DateTime
  usado     Boolean   @default(false)
  usadoAt   DateTime?
  
  creador   Usuario   @relation(fields: [creadoPor], references: [id])
}
```

**Campos:**
- `codigo`: Código único de invitación
- `usado`: Previene múltiples registros con misma invitación
- `usadoAt`: Auditoría de cuándo se usó

---

## 🌍 Módulo de Geografía

### Pais

```prisma
model Pais {
  id     Int    @id @default(autoincrement())
  nombre String
  sigla  String
  
  clientes    Cliente[]
  propiedades Propiedad[]
  provincias  Provincia[]
}
```

**Uso:** Normalización de países en direcciones.

---

### Provincia

```prisma
model Provincia {
  id      Int    @id @default(autoincrement())
  nombre  String
  paisId  Int
  
  pais        Pais        @relation(fields: [paisId], references: [id])
  clientes    Cliente[]
  propiedades Propiedad[]
}
```

**Relación:** Provincia → Pais (1:N)

---

## 👥 Módulo de Clientes

### Cliente

**Propósito:** Propietarios e inquilinos del sistema.

```prisma
model Cliente {
  id            Int      @id @default(autoincrement())
  nombre        String
  apellido      String
  razonSocial   String?
  cuit          String   @unique
  telefono1     String?
  telefono2     String?
  celular       String
  email         String
  paisId        Int
  provinciaId   Int
  localidad     String
  codigoPostal  String
  calle         String
  numero        Int
  piso          String?
  departamento  String?
  observaciones String?
  activo        Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  pais                 Pais        @relation(fields: [paisId], references: [id])
  provincia            Provincia   @relation(fields: [provinciaId], references: [id])
  contratosInquilino   Contrato[]  @relation("ClienteInquilino")
  contratosPropietario Contrato[]  @relation("ClientePropietario")
  propiedades          Propiedad[]
}
```

**Características:**
- **Dual Role:** Mismo cliente puede ser propietario e inquilino
- **CUIT Único:** Identificación fiscal argentina
- **Dirección Completa:** Normalizada con país/provincia
- **Soft Delete:** Campo `activo` en lugar de eliminar

**Relaciones:**
- Cliente → Contrato (como propietario) - 1:N
- Cliente → Contrato (como inquilino) - 1:N
- Cliente → Propiedad - 1:N (propietario de inmuebles)

**Índices:**
- `cuit` (unique) - Búsqueda por identificación fiscal

---

## 🏠 Módulo de Propiedades

### TipoPropiedad

```prisma
model TipoPropiedad {
  id          Int         @id @default(autoincrement())
  descripcion String
  
  propiedades Propiedad[]
}
```

**Ejemplos:** Casa, Departamento, Local Comercial, Oficina, etc.

---

### Propiedad

**Propósito:** Inmuebles bajo administración.

```prisma
model Propiedad {
  id              Int      @id @default(autoincrement())
  clienteId       Int
  tipoPropiedadId Int
  
  // Ubicación
  localidad       String
  provinciaId     Int
  paisId          Int
  codigoPostal    String
  calle           String
  numero          Int
  piso            String?
  departamento    String?
  
  // Características
  ambientes       Int
  dormitorios     Int
  banios          Int
  metrosCuadrados Int
  metrosCubiertos Int
  antiguedad      Int?
  cochera         Int
  expensas        Float?
  
  // Metadata
  descripcion     String
  observaciones   String?
  imagen          String?
  activo          Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  cliente       Cliente       @relation(fields: [clienteId], references: [id])
  pais          Pais          @relation(fields: [paisId], references: [id])
  provincia     Provincia     @relation(fields: [provinciaId], references: [id])
  tipoPropiedad TipoPropiedad @relation(fields: [tipoPropiedadId], references: [id])
  contratos     Contrato[]
}
```

**Campos Destacados:**
- `metrosCuadrados` vs `metrosCubiertos`: Diferenciación importante
- `expensas`: Gasto mensual del edificio (puede variar)
- `imagen`: URL o path de foto de la propiedad

**Relaciones:**
- Propiedad → Cliente (propietario) - N:1
- Propiedad → Contrato - 1:N (historial de alquileres)

---

## 📝 Módulo de Contratos

### TipoContrato

**Propósito:** Configuración de tipos de contrato con periodicidad de actualización.

```prisma
model TipoContrato {
  id                         Int       @id @default(autoincrement())
  descripcion                String
  cantidadMesesActualizacion Int       @unique
  ipc                        Float     @default(0)
  icl                        Float     @default(0)
  icp                        Float     @default(0)
  ultimaActualizacion        DateTime?
  
  contratos Contrato[]
}
```

**Ejemplos:**
- Anual (12 meses)
- Semestral (6 meses)
- Trimestral (3 meses)

**Campos:**
- `cantidadMesesActualizacion`: Cada cuántos meses se ajusta el alquiler
- `ultimaActualizacion`: Última vez que se actualizó el índice

---

### TipoIndice

**Propósito:** Define qué índice se usa para ajustar (IPC o ICL).

```prisma
model TipoIndice {
  id          Int    @id @default(autoincrement())
  descripcion String
  nombre      String
  
  contratos Contrato[]
}
```

**Valores:**
- IPC (Índice de Precios al Consumidor)
- ICL (Índice de Contratos de Locación)

---

### Contrato

**Propósito:** Acuerdo de alquiler entre propietario e inquilino.

```prisma
model Contrato {
  id                    Int      @id @default(autoincrement())
  propiedadId           Int
  clienteIdPropietario  Int
  clienteIdInquilino    Int
  tipoContratoId        Int
  tipoIndiceId          Int
  
  // Fechas
  fechaInicio           DateTime
  fechaVencimiento      DateTime
  cantidadMesesDuracion Int
  diaMesVencimiento     Int
  
  // Montos
  montoAlquilerInicial  Float
  montoAlquilerUltimo   Float?   @default(0)
  mesesRestaActualizar  Int
  
  // Servicios incluidos
  abl      Boolean
  aysa     Boolean
  expensas Boolean
  gas      Boolean
  luz      Boolean
  otros    Boolean
  
  descripcion   String
  observaciones String?
  
  clienteInquilino   Cliente      @relation("ClienteInquilino", fields: [clienteIdInquilino], references: [id])
  clientePropietario Cliente      @relation("ClientePropietario", fields: [clienteIdPropietario], references: [id])
  propiedad          Propiedad    @relation(fields: [propiedadId], references: [id])
  tipoContrato       TipoContrato @relation(fields: [tipoContratoId], references: [id])
  tipoIndice         TipoIndice   @relation(fields: [tipoIndiceId], references: [id])
  recibos            Recibo[]
}
```

**Campos Críticos:**
- `mesesRestaActualizar`: Contador para próximo ajuste (decrementa con cada recibo)
- `montoAlquilerUltimo`: Último monto calculado (se actualiza al generar recibo)
- `diaMesVencimiento`: Día del mes para vencimiento de recibos

**Lógica de Negocio:**
- Cuando `mesesRestaActualizar = 0` → aplicar ajuste por índice
- Después del ajuste → `mesesRestaActualizar = cantidadMesesActualizacion`
- `cantidadMesesDuracion` decrementa con cada recibo generado

**Relaciones:**
- Contrato → Cliente (propietario) - N:1
- Contrato → Cliente (inquilino) - N:1
- Contrato → Propiedad - N:1
- Contrato → Recibo - 1:N

---

## 🧾 Módulo de Recibos

### EstadoRecibo

```prisma
model EstadoRecibo {
  id          Int    @id @default(autoincrement())
  descripcion String
  
  recibos Recibo[]
}
```

**Estados del Sistema:**

| ID | Descripción | Significado |
|----|-------------|-------------|
| 1  | PENDIENTE   | Recibo creado pero no generado definitivamente |
| 2  | GENERADO    | Recibo generado con monto final calculado |
| 3  | PAGADO      | Inquilino pagó el alquiler |
| 4  | IMPRESO     | Recibo fue impreso/enviado |
| 5  | ANULADO     | Recibo cancelado (no válido) |

**Flujo Normal:**
```
PENDIENTE → GENERADO → PAGADO → IMPRESO
          ↓
       ANULADO (en cualquier momento)
```

---

### Recibo

**Propósito:** Documentos de cobro mensual.

```prisma
model Recibo {
  id             Int       @id @default(autoincrement())
  contratoId     Int
  estadoReciboId Int
  
  // Montos
  montoTotal     Float  // Alquiler base calculado
  montoAnterior  Float  // Alquiler del mes anterior
  montoPagado    Float  // Total a pagar (suma de items)
  
  // Fechas
  fechaPendiente DateTime   // Fecha de creación inicial
  fechaGenerado  DateTime?  // Cuando pasó a GENERADO
  fechaImpreso   DateTime?  // Cuando se imprimió
  fechaAnulado   DateTime?  // Si fue anulado
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  
  // Servicios (copiados del contrato)
  abl      Boolean
  aysa     Boolean
  expensas Boolean
  gas      Boolean
  luz      Boolean
  otros    Boolean
  
  observaciones String?
  
  contrato     Contrato     @relation(fields: [contratoId], references: [id])
  estadoRecibo EstadoRecibo @relation(fields: [estadoReciboId], references: [id])
  itemsRecibo  ItemRecibo[]
}
```

**Diferencia entre Montos:**
- `montoTotal`: Calculado por sistema (alquiler + ajuste IPC/ICL)
- `montoPagado`: Suma de todos los items (puede incluir extras/descuentos)
- `montoAnterior`: Referencia del mes previo

**Regeneración:**
- Recibos en estado PENDIENTE pueden regenerarse
- Recibos GENERADOS/PAGADOS/IMPRESOS son inmutables
- Recibos ANULADOS no se pueden regenerar

**Índices implícitos:**
- `contratoId` - Buscar recibos de un contrato
- `estadoReciboId` - Filtrar por estado

---

## 🏷️ Módulo de Items

### TipoItem

**Propósito:** Sistema tipificado de items con comportamiento configurable.

```prisma
model TipoItem {
  id              Int      @id @default(autoincrement())
  codigo          String   @unique
  nombre          String
  descripcion     String?
  
  // Configuración de comportamiento
  esModificable   Boolean  @default(true)   // Usuario puede editar
  esEliminable    Boolean  @default(true)   // Usuario puede eliminar
  permiteNegativo Boolean  @default(false)  // Permite montos < 0
  esObligatorio   Boolean  @default(false)  // Debe existir en recibo
  
  // UI
  orden           Int      @default(0)      // Orden de visualización
  color           String?  @default("#6B7280")
  
  activo          Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  itemsRecibo ItemRecibo[]

  @@index([codigo])
  @@index([activo])
}
```

**Tipos Predefinidos:**

| Código | Nombre | Modificable | Eliminable | Permite Negativo | Color |
|--------|--------|-------------|------------|------------------|-------|
| ALQUILER | Alquiler | ❌ | ❌ | ❌ | red |
| DESCUENTO | Descuento | ✅ | ✅ | ✅ | green |
| EXTRA | Extra | ✅ | ✅ | ❌ | yellow |
| SERVICIO | Servicio | ✅ | ✅ | ❌ | blue |
| REINTEGRO | Reintegro | ✅ | ✅ | ✅ | violet |

**Índices:**
- `codigo` (unique) - Búsqueda rápida por código
- `activo` - Filtrar solo tipos activos

---

### ItemRecibo

**Propósito:** Conceptos individuales dentro de un recibo.

```prisma
model ItemRecibo {
  id            Int      @id @default(autoincrement())
  reciboId      Int
  tipoItemId    Int
  descripcion   String
  monto         Float
  observaciones String?
  createdAt     DateTime @default(now())
  
  recibo   Recibo   @relation(fields: [reciboId], references: [id], onDelete: Cascade)
  tipoItem TipoItem @relation(fields: [tipoItemId], references: [id])

  @@index([reciboId])
  @@index([tipoItemId])
}
```

**Cascade Delete:**
- Al eliminar un Recibo → se eliminan automáticamente sus ItemRecibo
- Previene items huérfanos

**Inferencia Automática:**
- Items con `monto < 0` → tipo REINTEGRO
- Items con `monto >= 0` (no alquiler) → tipo EXTRA
- Item "Alquiler" → tipo ALQUILER

**Índices:**
- `reciboId` - Obtener items de un recibo
- `tipoItemId` - Filtrar por tipo de item

---

## 📈 Módulo de Índices

### IPC (Índice de Precios al Consumidor)

```prisma
model Ipc {
  id         Int    @id @default(autoincrement())
  annoMes    String @unique  // Formato: "YYYY-MM"
  porcentaje Float           // Ejemplo: 2.4 (para 2.4%)
}
```

**Uso:** Cálculo de ajuste anual de alquileres.

**Formato de `annoMes`:**
- "2024-01" para enero 2024
- "2024-12" para diciembre 2024

**Índice:**
- `annoMes` (unique) - Un solo valor por mes

---

### ICL (Índice de Contratos de Locación)

```prisma
model Icl {
  id     Int      @id @default(autoincrement())
  fecha  DateTime @unique
  indice Float    // Ejemplo: 1.234567
}
```

**Uso:** Cálculo de ajuste para contratos que usan ICL.

**Fuente:** Datos del Banco Central de la República Argentina (BCRA).

**Índice:**
- `fecha` (unique) - Un solo registro por fecha

---

## 🔗 Diagrama de Relaciones (Principales)

```
Usuario ──┐
          │
          ├─── Invitacion
          └─── PasswordResetToken

Pais ──┬─── Provincia
       ├─── Cliente
       └─── Propiedad

Cliente ──┬─── Propiedad (como propietario)
          ├─── Contrato (como propietario)
          └─── Contrato (como inquilino)

Propiedad ──┬─── TipoPropiedad
            └─── Contrato

Contrato ──┬─── TipoContrato
           ├─── TipoIndice
           └─── Recibo

Recibo ──┬─── EstadoRecibo
         └─── ItemRecibo

ItemRecibo ─── TipoItem

TipoContrato ─── cantidadMesesActualizacion

TipoIndice ──┬─── IPC (si usa IPC)
             └─── ICL (si usa ICL)
```

---

## 🔍 Índices y Performance

### Índices Automáticos (Prisma)

Prisma crea automáticamente índices para:
- Claves primarias (`@id`)
- Campos únicos (`@unique`)
- Foreign keys (relaciones)

### Índices Personalizados

```prisma
// En TipoItem
@@index([codigo])
@@index([activo])

// En ItemRecibo
@@index([reciboId])
@@index([tipoItemId])

// En PasswordResetToken
@@index([email])
@@index([token])
```

**Razones:**
- `TipoItem.codigo`: Búsquedas frecuentes por código (ALQUILER, EXTRA, etc.)
- `TipoItem.activo`: Filtrar solo tipos activos
- `ItemRecibo.reciboId`: JOIN frecuente Recibo → Items
- `ItemRecibo.tipoItemId`: Filtrar items por tipo
- `PasswordResetToken.token`: Validación rápida de tokens

---

## ⚙️ Constraints y Validaciones

### Unique Constraints

| Tabla | Campo(s) | Razón |
|-------|----------|-------|
| Usuario | email | Un email = un usuario |
| Cliente | cuit | Identificación fiscal única |
| TipoItem | codigo | Códigos únicos (ALQUILER, etc.) |
| TipoContrato | cantidadMesesActualizacion | Un tipo por periodicidad |
| IPC | annoMes | Un IPC por mes |
| ICL | fecha | Un ICL por fecha |
| PasswordResetToken | token | Tokens únicos |
| Invitacion | email, codigo | Prevenir duplicados |

### Campos Obligatorios vs Opcionales

**Obligatorios (sin `?`):**
- IDs y foreign keys
- Nombres, apellidos, emails
- Montos y fechas de contratos
- Estados y tipos

**Opcionales (con `?`):**
- `observaciones` (en casi todas las tablas)
- `razonSocial` en Cliente (solo si es empresa)
- `montoAlquilerUltimo` en Contrato (se establece después)
- Fechas de estados (fechaImpreso, fechaAnulado, etc.)

### Valores por Defecto

```prisma
activo      Boolean  @default(true)     // Soft delete
confirmado  Boolean  @default(false)    // Email no verificado
createdAt   DateTime @default(now())    // Timestamp automático
usado       Boolean  @default(false)    // Tokens/invitaciones sin usar
```

---

## 🛠️ Comandos Útiles

### Prisma Studio (Explorador Visual)

```bash
npx prisma studio
```

Abre interfaz web en `http://localhost:5555` para ver/editar datos.

---

### Migraciones

```bash
# Crear nueva migración
npx prisma migrate dev --name nombre_descriptivo

# Aplicar migraciones pendientes
npx prisma migrate deploy

# Ver estado de migraciones
npx prisma migrate status

# Resetear BD (⚠️ solo desarrollo)
npx prisma migrate reset
```

---

### Seed (Datos Iniciales)

```bash
# Ejecutar seed
npx prisma db seed

# Ver configuración en package.json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

**Datos que carga el seed:**
- TipoItem (5 tipos predefinidos)
- EstadoRecibo (5 estados)
- TipoContrato (configuraciones iniciales)
- TipoIndice (IPC, ICL)

---

### Generar Cliente Prisma

```bash
# Regenerar cliente después de cambios en schema
npx prisma generate
```

Ejecutar después de:
- Modificar `schema.prisma`
- Cambiar de branch con schema diferente
- Pull de cambios que afecten schema

---

### Inspeccionar Schema

```bash
# Ver modelo en formato SQL
npx prisma db pull

# Formatear schema.prisma
npx prisma format

# Validar schema
npx prisma validate
```

---

## 🔒 Buenas Prácticas

### 1. Nunca Eliminar, Desactivar

```typescript
// ❌ Malo
await prisma.cliente.delete({ where: { id } })

// ✅ Bueno
await prisma.cliente.update({ 
  where: { id },
  data: { activo: false }
})
```

### 2. Usar Transacciones para Operaciones Múltiples

```typescript
await prisma.$transaction(async (tx) => {
  const recibo = await tx.recibo.create({ data: reciboData })
  await tx.itemRecibo.createMany({ data: itemsData })
  await tx.contrato.update({ where: { id }, data: contratoUpdate })
})
```

### 3. Incluir Relaciones Solo Cuando Necesario

```typescript
// ❌ Sobrecarga
const recibos = await prisma.recibo.findMany({
  include: {
    contrato: {
      include: {
        propiedad: { include: { cliente: true } },
        clienteInquilino: true
      }
    }
  }
})

// ✅ Selectivo
const recibos = await prisma.recibo.findMany({
  include: {
    itemsRecibo: { include: { tipoItem: true } }
  }
})
```

### 4. Validar Foreign Keys Antes de Insertar

```typescript
// Verificar que contrato existe antes de crear recibo
const contrato = await prisma.contrato.findUnique({ where: { id: contratoId } })
if (!contrato) {
  throw new Error("Contrato no encontrado")
}
```

### 5. Usar Índices para Búsquedas Frecuentes

Si haces búsquedas como:
```typescript
await prisma.recibo.findMany({
  where: { estadoReciboId: 1 }
})
```

Considera agregar:
```prisma
model Recibo {
  // ...
  @@index([estadoReciboId])
}
```

---

## 📚 Referencias

- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Database Design Patterns](https://www.prisma.io/dataguide/database-design)

---

## 🔄 Historial de Cambios del Schema

### v2.1.0 (13 Nov 2024)
- Mejoras en inferencia automática de TipoItem

### v2.0.0 (13 Nov 2024)
- ✅ Agregado modelo `TipoItem`
- ✅ Modificado `ItemRecibo` para usar `tipoItemId`
- ✅ Agregados índices en `TipoItem`

### v1.5.0
- ✅ Agregado sistema de autenticación
- ✅ Modelo `Usuario`, `Invitacion`, `PasswordResetToken`

---

[⬅️ Volver al README principal](../README.md)
