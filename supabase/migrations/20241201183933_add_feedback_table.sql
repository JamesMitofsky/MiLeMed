-- Create the user_feedback table
CREATE TABLE public.user_feedback (
  id SERIAL PRIMARY KEY,
  profile_id UUID NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_user_feedback_profile
    FOREIGN KEY(profile_id) 
    REFERENCES public.profiles(id)
    ON DELETE CASCADE
);

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.set_profile_id()
RETURNS trigger AS $$
BEGIN
  NEW.profile_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER set_profile_id_trigger
BEFORE INSERT ON public.user_feedback
FOR EACH ROW
EXECUTE FUNCTION public.set_profile_id();

-- Enable RLS on the table
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for insert
CREATE POLICY "Allow logged-in users to insert feedback"
ON public.user_feedback
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
