
-- Migración para convertir attachments de text[] a jsonb preservando datos existentes

-- Para la tabla activities
ALTER TABLE "activities" ADD COLUMN "attachments_temp" jsonb DEFAULT '[]'::jsonb;

-- Convertir datos existentes de text[] a jsonb
UPDATE "activities" 
SET "attachments_temp" = CASE 
  WHEN "attachments" IS NULL OR array_length("attachments", 1) IS NULL THEN '[]'::jsonb
  ELSE (
    SELECT jsonb_agg(
      jsonb_build_object(
        'path', attachment,
        'originalName', split_part(attachment, '/', -1) || '.pdf'
      )
    )
    FROM unnest("attachments") as attachment
  )
END;

-- Eliminar columna antigua y renombrar la nueva
ALTER TABLE "activities" DROP COLUMN "attachments";
ALTER TABLE "activities" RENAME COLUMN "attachments_temp" TO "attachments";

-- Para la tabla cruises
ALTER TABLE "cruises" ADD COLUMN "attachments_temp" jsonb DEFAULT '[]'::jsonb;

UPDATE "cruises" 
SET "attachments_temp" = CASE 
  WHEN "attachments" IS NULL OR array_length("attachments", 1) IS NULL THEN '[]'::jsonb
  ELSE (
    SELECT jsonb_agg(
      jsonb_build_object(
        'path', attachment,
        'originalName', split_part(attachment, '/', -1) || '.pdf'
      )
    )
    FROM unnest("attachments") as attachment
  )
END;

ALTER TABLE "cruises" DROP COLUMN "attachments";
ALTER TABLE "cruises" RENAME COLUMN "attachments_temp" TO "attachments";

-- Para la tabla flights
ALTER TABLE "flights" ADD COLUMN "attachments_temp" jsonb DEFAULT '[]'::jsonb;

UPDATE "flights" 
SET "attachments_temp" = CASE 
  WHEN "attachments" IS NULL OR array_length("attachments", 1) IS NULL THEN '[]'::jsonb
  ELSE (
    SELECT jsonb_agg(
      jsonb_build_object(
        'path', attachment,
        'originalName', split_part(attachment, '/', -1) || '.pdf'
      )
    )
    FROM unnest("attachments") as attachment
  )
END;

ALTER TABLE "flights" DROP COLUMN "attachments";
ALTER TABLE "flights" RENAME COLUMN "attachments_temp" TO "attachments";

-- Para la tabla transports
ALTER TABLE "transports" ADD COLUMN "attachments_temp" jsonb DEFAULT '[]'::jsonb;

UPDATE "transports" 
SET "attachments_temp" = CASE 
  WHEN "attachments" IS NULL OR array_length("attachments", 1) IS NULL THEN '[]'::jsonb
  ELSE (
    SELECT jsonb_agg(
      jsonb_build_object(
        'path', attachment,
        'originalName', split_part(attachment, '/', -1) || '.pdf'
      )
    )
    FROM unnest("attachments") as attachment
  )
END;

ALTER TABLE "transports" DROP COLUMN "attachments";
ALTER TABLE "transports" RENAME COLUMN "attachments_temp" TO "attachments";
