"use client"
import { useEffect, useState } from "react";
import { calculaImporteRecibo } from "@/src/lib/calculaImporteRecibo";
import { verificaIpcActual } from "@/src/lib/verificaIpcActual";
import { Contrato, EstadoReciboSchema } from "@/src/schema";
import useRecibosFormStore from "@/src/stores/storeRecibos";
import { formatCurrency } from "@/src/utils";
import { Recibo } from "@prisma/client";

type ReciboFormDynamicProps = {
    contrato: Contrato
    recibo?: Recibo
}

export default function ReciboFormDynamic({ contrato, recibo }: ReciboFormDynamicProps) {
    const [selectContrato, setSelectContrato] = useState<Contrato>()
    const formValues = useRecibosFormStore((state) => state.formValues)
    const setFormValues = useRecibosFormStore((state) => state.setFormValues)
    const resetForm = useRecibosFormStore((state) => state.resetForm)
    const setHabilitarBoton = useRecibosFormStore((state) => state.setHabilitarBoton)

    async function cargarContrato() {
        setFormValues({
            expensas: false,
            abl: false,
            luz: false,
            gas: false,
            aysa: false,
            otros: false,
            contratoId: contrato.id,
            montoAnterior: contrato.montoAlquilerUltimo === 0 ? contrato.montoAlquilerInicial : contrato.montoAlquilerUltimo,
            tipoContratoId: contrato.tipoContratoId,
            tipoContrato: contrato.tipoContrato.descripcion,
            clientePropietario: `${contrato.clientePropietario.apellido} ${contrato.clientePropietario.nombre}`,
            clienteInquilino: `${contrato.clienteInquilino.apellido} ${contrato.clienteInquilino.nombre}`,
            propiedad: contrato?.propiedad
                ? `${contrato.propiedad.calle || ""}  ${contrato.propiedad.numero || ""} - Piso: ${contrato.propiedad.piso || ""} - Dpto: ${contrato.propiedad.departamento || ""}`
                : "",
            tipoIndice: contrato.tipoIndice.nombre,
            mesesRestaActualizar: contrato.mesesRestaActualizar,

        });
        setSelectContrato(contrato);
    }

    // Efectos
    useEffect(() => {
        cargarContrato();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contrato]);

    useEffect(() => {
        async function checkMesHabilitado() {

            let mesHabilitado = true
            if (formValues.mesesRestaActualizar === 0 && formValues.tipoIndice === 'IPC') { // TODO: verificar si es necesario tipoIndice ICL
                mesHabilitado = await verificaIpcActual(formValues.fechaPendiente)
            }
            if (mesHabilitado) {
                const { montoCalculado } = calculaImporteRecibo(contrato)  // Calcular el importe del Recibo
                setFormValues({
                    montoTotal: montoCalculado,
                })
            } else {
                setFormValues({
                    montoTotal: 0,      // Seteamos el "estado" como PENDIENTE porque todavía no está el IPC correspondiente al mes a cobrar 
                    estadoReciboId: 1   // PENDIENTE
                })
            }
        }

        checkMesHabilitado();
    }, [formValues.tipoIndice, formValues.mesesRestaActualizar, formValues.fechaPendiente, contrato, setFormValues]);

    useEffect(() => {
        return () => {
            resetForm();
        };
    }, [resetForm]);

    //--------------------- Traer el estado del Recibo -------------------

    useEffect(() => {
        async function cargarEstadoRecibo() {
            const formValuesEstadoRecibo = formValues.estadoReciboId // Por defecto, si no hay estado, se usa el ID 1 (PENDIENTE)
            const result = await fetch(`/api/recibos/estadoRecibo/${formValuesEstadoRecibo}`).then(res => res.json())
            const { data: estadoRecibo } = EstadoReciboSchema.safeParse(result) // Validar contrato con zod
            if (estadoRecibo) {
                setFormValues({ estadoRecibo: estadoRecibo.descripcion })
            } else {
                console.log('No se encontró el Estado para el recibo  !!!')
            }
        }

        if (recibo) {
            setFormValues({
                contratoId: recibo.contratoId || contrato.id,
                estadoReciboId: recibo.estadoReciboId || 1,
                fechaPendiente: recibo.fechaPendiente ? recibo.fechaPendiente.toISOString().split('T')[0] : '',
                fechaGenerado: recibo.fechaGenerado ? recibo.fechaGenerado.toISOString().split('T')[0] : '',
                fechaImpreso: recibo.fechaImpreso ? recibo.fechaImpreso.toISOString().split('T')[0] : '',
                fechaAnulado: recibo.fechaAnulado ? recibo.fechaAnulado.toISOString().split('T')[0] : '',
                montoAnterior: recibo.montoAnterior || 0,
                montoTotal: recibo.montoTotal || 0,
                abl: recibo.abl || false,
                aysa: recibo.aysa || false,
                luz: recibo.luz || false,
                gas: recibo.gas || false,
                otros: recibo.otros || false,
                expensas: recibo.expensas || false,
                observaciones: recibo.observaciones || ''
            })
        }
        cargarEstadoRecibo()

    }, [recibo, contrato.id, setFormValues, formValues.estadoReciboId])

    /* ---------------Validación para permitir la GENERACION  del Recibo------------- */

    useEffect(() => {
        if (!selectContrato) return;
        if (
            selectContrato.abl !== formValues.abl ||
            selectContrato.aysa !== formValues.aysa ||
            selectContrato.expensas !== formValues.expensas ||
            selectContrato.luz !== formValues.luz ||
            selectContrato.gas !== formValues.gas ||
            selectContrato.otros !== formValues.otros
        ) {
            setHabilitarBoton(false);
        } else {
            setHabilitarBoton(true);
        }
    }, [
        selectContrato,
        formValues.abl,
        formValues.aysa,
        formValues.expensas,
        formValues.luz,
        formValues.gas,
        formValues.otros,
        setHabilitarBoton
    ]);
    //------Fin de Efectos---------

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, type, value } = e.target as HTMLInputElement;

        let parsedValue: string | number | boolean = ""

        if (type === "checkbox") {
            parsedValue = (e.target as HTMLInputElement).checked
        } else if (
            type === "number" ||
            name === "contratoId" ||
            name === "estadoReciboId"
        ) {
            parsedValue = Number(value)
        } else {
            parsedValue = value
        }
        setFormValues({ [name]: parsedValue });

    }

    return (
        <>
            <div className="space-y-2">
                <label className="text-slate-800 font-bold"
                    htmlFor="contratoId">
                    Contrato :
                </label>
                <input
                    className="block w-full p-3 bg-slate-200"
                    id="contratoId"
                    name="contratoId"
                    value={contrato.descripcion}
                    disabled
                />
            </div>
            {/* ------------------------------------------------------------- */}
            <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                    <label className="text-slate-800 font-bold"
                        htmlFor="propiedad">
                        Propiedad :
                    </label>
                    <input
                        id="propiedad"
                        type="text"
                        name="propiedad"
                        value={formValues.propiedad ? formValues.propiedad : ""}
                        className="block w-full p-3 bg-slate-200 text-slate-600 font-bold"
                        disabled
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-slate-800 font-bold"
                        htmlFor="tipoContrato">
                        Tipo de Contrato :
                    </label>
                    <input
                        id="tipoContrato"
                        type="text"
                        name="tipoContrato"
                        onChange={handleInputChange}
                        value={formValues.tipoContrato}
                        className="block w-full p-3 bg-slate-200 text-slate-600 font-bold uppercase"
                        disabled
                    />
                </div>
            </div>
            {/* ------------------------------------------------------------- */}
            <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                    <label className="text-slate-800 font-bold"
                        htmlFor="clientePropietario">
                        Propietario :
                    </label>
                    <input
                        id="clientePropietario"
                        type="text"
                        name="clientePropietario"
                        onChange={handleInputChange}
                        value={formValues.clientePropietario}
                        className="block w-full p-3 bg-slate-200 text-slate-600 font-bold"
                        disabled
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-slate-800 font-bold"
                        htmlFor="clienteInquilino">
                        Inquilino :
                    </label>
                    <input
                        id="clienteInquilino"
                        type="text"
                        name="clienteInquilino"
                        onChange={handleInputChange}
                        value={formValues.clienteInquilino}
                        className="block w-full p-3 bg-slate-200 text-slate-600 font-bold"
                        disabled
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">

                <div className="space-y-2 text-center text-xl">
                    <label className="text-slate-800 font-bold"
                        htmlFor="estadoReciboId">
                        Estado del Recibo :
                    </label>
                    <input
                        id="estadoReciboId"
                        type="text"
                        name="estadoReciboId"
                        onChange={handleInputChange}
                        value={formValues.estadoRecibo ? formValues.estadoRecibo : ""}
                        className="block w-full p-3 bg-slate-200 text-slate-600 font-bold text-center uppercase"
                        disabled
                    />
                </div>
                <div className="space-y-2 text-center text-xl">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="fechaPendiente"
                    >Fecha :</label>
                    <input
                        id="fechaPendiente"
                        type="date"
                        name="fechaPendiente"
                        onChange={(e) => setFormValues({ fechaPendiente: e.target.value })} // Capturar como string
                        value={formValues.fechaPendiente} // Mostrar como string
                        className="block w-full p-3 bg-slate-200 text-center"
                        disabled
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 w-full max-w-md text-center">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="montoAnterior"
                    >Ultimo monto Recibido :</label>
                    <input
                        id="montoAnterior"
                        type="text"
                        name="montoAnterior"
                        onChange={handleInputChange}
                        value={formatCurrency(formValues.montoAnterior)}
                        className="block w-full p-3 bg-slate-200 text-3xl font-black text-center text-slate-500"
                        disabled
                    />
                </div>

                <div className="space-y-2 w-full max-w-md">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="montoTotal"
                    >Monto a Recibir :</label>
                    <input
                        id="montoTotal"
                        type="text"
                        name="montoTotal"
                        onChange={handleInputChange}
                        value={formatCurrency(formValues.montoTotal)}
                        className="block w-full p-3 bg-slate-200 text-3xl font-black"
                    />
                </div>

            </div>

            {/* ------------------------------------------------------------- */}
            <div className="grid lg:grid-cols-2 gap-4 mt-4 mb-4">
                <div className="grid lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label
                            className="text-slate-800 font-bold"
                            htmlFor="expensas"
                        >Expensas :</label>
                        <input
                            id="expensas"
                            type="checkbox"
                            name="expensas"
                            className="align-middle ml-2"
                            onChange={handleInputChange}
                            checked={formValues.expensas}
                        />
                    </div>
                    <div className="space-y-2">
                        <label
                            className="text-slate-800 font-bold"
                            htmlFor="abl"
                        >ABL :</label>
                        <input
                            id="abl"
                            type="checkbox"
                            name="abl"
                            className="align-middle ml-2"
                            onChange={handleInputChange}
                            checked={formValues.abl}
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            className="text-slate-800 font-bold"
                            htmlFor="aysa"
                        >AYSA :</label>
                        <input
                            id="aysa"
                            type="checkbox"
                            name="aysa"
                            className="align-middle ml-2"
                            onChange={handleInputChange}
                            checked={formValues.aysa}
                        />
                    </div>
                    <div className="space-y-2">
                        <label
                            className="text-slate-800 font-bold"
                            htmlFor="luz"
                        >Luz :</label>
                        <input
                            id="luz"
                            type="checkbox"
                            name="luz"
                            className="align-middle ml-2"
                            onChange={handleInputChange}
                            checked={formValues.luz}
                        />
                    </div>
                    <div className="space-y-2">
                        <label
                            className="text-slate-800 font-bold"
                            htmlFor="gas"
                        >Gas :</label>
                        <input
                            id="gas"
                            type="checkbox"
                            name="gas"
                            className="align-middle ml-2"
                            onChange={handleInputChange}
                            checked={formValues.gas}
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            className="text-slate-800 font-bold"
                            htmlFor="otros"
                        >Otros :</label>
                        <input
                            id="otros"
                            type="checkbox"
                            name="otros"
                            className="align-middle ml-2"
                            onChange={handleInputChange}
                            checked={formValues.otros}
                        />
                    </div>

                </div>

            </div>
            {/* ------------------------------------------------------------- */}
            <div className="grid lg:grid-cols-2 gap-4">

                <div>
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="observaciones"
                    >Observaciones :</label>
                    <textarea
                        id="observaciones"
                        name="observaciones"
                        onChange={handleInputChange}
                        value={formValues.observaciones}
                        className="block w-full p-4 bg-slate-200 mt-2"
                        placeholder="Observaciones del Recibo"
                    />
                </div>
            </div>

        </>
    )
}
