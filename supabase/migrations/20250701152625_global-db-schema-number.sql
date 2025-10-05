-- Create a table to track the database schema version
CREATE TABLE IF NOT EXISTS public.db_version (
    version TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (version)
);

-- Insert the initial version
INSERT INTO public.db_version (version) VALUES ('1.0');

-- Add comment to the table
COMMENT ON TABLE public.db_version IS 'Tracks the current version of the database schema';
