-- STEP ONE: drop unnecessary columns
ALTER TABLE lecture_events
DROP COLUMN description;
COMMIT;

-- STEP TWO: add a new event type
ALTER TYPE lecture_event_type
ADD VALUE 'LECTURE_COMPLETED';
COMMIT;

-- STEP THREE: create the function and trigger in a new transaction
CREATE OR REPLACE FUNCTION public.insert_lecture_completed_event()
RETURNS trigger AS $$
BEGIN
  INSERT INTO lecture_events (
    profile_id,
    lecture_id,
    event_type,
    created_at,
    updated_at
  ) VALUES (
    NEW.profile_id,
    NEW.lecture_id,
    'LECTURE_COMPLETED',
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
COMMIT;

CREATE TRIGGER quiz_sessions_after_insert_lecture_completed
AFTER INSERT ON quiz_sessions
FOR EACH ROW
EXECUTE PROCEDURE public.insert_lecture_completed_event();
COMMIT;

-- STEP FIVE: update the function to use lecture_events in a new transaction
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
    COUNT(DISTINCT le.lecture_id) AS completed_lectures
  FROM chapters c
  LEFT JOIN lectures l ON l.chapter_id = c.id
  LEFT JOIN lecture_events le
    ON le.lecture_id = l.id
    AND le.profile_id = auth.uid()
    AND le.event_type = 'LECTURE_COMPLETED'
  WHERE (p_mode IS NULL OR c.mode = p_mode)
  GROUP BY c.id, c.title, c.mode, c.sort_order
  ORDER BY c.sort_order;
$$;
COMMIT;
