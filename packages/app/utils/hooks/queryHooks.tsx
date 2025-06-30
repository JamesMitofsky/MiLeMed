import { Database, Json } from '@my/supabase/types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { UserProfile, SystemEvent } from '../supabase/databaseTypes'
import { useSessionContext } from '../supabase/useSessionContext'
import { useSupabase } from '../supabase/useSupabase'

// Comprehensive Hooks Collection
export const useChapters = (mode?: Database['public']['Enums']['mode']) => {
  const supabase = useSupabase()

  // Define query key as a constant
  const getChapterSummaryKey = (chapterMode?: Database['public']['Enums']['mode']) =>
    chapterMode ? (['chapters', chapterMode] as const) : (['chapters'] as const)

  // Get chapter summary with completion status
  const chapterQuery = useQuery<Database['public']['Functions']['chapter_get_summary']['Returns']>({
    queryKey: getChapterSummaryKey(mode),
    queryFn: async () => {
      // Type-safe RPC call with proper function name and args typing
      const rpcName = 'chapter_get_summary' as keyof Database['public']['Functions']
      const args: Database['public']['Functions']['chapter_get_summary']['Args'] = {
        chapter_mode: mode,
      }

      const { data, error } = await supabase.rpc(rpcName, args)

      if (error) throw error
      return data as Database['public']['Functions']['chapter_get_summary']['Returns']
    },
  })

  return {
    data: chapterQuery.data,
    isLoading: chapterQuery.isLoading,
    isPending: chapterQuery.isPending,
    error: chapterQuery.error,
    refetch: chapterQuery.refetch,
  }
}

