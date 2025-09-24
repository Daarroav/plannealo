
-- Migración para manejar conversión de attachments donde algunas columnas ya son json y otras text[]

-- Para la tabla activities
DO $$
DECLARE
    col_type text;
BEGIN
    SELECT data_type INTO col_type
    FROM information_schema.columns 
    WHERE table_name = 'activities' AND column_name = 'attachments';
    
    IF col_type = 'ARRAY' THEN
        -- Es text[], convertir a jsonb
        ALTER TABLE "activities" ADD COLUMN "attachments_temp" jsonb DEFAULT '[]'::jsonb;
        
        UPDATE "activities" 
        SET "attachments_temp" = CASE 
          WHEN "attachments" IS NULL OR array_length("attachments", 1) IS NULL THEN '[]'::jsonb
          ELSE (
            SELECT jsonb_agg(
              jsonb_build_object(
                'path', attachment,
                'originalName', split_part(attachment, '/', -1)
              )
            )
            FROM unnest("attachments") as attachment
          )
        END;
        
        ALTER TABLE "activities" DROP COLUMN "attachments";
        ALTER TABLE "activities" RENAME COLUMN "attachments_temp" TO "attachments";
    ELSIF col_type = 'json' THEN
        -- Ya es json, convertir a jsonb
        ALTER TABLE "activities" ALTER COLUMN "attachments" SET DATA TYPE jsonb USING "attachments"::jsonb;
    END IF;
END $$;

-- Para la tabla cruises
DO $$
DECLARE
    col_type text;
BEGIN
    SELECT data_type INTO col_type
    FROM information_schema.columns 
    WHERE table_name = 'cruises' AND column_name = 'attachments';
    
    IF col_type = 'ARRAY' THEN
        ALTER TABLE "cruises" ADD COLUMN "attachments_temp" jsonb DEFAULT '[]'::jsonb;
        
        UPDATE "cruises" 
        SET "attachments_temp" = CASE 
          WHEN "attachments" IS NULL OR array_length("attachments", 1) IS NULL THEN '[]'::jsonb
          ELSE (
            SELECT jsonb_agg(
              jsonb_build_object(
                'path', attachment,
                'originalName', split_part(attachment, '/', -1)
              )
            )
            FROM unnest("attachments") as attachment
          )
        END;
        
        ALTER TABLE "cruises" DROP COLUMN "attachments";
        ALTER TABLE "cruises" RENAME COLUMN "attachments_temp" TO "attachments";
    ELSIF col_type = 'json' THEN
        ALTER TABLE "cruises" ALTER COLUMN "attachments" SET DATA TYPE jsonb USING "attachments"::jsonb;
    END IF;
END $$;

-- Para la tabla flights
DO $$
DECLARE
    col_type text;
BEGIN
    SELECT data_type INTO col_type
    FROM information_schema.columns 
    WHERE table_name = 'flights' AND column_name = 'attachments';
    
    IF col_type = 'ARRAY' THEN
        ALTER TABLE "flights" ADD COLUMN "attachments_temp" jsonb DEFAULT '[]'::jsonb;
        
        UPDATE "flights" 
        SET "attachments_temp" = CASE 
          WHEN "attachments" IS NULL OR array_length("attachments", 1) IS NULL THEN '[]'::jsonb
          ELSE (
            SELECT jsonb_agg(
              jsonb_build_object(
                'path', attachment,
                'originalName', split_part(attachment, '/', -1)
              )
            )
            FROM unnest("attachments") as attachment
          )
        END;
        
        ALTER TABLE "flights" DROP COLUMN "attachments";
        ALTER TABLE "flights" RENAME COLUMN "attachments_temp" TO "attachments";
    ELSIF col_type = 'json' THEN
        ALTER TABLE "flights" ALTER COLUMN "attachments" SET DATA TYPE jsonb USING "attachments"::jsonb;
    END IF;
END $$;

-- Para la tabla transports
DO $$
DECLARE
    col_type text;
