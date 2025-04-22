"use client"
import { useEffect } from "react"
import { usePropiedadFormStore } from "@/src/stores/storePropiedades"
import { Cliente, Pais, Propiedad, Provincia, TipoPropiedad } from "@prisma/client"
import { Switch } from "@mui/material"


type PropiedadFormDynamicProps = {
    paises: Pais[],
    provincias: Provincia[],
    tiposPropiedad: TipoPropiedad[],
    clientes: Cliente[],
    propiedad?: Propiedad
}

export default function PropiedadFormDynamic({ paises, provincias, tiposPropiedad, clientes, propiedad }: PropiedadFormDynamicProps) {

    const { formValues, setFormValues } = usePropiedadFormStore()

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
                            {tipoPropiedad.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-slate-800 font-bold"
                    htmlFor="clienteId">
                    Propiedatrio :
                </label>
                <select
                    className="block w-full p-3 bg-slate-200"
                    id="clienteId"
                    name="clienteId"
                    onChange={handleInputChange}
                    value={formValues.clienteId}
                >
                    <option value="">-- Seleccione --</option>
                    {clientes.map((cliente) => (
                        <option
                            key={cliente.id}
                            value={cliente.id}
                        >
                            {cliente.nombre} {cliente.apellido} ------ {cliente.cuit}
                        </option>
                    ))}
                </select>
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
