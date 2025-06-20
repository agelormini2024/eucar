"use client"
import { getMesesRestanActualizar } from "@/src/lib/buscarMesesRestanActualizar";
import { ClientePropietarioSchemaApi, ClienteSchema } from "@/src/schema";
import { useContratoFormStore } from "@/src/stores/storeContratos";
import { Cliente, Contrato, Propiedad, TipoContrato, TipoIndice } from '@prisma/client'
import { useEffect, useState } from "react";

const DIA_MES_VENCIMIENTO = 10

type ContratoFormDynamicProps = {

    clientes: Cliente[]
    propiedades: Propiedad[]
    tiposContrato: TipoContrato[]
    tiposIndice: TipoIndice[]
    contrato?: Contrato
}

export default function ContratoFormDynamic({ clientes, propiedades, tiposContrato, tiposIndice, contrato }: ContratoFormDynamicProps) {
    const [propietario, setPropietario] = useState({ apellido: '', nombre: '', cuit: '' })
    const { formValues, setFormValues, resetForm } = useContratoFormStore()
    useEffect(() => {
        return () => {
            resetForm();
        };
    }, [resetForm]);

    useEffect(() => {
        if (contrato) {
            setFormValues({
                descripcion: contrato.descripcion || '',
                fechaInicio: contrato.fechaInicio ? contrato.fechaInicio.toISOString().split('T')[0] : '', // Convertir a string
                fechaVencimiento: contrato.fechaVencimiento ? contrato.fechaVencimiento.toISOString().split('T')[0] : '', // Convertir a string
                cantidadMesesDuracion: contrato.cantidadMesesDuracion || 0,
                mesesRestaActualizar: contrato.mesesRestaActualizar || 0,
                diaMesVencimiento: contrato.diaMesVencimiento || DIA_MES_VENCIMIENTO,
                clienteIdPropietario: contrato.clienteIdPropietario || 0,
                clienteIdInquilino: contrato.clienteIdInquilino || 0,
                propiedadId: contrato.propiedadId || 0,
                tipoContratoId: contrato.tipoContratoId || 0,
                tipoIndiceId: contrato.tipoIndiceId || 0,
                montoAlquilerInicial: contrato.montoAlquilerInicial || 0,
                observaciones: contrato.observaciones || '',
                expensas: contrato.expensas || false,
                abl: contrato.abl || false,
                aysa: contrato.aysa || false,
                luz: contrato.luz || false,
                gas: contrato.gas || false,
                otros: contrato.otros || false
            })
        }

    }, [contrato, setFormValues])

    //-------------------------------------------------------------------------------------------//
    //              calcular la cantidad de meses de duración del contrato
    //-------------------------------------------------------------------------------------------//
    const calcularCantidadMesesDuracion = () => {
        const fechaInicio = new Date(formValues.fechaInicio);
        const fechaVencimiento = new Date(formValues.fechaVencimiento);

        if (isNaN(fechaInicio.getTime()) || isNaN(fechaVencimiento.getTime())) {
            // Si alguna de las fechas no es válida, no hacemos nada
            return;
        }

        // Calcular la diferencia en años y meses
        const diferenciaAnios = fechaVencimiento.getFullYear() - fechaInicio.getFullYear();
        const diferenciaMeses = fechaVencimiento.getMonth() - fechaInicio.getMonth();
        // Total de meses
        const cantidadMeses = diferenciaAnios * 12 + diferenciaMeses;


        setFormValues({
            cantidadMesesDuracion: cantidadMeses,
            diaMesVencimiento: DIA_MES_VENCIMIENTO
        });
    }

    useEffect(() => {
        if (formValues.fechaInicio && formValues.fechaVencimiento) {
            calcularCantidadMesesDuracion();
        }
    }, [formValues.fechaInicio, formValues.fechaVencimiento]);

    //-------------------------------------------------------------------------------------------//
    //              Traer los meses de actualización del contrato
    //-------------------------------------------------------------------------------------------//
    async function fetchMesesRestanActualizar() {
        if (!formValues.tipoContratoId) return;
        const tipoContrato = await getMesesRestanActualizar(formValues.tipoContratoId);
        setFormValues({
            mesesRestaActualizar: tipoContrato?.cantidadMesesActualizacion ?? 0
        });
    }

    useEffect(() => {
        fetchMesesRestanActualizar()
    }, [formValues.tipoContratoId])

    //-----------------------------------------------------------------------------------------//
    // Se busca el propietario de la propiedad del contrato 
    //-----------------------------------------------------------------------------------------//
    async function buscarPropietario() {
        const result = await fetch(`/api/contratos/propiedad/${formValues.propiedadId}`).then(res => res.json())
        const { data: clientePropietario } = ClientePropietarioSchemaApi.safeParse(result) // Validar contrato con zod

        if (clientePropietario) {
            setFormValues({
                clienteIdPropietario: clientePropietario.id
            })
            setPropietario({
                apellido: clientePropietario.apellido,
                nombre: clientePropietario.nombre,
                cuit: clientePropietario.cuit
            })
        } else {
            console.log('No se encontró el Propietario  !!!')
        }
    }

    useEffect(() => {
        if (formValues.propiedadId) {
            buscarPropietario();
        }
    }, [formValues.propiedadId]);
    //-------------------------------------------------------------------------------------------//

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, type, value } = e.target as HTMLInputElement;
        let parsedValue: string | number | boolean = "";

        if (type === "checkbox") {
            parsedValue = (e.target as HTMLInputElement).checked;
        } else if (
            type === "number" ||
            name === "tipoContratoId" ||
            name === "tipoIndiceId" ||
            name === "propiedadId" ||
            name === "clienteIdPropietario" ||
            name === "clienteIdInquilino"
        ) {
            parsedValue = Number(value);
        } else {
            parsedValue = value;
        }

        setFormValues({ [name]: parsedValue });
    }
    return (
        <>
            <div className="space-y-2">
                <label
                    className="text-slate-800 font-bold"
                    htmlFor="descripcion"
                >Descripción :</label>
                <input
                    id="descripcion"
                    type="text"
                    name="descripcion"
                    onChange={handleInputChange}
                    value={formValues.descripcion}
                    className="block w-full p-3 bg-slate-200"
                    placeholder="Descripción del contrato"
                />
            </div>

            <div className="space-y-2">
                <label className="text-slate-800 font-bold"
                    htmlFor="propiedadId">
                    Propiedad :
                </label>
                <select
                    className="block w-full p-3 bg-slate-200"
                    id="propiedadId"
                    name="propiedadId"
                    onChange={handleInputChange}
                    value={formValues.propiedadId}
                >
                    <option value="">-- Seleccione --</option>
                    {propiedades.map((propiedad) => (
                        <option
                            key={propiedad.id}
                            value={propiedad.id}
                        >
                            {propiedad.descripcion}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="fechaInicio"
                    >Fecha Inicial :</label>
                    <input
                        id="fechaInicio"
                        type="date"
                        name="fechaInicio"
                        onChange={(e) => setFormValues({ fechaInicio: e.target.value })} // Capturar como string
                        value={formValues.fechaInicio} // Mostrar como string
                        className="block w-full p-3 bg-slate-200"
                        placeholder="Fecha de Inicio"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="fechaVencimiento"
                    >Fecha de Vto :</label>
                    <input
                        id="fechaVencimiento"
                        type="date"
                        name="fechaVencimiento"
                        onChange={(e) => setFormValues({ fechaVencimiento: e.target.value })} // Capturar como string
                        value={formValues.fechaVencimiento} // Mostrar como string
                        className="block w-full p-3 bg-slate-200"
                        placeholder="Fecha de Vencimiento"
                    />
                </div>
                <div className="space-y-2">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="montoAlquilerInicial"
                    >Monto Inicial :</label>
                    <input
                        id="montoAlquilerInicial"
                        type="number"
                        name="montoAlquilerInicial"
                        onChange={handleInputChange}
                        value={formValues.montoAlquilerInicial}
                        className="block w-full p-3 bg-slate-200"
                        placeholder="Ing. Monto Inicial"
                    />
                </div>

            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* ------------------------------------------------------------------------ */}
                {/* <div className="space-y-2">
                    <label className="text-slate-800 font-bold"
                        htmlFor="clienteIdPropietario">
                        Propiedatrio :
                    </label>
                    <select
                        className="block w-full p-3 bg-slate-200"
                        id="clienteIdPropietario"
                        name="clienteIdPropietario"
                        onChange={handleInputChange}
                        value={formValues.clienteIdPropietario}
                    >
                        <option value="">-- Seleccione --</option>
                        {clientes.map((cliente) => (
                            <option
                                key={cliente.id}
                                value={cliente.id}
                            >
                                {cliente.cuit} ----- {cliente.nombre} {cliente.apellido}
                            </option>
                        ))}
                    </select>
                </div> */}


                <div className="space-y-2">
                    <label className="text-slate-800 font-bold"
                        htmlFor="clienteIdPropietario">
                        Propiedatrio :
                    </label>
                    <input
                        id="clienteIdPropietario"
                        type="text"
                        name="clienteIdPropietario"
                        value={`${propietario.nombre} ${propietario.apellido} - ${propietario.cuit}`}
                        className="block w-full p-3 bg-slate-200"
                        disabled
                    />
                </div>

                {/* ------------------------------------------------------------------------ */}
                <div className="space-y-2">
                    <label className="text-slate-800 font-bold"
                        htmlFor="clienteIdInquilino">
                        Inquilino :
                    </label>
                    <select
                        className="block w-full p-3 bg-slate-200"
                        id="clienteIdInquilino"
                        name="clienteIdInquilino"
                        onChange={handleInputChange}
                        value={formValues.clienteIdInquilino}
                    >
                        <option value="">-- Seleccione --</option>
                        {clientes.map((cliente) => (
                            <option
                                key={cliente.id}
                                value={cliente.id}
                            >
                                {cliente.cuit} ----- {cliente.nombre} {cliente.apellido}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-slate-800 font-bold"
                        htmlFor="tipoContratoId">
                        Tipo de Contrato :
                    </label>
                    <select
                        className="block w-full p-3 bg-slate-200"
                        id="tipoContratoId"
                        name="tipoContratoId"
                        onChange={handleInputChange}
                        value={formValues.tipoContratoId}
                    >
                        <option value="">-- Seleccione --</option>
                        {tiposContrato.map((tiposContrato) => (
                            <option
                                key={tiposContrato.id}
                                value={tiposContrato.id}
                            >
                                {tiposContrato.descripcion}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-slate-800 font-bold"
                        htmlFor="tipoIndiceId">
                        Tipo de Indice :
                    </label>
                    <select
                        className="block w-full p-3 bg-slate-200"
                        id="tipoIndiceId"
                        name="tipoIndiceId"
                        onChange={handleInputChange}
                        value={formValues.tipoIndiceId}
                    >
                        <option value="">-- Seleccione --</option>
                        {tiposIndice.map((tiposIndice) => (
                            <option
                                key={tiposIndice.id}
                                value={tiposIndice.id}
                            >
                                {tiposIndice.descripcion}
                            </option>
                        ))}
                    </select>
                </div>

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
                <div className="grid lg:grid-cols-3 gap-4">
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
