CREATE TABLE public.user_feedback (
  id SERIAL PRIMARY KEY, -- Auto-incremented integer primary key
  profile_id UUID NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT fk_user_feedback_profile
    FOREIGN KEY(profile_id) 
    REFERENCES public.profiles(id)
    ON DELETE CASCADE
);
