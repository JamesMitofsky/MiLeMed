import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { ModeType } from '../supabase/databaseTypes'
import { useSupabase } from '../supabase/useSupabase'

const useFetchChapterWithLectureCount = (limit?: number, mode?: ModeType) => {
  const supabase = useSupabase()

  const queryFn = useMemo(() => {
    return async () => {
      let query = supabase.rpc('get_chapters_with_completion', {
        mode,
      })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      console.log(data)
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
  }, [limit, supabase, mode])

  return useQuery(['chapters'], queryFn)
}

export default useFetchChapterWithLectureCount
