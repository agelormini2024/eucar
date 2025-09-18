import { consultaContratos } from "@/src/types/contrato";
import { Prisma } from "@prisma/client";
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import Link from "next/link"; // Importar Link de Next.js
import { useMemo } from "react"
import { formatCurrency, formatFecha } from "@/src/utils";

type ContratosTableProps = {
    data: Prisma.ContratoGetPayload<typeof consultaContratos>[]
};

export default function ContratosTable({ data }: ContratosTableProps) {

    const columns = useMemo<MRT_ColumnDef<Prisma.ContratoGetPayload<typeof consultaContratos>>[]>(
        () => [
            {
                id: "acciones", // ID único para la columna
                header: "Contratos",
                Cell: ({ row }) => (
                    <Link
                        href={`${row.original.id}/edit`} // Ruta dinámica basada en el ID del contrato
                        className="bg-slate-700 text-white px-4 py-2 font-bold rounded hover:bg-slate-500 transition-colors duration-400"
                    >
                        Editar
                    </Link>
                ),
                muiTableHeadCellProps: { style: { textAlign: "center", color: "darkred", fontSize: "1rem" } },
                muiTableBodyCellProps: { style: { textAlign: "center" } },
            },
            {
                id: "generarRecibo", // ID único para la columna
                header: "Recibos",
                Cell: ({ row }) =>
                    row.original.recibos.length > 0 ? null :
                        (<Link
                            href={`../recibos/alta/${row.original.id}`} // Ruta dinámica basada en el ID del contrato
                            className="bg-orange-200 px-4 py-2 font-bold rounded hover:bg-orange-300 transition-colors duration-400"
                        >
                            Generar
                        </Link>
                        ),
                muiTableHeadCellProps: { style: { textAlign: "center", color: "darkred", fontSize: "1rem" } },
                muiTableBodyCellProps: { style: { textAlign: "center" } },

            },
            {
                accessorKey: "mesesRestaActualizar",
                header: "Meses p / Actualizar",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },
            {
                accessorKey: "cantidadMesesDuracion",
                header: "Meses /  Vencimiento",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },
            {
                id: "clientePropietario", // ID único para la columna
                header: "Propietario", // Título de la columna
                accessorFn: (row) => `${row.clientePropietario.apellido} ${row.clientePropietario.nombre}`, // Combina los valores de calle y número
                Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>, // Renderiza el valor combinado
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                id: "clienteInquilino", // ID único para la columna
                header: "Inquilino", // Título de la columna
                accessorFn: (row) => `${row.clienteInquilino.apellido} ${row.clienteInquilino.nombre}`, // Combina los valores de calle y número
                Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>, // Renderiza el valor combinado
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                id: "direccion", // ID único para la columna
                header: "Propiedad", // Título de la columna
                accessorFn: (row) => `${row.propiedad.calle} ${row.propiedad.numero} - ${row.propiedad.piso} "${row.propiedad.departamento}"`, // Combina los valores de calle y número
                Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>, // Renderiza el valor combinado
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                id: "montoAlquilerInicial",
                header: "Alquiler  /  Inicial",
                accessorFn: (row) => formatCurrency(row.montoAlquilerInicial ?? 0),
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                id: "montoAlquilerUltimo",
                header: "Ultimo.  /  Alquiler",
                accessorFn: (row) => formatCurrency(row.montoAlquilerUltimo ?? 0),
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                id: "fechaInicio",
                header: "Fecha     /  inicial",
                accessorFn: (row) => formatFecha(row.fechaInicio),
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                id: "fechaVencimiento",
                header: "Fecha  /  Vencimiento",
                accessorFn: (row) => formatFecha(row.fechaVencimiento),
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                accessorKey: "tipoContrato.descripcion",
                header: "Actualización",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },
            {
                accessorKey: "tipoIndice.nombre",
                header: "Indice",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            },
            {
                accessorKey: "descripcion",
                header: "Descripción",
                muiTableHeadCellProps: { style: { color: "darkred" } },
            }
        ],
        []
    )

    const table = useMaterialReactTable({
        columns,
        data,
        enableStickyHeader: true,
        muiTablePaperProps: {
            elevation: 5, //change the mui box shadow
            //customize paper styles
            // sx: {
            //     '& tr:nth-of-type(odd) > td': {
            //         backgroundColor: '#f5f5f5',
            //     },
            // },
        },
        muiTableBodyRowProps: ({ row }) => ({
            sx: {
                backgroundColor: row.original.mesesRestaActualizar === 0 ? '#f5f5f5' : 'inherit',
                '& td': {
                    color: row.original.mesesRestaActualizar === 0 ? '#F30000' : 'inherit',
                    fontWeight: row.original.mesesRestaActualizar === 0 ? 'bold' : 'normal',
                },
            },
        }),
        enableColumnResizing: true,
        enableColumnOrdering: true,
        enableRowNumbers: true,
        enableRowSelection: false, // Deshabilitar selección de filas si no es necesaria
    })

    return (
        <div className="m-4">
            <MaterialReactTable table={table} />
        </div>
    )
}

