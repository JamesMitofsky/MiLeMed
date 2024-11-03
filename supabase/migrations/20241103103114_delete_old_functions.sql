-- Example: Delete function without parameters
DROP FUNCTION IF EXISTS get_chapter_summary();

-- Delete function with one parameter (user_id uuid)
DROP FUNCTION IF EXISTS get_chapter_summary(user_id uuid);

-- Delete function with two parameters (user_id uuid, theoretical boolean)
DROP FUNCTION IF EXISTS get_chapter_summary(user_id uuid, theoretical boolean);

DROP FUNCTION IF EXISTS get_chapter_completion_counts();
