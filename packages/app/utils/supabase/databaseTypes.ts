import { Database } from '@my/supabase/types'

// Tables
type AppEventsType = Database['public']['Tables']['app_events']['Row']
type ChaptersType = Database['public']['Tables']['chapters']['Row']
type ImagesType = Database['public']['Tables']['images']['Row']
type LectureEventsType = Database['public']['Tables']['lecture_events']['Row']
type LecturesType = Database['public']['Tables']['lectures']['Row']
type ProfilesType = Database['public']['Tables']['profiles']['Row']
type QuizAnswersType = Database['public']['Tables']['user_quiz_answers']['Row']
type QuizQuestionOptionsType = Database['public']['Tables']['quiz_question_options']['Row']
type QuizQuestionsType = Database['public']['Tables']['quiz_questions']['Row']

// Enums
type GenderType = Database['public']['Enums']['gender']
type ModeType = Database['public']['Enums']['mode']
type QuestionType = Database['public']['Enums']['question_type']
type QuizEventType = Database['public']['Enums']['quiz_event_type']
type UserRoleType = Database['public']['Enums']['user_role']
type LectureEventEnumType = Database['public']['Enums']['lecture_event_type']

export {
  AppEventsType,
  ChaptersType,
  ImagesType,
  LectureEventsType,
  LecturesType,
  ProfilesType,
  QuizAnswersType,
  QuizQuestionOptionsType,
  QuizQuestionsType,
  GenderType,
  ModeType,
  QuestionType,
  QuizEventType,
  UserRoleType,
  LectureEventEnumType,
}
