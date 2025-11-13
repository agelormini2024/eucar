-- Script para migrar items existentes de ItemRecibo
-- Este script asigna el tipo correcto a items que ya existen en la BD

-- 1. Actualizar items con descripción "Alquiler" (case-insensitive)
UPDATE "ItemRecibo" 
SET "tipoItemId" = (SELECT id FROM "TipoItem" WHERE codigo = 'ALQUILER')
WHERE LOWER(TRIM(descripcion)) = 'alquiler';

-- 2. Actualizar items con palabras clave de descuento
UPDATE "ItemRecibo" 
SET "tipoItemId" = (SELECT id FROM "TipoItem" WHERE codigo = 'DESCUENTO')
WHERE LOWER(TRIM(descripcion)) LIKE '%descuento%'
   OR LOWER(TRIM(descripcion)) LIKE '%bonificaci%'
   OR LOWER(TRIM(descripcion)) LIKE '%rebaja%'
   OR monto < 0;

-- 3. Actualizar items con palabras clave de servicios
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
  );

-- 4. Actualizar items con palabras clave de reintegro
UPDATE "ItemRecibo" 
SET "tipoItemId" = (SELECT id FROM "TipoItem" WHERE codigo = 'REINTEGRO')
WHERE "tipoItemId" IS NULL
  AND (
    LOWER(TRIM(descripcion)) LIKE '%reintegro%'
    OR LOWER(TRIM(descripcion)) LIKE '%devoluci%'
  );

-- 5. Los items restantes se marcan como EXTRA
UPDATE "ItemRecibo" 
SET "tipoItemId" = (SELECT id FROM "TipoItem" WHERE codigo = 'EXTRA')
WHERE "tipoItemId" IS NULL;

-- Verificación: Mostrar estadísticas
SELECT 
    ti.nombre as tipo,
    COUNT(*) as cantidad
FROM "ItemRecibo" ir
JOIN "TipoItem" ti ON ir."tipoItemId" = ti.id
GROUP BY ti.nombre, ti.orden
ORDER BY ti.orden;
