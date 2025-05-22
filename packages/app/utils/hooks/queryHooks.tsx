import { Database, Json } from '@my/supabase/types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { UserProfile, SystemEvent } from '../supabase/databaseTypes'
import { useSessionContext } from '../supabase/useSessionContext'

// Comprehensive Hooks Collection
export const useChapters = () => {
  const { supabaseClient } = useSessionContext()

  // Define query key as a constant
  const getChapterSummaryKey = (mode?: 'THEORETICAL' | 'PRACTICAL') => ['chapters', mode] as const

  // Get chapter summary with completion status
  const getChapterSummary = (mode?: 'THEORETICAL' | 'PRACTICAL') => {
    return useQuery({
      queryKey: getChapterSummaryKey(mode),
      queryFn: async () => {
        const { data, error } = await supabaseClient.rpc('chapter_get_summary', {
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
  const { supabaseClient } = useSessionContext()
  const queryClient = useQueryClient()

  // Define query keys as constants
  const getLecturesKey = (chapterId: number) => ['lectures', chapterId] as const
  const getLectureByIdKey = (lectureId: number) => ['lecture', lectureId] as const

  // Get lectures with completion status for a specific chapter
  const getLecturesWithCompletion = (chapterId: number) => {
    return useQuery({
      queryKey: getLecturesKey(chapterId),
      queryFn: async () => {
        const { data, error } = await supabaseClient.rpc('lecture_get_with_completion', {
          p_chapter_id: chapterId,
        })

        if (error) throw error
        return data
      },
    })
  }

  // Get a single lecture by ID
  const getLectureById = (lectureId: number) => {
    return useQuery({
      queryKey: getLectureByIdKey(lectureId),
      queryFn: async () => {
        const { data, error } = await supabaseClient.rpc('lecture_get_by_id', {
          p_lecture_id: lectureId,
        })

        if (error) throw error
        return data[0] // Returns the first (and only) result
      },
    })
  }

  // Mark lecture as completed
  const markLectureCompleted = useMutation({
    mutationFn: async (lectureId: number) => {
      const { data, error } = await supabaseClient.rpc('lecture_mark_completed', {
        p_lecture_id: lectureId,
      })

      if (error) throw error
      return data
    },
    onSuccess: (_, lectureId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['user-completion-stats'],
      })

      // Attempt to get the lecture to invalidate its specific cache
      queryClient.invalidateQueries({
        queryKey: getLectureByIdKey(lectureId),
      })

      // If possible, try to get the associated chapter and invalidate lectures list
      try {
        // You might need to add a function to fetch chapter ID for a lecture
        // This is a placeholder - adjust based on your actual data retrieval method
        const fetchChapterId = async () => {
          const { data, error } = await supabaseClient
            .from('content_lectures')
            .select('chapter_id')
            .eq('id', lectureId)
            .single()

          if (error) throw error
          return data.chapter_id
        }

        fetchChapterId().then((chapterId) => {
          queryClient.invalidateQueries({
            queryKey: getLecturesKey(chapterId),
          })
        })
      } catch (error) {
        console.error('Failed to invalidate lectures list', error)
      }
    },
  })

  return {
    getLecturesWithCompletion,
    getLectureById,
    markLectureCompleted,
  }
}

export const useUserProfile = () => {
  const { session, supabaseClient } = useSessionContext()
  const user = session?.user

  // Define query keys as constants
  const statsKey = ['user-completion-stats'] as const

  const {
    data: profile,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      const { data, error } = await supabaseClient
        .from('users_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        // no rows - edge case of user being deleted
        if (error.code === 'PGRST116') {
          await supabaseClient.auth.signOut()
          return null
        }
        throw new Error(error.message)
      }

      console.log('inside useUserProfile', data)

      return data
    },
  })

  // Update user profile
  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
      if (!user?.id) throw new Error('User ID is required for profile update')
      
      const { data, error } = await supabaseClient
        .from('users_profiles')
        .update(updates)
        .eq('id', user.id) // Add WHERE clause to specify which user's profile to update
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      refetch()
    },
  })

  // Get user completion statistics
  const getCompletionStats = () => {
    return useQuery({
      queryKey: statsKey,
      queryFn: async () => {
        const { data, error } = await supabaseClient.rpc('user_get_completion_stats')

        if (error) throw error
        return data
      },
    })
  }

  return {
    profile,
    isLoading,
    updateProfile,
    getCompletionStats,
    refetch,
  }
}

export const useQuizSystem = () => {
  const { supabaseClient } = useSessionContext()
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
      const { data, error } = await supabaseClient.rpc('quiz_record_user_answer', {
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
        const { data, error } = await supabaseClient.rpc('quiz_get_results', {
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
        const { data, error } = await supabaseClient.rpc('quiz_check_completion', {
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
      const { data, error } = await supabaseClient.rpc('quiz_mark_completed', {
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
  const { supabaseClient } = useSessionContext()

  // Define query key as a constant
  const userEventsKey = ['user-events'] as const

  return useQuery({
    queryKey: userEventsKey,
    queryFn: async (): Promise<SystemEvent[]> => {
      const { data, error } = await supabaseClient
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
  const { supabaseClient } = useSessionContext()

  // Record a system event
  const recordSystemEvent = useMutation({
    mutationFn: async (params: {
      eventType: Database['public']['Enums']['event_type']
      lectureId?: number
      chapterId?: number
      quizQuestionId?: number
      metadata?: Json
    }) => {
      const { data, error } = await supabaseClient.rpc('system_record_event', {
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
  const { supabaseClient } = useSessionContext()
  const queryClient = useQueryClient()

  // Define query key as a constant
  const userFeedbackKey = ['user-feedback'] as const

  // Submit user feedback
  const submitFeedback = useMutation({
    mutationFn: async (description: string) => {
      const { data, error } = await supabaseClient
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
        const { data, error } = await supabaseClient
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
