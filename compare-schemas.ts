import { execSync } from 'child_process'
import * as fs from 'fs'

const neonUrl = "postgresql://neondb_owner:npg_gu8D1MTqpvIc@ep-dry-bar-acbjwofx-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
const localUrl = "postgresql://postgres:iona3736@localhost:5432/postgres?schema=public"

console.log('🔍 Comparando estructuras de BD...\n')

try {
  // Obtener schema de Neon
  console.log('📡 Obteniendo schema de NEON...')
  const neonSchema = execSync(`DATABASE_URL="${neonUrl}" npx prisma db pull --print`, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe']
  })
  fs.writeFileSync('schema-neon.txt', neonSchema)
  console.log('✅ Schema de Neon guardado en schema-neon.txt\n')

  // Obtener schema de Local
  console.log('💻 Obteniendo schema de LOCAL...')
  const localSchema = execSync(`DATABASE_URL="${localUrl}" npx prisma db pull --print`, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe']
  })
  fs.writeFileSync('schema-local.txt', localSchema)
  console.log('✅ Schema de Local guardado en schema-local.txt\n')

  // Extraer solo los modelos (sin generator/datasource)
  const extractModels = (schema: string) => {
    const lines = schema.split('\n')
    const modelLines = []
    let inModel = false
    
    for (const line of lines) {
      if (line.startsWith('model ')) {
        inModel = true
      }
      if (inModel) {
        modelLines.push(line)
      }
      if (line === '}' && inModel) {
        modelLines.push('') // línea en blanco entre modelos
      }
    }
    return modelLines.join('\n')
  }

  const neonModels = extractModels(neonSchema)
  const localModels = extractModels(localSchema)

  // Comparar
  if (neonModels === localModels) {
    console.log('🎉 ¡PERFECTO! Las estructuras son IDÉNTICAS')
    console.log('✅ Neon y Local tienen la misma estructura de tablas\n')
  } else {
    console.log('⚠️  HAY DIFERENCIAS entre las estructuras')
    console.log('\n📄 Revisa los archivos:')
    console.log('   - schema-neon.txt')
    console.log('   - schema-local.txt')
    console.log('\nPara ver las diferencias ejecuta:')
    console.log('   diff schema-local.txt schema-neon.txt\n')
  }

} catch (error: any) {
  console.error('❌ Error:', error?.message || error)
  process.exit(1)
}
