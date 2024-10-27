-- Drop the view from the last migration
DROP VIEW IF EXISTS all_sorted_lectures;

-- Replace the view with a function that will be type safe
CREATE OR REPLACE FUNCTION get_all_sorted_lectures()
RETURNS TABLE (
    lecture_id INTEGER,
    lecture_title TEXT,
    lecture_content TEXT,
    lecture_sort_order INTEGER,
    chapter_id INTEGER,
    chapter_title TEXT,
    chapter_sort_order INTEGER
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
        c.sort_order AS chapter_sort_order
    FROM 
        lectures l
    JOIN 
        chapters c ON l.chapter_id = c.id
    ORDER BY 
        c.sort_order ASC, 
        l.sort_order ASC;
END;
$$ LANGUAGE plpgsql;