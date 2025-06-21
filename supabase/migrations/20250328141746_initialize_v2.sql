-- ============================================
-- Improved Schema with Better Naming Conventions
-- ============================================

-- Start Transaction
BEGIN;

-- ============================================
-- Create Enum Types
-- ============================================
CREATE TYPE mode AS ENUM ('THEORETICAL', 'PRACTICAL');
CREATE TYPE question_type AS ENUM ('OPEN', 'MULTIPLE_CHOICE');
CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE user_role AS ENUM ('ADMIN', 'MEDICAL_PROFESSIONAL', 'STUDENT', 'STUDENT_TESTER');
CREATE TYPE event_type AS ENUM (
    -- Lecture events
    'LECTURE_VIEWED',
    'LECTURE_COMPLETED',
    'LECTURE_SKIPPED',
    
    -- Quiz events
    'QUIZ_STARTED',
    'QUIZ_COMPLETED',
    'QUIZ_PASSED',
    'QUIZ_FAILED',
    'QUESTION_ANSWERED',
    
    -- Navigation events
    'PAGE_VIEWED',
    'SEARCH_PERFORMED',
    
    -- User events
    'USER_REGISTERED',
    'USER_LOGGED_IN',
    'USER_LOGGED_OUT',
    'PROFILE_UPDATED',
    
    -- System events
    'ERROR_OCCURRED',
    'FEEDBACK_SUBMITTED'
);

-- ============================================
-- Create Core Content Tables
-- ============================================

-- Chapters
CREATE TABLE content_chapters (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mode mode NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT unique_chapter_order UNIQUE (sort_order)
);

-- Lectures
CREATE TABLE content_lectures (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    chapter_id INTEGER NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (chapter_id) REFERENCES content_chapters (id) ON DELETE CASCADE,
    CONSTRAINT unique_lecture_order UNIQUE (chapter_id, sort_order)
);

-- ============================================
-- Create User Tables
-- ============================================

-- Profiles
CREATE TABLE users_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    about TEXT,
    gender gender,
    birthdate DATE,
    overall_semester INTEGER,
    clinical_semester INTEGER,
    role user_role,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Feedback
CREATE TABLE users_feedback (
    id SERIAL PRIMARY KEY,
    profile_id UUID NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_user_feedback_profile
        FOREIGN KEY(profile_id) 
        REFERENCES users_profiles(id)
        ON DELETE CASCADE
);

-- ============================================
-- Create Quiz System Tables
-- ============================================

-- Quiz Questions
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    lecture_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type question_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lecture_id) REFERENCES content_lectures(id) ON DELETE CASCADE
);

-- Quiz Question Options (for multiple-choice questions)
CREATE TABLE quiz_options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,
    option_text TEXT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);

-- Reference Answers (stores correct answers for all question types)
CREATE TABLE quiz_reference_answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    answer_type TEXT NOT NULL, -- 'OPTION' or 'TEXT'
    option_id INTEGER REFERENCES quiz_options(id) ON DELETE CASCADE,
    answer_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Ensure that the answer format matches the expected type
    CONSTRAINT valid_answer_format CHECK (
        (answer_type = 'OPTION' AND option_id IS NOT NULL AND answer_text IS NULL) OR
        (answer_type = 'TEXT' AND option_id IS NULL AND answer_text IS NOT NULL)
    )
);

-- User Quiz Answers (store user responses)
CREATE TABLE quiz_user_answers (
    id SERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    answer_text TEXT, -- For open-ended questions
    chosen_option_ids INTEGER[], -- Array of selected option IDs for multiple-choice
    is_correct BOOLEAN, -- Whether the answer was correct
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one of answer_text or chosen_option_ids is set based on question type
    CONSTRAINT valid_answer_format CHECK (
        (answer_text IS NOT NULL AND chosen_option_ids IS NULL) OR
        (answer_text IS NULL AND chosen_option_ids IS NOT NULL)
    )
);

-- ============================================
-- Create Event Tracking Table
-- ============================================

