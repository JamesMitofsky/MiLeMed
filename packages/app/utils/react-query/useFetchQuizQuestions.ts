import { useQuery } from '@tanstack/react-query'

import { QuizQuestionOptionsType, QuizQuestionsType } from '../supabase/databaseTypes'
import { useSupabase } from '../supabase/useSupabase'

const getQuizQuestions = async (supabase, lectureId: number) => {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select(
      `
      id,
      question_text,
      question_type,
      quiz_question_options (id, option_text, is_correct)
    `
    )
    .eq('lecture_id', lectureId)

  if (error) throw new Error(error.message)
  if (!data) throw new Error('No data returned from the server')

  return data // Return the entire array, not just data[0]
}

export type QuizQuestionsWithOptionsType = QuizQuestionsType & {
  quiz_question_options: Pick<QuizQuestionOptionsType, 'id' | 'is_correct' | 'option_text'>[]
}

function useFetchQuizQuestions(lectureId: number) {
  const supabase = useSupabase()

  const queryFn = () => getQuizQuestions(supabase, lectureId)

  return useQuery<QuizQuestionsWithOptionsType[]>({
    queryKey: ['quizQuestions', lectureId],
    queryFn,
    enabled: !!lectureId, // Only enable the query if lectureId is provided
  })
}

export default useFetchQuizQuestions
