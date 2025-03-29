import { Database, Json } from '@my/supabase/types'
import { createClient } from '@supabase/supabase-js'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { UserProfile, SystemEvent } from '../supabase/databaseTypes'

// Initialize Supabase client
const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
)

// Comprehensive Hooks Collection
export const useChapters = () => {
  // Define query key as a constant
  const getChapterSummaryKey = (mode?: 'THEORETICAL' | 'PRACTICAL') => ['chapters', mode] as const

  // Get chapter summary with completion status
  const getChapterSummary = (mode?: 'THEORETICAL' | 'PRACTICAL') => {
    return useQuery({
      queryKey: getChapterSummaryKey(mode),
      queryFn: async () => {
        const { data, error } = await supabase.rpc('chapter_get_summary', {
          chapter_mode: mode,
        })

        if (error) throw error
        return data
      },
    })
  }

  return { getChapterSummary }
}

export const useLectures = () => {
  const queryClient = useQueryClient()

  // Define query keys as constants
  const getLecturesKey = (chapterId: number) => ['lectures', chapterId] as const

  // Get lectures with completion status for a specific chapter
  const getLecturesWithCompletion = (chapterId: number) => {
    return useQuery({
      queryKey: getLecturesKey(chapterId),
      queryFn: async () => {
        const { data, error } = await supabase.rpc('lecture_get_with_completion', {
          p_chapter_id: chapterId,
        })

        if (error) throw error
        return data
      },
    })
  }

  // Mark lecture as completed
  const markLectureCompleted = useMutation({
    mutationFn: async (lectureId: number) => {
      const { data, error } = await supabase.rpc('lecture_mark_completed', {
        p_lecture_id: lectureId,
      })

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      // Get the chapter ID associated with this lecture to invalidate the proper queries
      // Note: If you need to invalidate lectures list, you would need to know the chapterId
      // This is a placeholder - you might need to adjust based on your data structure
      queryClient.invalidateQueries({
        queryKey: ['user-completion-stats'],
      })
    },
  })

  return {
    getLecturesWithCompletion,
    markLectureCompleted,
  }
}

export const useUserProfile = () => {
  const queryClient = useQueryClient()

  // Define query keys as constants
  const profileKey = ['user-profile'] as const
  const statsKey = ['user-completion-stats'] as const

  // Get current user's profile
  const getProfile = () => {
    return useQuery({
      queryKey: profileKey,
      queryFn: async (): Promise<UserProfile> => {
        const { data, error } = await supabase.from('users_profiles').select('*').single()

        if (error) throw error
        return data
      },
    })
  }

  // Update user profile
  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
      const { data, error } = await supabase
        .from('users_profiles')
        .update(updates)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKey })
    },
  })

  // Get user completion statistics
  const getCompletionStats = () => {
    return useQuery({
      queryKey: statsKey,
      queryFn: async () => {
        const { data, error } = await supabase.rpc('user_get_completion_stats')

        if (error) throw error
        return data
      },
    })
  }

  return {
    getProfile,
    updateProfile,
    getCompletionStats,
  }
}

export const useQuizSystem = () => {
  const queryClient = useQueryClient()

  // Define query keys as constants
  const quizResultsKey = (lectureId: number) => ['quiz-results', lectureId] as const
  const quizCompletionKey = (lectureId: number) => ['quiz-completion', lectureId] as const
  const userCompletionStatsKey = ['user-completion-stats'] as const

  // Record a quiz answer
  const recordQuizAnswer = useMutation({
    mutationFn: async (params: {
      questionId: number
      answerText?: string
      chosenOptionIds?: number[]
      lectureId?: number // Adding this to allow invalidation of the right keys
    }) => {
      const { data, error } = await supabase.rpc('quiz_record_user_answer', {
        p_question_id: params.questionId,
        p_answer_text: params.answerText,
        p_chosen_option_ids: params.chosenOptionIds,
      })

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      // If lectureId is provided, we can invalidate the quiz results for that lecture
      if (variables.lectureId) {
        queryClient.invalidateQueries({
          queryKey: quizResultsKey(variables.lectureId),
        })
      }

      // Otherwise, just invalidate based on questionId
      queryClient.invalidateQueries({
        queryKey: ['quiz-results', variables.questionId],
      })
    },
  })

  // Get quiz results for a lecture
  const getQuizResults = (lectureId: number) => {
    return useQuery({
      queryKey: quizResultsKey(lectureId),
      queryFn: async () => {
        const { data, error } = await supabase.rpc('quiz_get_results', {
          p_lecture_id: lectureId,
        })

        if (error) throw error
        return data
      },
    })
  }

  // Check if all questions in a lecture quiz are answered
  const checkQuizCompletion = (lectureId: number) => {
    return useQuery({
      queryKey: quizCompletionKey(lectureId),
      queryFn: async () => {
        const { data, error } = await supabase.rpc('quiz_check_completion', {
          p_lecture_id: lectureId,
        })

        if (error) throw error
        return data
      },
    })
  }

  // Mark quiz as completed (passed/failed)
  const markQuizCompleted = useMutation({
    mutationFn: async (params: { lectureId: number; passed: boolean }) => {
      const { data, error } = await supabase.rpc('quiz_mark_completed', {
        p_lecture_id: params.lectureId,
        p_passed: params.passed,
      })

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: userCompletionStatsKey,
      })

      // Also invalidate the quiz completion status
      queryClient.invalidateQueries({
        queryKey: quizCompletionKey(variables.lectureId),
      })
    },
  })

  return {
    recordQuizAnswer,
    getQuizResults,
    checkQuizCompletion,
    markQuizCompleted,
  }
}

export const useUserEvents = () => {
  // Define query key as a constant
  const userEventsKey = ['user-events'] as const

  return useQuery({
    queryKey: userEventsKey,
    queryFn: async (): Promise<SystemEvent[]> => {
      const { data, error } = await supabase
        .from('system_events')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<SystemEvent[]>()

      if (error) throw error
      return data
    },
  })
}

export const useSystemEvents = () => {
  // Record a system event
  const recordSystemEvent = useMutation({
    mutationFn: async (params: {
      eventType: Database['public']['Enums']['event_type']
      lectureId?: number
      chapterId?: number
      quizQuestionId?: number
      metadata?: Json
    }) => {
      const { data, error } = await supabase.rpc('system_record_event', {
        p_event_type: params.eventType,
        p_lecture_id: params.lectureId,
        p_chapter_id: params.chapterId,
        p_quiz_question_id: params.quizQuestionId,
        p_metadata: params.metadata || {},
      })

      if (error) throw error
      return data
    },
  })

  return { recordSystemEvent }
}

export const useFeedback = () => {
  const queryClient = useQueryClient()

  // Define query key as a constant
  const userFeedbackKey = ['user-feedback'] as const

  // Submit user feedback
  const submitFeedback = useMutation({
    mutationFn: async (description: string) => {
      const { data, error } = await supabase
        .from('users_feedback')
        .insert({ description })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userFeedbackKey })
    },
  })

  // Optional: Get user's previous feedback (if needed)
  const getUserFeedback = () => {
    return useQuery({
      queryKey: userFeedbackKey,
      queryFn: async () => {
        const { data, error } = await supabase
          .from('users_feedback')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        return data
      },
    })
  }

  return {
    submitFeedback,
    getUserFeedback,
  }
}
