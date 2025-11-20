"use client"
import { getMesesRestanActualizar } from "@/src/lib/buscarMesesRestanActualizar";
import { ClientePropietarioSchemaApi } from "@/src/schema";
import { useContratoFormStore } from "@/src/stores/storeContratos";
import { Cliente, Contrato, Propiedad, TipoContrato, TipoIndice } from '@prisma/client'
import { useCallback, useEffect, useState, useMemo } from "react";
import Modal from "../ui/Modal";

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

    // Estado para el modal y búsqueda de propiedad
    const [showPropModal, setShowPropModal] = useState(false);
    const [searchProp, setSearchProp] = useState("");
    
    // Estado para el modal y búsqueda de inquilino
    const [showInquilinoModal, setShowInquilinoModal] = useState(false);
    const [searchInquilino, setSearchInquilino] = useState("");
    
    // Filtro de propiedades basado en la búsqueda
    const filteredPropiedades = useMemo(() => {
        if (!searchProp) return propiedades;
        const searchLower = searchProp.toLowerCase();
        return propiedades.filter((p) => {
            // Construir dirección completa para buscar
            const direccion = [
                p.calle,
                p.numero?.toString(),
                p.piso ? `piso ${p.piso}` : '',
                p.departamento ? `depto ${p.departamento}` : ''
            ].filter(Boolean).join(' ').toLowerCase();

            return (
                p.descripcion.toLowerCase().includes(searchLower) ||
                direccion.includes(searchLower)
            );
        });
    }, [searchProp, propiedades]);

    // Filtro de clientes (inquilinos) basado en la búsqueda
    const filteredClientes = useMemo(() => {
        if (!searchInquilino) return clientes;
        return clientes.filter((c) =>
            c.nombre.toLowerCase().includes(searchInquilino.toLowerCase()) ||
            c.apellido.toLowerCase().includes(searchInquilino.toLowerCase()) ||
            c.cuit.toLowerCase().includes(searchInquilino.toLowerCase())
        );
    }, [searchInquilino, clientes]);

    useEffect(() => {
        return () => {
            resetForm()
        };
    }, [resetForm]);

    useEffect(() => {

        console.log("ContratoFormDynamic - contrato recibido:", contrato);

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
    // const calcularCantidadMesesDuracion = () => {
    //     const fechaInicio = new Date(formValues.fechaInicio);
    //     const fechaVencimiento = new Date(formValues.fechaVencimiento);

    //     if (isNaN(fechaInicio.getTime()) || isNaN(fechaVencimiento.getTime())) {
    //         // Si alguna de las fechas no es válida, no hacemos nada
    //         return;
    //     }

    //     // Calcular la diferencia en años y meses
    //     const diferenciaAnios = fechaVencimiento.getFullYear() - fechaInicio.getFullYear();
    //     const diferenciaMeses = fechaVencimiento.getMonth() - fechaInicio.getMonth();
    //     // Total de meses
    //     const cantidadMeses = diferenciaAnios * 12 + diferenciaMeses;
    //     if (
    //         formValues.cantidadMesesDuracion !== cantidadMeses ||
    //         formValues.diaMesVencimiento !== DIA_MES_VENCIMIENTO
    //     ) {
    //         setFormValues({
    //             cantidadMesesDuracion: cantidadMeses,
    //             diaMesVencimiento: DIA_MES_VENCIMIENTO
    //         });
    //     }
    // }
    const calcularCantidadMesesDuracion = useCallback(() => {
        const fechaInicio = new Date(formValues.fechaInicio);
        const fechaVencimiento = new Date(formValues.fechaVencimiento);

        if (isNaN(fechaInicio.getTime()) || isNaN(fechaVencimiento.getTime())) {
            return;
        }

        const diferenciaAnios = fechaVencimiento.getFullYear() - fechaInicio.getFullYear();
        const diferenciaMeses = fechaVencimiento.getMonth() - fechaInicio.getMonth();
        const cantidadMeses = diferenciaAnios * 12 + diferenciaMeses;

        if (
            formValues.cantidadMesesDuracion !== cantidadMeses ||
            formValues.diaMesVencimiento !== DIA_MES_VENCIMIENTO
        ) {
            setFormValues({
                cantidadMesesDuracion: cantidadMeses,
                diaMesVencimiento: DIA_MES_VENCIMIENTO
            });
        }
    }, [formValues.fechaInicio, formValues.fechaVencimiento, formValues.cantidadMesesDuracion, formValues.diaMesVencimiento, setFormValues]);

    useEffect(() => {
        if (formValues.fechaInicio && formValues.fechaVencimiento) {
            calcularCantidadMesesDuracion();
        }
    }, [formValues.fechaInicio, formValues.fechaVencimiento, calcularCantidadMesesDuracion]);

    //-------------------------------------------------------------------------------------------//
    //              Traer los meses de actualización del contrato
    //-------------------------------------------------------------------------------------------//
    const fetchMesesRestanActualizar = useCallback(async () => {
        if (!formValues.tipoContratoId) return;

        const tipoContrato = await getMesesRestanActualizar(formValues.tipoContratoId);
        setFormValues({
            mesesRestaActualizar: tipoContrato?.cantidadMesesActualizacion ?? 0
        });
    }, [formValues.tipoContratoId, setFormValues]);

    useEffect(() => {
        if (!formValues.tipoContratoId) return;
        fetchMesesRestanActualizar()
    }, [formValues.tipoContratoId, fetchMesesRestanActualizar])

    //-----------------------------------------------------------------------------------------//
    // Se busca el propietario de la propiedad del contrato 
    //-----------------------------------------------------------------------------------------//
    const buscarPropietario = useCallback(async () => {
        console.log("Buscando propietario para propiedad:", formValues.propiedadId);
        const result = await fetch(`/api/contratos/propiedad/${formValues.propiedadId}`).then(res => res.json())
        console.log("Respuesta de la API:", result);
        const parsed = ClientePropietarioSchemaApi.safeParse(result);
        console.log("Resultado del safeParse:", parsed);

        const { data: clientePropietario } = parsed;

        // const { data: clientePropietario } = ClientePropietarioSchemaApi.safeParse(result) // Validar contrato con zod

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
    }, [formValues.propiedadId, setFormValues]);

    useEffect(() => {
        if (formValues.propiedadId && formValues.propiedadId !== 0) {
            buscarPropietario();
        }
    }, [formValues.propiedadId, buscarPropietario]);
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
                <label className="text-slate-800 font-bold" htmlFor="propiedadId">
                    Propiedad :
                </label>
                <button
                    id="propiedadId"
                    type="button"
                    className="block w-full p-3 bg-slate-200 text-left rounded hover:bg-slate-300 transition-colors"
                    onClick={() => setShowPropModal(true)}
                >
                    {formValues.propiedadId
                        ? propiedades.find((p) => p.id === formValues.propiedadId)?.descripcion || 'Seleccionar propiedad'
                        : 'Seleccionar propiedad'}
                </button>
                
                {/* Modal de selección de propiedad */}
                <Modal isOpen={showPropModal} onClose={() => setShowPropModal(false)}>
                    <h3 className="text-lg font-bold mb-4 text-slate-800">Seleccionar Propiedad</h3>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Buscar por descripción o dirección..."
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={searchProp}
                            onChange={(e) => setSearchProp(e.target.value)}
                        />
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {filteredPropiedades.length === 0 && (
                            <div className="text-gray-500 text-center py-4">
                                No se encontraron propiedades.
                            </div>
                        )}
                        {/* Encabezados de columnas */}
                        {filteredPropiedades.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-700 text-white font-bold sticky top-0 z-10 rounded">
                                <div>Descripción</div>
                                <div>Dirección</div>
                            </div>
                        )}
                        {filteredPropiedades.map((propiedad) => {
                            // Construir dirección completa
                            const direccion = [
                                propiedad.calle,
                                propiedad.numero,
                                propiedad.piso ? `Piso ${propiedad.piso}` : null,
                                propiedad.departamento ? `Depto ${propiedad.departamento}` : null
                            ].filter(Boolean).join(' ');

                            return (
                                <div
                                    key={propiedad.id}
                                    className={`grid grid-cols-2 gap-4 p-3 cursor-pointer hover:bg-slate-100 rounded border-b last:border-b-0 transition-colors ${
                                        formValues.propiedadId === propiedad.id ? 'bg-slate-200 font-bold' : ''
                                    }`}
                                    onClick={() => {
                                        setFormValues({ propiedadId: propiedad.id });
                                        setShowPropModal(false);
                                        setSearchProp(""); // Limpiar búsqueda al seleccionar
                                    }}
                                >
                                    <div className="font-medium">{propiedad.descripcion}</div>
                                    <div className="text-gray-700">{direccion}</div>
                                </div>
                            );
                        })}
                    </div>
                </Modal>
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

                <div className="space-y-2">
                    <label className="text-slate-800 font-bold"
                        htmlFor="clienteIdPropietario">
                        Propiedatrio :
                    </label>
                    <input
                        id="clienteIdPropietario"
                        type="text"
                        name="clienteIdPropietario"
                        value={`${propietario.nombre} ${propietario.apellido} |-| ${propietario.cuit}`}
                        className="block w-full p-3 bg-slate-200"
                        disabled
                    />
                </div>

                {/* ------------------------------------------------------------------------ */}
                <div className="space-y-2">
                    <label className="text-slate-800 font-bold" htmlFor="clienteIdInquilino">
                        Inquilino :
                    </label>
                    <button
                        id="clienteIdInquilino"
                        type="button"
                        className="block w-full p-3 bg-slate-200 text-left rounded hover:bg-slate-300 transition-colors"
                        onClick={() => setShowInquilinoModal(true)}
                    >
                        {formValues.clienteIdInquilino
                            ? (() => {
                                const cliente = clientes.find((c) => c.id === formValues.clienteIdInquilino);
                                return cliente ? `${cliente.nombre} ${cliente.apellido} |-| ${cliente.cuit}` : 'Seleccionar inquilino';
                            })()
                            : 'Seleccionar inquilino'}
                    </button>
                    
                    {/* Modal de selección de inquilino */}
                    <Modal isOpen={showInquilinoModal} onClose={() => setShowInquilinoModal(false)}>
                        <h3 className="text-lg font-bold mb-4 text-slate-800">Seleccionar Inquilino</h3>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Buscar por nombre, apellido o CUIT..."
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={searchInquilino}
                                onChange={(e) => setSearchInquilino(e.target.value)}
                            />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                            {filteredClientes.length === 0 && (
                                <div className="text-gray-500 text-center py-4">
                                    No se encontraron clientes.
                                </div>
                            )}
                            {filteredClientes.map((cliente) => (
                                <div
                                    key={cliente.id}
                                    className={`p-3 cursor-pointer hover:bg-slate-100 rounded border-b last:border-b-0 transition-colors ${
                                        formValues.clienteIdInquilino === cliente.id ? 'bg-slate-200 font-bold' : ''
                                    }`}
                                    onClick={() => {
                                        setFormValues({ clienteIdInquilino: cliente.id });
                                        setShowInquilinoModal(false);
                                        setSearchInquilino(""); // Limpiar búsqueda al seleccionar
                                    }}
                                >
                                    <div className="font-medium">{cliente.nombre} {cliente.apellido}</div>
                                    <div className="text-sm text-gray-600">CUIT: {cliente.cuit}</div>
                                </div>
                            ))}
                        </div>
                    </Modal>
                </div>
                <div className="space-y-2">
                    <label className="text-slate-800 font-bold"
                        htmlFor="tipoContratoId">
                        Actualización :
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
