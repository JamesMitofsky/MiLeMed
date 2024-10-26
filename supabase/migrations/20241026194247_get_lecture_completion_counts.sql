CREATE OR REPLACE FUNCTION get_lecture_completion_counts(user_id UUID)
RETURNS TABLE (total_lectures BIGINT, completed_lectures BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM lectures) AS total_lectures,  -- Total number of lectures (returns BIGINT)
        COUNT(DISTINCT le.lecture_id) AS completed_lectures -- Count of distinct completed lectures (returns BIGINT)
    FROM 
        lectures l
    LEFT JOIN lecture_events le 
        ON l.id = le.lecture_id
        AND le.profile_id = user_id 
        AND le.event_type IN ('LECTURE_SKIPPED', 'QUIZ_PASSED');
END;
$$ LANGUAGE plpgsql;
