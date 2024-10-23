-- Create Enums
DO $$ BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gender') THEN
      CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'OTHER');
   END IF;
END $$;

-- Create Tables
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,  -- Primary key defined inline
    avatar_url TEXT,
    name TEXT,
    about TEXT,
    age INTEGER,
    gender gender,
    semester_number INTEGER,
    role TEXT DEFAULT 'user' NOT NULL
);

-- Enable Row-Level Security (This doesn't have an IF NOT EXISTS equivalent, but you can run it safely)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create Policies
DO $$ BEGIN
   IF NOT EXISTS (SELECT 1 FROM information_schema.policies 
                  WHERE policy_name = 'Public profiles are viewable by everyone.'
                  AND table_name = 'profiles') THEN
      CREATE POLICY "Public profiles are viewable by everyone."
      ON public.profiles FOR SELECT
      USING (true);
   END IF;
END $$;

-- Uncomment this if profiles should be private:
-- DO $$ BEGIN
--    IF NOT EXISTS (SELECT 1 FROM information_schema.policies 
--                   WHERE policy_name = 'Profiles are viewable by users who created them.'
--                   AND table_name = 'profiles') THEN
--       CREATE POLICY "Profiles are viewable by users who created them."
--       ON public.profiles FOR SELECT
--       USING (auth.uid() = id);
--    END IF;
-- END $$;

DO $$ BEGIN
   IF NOT EXISTS (SELECT 1 FROM information_schema.policies 
                  WHERE policy_name = 'Users can insert their own profile.'
                  AND table_name = 'profiles') THEN
      CREATE POLICY "Users can insert their own profile."
      ON public.profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
   END IF;
END $$;

DO $$ BEGIN
   IF NOT EXISTS (SELECT 1 FROM information_schema.policies 
                  WHERE policy_name = 'Users can update own profile.'
                  AND table_name = 'profiles') THEN
      CREATE POLICY "Users can update own profile."
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id);
   END IF;
END $$;

-- Inserts a row into public.profiles when a user is created
DO $$ BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
      CREATE FUNCTION public.handle_new_user()
      RETURNS trigger
      LANGUAGE plpgsql
      SECURITY DEFINER SET search_path = public
      AS $$
      BEGIN
         INSERT INTO public.profiles (id, name, avatar_url, about, age, gender, semester_number, role)
         VALUES (NEW.id, NULL, NULL, NULL, NULL, NULL, NULL, 'user');
         RETURN NEW;
      END;
      $$;
   
      -- Trigger the function every time a user is created
      CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
   END IF;
END $$;
