CREATE OR REPLACE FUNCTION get_chapter_summary(user_id UUID, chapter_mode mode DEFAULT NULL)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    description TEXT,
    mode mode,  -- Using the `mode` enum type
    sort_order INTEGER,
    lecture_count INTEGER,
    lectures_completed INTEGER
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.title,
        c.description,
        c.mode,
        c.sort_order,
        COUNT(l.id)::INTEGER AS lecture_count,  -- Cast to INTEGER
        COUNT(DISTINCT CASE 
            WHEN le.event_type IN ('QUIZ_PASSED', 'LECTURE_SKIPPED', 'LECTURE_MARKED_AS_READ') THEN l.id 
            ELSE NULL 
        END)::INTEGER AS lectures_completed  -- Cast to INTEGER
    FROM 
        chapters c
    LEFT JOIN 
        lectures l ON l.chapter_id = c.id
    LEFT JOIN 
        lecture_events le ON le.lecture_id = l.id 
                         AND le.profile_id = user_id  -- Filter by current user
                         AND le.event_type IN ('QUIZ_PASSED', 'LECTURE_SKIPPED', 'LECTURE_MARKED_AS_READ')
    WHERE 
        (chapter_mode IS NULL OR c.mode = chapter_mode)  -- Apply filter only if chapter_mode is provided
    GROUP BY 
        c.id, c.title, c.description, c.mode, c.sort_order
    ORDER BY 
        c.sort_order ASC;
END;
$$ LANGUAGE plpgsql;
