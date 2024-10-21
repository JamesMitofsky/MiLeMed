enum EventTypesEnum {
  /**
   * The lecture was visited by the user
   */
  LECTURE_VISITED = 'LECTURE_VISITED',

  /**
   * The lecture was marked as skipped by the user. This indicates that the user does not want to take the quiz and the lecture should be placed into the interface’s 'archive' with the other skipped or completed lectures.
   */
  LECTURE_SKIPPED = 'LECTURE_SKIPPED',

  /**
   * The user has begun looking at a lecture
   */
  LECTURE_SESSION_STARTED = 'LECTURE_SESSION_STARTED',

  /**
   * The user has stopped looking at a lecture
   */
  LECTURE_SESSION_COMPLETED = 'LECTURE_SESSION_COMPLETED',

  /**
   * The user interacted with media embedded in the lecture
   */
  LECTURE_INTERACTED_WITH_MEDIA = 'LECTURE_INTERACTED_WITH_MEDIA',

  /**
   * The quiz for the lecture was started
   */
  QUIZ_STARTED = 'QUIZ_STARTED',

  /**
   * The user submitted the quiz, regardless of whether they passed or failed
   */
  QUIZ_SUBMITTED = 'QUIZ_SUBMITTED',

  /**
   * The quiz for the lecture was passed
   */
  QUIZ_PASSED = 'QUIZ_PASSED',

  /**
   * The quiz for the lecture was failed
   */
  QUIZ_FAILED = 'QUIZ_FAILED',

  /**
   * A hint was viewed during the lecture or quiz
   */
  QUIZ_HINT_VIEWED = 'QUIZ_HINT_VIEWED',

  /**
   * The user started a session in the app
   */
  APP_SESSION_STARTED = 'APP_SESSION_STARTED',

  /**
   * The user ended a session in the app
   */
  APP_SESSION_ENDED = 'APP_SESSION_ENDED',
}

export default EventTypesEnum
