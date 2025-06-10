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
    if (contrato.mesesRestaActualizar = 0) {
        montoCalculado = contrato.montoAlquilerUltimo
    } else {
        montoCalculado = importeCalculado(contrato.montoAlquilerUltimo)
    }


    return {
        montoCalculado
    }
} 