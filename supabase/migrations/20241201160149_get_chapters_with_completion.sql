CREATE OR REPLACE FUNCTION public.get_chapters_with_completion(mode mode DEFAULT NULL)
RETURNS TABLE (
  id INT,
  title TEXT,
  total_lectures INT,
  completed_lectures INT
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    c.id AS id,
    c.title AS title,
    COUNT(l.id) AS total_lectures,
    COUNT(qs.session_id) AS completed_lectures
  FROM 
    chapters c
  LEFT JOIN 
    lectures l ON l.chapter_id = c.id
  LEFT JOIN 
    quiz_sessions qs ON qs.lecture_id = l.id AND qs.profile_id = auth.uid()
  WHERE
    (mode IS NULL OR c.mode = mode)
  GROUP BY 
    c.id, c.title
  ORDER BY 
    c.id;
$$;
