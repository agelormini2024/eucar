"use client";
import { Cliente } from "@prisma/client"
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table"
import { useEffect, useMemo, useState } from "react"

type PruebaTableProps = {
    data: Cliente[]
};

export default function Prueba2({ data }: PruebaTableProps) {

    const [selectedId, setSelectedId] = useState<number | null>(null);

    const columns = useMemo<MRT_ColumnDef<Cliente>[]>(
        () => [


            {
                accessorKey: 'id',
                header: 'Id',
                muiTableHeadCellProps: { style: { color: 'darkred' } },
                enableHiding: true
            },
            {
                accessorKey: 'nombre',
                header: 'Nombre',
                muiTableHeadCellProps: { style: { color: 'darkred' } },
                enableHiding: false
            },
            {
                accessorKey: 'apellido',
                header: 'Apellido',
                muiTableHeadCellProps: { style: { color: 'darkred' } },
                enableHiding: false
            },
            {
                accessorKey: 'razonSocial',
                header: 'Razón Social',
                muiTableHeadCellProps: { style: { color: 'darkred' } },
                enableHiding: false
            },
            {
                accessorKey: 'email',
                header: 'Email',
                muiTableHeadCellProps: { style: { color: 'darkred' } },
                enableHiding: false
            },
            {
                accessorKey: 'celular',
                header: 'Celular',
                muiTableHeadCellProps: { style: { color: 'darkred' } },
                enableHiding: false
            }
        ], []
    )

    return (
        <div>
            <MaterialReactTable
                columns={columns}
                data={data}
                enableColumnResizing
                enableColumnOrdering
                enableRowNumbers
                muiTableBodyRowProps={({ row }) => ({
                    onClick: () => {
                        setSelectedId(row.original.id); // Guardar el ID del cliente seleccionado
                        console.log("Cliente seleccionado:", row.original.id); // Mostrar el ID en la consola
                    },
                    style: {
                        cursor: "pointer", // Cambiar el cursor para indicar que la fila es clicable
                    },
                })}
            />
            {selectedId && (
                <div className="mt-4">
                    <p>Cliente seleccionado: {selectedId}</p>
                    {/* Aquí puedes agregar un botón o enlace para pasar el ID como parámetro */}
                    <button
                        onClick={() => {
                            console.log("Navegar con ID:", selectedId);
                            // Aquí puedes usar un router para navegar, por ejemplo:
                            // router.push(`/ruta/${selectedId}`);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Ver detalles del cliente
                    </button>
                </div>
            )}
        </div>

    )
}
