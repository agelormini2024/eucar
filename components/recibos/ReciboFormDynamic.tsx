"use client"
import { calculaImporteRecibo } from "@/src/lib/calculaImporteRecibo";
import { verificaIpcActual } from "@/src/lib/verificaIpcActual";
import { Contrato, EstadoReciboSchema } from "@/src/schema";
import useRecibosFormStore from "@/src/stores/storeRecibos";
import { selectContratoPropietario } from "@/src/types";
import { formatCurrency } from "@/src/utils";
import { EstadoRecibo, Prisma, Recibo } from "@prisma/client";
import { useEffect, useState } from "react";

type ReciboFormDynamicProps = {

    contrato: Contrato
    recibo?: Recibo
}

export default function ReciboFormDynamic({ contrato, recibo }: ReciboFormDynamicProps) {
    const [selectContrato, setSelectContrato] = useState<Contrato>()
    const [mesValidado, setMesValidado] = useState(false)
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
            otros: false
        })

        setSelectContrato(contrato)
        console.log('contrato.....', contrato.id)
        const { montoCalculado } = calculaImporteRecibo(contrato)  // Calcular el importe del Recibo
        setFormValues({
            contratoId: contrato.id,
            montoAnterior: contrato.montoAlquilerUltimo ?? 0,
            montoTotal: montoCalculado ?? 0,
            tipoContrato: contrato.tipoContrato.descripcion,
            clientePropietario: contrato.clientePropietario.apellido,
            clienteInquilino: contrato.clienteInquilino.apellido,
            propiedad: contrato?.propiedad
                ? `${contrato.propiedad.calle || ""}  ${contrato.propiedad.numero || ""} - Piso: ${contrato.propiedad.piso || ""} - Dpto: ${contrato.propiedad.departamento || ""}`
                : "",
            tipoIndice: contrato.tipoIndice.nombre,
            mesesRestaActualizar: contrato.mesesRestaActualizar
        })


        // Traer el estado del Recibo
        const result = await fetch(`/api/recibos/estadoRecibo/${formValues.estadoReciboId}`).then(res => res.json())
        const { data: estadoRecibo } = EstadoReciboSchema.safeParse(result) // Validar contrato con zod
        if (estadoRecibo) {
            setFormValues({ estadoRecibo: estadoRecibo.descripcion })
        } else {
            console.log('No se encontró el Estado para el recibo  !!!')
        }
    }

    // Efectos
    useEffect(() => {
        cargarContrato()
    }, [])

    useEffect(() => {
        return () => {
            resetForm();
        };
    }, [resetForm]);

    useEffect(() => {
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
    }, [recibo, setFormValues])

    /* ---------------Validación para permitir la GENERACION  del Recibo------------- */

    useEffect(() => {
        async function checkMesHabilitado() {

            if (formValues.tipoIndice === 'IPC' && formValues.mesesRestaActualizar === 0) {
                const mesHabilitado = await verificaIpcActual(formValues.fechaPendiente);
                setMesValidado(mesHabilitado)
            } else {
                const mesHabilitado = true
                setMesValidado(mesHabilitado)
            }
        }

        checkMesHabilitado();

    }, [formValues.contratoId]);

    useEffect(() => {
        if (selectContrato?.abl !== formValues.abl ||
            selectContrato.aysa !== formValues.aysa ||
            selectContrato.expensas !== formValues.expensas ||
            selectContrato.luz !== formValues.luz ||
            selectContrato.gas !== formValues.gas ||
            selectContrato.otros !== formValues.otros ||
            !mesValidado
        ) {
            setHabilitarBoton(false)
        } else {
            setHabilitarBoton(true)
        }
    }, [formValues.abl,
    formValues.aysa,
    formValues.expensas,
    formValues.luz,
    formValues.gas,
    formValues.otros, mesValidado])
    //------------------------------------------------------------------------------------
    
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
                    >Monto Recibido :</label>
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
            <div className="grid lg:grid-cols-3 gap-4">
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

            </div>
            {/* ------------------------------------------------------------- */}
            <div className="grid lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="luz"
                    >Luz :</label>
                    <input
                        id="expenluzsluzas"
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

            {/* ------------------------------------------------------------- */}

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
                    className="block w-full p-3 bg-slate-200"
                    placeholder="Observaciones del contrato"
                />
            </div>

        </>
    )
}
