DROP TABLE IF EXISTS quiz_attempts CASCADE;

ALTER TABLE quiz_answers_from_user
DROP COLUMN IF EXISTS quiz_attempt_id;
