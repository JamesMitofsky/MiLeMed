-- Create Enums
CREATE TYPE mode AS ENUM ('THEORETICAL', 'PRACTICAL');
CREATE TYPE question_type AS ENUM ('OPEN', 'MULTIPLE_CHOICE');

-- Create Tables
CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mode mode NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 1,  -- Order column to define the sequence of chapters
    CONSTRAINT unique_chapter_order UNIQUE (sort_order) -- Ensure unique ordering for chapters globally
);

CREATE TABLE lectures (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    chapter_id INTEGER NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 1,  -- Order column to define the sequence of lectures within a chapter
    FOREIGN KEY (chapter_id) REFERENCES chapters (id) ON DELETE CASCADE,
    CONSTRAINT unique_lecture_order UNIQUE (chapter_id, sort_order) -- Ensure unique ordering within a chapter
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    lecture_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lecture_id) REFERENCES lectures (id) ON DELETE CASCADE  -- Change to CASCADE
);

-- Table for storing questions related to each lecture
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    lecture_id INTEGER NOT NULL,  -- Link to the lecture
    question_text TEXT NOT NULL,  -- The question itself
    question_type question_type NOT NULL,  -- Type of question using the enum
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lecture_id) REFERENCES lectures(id) ON DELETE CASCADE
);

-- Table for storing multiple choice options for questions
CREATE TABLE quiz_question_options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,  -- Link to the related question
    option_text TEXT NOT NULL,     -- Option text
    is_correct BOOLEAN DEFAULT FALSE,  -- Whether this option is correct
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);

-- Table for tracking quiz attempts by users
CREATE TABLE quiz_attempts (
    id SERIAL PRIMARY KEY,
    lecture_id INTEGER NOT NULL,  -- Link to the lecture
    profile_id UUID NOT NULL,     -- The user taking the quiz (link to auth.users)
    attempt_number INTEGER NOT NULL,  -- The attempt number for this quiz
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    FOREIGN KEY (lecture_id) REFERENCES lectures(id) ON DELETE CASCADE,
    FOREIGN KEY (profile_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT unique_quiz_attempt UNIQUE (lecture_id, profile_id, attempt_number) -- Ensure unique attempts per lecture and user
);

-- Table for storing user answers to quiz questions
CREATE TABLE quiz_answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,  -- The question being answered
    profile_id UUID NOT NULL,      -- The user answering (link to auth.users)
    quiz_attempt_id INTEGER NOT NULL, -- Link to the specific quiz attempt
    answer_text TEXT,              -- For open answer questions (NULL for multiple choice)
    chosen_option_id INTEGER,      -- For multiple choice, reference to quiz_question_options.id
    is_correct BOOLEAN,            -- Whether the answer is correct (calculated for open answer)
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE,
    FOREIGN KEY (chosen_option_id) REFERENCES quiz_question_options(id) ON DELETE CASCADE,
    FOREIGN KEY (profile_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE
);