-- Unified events table with specific resource references
CREATE TABLE system_events (
    id SERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type event_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Specific resource foreign keys
    lecture_id INTEGER REFERENCES content_lectures(id) ON DELETE SET NULL,
    chapter_id INTEGER REFERENCES content_chapters(id) ON DELETE SET NULL,
    quiz_question_id INTEGER REFERENCES quiz_questions(id) ON DELETE SET NULL,
    
    -- Only one resource ID should be populated per row
    CONSTRAINT one_resource_reference CHECK (
        (CASE WHEN lecture_id IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN chapter_id IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN quiz_question_id IS NOT NULL THEN 1 ELSE 0 END)
        <= 1
    ),
    
    -- Additional context as JSONB
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================
-- Create Indexes
-- ============================================

-- Core indexes
CREATE INDEX idx_content_lectures_chapter_id ON content_lectures (chapter_id);

-- Quiz system indexes
CREATE INDEX idx_quiz_questions_lecture_id ON quiz_questions (lecture_id);
CREATE INDEX idx_quiz_options_question_id ON quiz_options (question_id);
CREATE INDEX idx_quiz_reference_answers_question_id ON quiz_reference_answers (question_id);
CREATE INDEX idx_quiz_reference_answers_option_id ON quiz_reference_answers (option_id) WHERE option_id IS NOT NULL;
CREATE INDEX idx_quiz_user_answers_profile_id ON quiz_user_answers (profile_id);
CREATE INDEX idx_quiz_user_answers_question_id ON quiz_user_answers (question_id);

-- Event tracking indexes
CREATE INDEX idx_system_events_profile_id ON system_events (profile_id);
CREATE INDEX idx_system_events_event_type ON system_events (event_type);
CREATE INDEX idx_system_events_lecture_id ON system_events (lecture_id) WHERE lecture_id IS NOT NULL;
CREATE INDEX idx_system_events_chapter_id ON system_events (chapter_id) WHERE chapter_id IS NOT NULL;
CREATE INDEX idx_system_events_quiz_question_id ON system_events (quiz_question_id) WHERE quiz_question_id IS NOT NULL;
CREATE INDEX idx_system_events_created_at ON system_events (created_at);
CREATE INDEX idx_system_events_metadata ON system_events USING GIN (metadata);

-- ============================================
-- Core Functions for Timestamps
-- ============================================

-- Function: Update timestamps
CREATE OR REPLACE FUNCTION system_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- User Management Functions
-- ============================================

-- Function: Handle new users
CREATE OR REPLACE FUNCTION user_create_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO users_profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Function: Set profile ID for feedback
CREATE OR REPLACE FUNCTION user_set_feedback_profile_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Event Tracking Functions
-- ============================================

-- Function: Record an event
CREATE OR REPLACE FUNCTION system_record_event(
    p_event_type event_type,
    p_lecture_id INTEGER DEFAULT NULL,
    p_chapter_id INTEGER DEFAULT NULL,
    p_quiz_question_id INTEGER DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_event_id INTEGER;
BEGIN
    -- Enforce that only one resource ID is provided
    IF (CASE WHEN p_lecture_id IS NOT NULL THEN 1 ELSE 0 END) +
       (CASE WHEN p_chapter_id IS NOT NULL THEN 1 ELSE 0 END) +
       (CASE WHEN p_quiz_question_id IS NOT NULL THEN 1 ELSE 0 END) > 1 THEN
        RAISE EXCEPTION 'Only one resource ID can be provided';
    END IF;

    INSERT INTO system_events (
        profile_id,
        event_type,
        lecture_id,
        chapter_id,
        quiz_question_id,
        metadata,
        created_at,
        updated_at
    ) VALUES (
        auth.uid(),  -- Use Supabase's auth.uid() to get the current user
        p_event_type,
        p_lecture_id,
        p_chapter_id,
        p_quiz_question_id,
        p_metadata,
        NOW(),
        NOW()
    )
    RETURNING id INTO v_event_id;
    
    RETURN v_event_id;
END;
$$;

-- ============================================
-- Lecture Progress Functions
-- ============================================

-- Function: Mark lecture as completed
CREATE OR REPLACE FUNCTION lecture_mark_completed(p_lecture_id INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_event_id INTEGER;
BEGIN
    -- Check if lecture exists
    IF NOT EXISTS (SELECT 1 FROM content_lectures WHERE id = p_lecture_id) THEN
        RAISE EXCEPTION 'Lecture with ID % does not exist', p_lecture_id;
    END IF;
    
    -- Check if we already have a completion event for this lecture
    IF EXISTS (
        SELECT 1 
        FROM system_events 
        WHERE profile_id = auth.uid() 
          AND lecture_id = p_lecture_id 
          AND event_type = 'LECTURE_COMPLETED'
    ) THEN
        -- Return existing event ID
        SELECT id INTO v_event_id
        FROM system_events
        WHERE profile_id = auth.uid()
          AND lecture_id = p_lecture_id
          AND event_type = 'LECTURE_COMPLETED'
        LIMIT 1;
    ELSE
        -- Create new completion event
        INSERT INTO system_events (
            profile_id,
            event_type,
            lecture_id,
            created_at,
            updated_at
        ) VALUES (
            auth.uid(),
            'LECTURE_COMPLETED',
            p_lecture_id,
            NOW(),
            NOW()
        )
        RETURNING id INTO v_event_id;
    END IF;
    
    RETURN v_event_id;
END;
$$;

-- Function: Get lecture completion counts
CREATE OR REPLACE FUNCTION lecture_get_completion_counts(user_id UUID DEFAULT NULL)
RETURNS TABLE (total_lectures BIGINT, completed_lectures BIGINT)
LANGUAGE plpgsql STABLE
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- If no user_id is provided, use the current authenticated user
    v_user_id := COALESCE(user_id, auth.uid());
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'No user ID provided or authenticated';
    END IF;

    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM content_lectures) AS total_lectures,
        COUNT(DISTINCT lecture_id) AS completed_lectures
    FROM 
        system_events
    WHERE 
        profile_id = v_user_id
        AND event_type = 'LECTURE_COMPLETED'
        AND lecture_id IS NOT NULL;
END;
$$;

-- Function: Get chapter summary
CREATE OR REPLACE FUNCTION chapter_get_summary(user_id UUID DEFAULT NULL, chapter_mode mode DEFAULT NULL)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    description TEXT,
    mode mode,
    sort_order INTEGER,
    lecture_count INTEGER,
    lectures_completed INTEGER
)
LANGUAGE plpgsql STABLE
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- If no user_id is provided, use the current authenticated user
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
    FROM 
        content_chapters c
    LEFT JOIN 
        content_lectures l ON l.chapter_id = c.id
    LEFT JOIN 
        system_events ue ON 
            ue.lecture_id = l.id 
            AND ue.event_type = 'LECTURE_COMPLETED'
            AND ue.profile_id = v_user_id
    WHERE 
        (chapter_mode IS NULL OR c.mode = chapter_mode)
    GROUP BY 
        c.id, c.title, c.description, c.mode, c.sort_order
    ORDER BY 
        c.sort_order ASC;
END;
$$;

-- Function: Get lectures with completion status
CREATE OR REPLACE FUNCTION lecture_get_with_completion(p_chapter_id INTEGER)
RETURNS TABLE (
  id INTEGER,
  title TEXT,
  chapter_id INTEGER,
  sort_order INTEGER,
  is_completed BOOLEAN
)
LANGUAGE plpgsql STABLE
SECURITY DEFINER
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
      WHERE ue.lecture_id = l.id 
        AND ue.profile_id = auth.uid()
        AND ue.event_type = 'LECTURE_COMPLETED'
    ) AS is_completed
  FROM 
    content_lectures l
  WHERE 
    l.chapter_id = p_chapter_id
  ORDER BY 
    l.sort_order ASC;
