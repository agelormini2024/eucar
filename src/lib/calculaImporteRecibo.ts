import { Contrato } from "../schema";

export function calculaImporteRecibo(contrato: Contrato) {

    const importeCalculado = (monto: number) => {
        const tipoIndice = contrato.tipoIndiceId

        let result = 0
        if (tipoIndice === 1) {
            result = monto * contrato.tipoContrato.ipc
        } else if (tipoIndice === 2) {
            result = monto * contrato.tipoContrato.icl
        } else {
            result = monto * contrato.tipoContrato.icp
        }

        return result
    }

    // Si el contrato tiene meses restantes para actualizar, se calcula el monto del alquiler inicial o el último
    // Si no tiene meses restantes, se calcula el importe según el tipo de índice
    // Si el monto del alquiler último es 0, se usa el monto del alquiler inicial
    const { montoAlquilerInicial, montoAlquilerUltimo } = contrato
    const montoAlquiler = montoAlquilerUltimo === 0 ? montoAlquilerInicial : montoAlquilerUltimo
    let montoCalculado = 0
    if (contrato.mesesRestaActualizar !== 0) { // 
        montoCalculado = montoAlquiler // TODO: Crear una variable para el monto base

        // montoCalculado = contrato.montoAlquilerUltimo === 0 ? contrato.montoAlquilerInicial : contrato.montoAlquilerUltimo
    } else {
        montoCalculado = importeCalculado(montoAlquiler)
    }

  
    return {
        montoCalculado
    }
} 