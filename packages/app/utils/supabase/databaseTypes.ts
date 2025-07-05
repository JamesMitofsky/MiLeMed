import { Database } from '@my/supabase/types'

// Start James's custom types July 2025
export type QuestionForQuizComponent = {
  question_id: number
  question_text: string
  question_type: 'MULTIPLE_CHOICE' | 'OPEN'
  lecture_id: number
  created_at: string | null
  updated_at: string | null
  id: number

  // Added properties in the useMemo
  options: {
    id: number
    question_id: number
    option_text: string
    // Any other properties that might be in optionsData
  }[]
  // this appears to not exist
  // reference_answer_ids: number[]
}

// Types based on the schema (you'd typically generate these)
export type Chapter = {
  id: number
  title: string
  description: string
  mode: 'THEORETICAL' | 'PRACTICAL'
  sort_order: number
}

export type Lecture = {
  id: number
  title: string
  content: string
  chapter_id: number
  sort_order: number
}

export type UserProfile = {
  about: string | null
  birthdate: string | null
  clinical_semester: number | null
  created_at: string | null
  gender: Database['public']['Enums']['gender'] | null
  id: string
  name: string | null
  overall_semester: number | null
  role: Database['public']['Enums']['user_role'] | null
  updated_at: string | null
}

export type QuizQuestion = {
  id: number
  lecture_id: number
  question_text: string
  question_type: 'OPEN' | 'MULTIPLE_CHOICE'
}

export type QuizOption = {
  id: number
  question_id: number
  option_text: string
}

export type SystemEvent = {
  id: number
  profile_id: string
  event_type: string
  created_at: string
  lecture_id?: number
  chapter_id?: number
  quiz_question_id?: number
  metadata: Record<string, unknown>
}
