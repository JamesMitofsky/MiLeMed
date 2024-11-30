import { useFocusEffect } from '@react-navigation/native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

import { ModeType } from '../supabase/databaseTypes'
import { useSupabase } from '../supabase/useSupabase'
import { useUser } from '../useUser'

const useFetchChapterWithLectureCount = (limit?: number, mode?: ModeType) => {
  const supabase = useSupabase()
  const { user } = useUser()
  const queryClient = useQueryClient()

  const queryFn = useMemo(() => {
    return async () => {
      if (!user?.id) {
        throw new Error('User ID is not available')
      }

      // Define the RPC call
      let query = supabase.rpc('get_chapter_summary', {
        user_id: user.id,
        chapter_mode: mode,
      })

      // Apply the limit directly on the query
      if (limit) {
        query = query.limit(limit)
      }

      // Execute the query
      const { data, error } = await query

      if (error) {
        // Handle unauthorized access by signing out if relevant
        if (error.code === 'PGRST116') {
          // Confirm that `PGRST116` is an appropriate code for this scenario
          await supabase.auth.signOut()
          return null
        }
        throw new Error(error.message)
      }

      return data
    }
  }, [limit, supabase, user?.id, mode]) // Add `user?.id` to dependencies

  useFocusEffect(
    useCallback(() => {
      // Refetch chapters on focus when navigating back
      queryClient.invalidateQueries(['chapters', user?.id, limit, mode])
    }, [queryClient, user?.id, limit, mode])
  )

  return useQuery(['chapters', user?.id, limit, mode], queryFn)
}

export default useFetchChapterWithLectureCount
