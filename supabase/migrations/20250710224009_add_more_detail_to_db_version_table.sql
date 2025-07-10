-- Add title and description columns to db_version table
ALTER TABLE public.db_version ADD COLUMN title TEXT;
COMMENT ON COLUMN public.db_version.title IS 'Title of the database version';

ALTER TABLE public.db_version ADD COLUMN description TEXT;
COMMENT ON COLUMN public.db_version.description IS 'Detailed description of changes in this database version';

-- Update comment on the table to reflect new purpose
COMMENT ON TABLE public.db_version IS 'Tracks database versions with titles and descriptions';
