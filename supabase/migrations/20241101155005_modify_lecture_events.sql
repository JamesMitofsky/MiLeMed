ALTER TYPE lecture_event_type ADD VALUE 'QUIZ_PASSED';

CREATE OR REPLACE FUNCTION get_chapter_completion_counts()
RETURNS TABLE (total_chapters INTEGER, completed_chapters INTEGER)
AS $$
BEGIN
    RETURN QUERY
    WITH lecture_status AS (
        SELECT
            l.chapter_id,
            l.id AS lecture_id,
            MAX(
                CASE 
                    WHEN le.event_type IN ('LECTURE_SKIPPED', 'QUIZ_PASSED') THEN 1 
                    ELSE 0 
                END
            ) AS is_completed
        FROM lectures l
        LEFT JOIN lecture_events le ON l.id = le.lecture_id
        GROUP BY l.chapter_id, l.id
    ),
    chapter_completion AS (
        SELECT
            ls.chapter_id,
            COUNT(*)::integer AS total_lectures,
            SUM(ls.is_completed)::integer AS completed_lectures
        FROM lecture_status ls
        GROUP BY ls.chapter_id
    )
    SELECT
        COUNT(*)::integer AS total_chapters,
        COUNT(CASE WHEN cc.completed_lectures = cc.total_lectures THEN 1 END)::integer AS completed_chapters
    FROM chapter_completion cc;
END;
$$ LANGUAGE plpgsql;
