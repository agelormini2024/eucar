# EUCAR - Sistema de Gestión de Alquileres

Sistema integral para la administración de contratos de alquiler con cálculo automático de ajustes por índices económicos (IPC/ICL) y generación de recibos.

---

## 🎯 Características Principales

- **Gestión de Contratos**: Administración completa de contratos de alquiler con propietarios e inquilinos
- **Cálculo Automático**: Ajustes de alquiler según índices IPC (Índice de Precios al Consumidor) o ICL (Índice de Contratos de Locación)
- **Generación de Recibos**: Sistema inteligente de recibos con estados y validaciones
- **Items Tipificados**: Sistema flexible de items con comportamiento configurable
- **Gestión de Propiedades**: Control de inmuebles bajo administración
- **Auditoría Completa**: Seguimiento de cambios y estados históricos

---

## � Inicio Rápido

### Prerrequisitos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- npm/yarn/pnpm

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd eucar

# Instalar dependencias
npm install

# Configurar base de datos
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar migraciones
npx prisma migrate dev

# Cargar datos iniciales
npx prisma db seed

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## � Documentación

### Guías Técnicas

- **[🔧 Instalación y Configuración](./docs/INSTALLATION.md)** - Guía completa de setup
- **[🗄️ Base de Datos](./docs/DATABASE.md)** - Schema, relaciones y migraciones
- **[🧮 Cálculos de Índices](./docs/INDICES.md)** - Fórmulas IPC e ICL explicadas
- **[📝 Sistema de Recibos](./docs/RECIBOS.md)** - Lógica de negocio y estados
- **[🏷️ TipoItem](./docs/TIPO_ITEM.md)** - Sistema de tipos de items (nuevo)
- **[🧪 Testing](./docs/TESTING.md)** - Guía de tests y coverage

### Arquitectura

- **[📐 Estructura del Proyecto](./docs/ARCHITECTURE.md)** - Organización de carpetas y archivos
- **[🔄 Hooks Personalizados](./docs/HOOKS.md)** - useReciboData, useReciboValidation
- **[⚙️ Server Actions](./docs/ACTIONS.md)** - Acciones del servidor Next.js

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Base de Datos** | PostgreSQL + Prisma ORM |
| **Autenticación** | NextAuth.js |
| **Estado Global** | Zustand |
| **Estilos** | Tailwind CSS |
| **Validación** | Zod |
| **Testing** | Jest + React Testing Library |
| **Lenguaje** | TypeScript |

---

## 📊 Módulos del Sistema

### 1. Clientes
Gestión de propietarios e inquilinos con datos completos (DNI, CUIT, contacto).

### 2. Propiedades
Administración de inmuebles con tipos, ubicaciones y características.

### 3. Contratos
- Tipos de contrato (IPC/ICL)
- Periodicidad de ajustes
- Duración y renovaciones
- Montos históricos

### 4. Recibos
- Estados: PENDIENTE → GENERADO → PAGADO → IMPRESO → ANULADO
- Items tipificados con validaciones
- Regeneración inteligente
- Exportación a PDF

### 5. Índices Económicos
- Carga manual o automática de IPC
- Importación de ICL desde BCRA
- Históricos y consultas

---

## 🎨 Capturas

*(Agregar screenshots del sistema aquí)*

---

## 🔑 Variables de Entorno

```env
# Base de Datos
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Autenticación
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email (opcional)
EMAIL_SERVER_USER="email@example.com"
EMAIL_SERVER_PASSWORD="app-password"
EMAIL_FROM="noreply@eucar.com"
```

Ver [.env.example](./.env.example) para más detalles.

---

## � Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción

# Base de Datos
npm run db:studio    # Explorador visual (Prisma Studio)
npm run db:migrate   # Ejecutar migraciones
npm run db:seed      # Cargar datos iniciales
npm run db:reset     # Resetear base de datos

# Testing
npm test            # Ejecutar tests
npm run test:watch  # Tests en modo watch
npm run test:coverage # Generar coverage
```

---

## � Actualizaciones Recientes

### v2.0 - Sistema TipoItem (Noviembre 2024)

- ✅ Nueva tabla `TipoItem` con tipos configurables
- ✅ Items con comportamiento dinámico (modificable, eliminable)
- ✅ UI con colores por tipo de item
- ✅ Helpers type-safe para validaciones
- ✅ Migración de items existentes

Ver [CHANGELOG.md](./CHANGELOG.md) para historial completo.

---

## 🤝 Contribución

1. Fork del proyecto
2. Crear branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

Ver [CONTRIBUTING.md](./CONTRIBUTING.md) para guía detallada.

---

## � Licencia

Este proyecto es privado y confidencial. Todos los derechos reservados.

---

## 📧 Soporte

Para consultas o reportar problemas:
- **Issues**: [GitHub Issues](link-to-issues)
- **Email**: soporte@eucar.com
- **Documentación**: [Wiki del Proyecto](link-to-wiki)

---

## 👥 Equipo

Desarrollado por Alejandro Gelormini.

---

**Estado del Proyecto**: 🟢 En Desarrollo Activo

**Última Actualización**: Noviembre 2024


## Calculos en la usados en aplicacion
Ubicación del archivo temporal (excel) del BCRA para extraer los datos 
para el cálculo del ICL
## ICL
Calcular el ICL acumulado tomando como ejemplo los últimos 6 meses

    * Formula de ICL Semestral
    
    Supongamos:

    Contrato firmado el 1 de enero de 2024
    Ajuste a los 6 meses: 1 de julio de 2024
    Alquiler inicial: $1000

        ICL del 01/01/2024: 1.123456
        ICL del 01/07/2024: 1.234567

    Formula:

        Alquiler ajustado = 1000 × ( 1.123456 / 1.234567 ) ≈ 1000 × 1.099 ≈ 1099

    ✅ Resultado:
    El nuevo alquiler a partir del 1 de julio de 2024 sería $1099 
    Es decir que el porcentaje de aumento fué del 9.9 %           

## IPC

Formula de IPC Anual
Paso 1: Convertir los porcentajes a coeficientes
Para poder multiplicar el valor, transformamos cada porcentaje en su factor decimal:

Ejemplo:
IPC últimos 3 meses:
    Mes 1: 2.4%
    Mes 2: 3.73%
    Mes 3: 2.78%

    ✅ Paso 1: Convertir los porcentajes a coeficientes

    Mes 1 = 1 + 2.4% = 1.024
    Mes 2 = 1 + 3.73% = 1.0373
    Mes 3 = 1 + 2.78% = 1.0278
​
    
    ✅ Paso 2: Calcular el coeficiente acumulado
    
    Multiplicamos todos los factores:
    Factor acumulado = 1.024 × 1.0373 × 1 .0278 ≈ 1.091

    ✅ Paso 3: Calcular el nuevo valor del alquiler
    
    Nuevo alquiler=$1000 × 1.091 = $ 1091

