-- Drop the function from the last migration
DROP FUNCTION IF EXISTS get_all_sorted_lectures;

-- Create or replace the function with an updated version that includes chapter mode
CREATE OR REPLACE FUNCTION get_all_sorted_lectures()
RETURNS TABLE (
    lecture_id INTEGER,
    lecture_title TEXT,
    lecture_content TEXT,
    lecture_sort_order INTEGER,
    chapter_id INTEGER,
    chapter_title TEXT,
    chapter_sort_order INTEGER,
    chapter_mode mode
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id AS lecture_id,
        l.title AS lecture_title,
        l.content AS lecture_content,
        l.sort_order AS lecture_sort_order,
        l.chapter_id AS chapter_id,
        c.title AS chapter_title,
        c.sort_order AS chapter_sort_order,
        c.mode AS chapter_mode
    FROM 
        lectures l
    JOIN 
        chapters c ON l.chapter_id = c.id
    ORDER BY 
        c.sort_order ASC, 
        l.sort_order ASC;
END;
$$ LANGUAGE plpgsql;
