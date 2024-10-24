-- Create a composite index on (lecture_id, event_type) in lecture_events
CREATE INDEX IF NOT EXISTS idx_lecture_events_lecture_id_event_type
ON lecture_events (lecture_id, event_type);

-- Ensure there is an index on lectures.chapter_id (if not already present)
CREATE INDEX IF NOT EXISTS idx_lectures_chapter_id
ON lectures (chapter_id);

-- (Optional) If you frequently filter or join on profile_id in lecture_events and app_events
CREATE INDEX IF NOT EXISTS idx_lecture_events_profile_id
ON lecture_events (profile_id);

CREATE INDEX IF NOT EXISTS idx_app_events_profile_id
ON app_events (profile_id);


-- Create or replace the RPC function to get chapter summaries
CREATE OR REPLACE FUNCTION get_chapter_summary()
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    description TEXT,
    mode mode,
    sort_order INTEGER,
    lecture_count INTEGER,
    lectures_completed INTEGER
)
LANGUAGE sql
AS $$
    SELECT 
        c.id,
        c.title,
        c.description,
        c.mode,
        c.sort_order,
        COUNT(l.id) AS lecture_count,
        COUNT(DISTINCT CASE 
            WHEN le.event_type IN ('QUIZ_PASSED', 'LECTURE_SKIPPED') THEN l.id 
            ELSE NULL 
        END) AS lectures_completed
    FROM 
        chapters c
    LEFT JOIN 
        lectures l ON l.chapter_id = c.id
    LEFT JOIN 
        lecture_events le ON le.lecture_id = l.id 
                         AND le.event_type IN ('QUIZ_PASSED', 'LECTURE_SKIPPED')
    GROUP BY 
        c.id, c.title, c.description, c.mode, c.sort_order
    ORDER BY 
        c.sort_order ASC;
$$;
