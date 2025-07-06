import { Database, Json } from '@my/supabase/types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { UserProfile, SystemEvent } from '../supabase/databaseTypes'
import { useSessionContext } from '../supabase/useSessionContext'
import { useSupabase } from '../supabase/useSupabase'

// Comprehensive Hooks Collection
type Chapter = Pick<
  Database['public']['Tables']['content_chapters']['Row'],
  'id' | 'title' | 'sort_order'
> & {
  lectures: (Pick<
    Database['public']['Tables']['content_lectures']['Row'],
    'id' | 'title' | 'sort_order'
  > & {
    is_completed: boolean
  })[]
}

export const useChaptersWithLectures = (mode?: Database['public']['Enums']['mode']) => {
  const { supabaseClient, session } = useSessionContext()
  const userId = session?.user.id

  return useQuery<Chapter[], Error>({
    queryKey: ['chaptersWithLectures', userId, mode],
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5m
    cacheTime: 1000 * 60 * 30, // 30m
    queryFn: async () => {
      console.log('[useChaptersWithLectures] queryFn executing')
      if (!userId) {
        console.error('[useChaptersWithLectures] Not authenticated')
        throw new Error('Not authenticated')
      }

      // 1️⃣ load chapters, optionally filtering by mode
      let chapterQuery = supabaseClient
        .from('content_chapters')
        .select('id, title, sort_order')
        .order('sort_order', { ascending: true })

      if (mode) {
        chapterQuery = chapterQuery.eq('mode', mode)
      }

      const { data: chapters, error: chapErr } = await chapterQuery
      if (chapErr || !chapters) {
        console.error('[useChaptersWithLectures] Chapter fetch error:', chapErr)
        throw chapErr
      }

      // 2️⃣ load lectures for those chapters
      const chapterIds = chapters.map((c) => c.id)

      const { data: lectures, error: lectErr } = await supabaseClient
        .from('content_lectures')
        .select('id, title, sort_order, chapter_id')
        .in('chapter_id', chapterIds)
        .order('sort_order', { ascending: true })
      if (lectErr || !lectures) {
        console.error('[useChaptersWithLectures] Lecture fetch error:', lectErr)
        throw lectErr
      }

      // 3️⃣ load completed lecture IDs (LECTURE_COMPLETED)

      const { data: completions, error: compErr } = await supabaseClient
        .from('system_events')
        .select('lecture_id')
        .eq('event_type', 'LECTURE_COMPLETED')
        .eq('profile_id', userId)
      if (compErr || !completions) {
        console.error('[useChaptersWithLectures] Completions fetch error:', compErr)
        throw compErr
      }

      // Check for null or undefined lecture_ids
      const validCompletions = completions.filter((c) => c.lecture_id != null)
      if (validCompletions.length !== completions.length) {
        console.warn(
          '[useChaptersWithLectures] Found completions with null lecture_id:',
          completions.filter((c) => c.lecture_id == null).length
        )
      }

      const completedSet = new Set(validCompletions.map((c) => c.lecture_id!))

      // 4️⃣ merge
      const result = chapters.map((c) => ({
        ...c,
        lectures: lectures
          .filter((l) => l.chapter_id === c.id)
          .map((l) => ({
            id: l.id,
            title: l.title,
            sort_order: l.sort_order,
            is_completed: completedSet.has(l.id),
          })),
      }))

      return result
    },
  })
}

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
    error: chapterQuery.error,
    refetch: chapterQuery.refetch,
  }
}

// Custom hook to get a lecture by ID
export const useLectureById = (lectureId: number) => {
  const { supabaseClient } = useSessionContext()
  const getLectureByIdKey = (id: number) => ['lecture', id] as const

  console.log('📌 useLectureById - Hook called with lectureId:', lectureId)
  console.log('📌 useLectureById - Enabled:', !!lectureId)

  return useQuery({
    queryKey: getLectureByIdKey(lectureId),
    queryFn: async () => {
      console.log('📌 useLectureById - queryFn executing')
      const rpcName = 'lecture_get_by_id' as keyof Database['public']['Functions']
      const args: Database['public']['Functions']['lecture_get_by_id']['Args'] = {
        p_lecture_id: lectureId,
      }
      console.log('📌 useLectureById - Making RPC call with args:', args)

      try {
        const { data, error } = await supabaseClient.rpc(rpcName, args)
        console.log('📌 useLectureById - RPC response:', { data, error })

        if (error) {
          console.error('📌 useLectureById - Error from RPC call:', error)
          throw error
        }

        if (!data || data.length === 0) {
          console.warn('📌 useLectureById - No data returned from RPC call')
          return null
        }

        console.log('📌 useLectureById - Returning data[0]:', data[0])
        return data[0] // Returns the first (and only) result
      } catch (e) {
        console.error('📌 useLectureById - Exception caught:', e)
        throw e
      }
    },
    enabled: !!lectureId,
  })
}
export type LectureItem = {
  id: number
  title: string
  sort_order: number
  is_completed: boolean
}

