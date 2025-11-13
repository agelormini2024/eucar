# 🧮 Cálculos de Índices Económicos

Documentación detallada de las fórmulas y cálculos utilizados para ajustar los alquileres según los índices económicos IPC e ICL.

---

## 📊 ICL - Índice de Contratos de Locación

El ICL es el índice oficial para ajustar contratos de alquiler en Argentina según la Ley 27.551.

### Fuente de Datos

- **Origen**: Banco Central de la República Argentina (BCRA)
- **Frecuencia**: Diaria
- **Formato**: Archivo Excel descargable
- **Ubicación temporal**: Definida en configuración del sistema

### Fórmula de Cálculo

```
Alquiler Nuevo = Alquiler Anterior × (ICL Actual / ICL Anterior)
```

### Ejemplo Práctico: Ajuste Semestral

**Datos del contrato:**
- Fecha de firma: 1 de enero de 2024
- Primer ajuste: 1 de julio de 2024 (6 meses)
- Alquiler inicial: $100,000

**Valores de ICL:**
- ICL al 01/01/2024: 1.123456
- ICL al 01/07/2024: 1.234567

**Cálculo:**
```
Alquiler ajustado = 100,000 × (1.234567 / 1.123456)
                  = 100,000 × 1.0989
                  = $109,890
```

**Resultado:**
- ✅ Nuevo alquiler: **$109,890**
- 📈 Porcentaje de aumento: **9.89%**

### Periodicidad de Ajustes

El sistema permite configurar ajustes:
- Trimestrales (cada 3 meses)
- Cuatrimestrales (cada 4 meses)
- Semestrales (cada 6 meses)
- Anuales (cada 12 meses)

---

## 📈 IPC - Índice de Precios al Consumidor

El IPC mide la variación de precios y puede usarse para contratos anteriores a la Ley 27.551.

### Fuente de Datos

- **Origen**: INDEC (Instituto Nacional de Estadística y Censos)
- **Frecuencia**: Mensual
- **Carga**: Manual en el sistema

### Fórmula de Cálculo

El IPC se calcula multiplicando los coeficientes mensuales del período de ajuste.

**Paso 1: Convertir porcentajes a coeficientes**
```
Coeficiente = 1 + (Porcentaje / 100)
```

**Paso 2: Multiplicar coeficientes del período**
```
Factor Acumulado = Coef₁ × Coef₂ × Coef₃ × ... × Coefₙ
```

**Paso 3: Aplicar al alquiler**
```
Alquiler Nuevo = Alquiler Anterior × Factor Acumulado
```

### Ejemplo Práctico: Ajuste Trimestral

**Datos del contrato:**
- Alquiler anterior: $100,000
- Período de ajuste: 3 meses

**IPC de los últimos 3 meses:**
| Mes | IPC Mensual |
|-----|-------------|
| Mes 1 | 2.4% |
| Mes 2 | 3.73% |
| Mes 3 | 2.78% |

**Paso 1: Convertir a coeficientes**
```
Mes 1: 1 + 2.4/100  = 1.024
Mes 2: 1 + 3.73/100 = 1.0373
Mes 3: 1 + 2.78/100 = 1.0278
```

**Paso 2: Calcular factor acumulado**
```
Factor = 1.024 × 1.0373 × 1.0278
       = 1.0910
```

**Paso 3: Aplicar al alquiler**
```
Alquiler nuevo = 100,000 × 1.0910
               = $109,100
```

**Resultado:**
- ✅ Nuevo alquiler: **$109,100**
- 📈 Porcentaje de aumento: **9.10%**

### Ejemplo: Ajuste Anual

**IPC de 12 meses:**
```
Factor = 1.024 × 1.0373 × 1.0278 × 1.035 × ... (12 meses)
```

---

## 🔄 Lógica del Sistema

### Determinación del Monto Final

El sistema evalúa **3 casos** al generar un recibo:

#### **Caso 1A: Corresponde actualización + Hay índices**

```
✅ Condiciones:
- mesesRestaActualizar === 0
- Índices disponibles para el período

📊 Acciones:
- Calcula monto con fórmula IPC/ICL
- Estado: GENERADO (2)
- Actualiza contrato:
  - montoAlquilerUltimo = montoCalculado
  - mesesRestaActualizar = periodicidad - 1
  - cantidadMesesDuracion -= 1
```

#### **Caso 1B: NO corresponde actualización**

```
✅ Condiciones:
- mesesRestaActualizar > 0

📊 Acciones:
- Usa montoAnterior (sin calcular)
- Estado: GENERADO (2)
- NO actualiza contrato (solo decrementa meses de duración)
```

#### **Caso 1C: Corresponde actualización + NO hay índices**

```
⚠️ Condiciones:
- mesesRestaActualizar === 0
- NO hay índices disponibles

📊 Acciones:
- Usa montoAnterior temporalmente
- Estado: PENDIENTE (1)
- NO actualiza contrato (espera regeneración)
- fechaGenerado = null
```

### Regeneración de Recibos PENDIENTE

Cuando se cargan los índices faltantes:

1. Usuario abre recibo PENDIENTE
2. Sistema detecta `mesesRestaActualizar === 0`
3. Verifica disponibilidad de índices
4. Si están disponibles → aplica **Caso 1A**
5. Actualiza estado a GENERADO
6. Actualiza contrato

---

## 📝 Validaciones del Sistema

### Verificación de IPC

```typescript
// Valida que existan todos los IPC necesarios
const ipcActual = await verificaIpcActual(
  tipoIndice,
  fechaPendiente,
  mesesRestaActualizar,
  periodicidad
)

if (!ipcActual) {
  // → Caso 1C: Estado PENDIENTE
}
```

### Cálculo de Importe

```typescript
// Calcula el nuevo monto con índices
const montoCalculado = await calculaImporteRecibo(
  contratoId,
  montoAnterior,
  tipoIndiceId,
  fechaPendiente
)

if (montoCalculado > 0) {
  // → Caso 1A: Usar monto calculado
} else {
  // → Caso 1C: Índices no disponibles
}
```

---

## 🔍 Consideraciones Importantes

### Redondeo

- Todos los montos se redondean a 2 decimales
- Se usa `Math.round()` para evitar problemas de precisión

### Tolerancia de Comparación

Al validar items:
```typescript
// Tolerancia de 0.01 para comparar montos
if (Math.abs(itemAlquiler.monto - montoTotal) > 0.01) {
  // Error: montos no coinciden
}
```

### Fechas de Referencia

- **IPC**: Se usa el mes de la `fechaPendiente`
- **ICL**: Se usa el día exacto de la `fechaPendiente`

### Actualización del Contrato

Solo se actualiza el contrato cuando:
- Estado final es GENERADO (estadoReciboId === 2)
- NO cuando queda PENDIENTE

---

## 📚 Referencias

- [Ley 27.551 - Alquileres](http://servicios.infoleg.gob.ar/infolegInternet/anexos/340000-344999/340567/norma.htm)
- [BCRA - ICL](https://www.bcra.gob.ar/PublicacionesEstadisticas/Principales_variables.asp)
- [INDEC - IPC](https://www.indec.gob.ar/indec/web/Nivel4-Tema-3-5-31)

---

[⬅️ Volver al README principal](../README.md)
