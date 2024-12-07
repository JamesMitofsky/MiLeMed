-- Step 1: Drop outdated methods of counting lecture completions (the old way had no limit for events per lecture)
DROP TRIGGER IF EXISTS quiz_sessions_after_insert_lecture_completed ON public.quiz_sessions;
DROP FUNCTION IF EXISTS insert_lecture_completed_event;

-- Step 1.2: Create a trigger that ensures one 'LECTURE_COMPLETED' event per lecture
-- Trigger fires after a new `quiz_session` is created.

-- Step 1.2.1: Create the function that the trigger will call
CREATE OR REPLACE FUNCTION public.add_lecture_completed_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if a 'LECTURE_COMPLETED' event already exists for the lecture
    IF NOT EXISTS (
        SELECT 1
        FROM lecture_events
        WHERE lecture_id = NEW.lecture_id
          AND profile_id = NEW.profile_id
          AND event_type = 'LECTURE_COMPLETED'
    ) THEN
        -- Insert the 'LECTURE_COMPLETED' event if it doesn't exist
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
    END IF;

    -- Allow the original `quiz_session` insertion to proceed
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 1.2.2: Create the trigger to call the function after inserting a new `quiz_session`
CREATE TRIGGER add_lecture_completed_trigger
AFTER INSERT ON quiz_sessions
FOR EACH ROW
EXECUTE FUNCTION public.add_lecture_completed_event();

BEGIN;

-- Step 2: Add the 'LECTURE_COMPLETED' value to the enum if it doesn't exist
DO $$
BEGIN
   BEGIN
      ALTER TYPE lecture_event_type ADD VALUE 'LECTURE_COMPLETED';
   EXCEPTION
      WHEN duplicate_object THEN
         -- Ignore if the value already exists
   END;
END;
$$;

-- Step 3: Migrate old data to use the 'LECTURE_COMPLETED' event type
INSERT INTO lecture_events (profile_id, lecture_id, event_type, created_at, updated_at)
SELECT 
    profile_id,
    lecture_id,
    'LECTURE_COMPLETED' AS event_type,
    NOW(),
    NOW()
FROM lecture_events old_events
WHERE old_events.event_type IN ('LECTURE_SKIPPED', 'QUIZ_PASSED', 'LECTURE_MARKED_AS_READ')
  AND NOT EXISTS (
    SELECT 1
    FROM lecture_events new_events
    WHERE new_events.lecture_id = old_events.lecture_id
      AND new_events.profile_id = old_events.profile_id
      AND new_events.event_type = 'LECTURE_COMPLETED'
);

-- Step 4: Create function to handle new LECTURE_COMPLETED events
CREATE OR REPLACE FUNCTION public.create_lecture_completed_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Act only on specific event types
  IF NEW.event_type IN ('LECTURE_SKIPPED', 'QUIZ_PASSED', 'LECTURE_MARKED_AS_READ') THEN
    IF NOT EXISTS (
      SELECT 1
      FROM lecture_events
      WHERE lecture_id = NEW.lecture_id
        AND profile_id = NEW.profile_id
        AND event_type = 'LECTURE_COMPLETED'
    ) THEN
      INSERT INTO lecture_events (
        profile_id,
        lecture_id,
        event_type,
        created_at,
        updated_at
      )
      VALUES (
        NEW.profile_id,
        NEW.lecture_id,
        'LECTURE_COMPLETED',
        NOW(),
        NOW()
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Add trigger to create LECTURE_COMPLETED events
CREATE TRIGGER create_lecture_completed_trigger
AFTER INSERT ON lecture_events
FOR EACH ROW
EXECUTE FUNCTION public.create_lecture_completed_event();

-- Step 6: Enable Row Level Security (RLS) and define policies
ALTER TABLE lecture_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user to access their own lecture events"
ON lecture_events
FOR SELECT
USING (profile_id = auth.uid());

CREATE POLICY "Allow user to insert their own lecture events"
ON lecture_events
FOR INSERT
WITH CHECK (profile_id = auth.uid());

-- Step 7: Create function to fetch lecture completion counts
CREATE OR REPLACE FUNCTION public.fetch_lecture_completion_counts()
RETURNS TABLE (
  total_lectures INT,
  completed_lectures INT
)
LANGUAGE plpgsql STABLE AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INT FROM lectures) AS total_lectures, -- Cast COUNT result to INT
        COUNT(DISTINCT le.lecture_id)::INT AS completed_lectures -- Cast COUNT result to INT
    FROM lectures l
    LEFT JOIN lecture_events le 
        ON l.id = le.lecture_id
        AND le.profile_id = auth.uid()
        AND le.event_type = 'LECTURE_COMPLETED';
END;
$$;

COMMIT;




-- Migration of Chapters: Count the total chapters completed by the user
-- 1. Creates or replaces the `fetch_count_of_chapters_completed` function
--    to calculate the total number of chapters and how many are fully completed.
-- 2. Filters data using `auth.uid()` to ensure results are scoped to the authenticated user.

BEGIN;

-- Step 1: Create or replace the function to fetch completed chapters
CREATE OR REPLACE FUNCTION public.fetch_count_of_chapters_completed()
RETURNS TABLE (
  total_chapters INT,
  completed_chapters INT
)
LANGUAGE plpgsql STABLE AS $$
BEGIN
    RETURN QUERY
    WITH lecture_status AS (
        -- Step 1.1: Determine completion status for each lecture
        SELECT
            l.chapter_id,
            l.id AS lecture_id,
            MAX(
                CASE 
                    WHEN le.event_type = 'LECTURE_COMPLETED' THEN 1 
                    ELSE 0 
                END
            ) AS is_completed
        FROM lectures l
        LEFT JOIN lecture_events le
            ON l.id = le.lecture_id
            AND le.profile_id = auth.uid()  -- Filter by current user
        GROUP BY l.chapter_id, l.id
    ),
    chapter_completion AS (
        -- Step 1.2: Aggregate lecture completion data at the chapter level
        SELECT
            ls.chapter_id,
            COUNT(*)::integer AS total_lectures,
            SUM(ls.is_completed)::integer AS completed_lectures
        FROM lecture_status ls
        GROUP BY ls.chapter_id
    )
    -- Step 1.3: Calculate the total and completed chapters
    SELECT
        COUNT(*)::integer AS total_chapters,
        COUNT(CASE WHEN cc.completed_lectures = cc.total_lectures THEN 1 END)::integer AS completed_chapters
    FROM chapter_completion cc;
END;
$$;

COMMIT;