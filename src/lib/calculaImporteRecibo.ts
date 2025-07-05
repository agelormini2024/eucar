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

    let montoCalculado = 0
    console.log('Meses a actualizar:', contrato)
    if (contrato.mesesRestaActualizar !== 0) { // 
        montoCalculado = contrato.montoAlquilerUltimo === 0 ? contrato.montoAlquilerInicial : contrato.montoAlquilerUltimo
    } else {
        montoCalculado = importeCalculado(contrato.montoAlquilerUltimo)
    }

console.log('Monto calculado:', montoCalculado, 'Tipo de índice:', contrato.tipoIndiceId, 'Meses a actualizar:', contrato.mesesRestaActualizar)
    return {
        montoCalculado
    }
} 