# 📋 Templates y Guías para Actions

## 🎯 **Propósito**
Este archivo contiene templates y mejores prácticas para mantener consistencia y robustez en todos los server actions de la aplicación.

---

## 🗂️ **Template para List Actions**

### **Uso:** Para obtener listas de datos (getClientes, getContratos, etc.)

```typescript
"use server"
import { prisma } from "@/src/lib/prisma"

/**
 * Obtiene la lista de [ENTIDAD] con sus relaciones
 * [Descripción específica de qué incluye]
 * @returns Array de [ENTIDAD] con relaciones o array vacío en caso de error
 */
export async function get[ENTIDADES]() {
    try {
        const [entidades] = await prisma.[entidad].findMany({
            orderBy: {
                [campo]: 'asc'
            },
            include: {
                // Relaciones necesarias
            }
        })
        return [entidades];
    } catch (error) {
        console.error("Error al obtener [entidades]:", error)
        return []
    }
}
```

---

## 📝 **Template para Create Actions**

### **Uso:** Para crear nuevos registros (createCliente, createContrato, etc.)

```typescript
"use server"
import { prisma } from "@/src/lib/prisma"
import { [ENTIDAD]Schema } from "@/src/schema"

/**
 * Crea un nuevo [entidad] en el sistema
 * Valida los datos con Zod y verifica [reglas de negocio específicas]
 * @param data - Datos del [entidad] a crear
 * @returns Objeto con success/error y datos/errores correspondientes
 */
export async function create[ENTIDAD](data: unknown) {
    try {
        // 1. Validar los datos con el esquema de Zod
        const result = [ENTIDAD]Schema.safeParse(data)

        if (!result.success) {
            return {
                success: false,
                errors: result.error.issues
            }
        }

        // 2. Validaciones de negocio específicas
        // Ejemplo: verificar unicidad, relaciones existentes, etc.
        const existing[ENTIDAD] = await prisma.[entidad].findFirst({
            where: {
                // Condiciones de unicidad
            }
        });

        if (existing[ENTIDAD]) {
            return {
                success: false,
                errors: [{ 
                    path: ['[campo]'], 
                    message: "El [entidad] ya está registrado en el sistema" 
                }]
            };
        }

        // 3. Procesar datos si es necesario
        // Ejemplo: convertir fechas, transformar campos, etc.
        const processedData = {
            ...result.data,
            // Transformaciones específicas
        };

        // 4. Crear el registro
        const nuevo[ENTIDAD] = await prisma.[entidad].create({
            data: processedData
        })

        return {
            success: true,
            data: nuevo[ENTIDAD]
        }

    } catch (error) {
        console.error("Error al crear [entidad]:", error)
        return {
            success: false,
            errors: [{ 
                path: ['general'], 
                message: "Error interno del servidor. Intente nuevamente." 
            }]
        }
    }
}
```

---

## 🔄 **Template para Update Actions**

### **Uso:** Para actualizar registros existentes

```typescript
"use server"
import { prisma } from "@/src/lib/prisma"
import { [ENTIDAD]Schema } from "@/src/schema"

/**
 * Actualiza un [entidad] existente en el sistema
 * @param id - ID del [entidad] a actualizar
 * @param data - Datos actualizados del [entidad]
 * @returns Objeto con success/error y datos/errores correspondientes
 */
export async function update[ENTIDAD](id: number, data: unknown) {
    try {
        // 1. Validar los datos
        const result = [ENTIDAD]Schema.safeParse(data)

        if (!result.success) {
            return {
                success: false,
                errors: result.error.issues
            }
        }

        // 2. Verificar que el registro existe
        const existing[ENTIDAD] = await prisma.[entidad].findUnique({
            where: { id }
        });

        if (!existing[ENTIDAD]) {
            return {
                success: false,
                errors: [{ 
                    path: ['id'], 
                    message: "El [entidad] no existe" 
                }]
            };
        }

        // 3. Validaciones de negocio para actualización
        // Ejemplo: verificar que no se duplique con otros registros

        // 4. Actualizar el registro
        const [entidad]Actualizado = await prisma.[entidad].update({
            where: { id },
            data: result.data
        })

        return {
            success: true,
            data: [entidad]Actualizado
        }

    } catch (error) {
        console.error("Error al actualizar [entidad]:", error)
        return {
            success: false,
            errors: [{ 
                path: ['general'], 
                message: "Error interno del servidor. Intente nuevamente." 
            }]
        }
    }
}
```

---

## 🔄 **Template para Process Actions**

