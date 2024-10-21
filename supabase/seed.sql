INSERT INTO event_types (event_name, description)
VALUES 
('LECTURE_VISITED', 'The lecture was visited by the user'),
('LECTURE_SKIPPED', 'The lecture was marked as skipped by the user. This indicates that the user does not want to take the quiz and the lecture should be placed into the interface’s ''archive'' with the other skipped or completed lectures.'),
('LECTURE_SESSION_STARTED', 'The user has begun looking at a lecture'),
('LECTURE_SESSION_COMPLETED', 'The user has stopped looking at a lecture');
('LECTURE_INTERACTED_WITH_MEDIA', 'The user interacted with media embedded in the lecture'),
('QUIZ_STARTED', 'The quiz for the lecture was started'),
('QUIZ_SUBMITTED', 'The user submitted the quiz, regardless of whether they passed or failed'),
('QUIZ_PASSED', 'The quiz for the lecture was passed'),
('QUIZ_FAILED', 'The quiz for the lecture was failed'),
('QUIZ_HINT_VIEWED', 'A hint was viewed during the lecture or quiz'),
('APP_SESSION_STARTED', 'The user started a session in the app'),
('APP_SESSION_ENDED', 'The user ended a session in the app'),