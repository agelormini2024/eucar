/**
 * Script para migrar items existentes de ItemRecibo a sus tipos correspondientes
 * Ejecutar con: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/migrate-items.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Iniciando migración de items existentes...\n')

  try {
    // 1. Actualizar items con descripción "Alquiler"
    console.log('📝 Paso 1: Actualizando items de ALQUILER...')
    const alquileres = await prisma.$executeRaw`
      UPDATE "ItemRecibo" 
      SET "tipoItemId" = (SELECT id FROM "TipoItem" WHERE codigo = 'ALQUILER')
      WHERE LOWER(TRIM(descripcion)) = 'alquiler'
    `
    console.log(`   ✅ ${alquileres} items actualizados\n`)

    // 2. Actualizar items con palabras clave de descuento
    console.log('📝 Paso 2: Actualizando items de DESCUENTO...')
    const descuentos = await prisma.$executeRaw`
      UPDATE "ItemRecibo" 
      SET "tipoItemId" = (SELECT id FROM "TipoItem" WHERE codigo = 'DESCUENTO')
      WHERE "tipoItemId" IS NULL
        AND (
          LOWER(TRIM(descripcion)) LIKE '%descuento%'
          OR LOWER(TRIM(descripcion)) LIKE '%bonificaci%'
          OR LOWER(TRIM(descripcion)) LIKE '%rebaja%'
          OR monto < 0
        )
    `
    console.log(`   ✅ ${descuentos} items actualizados\n`)

    // 3. Actualizar items con palabras clave de servicios
    console.log('📝 Paso 3: Actualizando items de SERVICIO...')
    const servicios = await prisma.$executeRaw`
      UPDATE "ItemRecibo" 
      SET "tipoItemId" = (SELECT id FROM "TipoItem" WHERE codigo = 'SERVICIO')
      WHERE "tipoItemId" IS NULL
        AND (
          LOWER(TRIM(descripcion)) LIKE '%abl%'
          OR LOWER(TRIM(descripcion)) LIKE '%expensa%'
          OR LOWER(TRIM(descripcion)) LIKE '%aysa%'
          OR LOWER(TRIM(descripcion)) LIKE '%agua%'
          OR LOWER(TRIM(descripcion)) LIKE '%luz%'
          OR LOWER(TRIM(descripcion)) LIKE '%gas%'
        )
    `
    console.log(`   ✅ ${servicios} items actualizados\n`)

    // 4. Actualizar items con palabras clave de reintegro
    console.log('📝 Paso 4: Actualizando items de REINTEGRO...')
    const reintegros = await prisma.$executeRaw`
      UPDATE "ItemRecibo" 
      SET "tipoItemId" = (SELECT id FROM "TipoItem" WHERE codigo = 'REINTEGRO')
      WHERE "tipoItemId" IS NULL
        AND (
          LOWER(TRIM(descripcion)) LIKE '%reintegro%'
          OR LOWER(TRIM(descripcion)) LIKE '%devoluci%'
        )
    `
    console.log(`   ✅ ${reintegros} items actualizados\n`)

    // 5. Los items restantes se marcan como EXTRA
    console.log('📝 Paso 5: Actualizando items restantes como EXTRA...')
    const extras = await prisma.$executeRaw`
      UPDATE "ItemRecibo" 
      SET "tipoItemId" = (SELECT id FROM "TipoItem" WHERE codigo = 'EXTRA')
      WHERE "tipoItemId" IS NULL
    `
    console.log(`   ✅ ${extras} items actualizados\n`)

    // 6. Verificación: Mostrar estadísticas
    console.log('📊 Estadísticas finales:')
    console.log('─────────────────────────────────')
    
    const stats: Array<{ tipo: string; cantidad: bigint }> = await prisma.$queryRaw`
      SELECT 
        ti.nombre as tipo,
        COUNT(*) as cantidad
      FROM "ItemRecibo" ir
      JOIN "TipoItem" ti ON ir."tipoItemId" = ti.id
      GROUP BY ti.nombre, ti.orden
      ORDER BY ti.orden
    `
    
    stats.forEach(({ tipo, cantidad }) => {
      console.log(`   ${tipo.padEnd(15)} : ${cantidad.toString().padStart(4)} items`)
    })
    console.log('─────────────────────────────────')
    
    const total = stats.reduce((sum, { cantidad }) => sum + Number(cantidad), 0)
    console.log(`   ${'TOTAL'.padEnd(15)} : ${total.toString().padStart(4)} items\n`)

    console.log('✅ Migración completada exitosamente!')

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