### **Uso:** Para operaciones complejas (getIpc, getIcl, calcular índices, etc.)

```typescript
"use server"
import { prisma } from "@/src/lib/prisma"
import { [SCHEMA] } from "@/src/schema"

/**
 * Procesa [descripción de la operación]
 * 1. [Paso 1]
 * 2. [Paso 2]
 * 3. [Paso 3]
 * @param data - [Descripción del parámetro]
 * @returns Objeto con success/error y información del procesamiento
 */
export async function process[OPERACION](data: unknown) {
    try {
        // 1. Validar los datos
        const result = [SCHEMA].safeParse(data)

        if (!result.success) {
            return {
                success: false,
                errors: result.error.issues
            }
        }

        let procesados = 0;
        let actualizados = 0;

        // 2. Procesar datos principales
        for (const item of result.data) {
            // Lógica de procesamiento
            procesados++;
        }

        // 3. Realizar cálculos y actualizaciones secundarias
        // Ejemplo: actualizar índices, recalcular valores, etc.

        return {
            success: true,
            data: {
                registrosProcesados: procesados,
                registrosActualizados: actualizados,
                // Otras métricas relevantes
            }
        }

    } catch (error) {
        console.error("Error al procesar [operación]:", error)
        return {
            success: false,
            errors: [{ 
                path: ['general'], 
                message: "Error interno al procesar los datos. Intente nuevamente." 
            }]
        }
    }
}
```

---

## 🛡️ **Mejores Prácticas**

### **1. Estructura Consistente**
```typescript
// Siempre seguir este orden:
1. Imports
2. JSDoc completo
3. Try/catch que englobe toda la lógica
4. Validación con Zod
5. Validaciones de negocio
6. Operaciones de BD
7. Return con formato consistente
```

### **2. Formato de Respuesta Estándar**

#### **Para operaciones de creación/actualización:**
```typescript
// Éxito:
{
    success: true,
    data: [objetoCreado/Actualizado]
}

// Error:
{
    success: false,
    errors: [
        {
            path: ['campo'],
            message: "Mensaje descriptivo"
        }
    ]
}
```

#### **Para operaciones de listado:**
```typescript
// Éxito: Array de datos (nunca null/undefined)
[...datos]

// Error: Array vacío
[]
```

#### **Para operaciones de procesamiento:**
```typescript
// Éxito:
{
    success: true,
    data: {
        procesados: number,
        actualizados: number,
        [otrasMetricas]: any
    }
}
```

### **3. Manejo de Errores**

```typescript
// ✅ Logs informativos
console.error("Error al [operación específica]:", error)

// ✅ Mensajes de error claros para el usuario
"Error interno del servidor. Intente nuevamente."

// ✅ Paths específicos para errores de validación
path: ['campo'], message: "Descripción del problema"
```

### **4. JSDoc Completo**

```typescript
/**
 * [Descripción breve de qué hace la función]
 * [Descripción detallada si es necesario]
 * @param param1 - Descripción del parámetro
 * @param param2 - Descripción del parámetro
 * @returns Descripción del valor de retorno
 * @example
 * const result = await myAction(data)
 * if (result.success) {
 *   console.log(result.data)
 * }
 */
```

---

## 🎨 **Uso en Frontend**

### **Template para manejo en componentes React:**

```typescript
const handleAction = async (formData) => {
    const result = await myAction(formData)
    
    if (result.success) {
        toast.success("Operación exitosa")
        // Redireccionar o actualizar estado
        router.push(`/route/${result.data.id}`)
    } else {
        // Mostrar errores específicos
        result.errors.forEach(error => {
            if (error.path?.includes('specificField')) {
                setFieldError(error.message)
            } else {
                toast.error(error.message)
            }
        })
    }
}
```

---

## ✅ **Checklist antes de hacer commit**

- [ ] Try/catch engloba toda la lógica
- [ ] Validación con Zod dentro del try
- [ ] Formato de respuesta consistente
- [ ] JSDoc completo y descriptivo
- [ ] Logs de error informativos
- [ ] Mensajes de error claros para el usuario
- [ ] Validaciones de negocio apropiadas
- [ ] Tests actualizados (si aplica)

---

## 🚀 **Comandos útiles**

```bash
# Verificar errores de TypeScript
npm run type-check

# Ejecutar tests
npm test

# Verificar formato
npm run lint
```

---

**📝 Nota:** Este archivo debe actualizarse cuando se identifiquen nuevos patrones o mejores prácticas.

**🔄 Última actualización:** 18 de septiembre de 2025