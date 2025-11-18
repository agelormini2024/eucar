# 📢 InfoAlert Component

## 🎯 Propósito

Componente reutilizable para mostrar mensajes, alertas y validaciones de forma profesional y consistente en toda la aplicación.

---

## 📦 Props

```typescript
interface InfoAlertProps {
  title: string           // Título principal del mensaje
  message: string         // Mensaje descriptivo principal
  subMessage?: string     // Mensaje adicional opcional (más detalle)
  variant?: "info" | "warning" | "success" | "error"  // Tipo de alerta (default: "info")
  showBackButton?: boolean  // Mostrar botón "Volver" (default: true)
}
```

---

## 🎨 Variantes

### 1. **Info** (Azul) 💙
- **Uso**: Mensajes informativos, instrucciones, guías
- **Ícono**: ℹ️ Info (Lucide React)
- **Color**: `bg-blue-50`, `text-blue-800`, `border-blue-200`
- **Ejemplo**: "Índices no disponibles aún"

```tsx
<InfoAlert
  variant="info"
  title="Índices no disponibles"
  message="Este recibo está en estado PENDIENTE porque aún no están cargados los índices IPC."
  subMessage="Una vez que los índices estén disponibles, podrá regenerar el recibo."
/>
```

### 2. **Warning** (Amarillo) ⚠️
- **Uso**: Advertencias, validaciones fallidas, acciones bloqueadas
- **Ícono**: ⚠️ AlertTriangle (Lucide React)
- **Color**: `bg-yellow-50`, `text-yellow-800`, `border-yellow-200`
- **Ejemplo**: "Recibo no editable"

```tsx
<InfoAlert
  variant="warning"
  title="Recibo no editable"
  message="Este recibo está en estado GENERADO y no puede ser editado."
  subMessage="Solo los recibos en estado PENDIENTE pueden ser modificados."
/>
```

### 3. **Success** (Verde) ✅
- **Uso**: Confirmaciones exitosas, operaciones completadas
- **Ícono**: ✓ CheckCircle (Lucide React)
- **Color**: `bg-green-50`, `text-green-800`, `border-green-200`
- **Ejemplo**: "Recibo creado exitosamente"

```tsx
<InfoAlert
  variant="success"
  title="Operación exitosa"
  message="El recibo ha sido generado correctamente."
/>
```

### 4. **Error** (Rojo) ❌
- **Uso**: Errores críticos, recursos no encontrados, fallos del sistema
- **Ícono**: ✗ XCircle (Lucide React)
- **Color**: `bg-red-50`, `text-red-800`, `border-red-200`
- **Ejemplo**: "Recibo no encontrado"

```tsx
<InfoAlert
  variant="error"
  title="Recibo no encontrado"
  message="No se encontró el recibo solicitado o no existe en el sistema."
  subMessage="Verifique que el ID del recibo sea correcto."
/>
```

---

## 📍 Ubicación

```
components/ui/InfoAlert.tsx
```

---

## 🔧 Uso en la Aplicación

### Página de Edición (`/admin/recibos/[id]/edit`)

```tsx
// Validación 1: Recibo no encontrado
{!recibo ? (
  <InfoAlert
    variant="error"
    title="Recibo no encontrado"
    message="No se encontró el recibo solicitado o no existe en el sistema."
    subMessage="Verifique que el ID del recibo sea correcto."
  />
) : 

// Validación 2: Estado no editable
recibo.estadoReciboId !== 1 ? (
  <InfoAlert
    variant="warning"
    title="Recibo no editable"
    message={`Este recibo está en estado ${estadosMap[recibo.estadoReciboId]}.`}
    subMessage="Solo los recibos en estado PENDIENTE pueden ser modificados."
  />
) :

// Validación 3: Debe regenerarse
puedeRegenerar ? (
  <InfoAlert
    variant="info"
    title="Recibo listo para regenerar"
    message={`Los índices ${tipoIndice} necesarios ya están disponibles.`}
    subMessage="Dirígete a la sección de 'Regenerar Recibo'."
  />
) :

// Todo OK: Mostrar formulario
<EditReciboForm>...</EditReciboForm>
}
```

### Página de Alta/Regenerar (`/admin/recibos/alta/[contratoId]`)

```tsx
{recibo && recibo.estadoReciboId !== 1 ? (
  <InfoAlert
    variant="warning"
    title="Recibo ya generado"
    message="Ya existe un recibo generado para este contrato en este mes."
  />
) : recibo && !indicesDisponibles ? (
  <InfoAlert
    variant="info"
    title="Índices no disponibles"
    message={`Aún no están cargados los índices ${tipoIndice} necesarios.`}
    subMessage="Una vez disponibles, podrá regenerar el recibo."
  />
) : (
  <AddReciboForm>...</AddReciboForm>
)}
```

