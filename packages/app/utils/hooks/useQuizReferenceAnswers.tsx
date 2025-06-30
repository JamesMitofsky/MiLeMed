import { useSessionContext } from '@supabase/auth-helpers-react'
import { useQuery } from '@tanstack/react-query'

// Custom hook to fetch quiz reference answers
export const useQuizReferenceAnswers = (questionIds?: number[]) => {
  const { supabaseClient } = useSessionContext()

  // Define query key as a constant
  const refAnswersKey = questionIds 
    ? ['quiz-reference-answers', questionIds] 
    : ['quiz-reference-answers'] as const

  // Get reference answers filtered by question IDs if provided
  const refAnswersQuery = useQuery({
    queryKey: refAnswersKey,
    queryFn: async () => {
      // Start with the base query
      let query = supabaseClient
        .from('quiz_reference_answers')
        .select('*')
      
      // Apply filter for specific question IDs if provided
      if (questionIds && questionIds.length > 0) {
        query = query.in('question_id', questionIds)
      }
      
      // Execute the query with ordering
      const { data, error } = await query.order('id', { ascending: true })

      if (error) throw error
      return data
    },
    // Enable the query if questionIds is undefined or has elements
    enabled: !questionIds || questionIds.length > 0,
  })

  // Get reference answers for a specific question
  const getReferenceAnswersForQuestion = (questionId: number) => {
    if (!refAnswersQuery.data) return []
    return refAnswersQuery.data.filter((answer) => answer.question_id === questionId)
  }

  // Get the correct option ID for a specific question (for multiple choice questions)
  const getCorrectOptionIdForQuestion = (questionId: number): number | null => {
    if (!refAnswersQuery.data) return null

    const answers = refAnswersQuery.data.filter(
      (answer) => answer.question_id === questionId && answer.answer_type === 'OPTION'
    )
    
    // Return the option_id if found
    if (answers.length > 0 && answers[0].option_id) {
      return answers[0].option_id
    }
    
    return null
  }

  return {
    data: refAnswersQuery.data,
    isLoading: refAnswersQuery.isLoading,
    error: refAnswersQuery.error,
    refetch: refAnswersQuery.refetch,
    getReferenceAnswersForQuestion,
    getCorrectOptionIdForQuestion
  }
}
