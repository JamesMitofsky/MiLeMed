CREATE OR REPLACE FUNCTION public.get_lectures_with_completion(
  p_chapter_id INT
)
RETURNS TABLE (
  id INT,
  title TEXT,
  chapter_id INT,
  sort_order INT,
  is_completed BOOLEAN
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lectures.id,
    lectures.title,
    lectures.chapter_id,
    lectures.sort_order,
    EXISTS (
      SELECT 1 
      FROM quiz_sessions 
      WHERE quiz_sessions.lecture_id = lectures.id 
        AND quiz_sessions.profile_id = auth.uid()
    ) AS is_completed
  FROM 
    lectures
  WHERE 
    lectures.chapter_id = p_chapter_id
  ORDER BY 
    lectures.sort_order ASC;
END;
$$;
