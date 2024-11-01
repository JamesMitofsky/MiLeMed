CREATE OR REPLACE FUNCTION get_chapter_completion_counts(user_id UUID)
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
                    WHEN le.event_type IN ('LECTURE_SKIPPED', 'QUIZ_PASSED', 'LECTURE_MARKED_AS_READ') THEN 1 
                    ELSE 0 
                END
            ) AS is_completed
        FROM lectures l
        LEFT JOIN lecture_events le 
            ON l.id = le.lecture_id
            AND le.profile_id = user_id  -- Filter events for the current user
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


CREATE OR REPLACE FUNCTION get_lecture_completion_counts(user_id UUID)
RETURNS TABLE (total_lectures BIGINT, completed_lectures BIGINT)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM lectures) AS total_lectures,  -- Total number of lectures
        COUNT(DISTINCT le.lecture_id) AS completed_lectures -- Count of distinct completed lectures
    FROM 
        lectures l
    LEFT JOIN lecture_events le 
        ON l.id = le.lecture_id
        AND le.profile_id = user_id 
        AND le.event_type IN ('LECTURE_SKIPPED', 'QUIZ_PASSED', 'LECTURE_MARKED_AS_READ');
END;
$$ LANGUAGE plpgsql;