BEGIN
    SELECT data_type INTO col_type
    FROM information_schema.columns 
    WHERE table_name = 'transports' AND column_name = 'attachments';
    
    IF col_type = 'ARRAY' THEN
        ALTER TABLE "transports" ADD COLUMN "attachments_temp" jsonb DEFAULT '[]'::jsonb;
        
        UPDATE "transports" 
        SET "attachments_temp" = CASE 
          WHEN "attachments" IS NULL OR array_length("attachments", 1) IS NULL THEN '[]'::jsonb
          ELSE (
            SELECT jsonb_agg(
              jsonb_build_object(
                'path', attachment,
                'originalName', split_part(attachment, '/', -1)
              )
            )
            FROM unnest("attachments") as attachment
          )
        END;
        
        ALTER TABLE "transports" DROP COLUMN "attachments";
        ALTER TABLE "transports" RENAME COLUMN "attachments_temp" TO "attachments";
    ELSIF col_type = 'json' THEN
        ALTER TABLE "transports" ALTER COLUMN "attachments" SET DATA TYPE jsonb USING "attachments"::jsonb;
    END IF;
END $$;

-- Para la tabla insurances
DO $$
DECLARE
    col_type text;
BEGIN
    SELECT data_type INTO col_type
    FROM information_schema.columns 
    WHERE table_name = 'insurances' AND column_name = 'attachments';
    
    IF col_type = 'ARRAY' THEN
        ALTER TABLE "insurances" ADD COLUMN "attachments_temp" jsonb DEFAULT '[]'::jsonb;
        
        UPDATE "insurances" 
        SET "attachments_temp" = CASE 
          WHEN "attachments" IS NULL OR array_length("attachments", 1) IS NULL THEN '[]'::jsonb
          ELSE (
            SELECT jsonb_agg(
              jsonb_build_object(
                'path', attachment,
                'originalName', split_part(attachment, '/', -1)
              )
            )
            FROM unnest("attachments") as attachment
          )
        END;
        
        ALTER TABLE "insurances" DROP COLUMN "attachments";
        ALTER TABLE "insurances" RENAME COLUMN "attachments_temp" TO "attachments";
    ELSIF col_type = 'json' THEN
        ALTER TABLE "insurances" ALTER COLUMN "attachments" SET DATA TYPE jsonb USING "attachments"::jsonb;
    END IF;
END $$;

-- Para la tabla notes
DO $$
DECLARE
    col_type text;
BEGIN
    SELECT data_type INTO col_type
    FROM information_schema.columns 
    WHERE table_name = 'notes' AND column_name = 'attachments';
    
    IF col_type = 'ARRAY' THEN
        ALTER TABLE "notes" ADD COLUMN "attachments_temp" jsonb DEFAULT '[]'::jsonb;
        
        UPDATE "notes" 
        SET "attachments_temp" = CASE 
          WHEN "attachments" IS NULL OR array_length("attachments", 1) IS NULL THEN '[]'::jsonb
          ELSE (
            SELECT jsonb_agg(
              jsonb_build_object(
                'path', attachment,
                'originalName', split_part(attachment, '/', -1)
              )
            )
            FROM unnest("attachments") as attachment
          )
        END;
        
        ALTER TABLE "notes" DROP COLUMN "attachments";
        ALTER TABLE "notes" RENAME COLUMN "attachments_temp" TO "attachments";
    ELSIF col_type = 'json' THEN
        ALTER TABLE "notes" ALTER COLUMN "attachments" SET DATA TYPE jsonb USING "attachments"::jsonb;
    END IF;
END $$;

-- Para la tabla accommodations
DO $$
DECLARE
    col_type text;
BEGIN
    SELECT data_type INTO col_type
    FROM information_schema.columns 
    WHERE table_name = 'accommodations' AND column_name = 'attachments';
    
    IF col_type = 'ARRAY' THEN
        ALTER TABLE "accommodations" ADD COLUMN "attachments_temp" jsonb DEFAULT '[]'::jsonb;
        
        UPDATE "accommodations" 
        SET "attachments_temp" = CASE 
          WHEN "attachments" IS NULL OR array_length("attachments", 1) IS NULL THEN '[]'::jsonb
          ELSE (
            SELECT jsonb_agg(
              jsonb_build_object(
                'path', attachment,
                'originalName', split_part(attachment, '/', -1)
              )
            )
            FROM unnest("attachments") as attachment
          )
        END;
        
        ALTER TABLE "accommodations" DROP COLUMN "attachments";
        ALTER TABLE "accommodations" RENAME COLUMN "attachments_temp" TO "attachments";
    ELSIF col_type = 'json' THEN
        ALTER TABLE "accommodations" ALTER COLUMN "attachments" SET DATA TYPE jsonb USING "attachments"::jsonb;
    END IF;
END $$;
