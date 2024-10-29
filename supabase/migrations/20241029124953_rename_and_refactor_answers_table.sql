-- Rename table quiz_answers to quiz_answers_from_user
ALTER TABLE quiz_answers RENAME TO quiz_answers_from_user;

-- Drop the existing column chosen_option_id
ALTER TABLE quiz_answers_from_user DROP COLUMN chosen_option_id;

-- Add a new column chosen_option_ids with int4[] type
ALTER TABLE quiz_answers_from_user ADD COLUMN chosen_option_ids int4[];