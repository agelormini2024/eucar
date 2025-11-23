import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding TipoItem...')
  
  const tiposItem = [
    {
      id: 1,
      codigo: 'ALQUILER',
      nombre: 'Alquiler',
      descripcion: 'Monto base del alquiler mensual',
      esModificable: false,
      esEliminable: false,
      permiteNegativo: false,
      esObligatorio: true,
      orden: 1,
      color: '#3B82F6', // blue
      activo: true
    },
    {
      id: 2,
      codigo: 'EXTRA',
      nombre: 'Extra',
      descripcion: 'Cargos adicionales (expensas, servicios, etc)',
      esModificable: true,
      esEliminable: true,
      permiteNegativo: false,
      esObligatorio: false,
      orden: 2,
      color: '#F59E0B', // orange
      activo: true
    },
    {
      id: 3,
      codigo: 'DESCUENTO',
      nombre: 'Descuento',
      descripcion: 'Descuentos o bonificaciones',
      esModificable: true,
      esEliminable: true,
      permiteNegativo: true,
      esObligatorio: false,
      orden: 3,
      color: '#10B981', // green
      activo: true
    },
    {
      id: 4,
      codigo: 'SERVICIO',
      nombre: 'Servicio',
      descripcion: 'Servicios incluidos en el recibo',
      esModificable: true,
      esEliminable: true,
      permiteNegativo: false,
      esObligatorio: false,
      orden: 4,
      color: '#8B5CF6', // purple
      activo: true
    },
    {
      id: 5,
      codigo: 'REINTEGRO',
      nombre: 'Reintegro',
      descripcion: 'Reintegros o devoluciones',
      esModificable: true,
      esEliminable: true,
      permiteNegativo: true,
      esObligatorio: false,
      orden: 5,
      color: '#EF4444', // red
      activo: true
    }
  ]

  for (const tipoItem of tiposItem) {
    const created = await prisma.tipoItem.upsert({
      where: { codigo: tipoItem.codigo },
      update: {},
      create: tipoItem
    })
    console.log(`✅ ${created.codigo} - ${created.nombre}`)
  }

  console.log('🎉 Seed completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
