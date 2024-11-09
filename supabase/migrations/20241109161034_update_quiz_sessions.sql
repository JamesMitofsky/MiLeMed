-- Create quiz_sessions table
CREATE TABLE quiz_sessions (
    session_id UUID PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    lecture_id INTEGER REFERENCES lectures(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add session_id to user_quiz_answers
ALTER TABLE user_quiz_answers
ADD COLUMN session_id UUID REFERENCES quiz_sessions(session_id) ON DELETE CASCADE;

-- Trigger function to ensure a session exists in quiz_sessions
CREATE OR REPLACE FUNCTION ensure_session_exists()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the session exists in quiz_sessions
  IF NOT EXISTS (
    SELECT 1 FROM quiz_sessions WHERE session_id = NEW.session_id
  ) THEN
    -- Insert a new session record if it doesn't exist
    INSERT INTO quiz_sessions (session_id, profile_id, lecture_id, created_at)
    VALUES (NEW.session_id, NEW.profile_id, (SELECT lecture_id FROM quiz_questions WHERE id = NEW.question_id), NOW());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to ensure session exists on insert in user_quiz_answers
CREATE TRIGGER ensure_session_exists_trigger
BEFORE INSERT ON user_quiz_answers
FOR EACH ROW
EXECUTE FUNCTION ensure_session_exists();
