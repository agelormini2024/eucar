# 🔐 Guía de Usuario - Módulo de Autenticación
## Sistema Soares Parente Propiedades

---

## 📋 **Índice**
1. [Registro de Nueva Cuenta](#registro-de-nueva-cuenta)
2. [Iniciar Sesión](#iniciar-sesión)
3. [Recuperar Contraseña Olvidada](#recuperar-contraseña-olvidada)
4. [Cambiar Contraseña](#cambiar-contraseña)
5. [Gestión de Invitaciones (Solo Administradores)](#gestión-de-invitaciones-solo-administradores)
6. [Cerrar Sesión](#cerrar-sesión)
7. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🆕 **Registro de Nueva Cuenta**

### **Requisitos Previos:**
- ✅ Debe tener un **código de invitación válido**
- ✅ El código debe estar asociado a su email
- ✅ El código no debe haber expirado

### **Pasos para Registrarse:**

1. **Acceder a la página de registro:**
   - Ir a la página de login
   - Hacer clic en **"¿No tienes una cuenta? Regístrate aquí"**
   - O ir directamente a `/auth/register`

2. **Completar el formulario:**
   - **Email:** Debe coincidir exactamente con el de la invitación
   - **Nombre:** Su nombre completo
   - **Contraseña:** Mínimo 6 caracteres
   - **Confirmar Contraseña:** Debe coincidir con la anterior
   - **Código de Invitación:** Proporcionado por el administrador

3. **Validaciones del sistema:**
   - ✅ Email válido y coincidente con invitación
   - ✅ Contraseña segura (mínimo 6 caracteres)
   - ✅ Contraseñas coincidentes
   - ✅ Código de invitación válido y no usado

4. **Finalización:**
   - Si todo es correcto, será redirigido al login
   - Podrá iniciar sesión inmediatamente

### **Posibles Errores:**
- ❌ **"Código de invitación inválido"** → Verificar el código con el administrador
- ❌ **"El email no coincide con la invitación"** → Usar el email exacto de la invitación
- ❌ **"Este código ya ha sido utilizado"** → Solicitar nuevo código al administrador
- ❌ **"El código ha expirado"** → Solicitar nuevo código al administrador

---

## 🔑 **Iniciar Sesión**

### **Pasos:**

1. **Acceder al login:**
   - Ir a la página principal del sistema
   - O directamente a `/auth/login`

2. **Introducir credenciales:**
   - **Email:** El mismo usado en el registro
   - **Contraseña:** Su contraseña personal

3. **Acceder al sistema:**
   - Hacer clic en **"Iniciar Sesión"**
   - Será redirigido al panel principal

### **Posibles Errores:**
- ❌ **"No se encontró un usuario con este email"** → Verificar el email
- ❌ **"Password Inválido"** → Verificar la contraseña o usar "¿Olvidaste tu contraseña?"

---

## 🔄 **Recuperar Contraseña Olvidada**

### **Cuándo usar esta función:**
- Ha olvidado su contraseña
- No puede acceder a su cuenta
- Necesita restablecer su contraseña por seguridad

### **Pasos:**

1. **Solicitar recuperación:**
   - En la página de login, hacer clic en **"¿Olvidaste tu contraseña?"**
   - Introducir su **email registrado**
   - Hacer clic en **"Enviar Instrucciones"**

2. **Revisar su email:**
   - Recibirá un email con el asunto: **"🔐 Recuperación de Contraseña - Soares Parente Propiedades"**
   - Revisar también la carpeta de spam/correo no deseado
   - El email contiene un enlace de recuperación

3. **Usar el enlace de recuperación:**
   - Hacer clic en el botón **"🔐 Restablecer Mi Contraseña"** del email
   - O copiar y pegar el enlace en su navegador
   - ⚠️ **IMPORTANTE:** El enlace expira en **1 hora**

4. **Crear nueva contraseña:**
   - Introducir su **nueva contraseña** (mínimo 6 caracteres)
   - **Confirmar** la nueva contraseña
   - Hacer clic en **"Restablecer Contraseña"**

5. **Iniciar sesión:**
   - Será redirigido automáticamente al login
   - Podrá iniciar sesión con su nueva contraseña

### **Características de Seguridad:**
- 🔒 El enlace solo funciona **una vez**
- ⏰ Expira en **1 hora** desde su creación
- 🚫 No revela si el email existe en el sistema
- 🔄 Los enlaces anteriores se invalidan al generar uno nuevo

### **Posibles Problemas:**
- ❌ **"Token inválido o expirado"** → Solicitar nuevo enlace de recuperación
- ❌ **"Este token ya ha sido utilizado"** → Solicitar nuevo enlace
- ❌ **No recibe el email** → Revisar spam, verificar email, contactar administrador

---

## 🛠️ **Cambiar Contraseña**

### **Cuándo usar esta función:**
- Desea cambiar su contraseña actual
- Está logueado y quiere actualizar su contraseña
- Política de seguridad requiere cambio periódico

### **Pasos:**

1. **Acceder a su perfil:**
   - Estando logueado, hacer clic en el botón **👤 (icono de perfil)** en la barra superior
   - Será redirigido a `/home/profile`

2. **Ir a la sección "Cambiar Contraseña":**
   - En la página de perfil, buscar la sección **"Cambiar Contraseña"**

3. **Completar el formulario:**
   - **Contraseña Actual:** Su contraseña actual
   - **Nueva Contraseña:** Mínimo 6 caracteres
   - **Confirmar Nueva Contraseña:** Debe coincidir con la anterior

4. **Guardar cambios:**
   - Hacer clic en **"Cambiar Contraseña"**
   - Recibirá un mensaje de confirmación: **"Contraseña cambiada exitosamente"**

### **Validaciones del Sistema:**
- ✅ Contraseña actual correcta
- ✅ Nueva contraseña diferente a la actual
- ✅ Nueva contraseña mínimo 6 caracteres
- ✅ Confirmación coincidente

### **Posibles Errores:**
- ❌ **"La contraseña actual es incorrecta"** → Verificar contraseña actual
- ❌ **"La nueva contraseña debe ser diferente a la actual"** → Usar contraseña diferente
- ❌ **"Las contraseñas no coinciden"** → Verificar confirmación

---

## 👥 **Gestión de Invitaciones (Solo Administradores)**

### **¿Quién puede usar esta función?**
- Solo usuarios con rol de **Administrador**
- Aparece el botón **"Invitaciones"** en la barra superior

### **Crear Nueva Invitación:**

1. **Acceder a invitaciones:**
   - Hacer clic en **"Invitaciones"** en la barra superior
   - Ir a `/admin/invitaciones`

2. **Crear invitación:**
   - Introducir el **email** del nuevo usuario
   - Hacer clic en **"Enviar Invitación"**
   - Se genera automáticamente un código único

3. **Compartir código:**
   - El sistema mostrará el **código de invitación**
   - Compartir este código con el nuevo usuario
   - El código tiene fecha de expiración

### **Gestionar Invitaciones Existentes:**
- Ver todas las invitaciones enviadas
- Estado: **Pendiente**, **Usada**, **Expirada**
- Email asociado y fecha de creación
- Posibilidad de reenviar invitaciones

### **Información Importante:**
- ⏰ Las invitaciones tienen **fecha de expiración**
- 🔒 Cada código solo puede usarse **una vez**
- 📧 El email debe coincidir exactamente al registrarse
- 🔄 Se pueden generar nuevas invitaciones si las anteriores expiran

---

## 🚪 **Cerrar Sesión**

### **Pasos:**
1. Hacer clic en el botón **"Logout"** en la barra superior
2. Será redirigido a la página de login
3. Su sesión quedará cerrada de forma segura

### **Recomendaciones:**
- 🔒 Siempre cerrar sesión en computadoras compartidas
- 🔄 El sistema cierra automáticamente sesiones inactivas
- 💾 Sus datos se guardan automáticamente

---

## ❓ **Preguntas Frecuentes**

### **¿Cuánto tiempo duran las sesiones?**
Las sesiones permanecen activas mientras use el sistema. Se cierran automáticamente por inactividad prolongada.

### **¿Puedo usar el mismo email para múltiples cuentas?**
No, cada email solo puede tener una cuenta en el sistema.

### **¿Qué pasa si pierdo mi código de invitación?**
Contacte al administrador para que genere una nueva invitación.

### **¿Los enlaces de recuperación son seguros?**
Sí, utilizan tokens únicos, expiran en 1 hora y solo funcionan una vez.

### **¿Puedo cambiar mi email después del registro?**
Actualmente no es posible cambiar el email. Contacte al administrador si necesita usar otro email.

### **¿Qué navegadores son compatibles?**
El sistema funciona en todos los navegadores modernos: Chrome, Firefox, Safari, Edge.

### **¿Hay límites en los intentos de login?**
El sistema tiene protecciones de seguridad, pero no hay límite específico de intentos.

---

## 📞 **Soporte Técnico**

### **Para problemas técnicos:**
- Problemas de acceso al sistema
- Errores en el registro
- No recepción de emails de recuperación

### **Para gestión de usuarios:**
- Solicitar códigos de invitación
- Cambios de permisos
- Problemas con cuentas

### **Contacto:**
**Administrador del Sistema Soares Parente Propiedades**

---

## 🔐 **Consejos de Seguridad**

### **Para mantener su cuenta segura:**

1. **Contraseñas:**
   - Use contraseñas únicas y seguras
   - No comparta su contraseña con nadie
   - Cambie su contraseña periódicamente

2. **Emails de recuperación:**
   - Solo use enlaces de emails oficiales
   - Verifique que los emails vengan de Soares Parente Propiedades
   - No haga clic en enlaces sospechosos

3. **Sesiones:**
   - Cierre sesión en computadoras compartidas
   - No deje su sesión abierta sin supervisión
   - Mantenga su navegador actualizado

4. **Información personal:**
   - No comparta sus credenciales
   - Reporte actividad sospechosa inmediatamente
   - Mantenga actualizada su información de contacto

---

**📅 Última actualización:** Octubre 2025  
**📝 Versión:** 1.0  
**💻 Sistema:** Soares Parente Propiedades v.1.0.1**