export function useLecturesInChapter(chapterId?: number) {
  const { supabaseClient, session } = useSessionContext()
  const userId = session?.user.id

  return useQuery<LectureItem[], Error>({
    queryKey: ['lecturesInChapter', userId, chapterId],
    enabled: !!userId && typeof chapterId === 'number',
    staleTime: 1000 * 60 * 5, // 5m
    cacheTime: 1000 * 60 * 30, // 30m
    queryFn: async () => {
      if (!userId) throw new Error('Not authenticated')
      if (chapterId === undefined) throw new Error('chapterId is required')

      // 1️⃣ Fetch all lectures in this chapter
      const { data: lectures, error: lectErr } = await supabaseClient
        .from('content_lectures')
        .select('id, title, sort_order')
        .eq('chapter_id', chapterId)
        .order('sort_order', { ascending: true })
      if (lectErr || !lectures) throw lectErr

      // 2️⃣ Fetch all QUIZ_PASSED events for this user
      const { data: comps, error: compErr } = await supabaseClient
        .from('system_events')
        .select('lecture_id')
        .eq('event_type', 'LECTURE_COMPLETED')
        .eq('profile_id', userId)
      if (compErr || !comps) throw compErr

      const completedSet = new Set(comps.map((c) => c.lecture_id!))

      // 3️⃣ Merge into the shape you want
      return lectures.map((l) => ({
        id: l.id,
        title: l.title,
        sort_order: l.sort_order,
        is_completed: completedSet.has(l.id),
      }))
    },
  })
}

export const useLectures = (chapterId?: number) => {
  const { supabaseClient } = useSessionContext()
  const queryClient = useQueryClient()

  // Define query keys as constants
  const getLecturesKey = (chapterId: number) => ['lectures', chapterId] as const

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
        queryKey: ['lecture', lectureId],
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
    error: lecturesQuery.error,
    refetch: lecturesQuery.refetch,
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
  const markLectureCompleted = useMutation({
    mutationFn: async (params: { lectureId: number }) => {
      const rpcName = 'lecture_mark_completed' as keyof Database['public']['Functions']
      const args: Database['public']['Functions']['lecture_mark_completed']['Args'] = {
        p_lecture_id: params.lectureId,
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
    markLectureCompleted,
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

// Hook to fetch reference answers from quiz_reference_answers table
export const useQuizReferenceAnswer = (questionId?: number) => {
  const supabaseClient = useSupabase()

  // Define query key as a constant
  const quizReferenceAnswersKey = questionId
    ? ['quiz-reference-answers', questionId]
    : (['quiz-reference-answers'] as const)

  // Get quiz reference answers filtered by question ID if provided
  const quizReferenceAnswersQuery = useQuery({
    queryKey: quizReferenceAnswersKey,
    queryFn: async () => {
      // Start with the base query
      let query = supabaseClient.from('quiz_reference_answers').select('*')

      // Apply filter for specific question ID if provided
      if (questionId) {
        query = query.eq('question_id', questionId)
      }

      // Execute the query
      const { data, error } = await query.order('id', { ascending: true })

      if (error) throw error
      return data
    },
    // Enable the query regardless of questionId being provided
    enabled: true,
  })

  // Get reference answers for a specific question
  const getReferenceAnswersForQuestion = (id: number) => {
    if (!quizReferenceAnswersQuery.data) return []
    return quizReferenceAnswersQuery.data.filter((answer) => answer.question_id === id)
  }

  return {
    data: quizReferenceAnswersQuery.data,
    isLoading: quizReferenceAnswersQuery.isLoading,
    error: quizReferenceAnswersQuery.error,
    refetch: quizReferenceAnswersQuery.refetch,
    getReferenceAnswersForQuestion,
  }
}

// Hook to fetch reference answers from quiz_reference_answers table TODO: this doesn't even work
export const useQuizReferenceAnswers = (questionIds?: number[]) => {
  const supabaseClient = useSupabase()

  // Define query key as a constant
  const quizReferenceAnswersKey = questionIds
    ? ['quiz-reference-answers', questionIds]
    : (['quiz-reference-answers'] as const)

  // Get quiz reference answers filtered by question IDs if provided
  const quizReferenceAnswersQuery = useQuery({
    queryKey: quizReferenceAnswersKey,
    queryFn: async () => {
      // Start with the base query
      let query = supabaseClient.from('quiz_reference_answers').select('*')

      // Apply filter for specific question IDs if provided
      if (questionIds && questionIds.length > 0) {
        query = query.in('question_id', questionIds)
      }

      // Execute the query
      const { data, error } = await query.order('id', { ascending: true })

      if (error) throw error
      return data
    },
    // Enable the query if questionIds is undefined or has elements
    enabled: !questionIds || questionIds.length > 0,
  })

  // Get reference answers for a specific question
  const getReferenceAnswersForQuestion = (questionId: number) => {
    if (!quizReferenceAnswersQuery.data) return []
    return quizReferenceAnswersQuery.data.filter((answer) => answer.question_id === questionId)
  }

  return {
    data: quizReferenceAnswersQuery.data,
    isLoading: quizReferenceAnswersQuery.isLoading,
    error: quizReferenceAnswersQuery.error,
    refetch: quizReferenceAnswersQuery.refetch,
    getReferenceAnswersForQuestion,
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
