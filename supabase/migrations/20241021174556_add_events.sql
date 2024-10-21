CREATE TABLE lecture_events (
    id SERIAL PRIMARY KEY,
    profile_id UUID NOT NULL,
    lecture_id INTEGER NOT NULL,                  -- Reference to a specific lecture
    event_type TEXT NOT NULL,          
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    FOREIGN KEY (profile_id) REFERENCES auth.users (id) ON DELETE CASCADE,
    FOREIGN KEY (lecture_id) REFERENCES lectures (id) ON DELETE CASCADE
);

CREATE TABLE app_events (
    id SERIAL PRIMARY KEY,
    profile_id UUID NOT NULL,
    event_type TEXT NOT NULL,          
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    FOREIGN KEY (profile_id) REFERENCES auth.users (id) ON DELETE CASCADE
);
