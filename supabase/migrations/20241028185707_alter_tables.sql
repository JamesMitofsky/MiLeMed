-- QUIZ ATTEMPTS

-- Remove the unique constraint first
ALTER TABLE quiz_attempts
DROP CONSTRAINT unique_quiz_attempt;

-- Remove the attempt_number column
ALTER TABLE quiz_attempts
    DROP COLUMN attempt_number,
    DROP COLUMN started_at,
    DROP COLUMN completed_at;





-- QUIZ EVENTS
CREATE TYPE quiz_event_type AS ENUM (
    'QUIZ_STARTED',
    'QUESTION_ANSWERED',
    'QUIZ_COMPLETED'
);

CREATE TABLE quiz_events (
    id SERIAL PRIMARY KEY,
    quiz_attempt_id INTEGER NOT NULL,          -- Reference to quiz_attempts
    event_type quiz_event_type NOT NULL,       -- Enum type for event types
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE
);




-- UPDATED AT TRIGGER
-- Add or modify the `updated_at` column for each table
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE lectures ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE images ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE quiz_question_options ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE quiz_answers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE lecture_events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE app_events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create or replace the trigger function for updating `updated_at`
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to each table where `updated_at` should auto-update

-- For `chapters`
DROP TRIGGER IF EXISTS set_chapters_updated_at ON chapters;
CREATE TRIGGER set_chapters_updated_at
BEFORE UPDATE ON chapters
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- For `lectures`
DROP TRIGGER IF EXISTS set_lectures_updated_at ON lectures;
CREATE TRIGGER set_lectures_updated_at
BEFORE UPDATE ON lectures
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- For `images`
DROP TRIGGER IF EXISTS set_images_updated_at ON images;
CREATE TRIGGER set_images_updated_at
BEFORE UPDATE ON images
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- For `quiz_questions`
DROP TRIGGER IF EXISTS set_quiz_questions_updated_at ON quiz_questions;
CREATE TRIGGER set_quiz_questions_updated_at
BEFORE UPDATE ON quiz_questions
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- For `quiz_question_options`
DROP TRIGGER IF EXISTS set_quiz_question_options_updated_at ON quiz_question_options;
CREATE TRIGGER set_quiz_question_options_updated_at
BEFORE UPDATE ON quiz_question_options
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- For `quiz_answers`
DROP TRIGGER IF EXISTS set_quiz_answers_updated_at ON quiz_answers;
CREATE TRIGGER set_quiz_answers_updated_at
BEFORE UPDATE ON quiz_answers
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- For `lecture_events`
DROP TRIGGER IF EXISTS set_lecture_events_updated_at ON lecture_events;
CREATE TRIGGER set_lecture_events_updated_at
BEFORE UPDATE ON lecture_events
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- For `app_events`
DROP TRIGGER IF EXISTS set_app_events_updated_at ON app_events;
CREATE TRIGGER set_app_events_updated_at
BEFORE UPDATE ON app_events
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();