export const useLectures = (chapterId?: number) => {
  const { supabaseClient } = useSessionContext()
  const queryClient = useQueryClient()

  // Define query keys as constants
  const getLecturesKey = (chapterId: number) => ['lectures', chapterId] as const
  const getLectureByIdKey = (lectureId: number) => ['lecture', lectureId] as const

  // Get lectures with completion status for a specific chapter
  const lecturesQuery = useQuery({
    queryKey: chapterId ? getLecturesKey(chapterId) : ['lectures'],
    queryFn: async () => {
      if (!chapterId) return null

      const rpcName = 'lecture_get_with_completion' as keyof Database['public']['Functions']
      const args: Database['public']['Functions']['lecture_get_with_completion']['Args'] = {
        p_chapter_id: chapterId,
      }
      const { data, error } = await supabaseClient.rpc(rpcName, args)

      if (error) throw error
      return data
    },
    enabled: !!chapterId, // Only run the query if chapterId is provided
  })
  // Custom hook to get a single lecture by ID
  const useLectureById = (lectureId: number) => {
    return useQuery({
      queryKey: getLectureByIdKey(lectureId),
      queryFn: async () => {
        const rpcName = 'lecture_get_by_id' as keyof Database['public']['Functions']
        const args: Database['public']['Functions']['lecture_get_by_id']['Args'] = {
          p_lecture_id: lectureId,
        }
        const { data, error } = await supabaseClient.rpc(rpcName, args)

        if (error) throw error
        return data[0] // Returns the first (and only) result
      },
    })
  }

  // Mark lecture as completed
  const markLectureCompleted = useMutation({
    mutationFn: async (lectureId: number) => {
      const rpcName = 'lecture_mark_completed' as keyof Database['public']['Functions']
      const args: Database['public']['Functions']['lecture_mark_completed']['Args'] = {
        p_lecture_id: lectureId,
      }
      const { data, error } = await supabaseClient.rpc(rpcName, args)

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
    data: lecturesQuery.data,
    isLoading: lecturesQuery.isLoading,
    isPending: lecturesQuery.isPending,
    error: lecturesQuery.error,
    refetch: lecturesQuery.refetch,
    useLectureById,
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
    isPending,
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
  const useCompletionStats = () => {
    return useQuery({
      queryKey: statsKey,
      queryFn: async () => {
        const rpcName = 'user_get_completion_stats' as keyof Database['public']['Functions']
        const args: Database['public']['Functions']['user_get_completion_stats']['Args'] = {}
        const { data, error } = await supabaseClient.rpc(rpcName, args)

        if (error) throw error
        return data
      },
    })
  }

  return {
    profile,
    isPending,
    isLoading,
    updateProfile,
    useCompletionStats,
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
      const rpcName = 'quiz_record_user_answer' as keyof Database['public']['Functions']
      const args: Database['public']['Functions']['quiz_record_user_answer']['Args'] = {
        p_question_id: params.questionId,
        p_answer_text: params.answerText,
        p_chosen_option_ids: params.chosenOptionIds,
      }
      const { data, error } = await supabaseClient.rpc(rpcName, args)

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

  // Custom hook to get quiz results for a lecture
  const useQuizResults = (lectureId: number) => {
    return useQuery({
      queryKey: quizResultsKey(lectureId),
      queryFn: async () => {
        const rpcName = 'quiz_get_results' as keyof Database['public']['Functions']
        const args: Database['public']['Functions']['quiz_get_results']['Args'] = {
          p_lecture_id: lectureId,
        }
        const { data, error } = await supabaseClient.rpc(rpcName, args)

        if (error) throw error
        return data
      },
    })
  }

  // Custom hook to check if all questions in a lecture quiz are answered
  const useQuizCompletion = (lectureId: number) => {
    return useQuery({
      queryKey: quizCompletionKey(lectureId),
      queryFn: async () => {
        const rpcName = 'quiz_check_completion' as keyof Database['public']['Functions']
        const args: Database['public']['Functions']['quiz_check_completion']['Args'] = {
          p_lecture_id: lectureId,
        }
        const { data, error } = await supabaseClient.rpc(rpcName, args)

        if (error) throw error
        return data
      },
    })
  }

  // Mark quiz as completed (passed/failed)
  const markQuizCompleted = useMutation({
    mutationFn: async (params: { lectureId: number; passed: boolean }) => {
      const rpcName = 'quiz_mark_completed' as keyof Database['public']['Functions']
      const args: Database['public']['Functions']['quiz_mark_completed']['Args'] = {
        p_lecture_id: params.lectureId,
        p_passed: params.passed,
      }
      const { data, error } = await supabaseClient.rpc(rpcName, args)

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
    useQuizResults,
    useQuizCompletion,
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

export const useAllChaptersAndLectures = (mode?: 'THEORETICAL' | 'PRACTICAL') => {
  const { supabaseClient } = useSessionContext()

  console.log('🔍 useAllChaptersAndLectures called with mode:', mode)

  // Define query keys as constants
  const getAllChaptersAndLecturesKey = (chapterMode?: 'THEORETICAL' | 'PRACTICAL') =>
    ['all-chapters-and-lectures', chapterMode] as const

  // Get all chapters and their lectures without completion status
  const chaptersAndLecturesQuery = useQuery({
    queryKey: getAllChaptersAndLecturesKey(mode),
    queryFn: async () => {
      console.log('🔄 Query function executing with mode:', mode)

      // First get all chapters based on mode filter
      let chaptersQuery = supabaseClient
        .from('content_chapters')
        .select('*')
        .order('sort_order', { ascending: true })

      // Only apply the filter if mode is specified
      if (mode) {
        console.log(`🔍 Filtering chapters by mode: ${mode}`)
        chaptersQuery = chaptersQuery.eq('mode', mode)
      } else {
        console.log('🔍 No mode filter applied, fetching all chapters')
      }

      const { data: chapters, error: chaptersError } = await chaptersQuery

      console.log(`📊 Chapters query result: ${chapters?.length || 0} chapters found`)

      if (chaptersError) {
        console.error('❌ Error fetching chapters:', chaptersError)
        throw chaptersError
      }

      if (!chapters || chapters.length === 0) {
        console.log('⚠️ No chapters found, returning empty result')
        return { chapters: [], lecturesByChapter: {} }
      }

      // Then get all lectures for these chapters
      const lecturesByChapter: Record<number, unknown[]> = {}

      // Get lectures for all chapters at once
      console.log(
        '🔍 Fetching lectures for chapter IDs:',
        chapters.map((chapter) => chapter.id)
      )

      const { data: allLectures, error: lecturesError } = await supabaseClient
        .from('content_lectures')
        .select('*')
        .in(
          'chapter_id',
          chapters.map((chapter) => chapter.id)
        )
        .order('sort_order', { ascending: true })

      console.log(`📊 Lectures query result: ${allLectures?.length || 0} lectures found`)

      if (lecturesError) {
        console.error('❌ Error fetching lectures:', lecturesError)
        throw lecturesError
      }

      // Organize lectures by chapter
      if (allLectures) {
        allLectures.forEach((lecture) => {
          if (!lecturesByChapter[lecture.chapter_id]) {
            lecturesByChapter[lecture.chapter_id] = []
          }
          lecturesByChapter[lecture.chapter_id].push(lecture)
        })

        console.log(
          '📊 Organized lectures by chapter:',
          Object.keys(lecturesByChapter).length,
          'chapters with lectures'
        )
      } else {
        console.log('⚠️ No lectures found')
      }

      const result = {
        chapters,
        lecturesByChapter,
      }

      console.log('✅ Query function completed successfully')
      return result
    },
  })

  console.log('🔄 Hook state:', {
    isLoading: chaptersAndLecturesQuery.isLoading,
    isError: !!chaptersAndLecturesQuery.error,
    dataAvailable: !!chaptersAndLecturesQuery.data,
  })

  return {
    data: chaptersAndLecturesQuery.data,
    isLoading: chaptersAndLecturesQuery.isLoading,
    error: chaptersAndLecturesQuery.error,
    refetch: chaptersAndLecturesQuery.refetch,
  }
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
      const rpcName = 'system_record_event' as keyof Database['public']['Functions']
      const args: Database['public']['Functions']['system_record_event']['Args'] = {
        p_event_type: params.eventType,
        p_lecture_id: params.lectureId,
        p_chapter_id: params.chapterId,
        p_quiz_question_id: params.quizQuestionId,
        p_metadata: params.metadata || {},
      }
      const { data, error } = await supabaseClient.rpc(rpcName, args)

      if (error) throw error
      return data
    },
  })

  return { recordSystemEvent }
}

export const useQuizOptions = (questionIds?: number[]) => {
  const { supabaseClient } = useSessionContext()

  // Define query key as a constant
  const quizOptionsKey = questionIds ? ['quiz-options', questionIds] : (['quiz-options'] as const)

  // Get quiz options filtered by question IDs if provided
  const quizOptionsQuery = useQuery({
    queryKey: quizOptionsKey,
    queryFn: async () => {
      // Start with the base query
      let query = supabaseClient.from('quiz_options').select('*')

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

  // Get options for a specific question
  const getOptionsForQuestion = (questionId: number) => {
    if (!quizOptionsQuery.data) return []
    return quizOptionsQuery.data.filter((option) => option.question_id === questionId)
  }

  return {
    data: quizOptionsQuery.data,
    isLoading: quizOptionsQuery.isLoading,
    error: quizOptionsQuery.error,
    refetch: quizOptionsQuery.refetch,
    getOptionsForQuestion,
  }
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
  const useFeedbackHistory = () => {
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
    useFeedbackHistory,
  }
}
