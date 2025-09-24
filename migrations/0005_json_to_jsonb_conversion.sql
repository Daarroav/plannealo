
-- Migración específica para convertir columnas json a jsonb

-- Para todas las tablas, convertir de json a jsonb si es necesario
DO $$
DECLARE
    table_name text;
    col_type text;
BEGIN
    -- Lista de tablas a procesar
    FOR table_name IN VALUES ('activities'), ('cruises'), ('flights'), ('transports'), ('insurances'), ('notes'), ('accommodations')
    LOOP
        -- Obtener el tipo de dato actual
        SELECT data_type INTO col_type
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = table_name 
        AND column_name = 'attachments';
        
        -- Si existe la columna y es json, convertir a jsonb
        IF col_type = 'json' THEN
            EXECUTE format('ALTER TABLE "%I" ALTER COLUMN "attachments" SET DATA TYPE jsonb USING "attachments"::jsonb', table_name);
            RAISE NOTICE 'Converted % from json to jsonb', table_name;
        ELSIF col_type = 'ARRAY' THEN
            -- Si es array, usar la conversión completa
            EXECUTE format('ALTER TABLE "%I" ADD COLUMN "attachments_temp" jsonb DEFAULT ''[]''::jsonb', table_name);
            
            EXECUTE format('UPDATE "%I" SET "attachments_temp" = CASE 
              WHEN "attachments" IS NULL OR array_length("attachments", 1) IS NULL THEN ''[]''::jsonb
              ELSE (
                SELECT jsonb_agg(
                  jsonb_build_object(
                    ''path'', attachment,
                    ''originalName'', split_part(attachment, ''/'', -1)
                  )
                )
                FROM unnest("attachments") as attachment
              )
            END', table_name);
            
            EXECUTE format('ALTER TABLE "%I" DROP COLUMN "attachments"', table_name);
            EXECUTE format('ALTER TABLE "%I" RENAME COLUMN "attachments_temp" TO "attachments"', table_name);
            RAISE NOTICE 'Converted % from text[] to jsonb', table_name;
        ELSIF col_type = 'jsonb' THEN
            RAISE NOTICE 'Table % already has jsonb type', table_name;
        ELSIF col_type IS NULL THEN
            RAISE NOTICE 'Table % does not have attachments column', table_name;
        ELSE
            RAISE NOTICE 'Table % has unexpected type: %', table_name, col_type;
        END IF;
    END LOOP;
END $$;
