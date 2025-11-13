/**
 * Archivo de re-exportación central para tipos de dominio
 * @fileoverview Re-exporta todos los tipos de los módulos específicos de dominio
 * @author Alejandro
 * @since 1.0.0
 * 
 * @note Para mantener compatibilidad hacia atrás, este archivo re-exporta
 * todos los tipos desde sus archivos específicos de dominio.
 * Se recomienda importar directamente desde los archivos específicos en código nuevo.
 */

// Re-exports de tipos de cliente
export type { ClientesConProvinciaPais } from './cliente';

// Re-exports de tipos de contrato
export { 
    consultaContratos, 
    selectContratoPropietario, 
    selectContratoInquilino 
} from './contrato';

// Re-exports de tipos de propiedad
export type { PropiedadesConRelaciones } from './propiedad';

// Re-exports de tipos de recibo
export type { 
    ReciboFormValues,
    ReciboFormProps,
    ReciboFormSetValues,
    RecibosConRelaciones,
    ReciboConRelaciones 
} from './recibo';

// Re-exports de tipos de item y tipoItem (desde store)
export type { 
    ItemRecibo,
    TipoItem 
} from '../stores/storeRecibos';

// Re-exports de tipos de índices
export type { 
    Ipc,
    IpcMensual,
    IclDiario 
} from './indices';
