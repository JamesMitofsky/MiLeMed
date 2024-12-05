import { useMutation, useQueryClient } from '@tanstack/react-query'

import { LectureEventsType } from '../supabase/databaseTypes'
import { useSupabase } from '../supabase/useSupabase'
import { useUser } from '../useUser'

const useMarkLectureAsRead = () => {
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  const { user } = useUser()

  return useMutation({
    mutationFn: async (lecture_id: LectureEventsType['lecture_id']) => {
      if (!user) throw new Error('User not found')

      const { error } = await supabase.from('lecture_events').insert([
        {
          profile_id: user.id,
          lecture_id,
          event_type: 'LECTURE_MARKED_AS_READ',
        },
      ])

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['lecture_events'])
    },
  })
}

export { useMarkLectureAsRead }
