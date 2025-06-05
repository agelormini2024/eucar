"use client";
import { estadoRecibo } from "@/prisma/data/estadoRecibos";
import { ContratoSchemaApi } from "@/src/schema";
import useRecibosFormStore from "@/src/stores/storeRecibos";
import { selectContratoPropietario } from "@/src/types";
import { EstadoRecibo, Prisma, Recibo } from "@prisma/client";
import { useEffect, useState } from "react";

type ReciboFormDynamicProps = {

    contratos: Prisma.ContratoGetPayload<typeof selectContratoPropietario>[]
    recibo?: Recibo
    estadosRecibo: EstadoRecibo[]
}

export default function ReciboFormDynamic({ contratos, recibo, estadosRecibo }: ReciboFormDynamicProps) {
    const [selectContrato, setSelectContrato] = useState<any>(null)
    const formValues = useRecibosFormStore((state) => state.formValues)
    const setFormValues = useRecibosFormStore((state) => state.setFormValues)

    useEffect(() => {
        if (recibo) {
            setFormValues({
                contratoId: recibo.contratoId || 0,
                estadoReciboId: recibo.estadoReciboId || 1,
                fechaPendiente: recibo.fechaPendiente ? recibo.fechaPendiente.toISOString().split('T')[0] : '', 
                fechaGenerado: recibo.fechaGenerado ? recibo.fechaGenerado.toISOString().split('T')[0] : '', 
                fechaImpreso: recibo.fechaImpreso ? recibo.fechaImpreso.toISOString().split('T')[0] : '', 
                fechaAnulado: recibo.fechaAnulado ? recibo.fechaAnulado.toISOString().split('T')[0] : '' ,
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

    //------------------------------------------------------------------------------------
    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, type, value } = e.target as HTMLInputElement;
        let parsedValue: string | number | boolean = ""

        // Traer los datos del contrato Seleccionado
        if (name === "contratoId") {
            // Datos del Contrato
            const contrato = await fetch(`/api/recibos/contrato/${Number(value)}`).then(res => res.json())

            // Validar contrato con zod
            const { data: contratoSelecionado } = ContratoSchemaApi.safeParse(contrato)

            if (contratoSelecionado) {
                setSelectContrato(contratoSelecionado)
            } else {
                console.log('Manejar el error aqui !!!')
            }
        }

        if (type === "checkbox") {
            parsedValue = (e.target as HTMLInputElement).checked
        } else if (
            type === "number" ||
            name === "contratoId" ||
            name === "estadoReciboId" ||
            name === "montoTotal"
        ) {
            parsedValue = Number(value)

        } else {
            parsedValue = value
        }

        setFormValues({ [name]: parsedValue });
    }

    /* ------------------------------------------------------------- */
    /* TODO: Incluir Campos de :
            Monto recibido: montoTotal

    */

    return (
        <>
            <div className="space-y-2">
                <label className="text-slate-800 font-bold"
                    htmlFor="contratoId">
                    Contrato :
                </label>
                <select
                    className="block w-full p-3 bg-slate-200"
                    id="contratoId"
                    name="contratoId"
                    onChange={handleInputChange}
                    value={formValues.contratoId || ""}
                >
                    <option
                        value=""
                        disabled={selectContrato} >-- Seleccione un Contrato --</option>
                    {contratos.map((item) => (
                        <option
                            key={item.id}
                            value={item.id}
                        >
                            {item.descripcion} ----- {item.clientePropietario.apellido} ---- {item.clientePropietario.cuit}
                        </option>
                    ))}
                </select>
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
                        onChange={handleInputChange}
                        value={
                            selectContrato?.propiedad
                                ? `${selectContrato.propiedad.calle || ""}  ${selectContrato.propiedad.numero || ""} - Piso: ${selectContrato.propiedad.piso || ""} - Dpto: ${selectContrato.propiedad.departamento || ""}`
                                : ""}
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
                        value={selectContrato?.tipoContrato?.descripcion || ""}
                        className="block w-full p-3 bg-slate-200 text-slate-600 font-bold"
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
                        value={selectContrato?.clientePropietario?.apellido || ""}
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
                        value={selectContrato?.clienteInquilino?.apellido || ""}
                        className="block w-full p-3 bg-slate-200 text-slate-600 font-bold"
                        disabled
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                    <label className="text-slate-800 font-bold"
                        htmlFor="estadoReciboId">
                        Estado del Recibo :
                    </label>
                    <input
                        id="estadoReciboId"
                        type="text"
                        name="estadoReciboId"
                        onChange={handleInputChange}
                        value={formValues.estadoReciboId || ""}
                        className="block w-full p-3 bg-slate-200 text-slate-600 font-bold"
                        disabled
                    />
                </div>
                <div className="space-y-2">
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
                        className="block w-full p-3 bg-slate-200"
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
