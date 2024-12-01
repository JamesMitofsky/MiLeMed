CREATE OR REPLACE FUNCTION public.get_chapters_with_completion(p_mode mode DEFAULT NULL)
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
    COUNT(DISTINCT l.id) AS total_lectures,
    COUNT(DISTINCT qs.lecture_id) AS completed_lectures
  FROM 
    chapters c
  LEFT JOIN 
    lectures l ON l.chapter_id = c.id
  LEFT JOIN 
    quiz_sessions qs ON qs.lecture_id = l.id AND qs.profile_id = auth.uid()
  WHERE
    (p_mode IS NULL OR c.mode = p_mode)
  GROUP BY 
    c.id, c.title, c.mode, c.sort_order -- Include c.sort_order in GROUP BY
  ORDER BY 
    c.sort_order;
$$;