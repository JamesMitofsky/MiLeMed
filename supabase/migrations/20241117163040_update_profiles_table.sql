-- Start transaction
BEGIN;

-- Step 1: Add new columns
ALTER TABLE profiles
ADD COLUMN birthDate DATE;

ALTER TABLE profiles
ADD COLUMN overall_semester INTEGER;

ALTER TABLE profiles
ADD COLUMN clinical_semester INTEGER;

-- Step 3: Drop old columns
ALTER TABLE profiles
DROP COLUMN age;

ALTER TABLE profiles
DROP COLUMN semester_number;

ALTER TABLE profiles
DROP COLUMN avatar_url;

-- Commit transaction
COMMIT;
