-- Function to get a single lecture by ID with additional details
CREATE OR REPLACE FUNCTION lecture_get_by_id(p_lecture_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    content TEXT,
    chapter_id INTEGER,
    chapter_title TEXT,
    chapter_mode mode,
    sort_order INTEGER,
    is_completed BOOLEAN
)
LANGUAGE plpgsql STABLE
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.title,
        l.content,
        l.chapter_id,
        c.title AS chapter_title,
        c.mode AS chapter_mode,
        l.sort_order,
        EXISTS (
            SELECT 1 
            FROM system_events se
            WHERE se.lecture_id = l.id 
              AND se.profile_id = auth.uid()
              AND se.event_type = 'LECTURE_COMPLETED'
        ) AS is_completed
    FROM 
        content_lectures l
    JOIN 
        content_chapters c ON l.chapter_id = c.id
    WHERE 
        l.id = p_lecture_id;
END;
$$;