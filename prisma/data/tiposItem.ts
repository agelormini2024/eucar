export const tiposItem = [
    {
        codigo: 'ALQUILER',
        nombre: 'Alquiler',
        descripcion: 'Alquiler base del inmueble',
        esModificable: false,      // No se puede editar el monto manualmente
        esEliminable: false,        // No se puede eliminar
        permiteNegativo: false,
        esObligatorio: true,        // Debe existir en todo recibo
        orden: 1,
        color: '#DC2626',           // Rojo
        activo: true
    },
    {
        codigo: 'DESCUENTO',
        nombre: 'Descuento',
        descripcion: 'Descuento o bonificación aplicada',
        esModificable: true,
        esEliminable: true,
        permiteNegativo: true,      // Puede ser negativo
        esObligatorio: false,
        orden: 10,
        color: '#059669',           // Verde
        activo: true
    },
    {
        codigo: 'EXTRA',
        nombre: 'Cargo Extra',
        descripcion: 'Cargos adicionales o extras',
        esModificable: true,
        esEliminable: true,
        permiteNegativo: false,
        esObligatorio: false,
        orden: 5,
        color: '#F59E0B',           // Amarillo
        activo: true
    },
    {
        codigo: 'SERVICIO',
        nombre: 'Servicio',
        descripcion: 'Servicios incluidos (ABL, Expensas, etc.)',
        esModificable: true,
        esEliminable: true,
        permiteNegativo: false,
        esObligatorio: false,
        orden: 3,
        color: '#3B82F6',           // Azul
        activo: true
    },
    {
        codigo: 'REINTEGRO',
        nombre: 'Reintegro',
        descripcion: 'Reintegro de gastos o devoluciones',
        esModificable: true,
        esEliminable: true,
        permiteNegativo: true,
        esObligatorio: false,
        orden: 8,
        color: '#8B5CF6',           // Violeta
        activo: true
    }
];
