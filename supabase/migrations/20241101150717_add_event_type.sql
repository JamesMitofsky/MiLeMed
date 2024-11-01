-- Step 1: Create the enum type if it doesn’t already exist
CREATE TYPE lecture_event_type AS ENUM ('LECTURE_SKIPPED', 'LECTURE_MARKED_AS_READ');

-- Step 2: Alter the `lecture_events` table to use this enum type for `event_type`
ALTER TABLE lecture_events
ALTER COLUMN event_type TYPE lecture_event_type USING event_type::lecture_event_type;