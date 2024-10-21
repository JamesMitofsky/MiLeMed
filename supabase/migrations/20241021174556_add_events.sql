CREATE TABLE event_types (
    id SERIAL PRIMARY KEY,     -- Unique identifier for the event type
    event_name TEXT NOT NULL,  -- Name of the event (e.g., CLICKED, COMPLETED)
    description TEXT           -- Optional description of the event
);

CREATE TABLE lecture_events (
    id SERIAL PRIMARY KEY,                    -- Unique identifier for each event
    lecture_id INTEGER NOT NULL,              -- Reference to the lecture
    profile_id UUID NOT NULL,                 -- Reference to the user (profile)
    event_type_id INTEGER NOT NULL,           -- Foreign key to event_types
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the event occurred
    FOREIGN KEY (lecture_id) REFERENCES lectures(id) ON DELETE CASCADE,
    FOREIGN KEY (profile_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE CASCADE
);
