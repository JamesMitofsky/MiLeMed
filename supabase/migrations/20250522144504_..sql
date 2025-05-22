BEGIN;

------------------------------------------------------------------------
-- 1. Lecture completion now driven solely by QUIZ_PASSED events
------------------------------------------------------------------------

-- lecture_get_completion_counts
CREATE OR REPLACE FUNCTION lecture_get_completion_counts(user_id UUID DEFAULT NULL)
RETURNS TABLE (
  total_lectures BIGINT,
  completed_lectures BIGINT
)
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := COALESCE(user_id, auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user ID provided or authenticated';
  END IF;

  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM content_lectures) AS total_lectures,
    COUNT(DISTINCT lecture_id) AS completed_lectures
  FROM system_events
  WHERE profile_id    = v_user_id
    AND event_type    = 'QUIZ_PASSED'
    AND lecture_id IS NOT NULL;
END;
$$;

-- lecture_get_with_completion
CREATE OR REPLACE FUNCTION lecture_get_with_completion(p_chapter_id INTEGER)
RETURNS TABLE (
  id INTEGER,
  title TEXT,
  chapter_id INTEGER,
  sort_order INTEGER,
  is_completed BOOLEAN
)
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.title,
    l.chapter_id,
    l.sort_order,
    EXISTS (
      SELECT 1
      FROM system_events ue
      WHERE ue.lecture_id   = l.id
        AND ue.profile_id   = auth.uid()
        AND ue.event_type   = 'QUIZ_PASSED'
    ) AS is_completed
  FROM content_lectures l
  WHERE l.chapter_id = p_chapter_id
  ORDER BY l.sort_order ASC;
END;
$$;

-- lecture_get_by_id
CREATE OR REPLACE FUNCTION lecture_get_by_id(p_lecture_id INTEGER)
RETURNS TABLE (
  id            INTEGER,
  title         TEXT,
  content       TEXT,
  chapter_id    INTEGER,
  chapter_title TEXT,
  chapter_mode  mode,
  sort_order    INTEGER,
  is_completed  BOOLEAN
)
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.title,
    l.content,
    l.chapter_id,
    c.title        AS chapter_title,
    c.mode         AS chapter_mode,
    l.sort_order,
    EXISTS (
      SELECT 1
      FROM system_events se
      WHERE se.lecture_id = l.id
        AND se.profile_id = auth.uid()
        AND se.event_type = 'QUIZ_PASSED'
    ) AS is_completed
  FROM content_lectures l
  JOIN content_chapters c ON l.chapter_id = c.id
  WHERE l.id = p_lecture_id;
END;
$$;

------------------------------------------------------------------------
-- 2. Chapter summary: count lectures completed by QUIZ_PASSED
------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION chapter_get_summary(
  user_id UUID DEFAULT NULL,
  chapter_mode mode DEFAULT NULL
)
RETURNS TABLE (
  id                INTEGER,
  title             TEXT,
  description       TEXT,
  mode              mode,
  sort_order        INTEGER,
  lecture_count     INTEGER,
  lectures_completed INTEGER
)
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := COALESCE(user_id, auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user ID provided or authenticated';
  END IF;

  RETURN QUERY
  SELECT
    c.id,
    c.title,
    c.description,
    c.mode,
    c.sort_order,
    COUNT(l.id)::INTEGER AS lecture_count,
    COUNT(DISTINCT ue.lecture_id)::INTEGER AS lectures_completed
  FROM content_chapters c
  LEFT JOIN content_lectures l ON l.chapter_id = c.id
  LEFT JOIN system_events ue
    ON ue.lecture_id = l.id
   AND ue.event_type  = 'QUIZ_PASSED'
   AND ue.profile_id  = v_user_id
  WHERE (chapter_mode IS NULL OR c.mode = chapter_mode)
  GROUP BY c.id, c.title, c.description, c.mode, c.sort_order
  ORDER BY c.sort_order ASC;
END;
$$;

------------------------------------------------------------------------
-- 3. Overall user stats: base completion on QUIZ_PASSED
------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION user_get_completion_stats(user_id UUID DEFAULT NULL)
RETURNS TABLE (
  total_chapters      INTEGER,
  completed_chapters  INTEGER,
  total_lectures      INTEGER,
  completed_lectures  INTEGER,
  completion_percentage NUMERIC
)
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := COALESCE(user_id, auth.uid());
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user ID provided or authenticated';
  END IF;

  RETURN QUERY
  WITH lecture_completions AS (
    SELECT
      l.id AS lecture_id,
      l.chapter_id,
      EXISTS (
        SELECT 1
        FROM system_events ue
        WHERE ue.lecture_id = l.id
          AND ue.profile_id = v_user_id
          AND ue.event_type = 'QUIZ_PASSED'
      ) AS is_completed
    FROM content_lectures l
  ),
  chapter_stats AS (
    SELECT
      c.id AS chapter_id,
      COUNT(lc.lecture_id) AS total_lectures,
      COUNT(lc.lecture_id) FILTER (WHERE lc.is_completed) AS completed_lectures,
      CASE
        WHEN COUNT(lc.lecture_id) > 0
        THEN COUNT(lc.lecture_id) FILTER (WHERE lc.is_completed) = COUNT(lc.lecture_id)
        ELSE FALSE
      END AS is_completed
    FROM content_chapters c
    LEFT JOIN lecture_completions lc ON c.id = lc.chapter_id
    GROUP BY c.id
  )
  SELECT
    COUNT(*)::INTEGER AS total_chapters,
    COUNT(*) FILTER (WHERE cs.is_completed)::INTEGER AS completed_chapters,
    SUM(cs.total_lectures)::INTEGER AS total_lectures,
    SUM(cs.completed_lectures)::INTEGER AS completed_lectures,
    CASE
      WHEN SUM(cs.total_lectures) > 0
      THEN ROUND((SUM(cs.completed_lectures) * 100.0 / SUM(cs.total_lectures)), 1)
      ELSE 0
    END AS completion_percentage
  FROM chapter_stats cs;
END;
$$;

COMMIT;
