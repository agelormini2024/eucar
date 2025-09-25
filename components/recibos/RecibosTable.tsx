"use client"
import { useMemo } from "react"
import Link from "next/link"
import { RecibosConRelaciones } from "@/src/types/recibo"
import { formatCurrency, formatFecha } from "@/src/utils"
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table"


type RecibosTableProps = {
    data: RecibosConRelaciones[]
}
export default function RecibosTable({ data }: RecibosTableProps) {

    const columns = useMemo<MRT_ColumnDef<RecibosConRelaciones>[]>(
        () => [

            {
                id: "imprimirRecibo", 
                header: "",
                size: 80,
                Cell: ({ row }) => (
                    <Link
                        href={`${row.original.id}/imprimir`}
                        className="bg-slate-700 text-white px-2 py-2 font-bold rounded hover:bg-slate-500 transition-colors duration-400 flex items-center justify-center"
                        title="Imprimir recibo"
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
                                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
                            />
                        </svg>
                    </Link>
                ),
                muiTableHeadCellProps: { style: { textAlign: "center", color: "darkred", fontSize: "1rem" } },
                muiTableBodyCellProps: { style: { textAlign: "center" } },
            },
            {
                id: "editarRecibo", // ID único para la columna
                header: "",
                size: 80,
                Cell: ({ row }) => (
                    <Link
                        href={`${row.original.id}/edit`}
                        className="bg-orange-400 text-white px-2 py-2 font-bold rounded hover:bg-slate-500 transition-colors duration-400 flex items-center justify-center"
                        title="Editar recibo"
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
                id: "eliminarRecibo", // ID único para la columna
                header: "",
                size: 80,
                Cell: ({ row }) => (
                    <Link
                        href={`${row.original.id}/borrar`}
                        className="bg-red-600 text-white px-2 py-2 font-bold rounded hover:bg-slate-500 transition-colors duration-400 flex items-center justify-center"
                        title="Eliminar recibo"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m5 0H4"
                                />
                            </svg>
                    </Link>
                ),
                muiTableHeadCellProps: { style: { textAlign: "center", color: "darkred", fontSize: "1rem" } },
                muiTableBodyCellProps: { style: { textAlign: "center" } },
            },
            {
                id: "generarRecibo", // ID único para la columna
                header: "Pendientes",
                Cell: ({ row }) =>
                    row.original.montoTotal === 0 ? (
                        <Link
                            href={`../recibos/alta/${row.original.contratoId}`}
                            className="bg-orange-200 px-2 py-2 font-bold rounded hover:bg-orange-300 transition-colors duration-400"
                        >
                            Generar
                        </Link>
                    ) : null
                ,
                muiTableHeadCellProps: { style: { textAlign: "center", color: "darkred", fontSize: "1rem" } },
                muiTableBodyCellProps: { style: { textAlign: "center" } },
            },
            {
                id: "numeroRecibo", // ID único para la columna
                header: "N° Recibo",
                accessorFn: (row) => row.id.toString().padStart(8, '0'),
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                id: "cliente", // ID único para la columna
                header: "Cliente", // Título de la columna
                accessorFn: (row) => `${row.contrato.clienteInquilino.apellido} ${row.contrato.clienteInquilino.nombre}`, // Combina los valores de nombre y apellido
                Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>, // Renderiza el valor combinado
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                id: "propiedad", // ID único para la columna
                header: "Propiedad", // Título de la columna
                accessorFn: (row) => `${row.contrato.propiedad.calle} ${row.contrato.propiedad.numero} ${row.contrato.propiedad.piso} ${row.contrato.propiedad.departamento}`, // Combina los valores de nombre y apellido
                Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>, // Renderiza el valor combinado
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                id: "montoAnterior",
                header: "Anterior",
                accessorFn: (row) => formatCurrency(row.montoAnterior ?? 0),
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                id: "montoTotal",
                header: "Actual",
                accessorFn: (row) => formatCurrency(row.montoTotal ?? 0),
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                id: "montoPagado",
                header: "Pagado",
                accessorFn: (row) => formatCurrency(row.montoPagado ?? 0),
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                id: "fechaGenerado",
                header: "Generado",
                accessorFn: (row) => row.fechaGenerado ? formatFecha(new Date(row.fechaGenerado)) : '',
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },
            {
                id: "fechaImpreso",
                header: "Impreso",
                accessorFn: (row) => row.fechaImpreso ? formatFecha(new Date(row.fechaImpreso)) : '',
                muiTableHeadCellProps: { style: { color: "darkred" } },
                enableSorting: true, // Habilita el ordenamiento
                enableColumnFilter: true, // Habilita el filtrado
            },

        ], [])


    const table = useMaterialReactTable({
        columns,
        data,
        enableStickyHeader: true,
        muiTablePaperProps: {
            elevation: 5, // Cambiar la sombra del cuadro mui
            sx: { // Personalizar estilos de papel
                '& tr:nth-of-type(odd) > td': {
                    backgroundColor: '#f5f5f5',
                },
            },
        },
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
