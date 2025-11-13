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
                header: "",
                size: 80,
                Cell: ({ row }) => (
                    <Link
                        href={`${row.original.id}/edit`} 
                        className="bg-slate-700 text-white px-4 py-2 font-bold rounded hover:bg-slate-500 transition-colors duration-400"
                        title="Editar contrato"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>

                    </Link>
                ),
                muiTableHeadCellProps: { style: { textAlign: "center", color: "darkred", fontSize: "1rem" } },
                muiTableBodyCellProps: { style: { textAlign: "center" } },
            },
            {
                id: "generarRecibo",
                header: "Recibos",
                Cell: ({ row }) => (
                    <Link
                        href={`/admin/recibos/alta/${row.original.id}`}
                        className="bg-orange-200 px-4 py-2 font-bold rounded hover:bg-orange-300 transition-colors duration-400"
                        title="Generar recibo para este contrato"
                    >
                        Generar
                    </Link>
                ),
                muiTableHeadCellProps: { style: { textAlign: "center", color: "darkred", fontSize: "1rem" } },
                muiTableBodyCellProps: { style: { textAlign: "center" } },

            },
            {
                accessorKey: "id",
                header: "Contrato N°",
                muiTableHeadCellProps: { style: { color: "darkred" } },
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
                id: "clientePropietario", 
                header: "Propietario", 
                accessorFn: (row) => `${row.clientePropietario.apellido} ${row.clientePropietario.nombre}`, // Combina los valores de calle y número
                Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>, // Renderiza el valor combinado
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                id: "clienteInquilino", 
                header: "Inquilino",
                accessorFn: (row) => `${row.clienteInquilino.apellido} ${row.clienteInquilino.nombre}`, // Combina los valores de calle y número
                Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>, // Renderiza el valor combinado
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, 
                enableColumnFilter: true, 
            },
            {
                id: "direccion", 
                header: "Propiedad", 
                accessorFn: (row) => `${row.propiedad.calle} ${row.propiedad.numero} - ${row.propiedad.piso} "${row.propiedad.departamento}"`, // Combina los valores de calle y número
                Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>, // Renderiza el valor combinado
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, 
                enableColumnFilter: true, 
            },
            {
                id: "montoAlquilerInicial",
                header: "Alquiler  /  Inicial",
                accessorFn: (row) => formatCurrency(row.montoAlquilerInicial ?? 0),
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, 
                enableColumnFilter: true, 
            },
            {
                id: "montoAlquilerUltimo",
                header: "Ultimo.  /  Alquiler",
                accessorFn: (row) => formatCurrency(row.montoAlquilerUltimo ?? 0),
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, 
                enableColumnFilter: true, 
            },
            {
                id: "fechaInicio",
                header: "Fecha     /  inicial",
                accessorFn: (row) => formatFecha(row.fechaInicio),
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, 
                enableColumnFilter: true, 
            },
            {
                id: "fechaVencimiento",
                header: "Fecha  /  Vencimiento",
                accessorFn: (row) => formatFecha(row.fechaVencimiento),
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, 
                enableColumnFilter: true, 
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

