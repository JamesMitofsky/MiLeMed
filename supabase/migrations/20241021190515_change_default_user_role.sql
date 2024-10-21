-- Change the default value of the 'role' column to 'user'
ALTER TABLE profiles
ALTER COLUMN role SET DEFAULT 'user';