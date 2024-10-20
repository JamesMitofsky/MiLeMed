-- Create Enums
CREATE TYPE mode AS ENUM ('THEORETICAL', 'PRACTICAL');

-- Create Tables

CREATE TABLE chapters (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mode mode NOT NULL
);

CREATE TABLE lectures (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    chapter_id INTEGER NOT NULL,
    FOREIGN KEY (chapter_id) REFERENCES chapters (id) ON DELETE CASCADE
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    lecture_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lecture_id) REFERENCES lectures (id) ON DELETE CASCADE  -- Change to CASCADE
);

CREATE TABLE lecture_clicks (
    id SERIAL PRIMARY KEY,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lecture_id INTEGER,
    profile_id UUID,  -- Change to UUID to match auth.users.id type
    FOREIGN KEY (lecture_id) REFERENCES lectures (id) ON DELETE SET NULL,
    FOREIGN KEY (profile_id) REFERENCES auth.users(id) ON DELETE SET NULL  -- Reference to auth.users
);

-- Table for storing questions related to each lecture
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    lecture_id INTEGER NOT NULL,  -- Link to the lecture
    question_text TEXT NOT NULL,  -- The question itself
    question_type TEXT CHECK (question_type IN ('OPEN', 'MULTIPLE_CHOICE')),  -- Type of question
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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

-- Table for storing user answers to quiz questions
CREATE TABLE quiz_answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,  -- The question being answered
    profile_id UUID NOT NULL,      -- The user answering (link to auth.users)
    answer_text TEXT,              -- For open answer questions (NULL for multiple choice)
    chosen_option_id INTEGER,      -- For multiple choice, reference to quiz_question_options.id
    is_correct BOOLEAN,            -- Whether the answer is correct (calculated for open answer)
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE,
    FOREIGN KEY (chosen_option_id) REFERENCES quiz_question_options(id) ON DELETE CASCADE,
    FOREIGN KEY (profile_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
