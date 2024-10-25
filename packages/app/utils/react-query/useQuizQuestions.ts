import { useQuery } from '@tanstack/react-query'

import { useSupabase } from '../supabase/useSupabase'

const getEvents = async (supabase, lectureId) => {
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
  return data
}

function useQuizQuestionsQuery(lectureId) {
  const supabase = useSupabase()

  const queryFn = () => getEvents(supabase, lectureId)

  return useQuery({
    queryKey: ['quizQuestions', lectureId],
    queryFn,
    enabled: !!lectureId,
  })
}

export default useQuizQuestionsQuery