END;
$$;

-- Function: Get overall user completion statistics
CREATE OR REPLACE FUNCTION user_get_completion_stats(user_id UUID DEFAULT NULL)
RETURNS TABLE (
  total_chapters INTEGER,
  completed_chapters INTEGER,
  total_lectures INTEGER,
  completed_lectures INTEGER,
  completion_percentage NUMERIC
)
LANGUAGE plpgsql STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- If no user_id is provided, use the current authenticated user
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
          AND ue.event_type = 'LECTURE_COMPLETED'
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

-- ============================================
-- Quiz Functions
-- ============================================

-- Function: Record a quiz answer
CREATE OR REPLACE FUNCTION quiz_record_user_answer(
    p_question_id INTEGER,
    p_answer_text TEXT DEFAULT NULL,
    p_chosen_option_ids INTEGER[] DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_answer_id INTEGER;
    v_is_correct BOOLEAN;
    v_question_type question_type;
    v_lecture_id INTEGER;
BEGIN
    -- Get question type and lecture ID
    SELECT 
        question_type, 
        lecture_id 
    INTO 
        v_question_type, 
        v_lecture_id
    FROM quiz_questions
    WHERE id = p_question_id;
    
    IF v_question_type IS NULL THEN
        RAISE EXCEPTION 'Question not found';
    END IF;
    
    -- Validate input based on question type
    IF v_question_type = 'OPEN' AND p_answer_text IS NULL THEN
        RAISE EXCEPTION 'Answer text is required for open questions';
    ELSIF v_question_type = 'MULTIPLE_CHOICE' AND p_chosen_option_ids IS NULL THEN
        RAISE EXCEPTION 'Chosen options are required for multiple-choice questions';
    END IF;
    
    -- Determine if answer is correct (for multiple-choice)
    IF v_question_type = 'MULTIPLE_CHOICE' THEN
        -- Answer is correct if chosen options match all and only correct options
        WITH 
        correct_options AS (
            SELECT option_id FROM quiz_reference_answers
            WHERE question_id = p_question_id AND answer_type = 'OPTION'
            AND option_id IS NOT NULL
        ),
        chosen_correct AS (
            SELECT option_id FROM correct_options
            WHERE option_id = ANY(p_chosen_option_ids)
        ),
        chosen_incorrect AS (
            SELECT id FROM quiz_options
            WHERE question_id = p_question_id 
              AND id = ANY(p_chosen_option_ids)
              AND id NOT IN (SELECT option_id FROM correct_options)
        )
        SELECT 
            (SELECT COUNT(*) FROM correct_options) = (SELECT COUNT(*) FROM chosen_correct)
            AND (SELECT COUNT(*) FROM chosen_incorrect) = 0
        INTO v_is_correct;
    ELSE
        -- For open questions, leave is_correct as NULL (to be evaluated later)
        v_is_correct := NULL;
    END IF;
    
    -- Insert answer
    INSERT INTO quiz_user_answers (
        profile_id,
        question_id,
        answer_text,
        chosen_option_ids,
        is_correct,
        created_at,
        updated_at
    ) VALUES (
        auth.uid(),
        p_question_id,
        p_answer_text,
        p_chosen_option_ids,
        v_is_correct,
        NOW(),
        NOW()
    )
    RETURNING id INTO v_answer_id;
    
    -- Record event
    PERFORM system_record_event(
        'QUESTION_ANSWERED'::event_type,
        NULL, -- lecture_id
        NULL, -- chapter_id
        p_question_id, -- quiz_question_id
        jsonb_build_object(
            'is_correct', v_is_correct
        )
    );
    
    RETURN v_answer_id;
END;
$$;

-- Function: Record quiz completion and mark lecture as completed if passed
CREATE OR REPLACE FUNCTION quiz_mark_completed(
    p_lecture_id INTEGER,
    p_passed BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_event_type event_type;
BEGIN
    -- Check if the lecture exists
    IF NOT EXISTS (SELECT 1 FROM content_lectures WHERE id = p_lecture_id) THEN
        RAISE EXCEPTION 'Lecture with ID % does not exist', p_lecture_id;
    END IF;
    
    -- Determine event type based on pass/fail
    v_event_type := CASE WHEN p_passed THEN 'QUIZ_PASSED' ELSE 'QUIZ_FAILED' END;
    
    -- Record quiz completion event
    PERFORM system_record_event(
        v_event_type,
        p_lecture_id, -- lecture_id
        NULL, -- chapter_id
        NULL, -- quiz_question_id
        jsonb_build_object('completed_at', NOW())
    );
    
    -- If quiz passed, mark lecture as completed
    IF p_passed THEN
        PERFORM lecture_mark_completed(p_lecture_id);
    END IF;
    
    RETURN p_passed;
END;
$$;

-- Function: Check if a user has answered all questions for a lecture
CREATE OR REPLACE FUNCTION quiz_check_completion(p_lecture_id INTEGER, user_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql STABLE
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_result BOOLEAN;
BEGIN
    -- If no user_id is provided, use the current authenticated user
    v_user_id := COALESCE(user_id, auth.uid());
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'No user ID provided or authenticated';
    END IF;

    -- Check if all questions have been answered
    SELECT
        CASE 
            WHEN COUNT(DISTINCT qq.id) = 0 THEN TRUE -- No questions means all answered
            WHEN COUNT(DISTINCT qq.id) = COUNT(DISTINCT ua.question_id) THEN TRUE
            ELSE FALSE
        END INTO v_result
    FROM
        quiz_questions qq
    LEFT JOIN
        quiz_user_answers ua ON 
            ua.question_id = qq.id AND 
            ua.profile_id = v_user_id
    WHERE
        qq.lecture_id = p_lecture_id;
        
    RETURN v_result;
END;
$$;

-- Function: Get quiz results for a lecture
CREATE OR REPLACE FUNCTION quiz_get_results(p_lecture_id INTEGER, user_id UUID DEFAULT NULL)
RETURNS TABLE (
    question_id INTEGER,
    question_text TEXT,
    question_type question_type,
    answer_text TEXT,
    chosen_option_ids INTEGER[],
    correct_option_ids INTEGER[],
    correct_answer_text TEXT,
    is_correct BOOLEAN,
    answered_at TIMESTAMP
)
LANGUAGE plpgsql STABLE
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- If no user_id is provided, use the current authenticated user
    v_user_id := COALESCE(user_id, auth.uid());
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'No user ID provided or authenticated';
    END IF;

    RETURN QUERY
    SELECT
        qq.id AS question_id,
        qq.question_text,
        qq.question_type,
        ua.answer_text,
        ua.chosen_option_ids,
        ARRAY(
            SELECT qra.option_id
            FROM quiz_reference_answers qra
            WHERE qra.question_id = qq.id 
              AND qra.answer_type = 'OPTION'
              AND qra.option_id IS NOT NULL
            ORDER BY qra.id
        ) AS correct_option_ids,
        (
            SELECT qra.answer_text
            FROM quiz_reference_answers qra
            WHERE qra.question_id = qq.id 
              AND qra.answer_type = 'TEXT'
            LIMIT 1
        ) AS correct_answer_text,
        ua.is_correct,
        ua.created_at AS answered_at
    FROM
        quiz_questions qq
    LEFT JOIN
        (
            SELECT DISTINCT ON (question_id) *
            FROM quiz_user_answers
            WHERE profile_id = v_user_id
            ORDER BY question_id, created_at DESC
        ) ua ON ua.question_id = qq.id
    WHERE
        qq.lecture_id = p_lecture_id
    ORDER BY
        qq.id;
END;
$$;

-- Helper function to add reference answers for multiple choice questions
CREATE OR REPLACE FUNCTION quiz_set_reference_option(
    p_question_id INTEGER,
    p_correct_option_id INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_reference_answer_id INTEGER;
    v_question_type question_type;
BEGIN
    -- Verify this is a multiple choice question
    SELECT question_type INTO v_question_type
    FROM quiz_questions
    WHERE id = p_question_id;
    
    IF v_question_type != 'MULTIPLE_CHOICE' THEN
        RAISE EXCEPTION 'Question is not multiple choice';
    END IF;
    
    -- Verify option exists for this question
    IF NOT EXISTS (
        SELECT 1 FROM quiz_options 
        WHERE id = p_correct_option_id 
        AND question_id = p_question_id
    ) THEN
        RAISE EXCEPTION 'Option does not exist for this question';
    END IF;
    
    -- Delete any existing reference answers for this question
    DELETE FROM quiz_reference_answers
    WHERE question_id = p_question_id
    AND answer_type = 'OPTION';
    
    -- Insert the new reference answer
    INSERT INTO quiz_reference_answers (
        question_id,
        answer_type,
        option_id,
        created_at,
        updated_at
    ) VALUES (
        p_question_id,
        'OPTION',
        p_correct_option_id,
        NOW(),
        NOW()
    )
    RETURNING id INTO v_reference_answer_id;
    
    RETURN v_reference_answer_id;
END;
$$;

-- Helper function to add reference answers for open questions
CREATE OR REPLACE FUNCTION quiz_set_reference_text(
    p_question_id INTEGER,
    p_reference_answer TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_reference_answer_id INTEGER;
    v_question_type question_type;
BEGIN
    -- Verify this is an open question
    SELECT question_type INTO v_question_type
    FROM quiz_questions
    WHERE id = p_question_id;
    
    IF v_question_type != 'OPEN' THEN
        RAISE EXCEPTION 'Question is not open-ended';
    END IF;
    
    -- Delete any existing reference answers for this question
    DELETE FROM quiz_reference_answers
    WHERE question_id = p_question_id
    AND answer_type = 'TEXT';
    
    -- Insert the new reference answer
    INSERT INTO quiz_reference_answers (
        question_id,
        answer_type,
        answer_text,
        created_at,
        updated_at
    ) VALUES (
        p_question_id,
        'TEXT',
        p_reference_answer,
        NOW(),
        NOW()
    )
    RETURNING id INTO v_reference_answer_id;
    
    RETURN v_reference_answer_id;
END;
$$;

-- ============================================
-- Triggers
-- ============================================

-- Updated at triggers
CREATE TRIGGER update_content_chapters_timestamp
BEFORE UPDATE ON content_chapters
FOR EACH ROW
EXECUTE FUNCTION system_update_timestamp();

CREATE TRIGGER update_content_lectures_timestamp
BEFORE UPDATE ON content_lectures
FOR EACH ROW
EXECUTE FUNCTION system_update_timestamp();

CREATE TRIGGER update_quiz_questions_timestamp
BEFORE UPDATE ON quiz_questions
FOR EACH ROW
EXECUTE FUNCTION system_update_timestamp();

CREATE TRIGGER update_quiz_options_timestamp
BEFORE UPDATE ON quiz_options
FOR EACH ROW
EXECUTE FUNCTION system_update_timestamp();

CREATE TRIGGER update_quiz_reference_answers_timestamp
BEFORE UPDATE ON quiz_reference_answers
FOR EACH ROW
EXECUTE FUNCTION system_update_timestamp();

CREATE TRIGGER update_quiz_user_answers_timestamp
BEFORE UPDATE ON quiz_user_answers
FOR EACH ROW
EXECUTE FUNCTION system_update_timestamp();

CREATE TRIGGER update_system_events_timestamp
BEFORE UPDATE ON system_events
FOR EACH ROW
EXECUTE FUNCTION system_update_timestamp();

-- User creation trigger
CREATE TRIGGER create_profile_on_user_creation
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION user_create_profile();

-- Set profile ID trigger for feedback
CREATE TRIGGER set_user_feedback_profile_id
BEFORE INSERT ON users_feedback
FOR EACH ROW
EXECUTE FUNCTION user_set_feedback_profile_id();

-- ============================================
-- Row Level Security Policies
-- ============================================

-- Profiles RLS
ALTER TABLE users_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON users_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON users_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users_profiles FOR UPDATE
  USING (auth.uid() = id);

-- User events RLS
ALTER TABLE system_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own events"
  ON system_events FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own events"
  ON system_events FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- User answers RLS
ALTER TABLE quiz_user_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz answers"
  ON quiz_user_answers FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own quiz answers"
  ON quiz_user_answers FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Quiz reference answers RLS (viewable by all, manageable by admins)
ALTER TABLE quiz_reference_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reference answers are viewable by everyone"
  ON quiz_reference_answers
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert reference answers"
  ON quiz_reference_answers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users_profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Only admins can update reference answers"
  ON quiz_reference_answers
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Only admins can delete reference answers"
  ON quiz_reference_answers
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users_profiles 
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- User feedback RLS
ALTER TABLE users_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow logged-in users to insert feedback"
  ON users_feedback FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

COMMIT;