---

## 🎨 Diseño Visual

### Estructura HTML
```html
<div className="bg-{color}-50 border border-{color}-200 rounded-lg p-6">
  <div className="flex items-start">
    <!-- Ícono -->
    <div className="flex-shrink-0">
      <Icon className="h-6 w-6 text-{color}-600" />
    </div>
    
    <!-- Contenido -->
    <div className="ml-3 flex-1">
      <h3 className="text-lg font-bold text-{color}-800">
        {title}
      </h3>
      <p className="mt-2 text-sm text-{color}-700">
        {message}
      </p>
      {subMessage && (
        <p className="mt-2 text-sm text-{color}-600">
          {subMessage}
        </p>
      )}
    </div>
  </div>
  
  <!-- Botón Volver (opcional) -->
  {showBackButton && (
    <div className="mt-4 flex justify-center">
      <ButtonGoBack />
    </div>
  )}
</div>
```

### Características de Diseño
- ✅ **Responsive**: Se adapta a diferentes tamaños de pantalla
- ✅ **Accesible**: Colores con suficiente contraste
- ✅ **Consistente**: Mismo diseño en toda la app
- ✅ **Profesional**: Diseño limpio y moderno
- ✅ **Iconos**: Visual feedback inmediato del tipo de mensaje

---

## 💡 Ventajas

1. **DRY (Don't Repeat Yourself)**
   - Elimina ~50 líneas de HTML repetitivo
   - Un solo componente para todos los mensajes

2. **Consistencia**
   - Diseño uniforme en toda la aplicación
   - Mismo comportamiento y estilo

3. **Mantenibilidad**
   - Cambios de estilo en un solo lugar
   - Fácil agregar nuevas variantes

4. **Type Safety**
   - Props tipadas con TypeScript
   - Autocompletado en IDE

5. **UX Mejorada**
   - Mensajes claros y color-coded
   - Guía visual inmediata (íconos + colores)

---

## 🔄 Antes vs Después

### ❌ Antes (código repetitivo)
```tsx
<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-10">
  <div className="flex items-start">
    <div className="flex-shrink-0">
      <Info className="h-6 w-6 text-blue-600" />
    </div>
    <div className="ml-3 flex-1">
      <h3 className="text-lg font-bold text-blue-800">
        Índices no disponibles
      </h3>
      <p className="mt-2 text-sm text-blue-700">
        Este recibo está en estado PENDIENTE...
      </p>
      <p className="mt-2 text-sm text-blue-600">
        Una vez que los índices estén disponibles...
      </p>
    </div>
  </div>
  <div className="mt-4 flex justify-center">
    <ButtonGoBack />
  </div>
</div>
```

### ✅ Después (componente reutilizable)
```tsx
<InfoAlert
  variant="info"
  title="Índices no disponibles"
  message="Este recibo está en estado PENDIENTE..."
  subMessage="Una vez que los índices estén disponibles..."
/>
```

**Reducción**: De ~24 líneas a ~5 líneas (-80%)

---

## 🚀 Extensibilidad

### Agregar Nueva Variante

```typescript
// En InfoAlert.tsx
const variantStyles = {
  info: { bg: "bg-blue-50", border: "border-blue-200", ... },
  warning: { bg: "bg-yellow-50", border: "border-yellow-200", ... },
  success: { bg: "bg-green-50", border: "border-green-200", ... },
  error: { bg: "bg-red-50", border: "border-red-200", ... },
  // Nueva variante
  custom: { bg: "bg-purple-50", border: "border-purple-200", ... }
}

const variantIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
  // Nuevo ícono
  custom: Star
}
```

---

## 📚 Referencias

- **Lucide React**: https://lucide.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Componente**: `components/ui/InfoAlert.tsx`
- **Documentación de Flujo**: `components/recibos/FLOW_RECIBOFORMDYNAMIC.md`
- **Changelog**: `CHANGELOG.md` (versión 2.3.0)

---

## ✅ Checklist de Implementación

- [x] Componente InfoAlert creado
- [x] 4 variantes implementadas (info, warning, success, error)
- [x] Props tipadas con TypeScript
- [x] Integrado en página de edición (3 validaciones)
- [x] Integrado en página de alta (2 validaciones)
- [x] Botón "Volver" integrado
- [x] Documentación completa
- [x] Testing manual exitoso

---

**Versión**: 2.3.0  
**Última actualización**: 18/11/2024  
**Autor**: Sistema de Gestión EUCAR
