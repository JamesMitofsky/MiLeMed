-- Create Enums
CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'OTHER');
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

CREATE TABLE user_stats (
    profile_id UUID PRIMARY KEY,  -- Change to UUID to match auth.users.id type
    age INTEGER,
    gender gender,
    semester_number INTEGER,
    FOREIGN KEY (profile_id) REFERENCES auth.users(id) ON DELETE CASCADE  -- Reference to auth.users
);
