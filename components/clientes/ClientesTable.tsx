// Objetivo: Crear una Tabla para mostrar los clientes

import { Cliente } from "@prisma/client"

type ClientesTableProps = {
    clientes: Cliente[]
}

export default function ClientesTable({ clientes }: ClientesTableProps) {
  return (
    <div>ClientesTable</div>
  )
}
