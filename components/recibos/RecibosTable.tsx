"use client"
import { useMemo } from "react"
import { RecibosConRelaciones } from "@/src/types"
import { formatCurrency, formatFecha } from "@/src/utils"
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table"
import Link from "next/link"


type RecibosTableProps = {
    data: RecibosConRelaciones[]
}
export default function RecibosTable({ data }: RecibosTableProps) {

    const columns = useMemo<MRT_ColumnDef<RecibosConRelaciones>[]>(
        () => [

            {
                id: "imprimirRecibo", // ID único para la columna
                header: "Acciones",
                Cell: ({ row }) => (
                    <Link
                        href={`${row.original.id}/imprimir`}
                        className="bg-red-800 text-white px-4 py-2 font-bold rounded hover:bg-red-500 transition-colors duration-400"
                    >
                        Imprimir
                    </Link>
                ),
                muiTableHeadCellProps: { style: { textAlign: "center", color: "darkred", fontSize: "1rem" } },
                muiTableBodyCellProps: { style: { textAlign: "center" } },
            },
            {
                id: "generarRecibo", // ID único para la columna
                header: "Recibos",
                Cell: ({ row }) =>
                    row.original.montoTotal === 0 ? (
                        <Link
                            href={`../recibos/alta/${row.original.contratoId}`}
                            className="bg-orange-400 text-white px-4 py-2 font-bold rounded hover:bg-orange-600 transition-colors duration-400"
                        >
                            Generar
                        </Link>
                    ) : null
                ,
                muiTableHeadCellProps: { style: { textAlign: "center", color: "darkred", fontSize: "1rem" } },
                muiTableBodyCellProps: { style: { textAlign: "center" } },
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
                id: "montoTotal",
                header: "Importe Alquiler",
                accessorFn: (row) => formatCurrency(row.montoTotal ?? 0),
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
            elevation: 5, //change the mui box shadow
            //customize paper styles
            sx: {
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
