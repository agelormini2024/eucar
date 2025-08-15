"use client"
import { useEffect, useState, useMemo } from "react"
import { usePropiedadFormStore } from "@/src/stores/storePropiedades"
import { Cliente, Pais, Propiedad, Provincia, TipoPropiedad } from "@prisma/client"
import { Switch } from "@mui/material"
import Modal from "../ui/Modal"


type PropiedadFormDynamicProps = {
    paises: Pais[],
    provincias: Provincia[],
    tiposPropiedad: TipoPropiedad[],
    clientes: Cliente[],
    propiedad?: Propiedad
}

export default function PropiedadFormDynamic({ paises, provincias, tiposPropiedad, clientes, propiedad }: PropiedadFormDynamicProps) {

    const { formValues, setFormValues, resetForm } = usePropiedadFormStore()
    
    // Estado para el modal y búsqueda de propietario
    const [showPropietarioModal, setShowPropietarioModal] = useState(false);
    const [searchPropietario, setSearchPropietario] = useState("");
    
    // Filtro de clientes (propietarios) basado en la búsqueda
    const filteredClientes = useMemo(() => {
        if (!searchPropietario) return clientes;
        return clientes.filter((c) =>
            c.nombre.toLowerCase().includes(searchPropietario.toLowerCase()) ||
            c.apellido.toLowerCase().includes(searchPropietario.toLowerCase()) ||
            c.cuit.toLowerCase().includes(searchPropietario.toLowerCase())
        );
    }, [searchPropietario, clientes]);

    useEffect(() => {
        return () => {
            resetForm();
        };
    }, [resetForm]);

    // Si la propiedad existe, cargar los valores en el formulario
    useEffect(() => {
        if (propiedad) {
            setFormValues({
                descripcion: propiedad.descripcion || '',
                calle: propiedad.calle || '',
                numero: propiedad.numero || 0,
                piso: propiedad.piso || '',
                departamento: propiedad.departamento || '',
                localidad: propiedad.localidad || '',
                provinciaId: propiedad.provinciaId || 0,
                paisId: propiedad.paisId || 1,
                codigoPostal: propiedad.codigoPostal || '',
                ambientes: propiedad.ambientes || 0,
                dormitorios: propiedad.dormitorios || 0,
                banios: propiedad.banios || 0,
                metrosCuadrados: propiedad.metrosCuadrados || 0,
                metrosCubiertos: propiedad.metrosCubiertos || 0,
                cochera: propiedad.cochera || 0,
                expensas: propiedad.expensas || 0,
                antiguedad: propiedad.antiguedad || 0,
                imagen: propiedad.imagen || '',
                tipoPropiedadId: propiedad.tipoPropiedadId || 0,
                observaciones: propiedad.observaciones || '',
                clienteId: propiedad.clienteId || 0,
                activo: propiedad.activo !== undefined ? propiedad.activo : true,

            })
        }
    }, [propiedad, setFormValues])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | React.ChangeEvent<{ checked: boolean }>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;

        if (type === "checkbox") {
            setFormValues({ [name]: checked });
        } else {
            setFormValues({ [name]: value });
        }
    };
    const isArgentina = true; // Por el momento solo se permite Argentina en el caso de permitir otro pais

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
                    placeholder="Descripción de la propiedad"
                />
            </div>
            <div className="space-y-2">
                <label
                    className="text-slate-800 font-bold"
                    htmlFor="calle"
                >Calle :</label>
                <input
                    id="calle"
                    type="text"
                    name="calle"
                    onChange={handleInputChange}
                    value={formValues.calle}
                    className="block w-full p-3 bg-slate-200"
                    placeholder="Calle"
                />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="numero"
                    >Número :</label>
                    <input
                        id="numero"
                        type="number"
                        name="numero"
                        onChange={handleInputChange}
                        value={formValues.numero}
                        className="block w-full p-3 bg-slate-200"
                        placeholder="Número"
                    />
                </div>
                <div className="space-y-2">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="piso"
                    >Piso :</label>
                    <input
                        id="piso"
                        type="text"
                        name="piso"
                        onChange={handleInputChange}
                        value={formValues.piso}
                        className="block w-full p-3 bg-slate-200"
                        placeholder="Piso"
                    />
                </div>
                <div className="space-y-2">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="departamento"
                    >Departamento :</label>
                    <input
                        id="departamento"
                        type="text"
                        name="departamento"
                        onChange={handleInputChange}
                        value={formValues.departamento}
                        className="block w-full p-3 bg-slate-200"
                        placeholder="Departamento"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label
                    className="text-slate-800 font-bold"
                    htmlFor="localidad"
                >Localidad :</label>
                <input
                    id="localidad"
                    type="text"
                    name="localidad"
                    onChange={handleInputChange}
                    value={formValues.localidad}
                    className="block w-full p-3 bg-slate-200"
                    placeholder="Ingrese la localidad Ej: Caballito"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">

                <div className="space-y-2">
                    <label className="text-slate-800 font-bold"
                        htmlFor="paisId">
                        País :
                    </label>
                    <select
                        className="block w-full p-3 bg-slate-200"
                        id="paisId"
                        name="paisId"
                        defaultValue="1"
                        disabled={true} // Por el moment Deshabilitar este select y establecer el pais por defecto en 1 
                        onChange={handleInputChange}
                    >
                        <option value="">-- Seleccione --</option>
                        {paises.map((pais) => (
                            <option key={pais.id} value={pais.id}>
                                {pais.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="codigoPostal"
                    >Código Postal :</label>
                    <input
                        id="codigoPostal"
                        type="text"
                        name="codigoPostal"
                        onChange={handleInputChange}
                        value={formValues.codigoPostal}
                        className="block w-full p-3 bg-slate-200"
                        placeholder="Código Postal"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-slate-800 font-bold"
                    htmlFor="provinciaId">
                    Provincia :
                </label>
                <select
                    className="block w-full p-3 bg-slate-200"
                    id="provinciaId"
                    name="provinciaId"
                    onChange={handleInputChange}
                    value={formValues.provinciaId}
                    disabled={!isArgentina} // Deshabilitar si el país no es Argentina
                >
                    <option value="">-- Seleccione --</option>
                    {provincias.map((provincia) => (
                        <option
                            key={provincia.id}
                            value={provincia.id}
                        >
                            {provincia.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="ambientes"
                    >Ambientes :</label>
                    <input
                        id="ambientes"
                        type="number"
                        name="ambientes"
                        onChange={handleInputChange}
                        value={formValues.ambientes}
                        className="block w-full p-3 bg-slate-200"
                        placeholder="Número de ambientes"
                    />
                </div>
                <div className="space-y-2">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="dormitorios"
                    >Dormitorios :</label>
                    <input
                        id="dormitorios"
                        type="number"
                        name="dormitorios"
                        onChange={handleInputChange}
                        value={formValues.dormitorios}
                        className="block w-full p-3 bg-slate-200"
                        placeholder="Número de dormitorios"
                    />
                </div>
                <div className="space-y-2">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="banios"
                    >Baños :</label>
                    <input
                        id="banios"
                        type="number"
                        name="banios"
                        onChange={handleInputChange}
                        value={formValues.banios}
                        className="block w-full p-3 bg-slate-200"
                        placeholder="Número de baños"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="metrosCuadrados"
                    >Superficie :</label>
                    <input
                        id="metrosCuadrados"
                        type="number"
                        name="metrosCuadrados"
                        onChange={handleInputChange}
                        value={formValues.metrosCuadrados}
                        className="block w-full p-3 bg-slate-200"
                        placeholder="Superficie Total"
                    />
                </div>
                <div className="space-y-2">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="metrosCubiertos"
                    >Sup. Cubierta :</label>
                    <input
                        id="metrosCubiertos"
                        type="number"
                        name="metrosCubiertos"
                        onChange={handleInputChange}
                        value={formValues.metrosCubiertos}
                        className="block w-full p-3 bg-slate-200"
                        placeholder="Superficie Cubierta"
                    />
                </div>
                <div className="space-y-2">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="cochera"
                    >Cocheras :</label>
                    <input
                        id="cochera"
                        type="number"
                        name="cochera"
                        onChange={handleInputChange}
                        value={formValues.cochera}
                        className="block w-full p-3 bg-slate-200"
                        placeholder="Número de Cocheras"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-slate-800 font-bold"
                    htmlFor="tipoPropiedadId">
                    Tipo de Propiedad :
                </label>
                <select
                    className="block w-full p-3 bg-slate-200"
                    id="tipoPropiedadId"
                    name="tipoPropiedadId"
                    onChange={handleInputChange}
                    value={formValues.tipoPropiedadId}
                >
                    <option value="">-- Seleccione --</option>
                    {tiposPropiedad.map((tipoPropiedad) => (
                        <option
                            key={tipoPropiedad.id}
                            value={tipoPropiedad.id}
                        >
                            {tipoPropiedad.descripcion}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-slate-800 font-bold" htmlFor="clienteId">
                    Propietario :
                </label>
                <button
                    type="button"
                    className="block w-full p-3 bg-slate-200 text-left rounded hover:bg-slate-300 transition-colors"
                    onClick={() => setShowPropietarioModal(true)}
                >
                    {formValues.clienteId
                        ? (() => {
                            const cliente = clientes.find((c) => c.id === formValues.clienteId);
                            return cliente ? `${cliente.nombre} ${cliente.apellido} |-| ${cliente.cuit}` : 'Seleccionar propietario';
                        })()
                        : 'Seleccionar propietario'}
                </button>
                
                {/* Modal de selección de propietario */}
                <Modal isOpen={showPropietarioModal} onClose={() => setShowPropietarioModal(false)}>
                    <h3 className="text-lg font-bold mb-4 text-slate-800">Seleccionar Propietario</h3>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, apellido o CUIT..."
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={searchPropietario}
                            onChange={(e) => setSearchPropietario(e.target.value)}
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
                                    formValues.clienteId === cliente.id ? 'bg-slate-200 font-bold' : ''
                                }`}
                                onClick={() => {
                                    setFormValues({ clienteId: cliente.id });
                                    setShowPropietarioModal(false);
                                    setSearchPropietario(""); // Limpiar búsqueda al seleccionar
                                }}
                            >
                                <div className="font-medium">{cliente.nombre} {cliente.apellido}</div>
                                <div className="text-sm text-gray-600">CUIT: {cliente.cuit}</div>
                            </div>
                        ))}
                    </div>
                </Modal>
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
                    placeholder="Observaciones"
                />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="expensas"
                    >Expensas :</label>
                    <input
                        id="expensas"
                        type="number"
                        name="expensas"
                        onChange={handleInputChange}
                        value={formValues.expensas}
                        className="block w-full p-3 bg-slate-200"
                        placeholder="Expensas"
                    />
                </div>
                <div className="space-y-2">
                    <label
                        className="text-slate-800 font-bold"
                        htmlFor="antiguedad"
                    >Antigüedad :</label>
                    <input
                        id="antiguedad"
                        type="number"
                        name="antiguedad"
                        onChange={handleInputChange}
                        value={formValues.antiguedad}
                        className="block w-full p-3 bg-slate-200"
                        placeholder="Antigüedad"
                    />
                </div>
                <div className="space-y-2 flex items-center">
                    <label
                        className="text-slate-800 font-bold "
                        htmlFor="activo"
                    >Propiedad Alquilada </label>
                    <Switch
                        id="activo"
                        checked={formValues.activo}
                        onChange={(e) => handleInputChange({ ...e, target: { ...e.target, name: "activo", type: "checkbox", checked: e.target.checked } })}
                        color="primary"
                        className="ml-4"
                        name="activo"
                    />
                </div>
            </div>
        </>
    )
}
