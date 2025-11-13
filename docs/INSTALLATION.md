# 🔧 Instalación y Configuración

Guía completa para configurar el entorno de desarrollo de EUCAR.

---

## 📋 Prerrequisitos

### Software Requerido

| Software | Versión Mínima | Recomendada | Notas |
|----------|----------------|-------------|-------|
| **Node.js** | 18.17.0 | 20.x LTS | [Descargar](https://nodejs.org/) |
| **PostgreSQL** | 14.0 | 15.x o 16.x | [Descargar](https://www.postgresql.org/download/) |
| **npm** | 9.0 | 10.x | Incluido con Node.js |
| **Git** | 2.30 | Latest | [Descargar](https://git-scm.com/) |

### Opcionales

- **pnpm** o **yarn** - Gestores de paquetes alternativos
- **pgAdmin 4** - Cliente gráfico para PostgreSQL
- **VS Code** - Editor recomendado

---

## 🚀 Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd eucar
```

### 2. Instalar Dependencias

```bash
# Con npm
npm install

# O con pnpm
pnpm install

# O con yarn
yarn install
```

### 3. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# ==========================================
# DATABASE
# ==========================================
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/eucar?schema=public"

# ==========================================
# NEXTAUTH
# ==========================================
NEXTAUTH_SECRET="genera-un-secret-aleatorio-aqui"
NEXTAUTH_URL="http://localhost:3000"

# ==========================================
# EMAIL (Opcional - para recuperación de contraseña)
# ==========================================
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="tu-email@gmail.com"
EMAIL_SERVER_PASSWORD="tu-app-password"
EMAIL_FROM="noreply@eucar.com"

# ==========================================
# OTROS (Opcional)
# ==========================================
NODE_ENV="development"
```

#### Generar NEXTAUTH_SECRET

```bash
# Método 1: OpenSSL
openssl rand -base64 32

# Método 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Configurar Base de Datos

#### Crear Base de Datos en PostgreSQL

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE eucar;

# Crear usuario (opcional)
CREATE USER eucar_user WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE eucar TO eucar_user;

# Salir
\q
```

#### Ejecutar Migraciones

```bash
npx prisma migrate dev
```

**¿Qué hace esto?**
- Crea todas las tablas en la BD
- Ejecuta migraciones en orden
- Genera el Prisma Client

#### Cargar Datos Iniciales (Seed)

```bash
npx prisma db seed
```

**¿Qué se carga?**
- Tipos de contrato (IPC, ICL)
- Estados de recibo (PENDIENTE, GENERADO, etc.)
- TipoItem (ALQUILER, DESCUENTO, etc.)
- Tipos de propiedad
- Provincias y países
- Datos de ejemplo (opcional)

### 5. Verificar Instalación

```bash
# Ver tablas creadas
npx prisma studio
```

Abre [http://localhost:5555](http://localhost:5555) para explorar la BD.

### 6. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Aplicación disponible en [http://localhost:3000](http://localhost:3000)

---

## 🐳 Instalación con Docker (Opcional)

### Prerrequisitos

- Docker Desktop instalado
- Docker Compose

### Pasos

1. **Crear `docker-compose.yml`** (si no existe):

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: eucar_postgres
    environment:
      POSTGRES_USER: eucar
      POSTGRES_PASSWORD: eucar123
      POSTGRES_DB: eucar
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    container_name: eucar_app
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://eucar:eucar123@postgres:5432/eucar?schema=public"
      NEXTAUTH_URL: "http://localhost:3000"
    depends_on:
      - postgres
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  postgres_data:
```

2. **Ejecutar:**

```bash
docker-compose up -d
```

---

## ⚙️ Configuración de VS Code

### Extensiones Recomendadas

Crear `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "orta.vscode-jest"
  ]
}
```

### Settings

Crear `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```

---

## 🧪 Verificar Instalación

### Checklist

- [ ] Node.js y npm instalados
- [ ] PostgreSQL corriendo
- [ ] Base de datos `eucar` creada
- [ ] Variables de entorno configuradas
- [ ] Dependencias instaladas
- [ ] Migraciones ejecutadas
- [ ] Seed ejecutado
- [ ] Servidor dev corriendo sin errores
- [ ] Prisma Studio funciona
- [ ] Aplicación accesible en navegador

### Tests

```bash
# Ejecutar tests
npm test

# Debería mostrar:
# ✓ Tests pasando (algunos pueden fallar post-migración TipoItem)
```

---

## 🔧 Troubleshooting

### Error: "Role 'postgres' does not exist"

```bash
# En terminal
createuser -s postgres
```

### Error: "Database 'eucar' does not exist"

```bash
createdb eucar
```

### Error: "Port 5432 already in use"

```bash
# Cambiar puerto en .env
DATABASE_URL="postgresql://user:pass@localhost:5433/eucar"
```

### Error: Prisma Client no genera

```bash
npx prisma generate
```

### Resetear Base de Datos

```bash
# ⚠️ CUIDADO: Borra todos los datos
npx prisma migrate reset
```

---

## 📦 Estructura de Archivos

Después de la instalación:

```
eucar/
├── .env                  # Variables de entorno (NO commitear)
├── .env.example          # Template de variables
├── package.json          # Dependencias
├── prisma/
│   ├── schema.prisma     # Schema de BD
│   ├── migrations/       # Migraciones
│   └── seed.ts          # Datos iniciales
├── node_modules/        # Dependencias instaladas
└── ...
```

---

## 🚀 Próximos Pasos

1. **Explorar la aplicación** en [http://localhost:3000](http://localhost:3000)
2. **Leer documentación** de [Base de Datos](./DATABASE.md)
3. **Entender el flujo** de [Recibos](./RECIBOS.md)
4. **Ver ejemplos** de [Cálculos](./INDICES.md)

---

[⬅️ Volver al README principal](../README.md)
