import { Database } from '@my/supabase/types'

// Tables
type AppEventsType = Database['public']['Tables']['app_events']['Row']
type ChaptersType = Database['public']['Tables']['chapters']['Row']
type ImagesType = Database['public']['Tables']['images']['Row']
type LectureEventsType = Database['public']['Tables']['lecture_events']['Row']
type LecturesType = Database['public']['Tables']['lectures']['Row']
type ProfilesType = Database['public']['Tables']['profiles']['Row']
type QuizAnswersType = Database['public']['Tables']['quiz_answers']['Row']
type QuizQuestionOptionsType = Database['public']['Tables']['quiz_question_options']['Row']
type QuizQuestionsType = Database['public']['Tables']['quiz_questions']['Row']

// Insert types
type AppEventsInsertType = Database['public']['Tables']['app_events']['Insert']
type ChaptersInsertType = Database['public']['Tables']['chapters']['Insert']
type ImagesInsertType = Database['public']['Tables']['images']['Insert']
type LectureEventsInsertType = Database['public']['Tables']['lecture_events']['Insert']
type LecturesInsertType = Database['public']['Tables']['lectures']['Insert']
type ProfilesInsertType = Database['public']['Tables']['profiles']['Insert']
type QuizAnswersInsertType = Database['public']['Tables']['quiz_answers']['Insert']
type QuizQuestionOptionsInsertType = Database['public']['Tables']['quiz_question_options']['Insert']
type QuizQuestionsInsertType = Database['public']['Tables']['quiz_questions']['Insert']

// Update types
type AppEventsUpdateType = Database['public']['Tables']['app_events']['Update']
type ChaptersUpdateType = Database['public']['Tables']['chapters']['Update']
type ImagesUpdateType = Database['public']['Tables']['images']['Update']
type LectureEventsUpdateType = Database['public']['Tables']['lecture_events']['Update']
type LecturesUpdateType = Database['public']['Tables']['lectures']['Update']
type ProfilesUpdateType = Database['public']['Tables']['profiles']['Update']
type QuizAnswersUpdateType = Database['public']['Tables']['quiz_answers']['Update']
type QuizQuestionOptionsUpdateType = Database['public']['Tables']['quiz_question_options']['Update']
type QuizQuestionsUpdateType = Database['public']['Tables']['quiz_questions']['Update']

// Enums
type GenderType = Database['public']['Enums']['gender']
type ModeType = Database['public']['Enums']['mode']

export {
  AppEventsType,
  AppEventsInsertType,
  AppEventsUpdateType,
  ChaptersType,
  ChaptersInsertType,
  ChaptersUpdateType,
  ImagesType,
  ImagesInsertType,
  ImagesUpdateType,
  LectureEventsType,
  LectureEventsInsertType,
  LectureEventsUpdateType,
  LecturesType,
  LecturesInsertType,
  LecturesUpdateType,
  ProfilesType,
  ProfilesInsertType,
  ProfilesUpdateType,
  QuizAnswersType,
  QuizAnswersInsertType,
  QuizAnswersUpdateType,
  QuizQuestionOptionsType,
  QuizQuestionOptionsInsertType,
  QuizQuestionOptionsUpdateType,
  QuizQuestionsType,
  QuizQuestionsInsertType,
  QuizQuestionsUpdateType,
  GenderType,
  ModeType,
}
