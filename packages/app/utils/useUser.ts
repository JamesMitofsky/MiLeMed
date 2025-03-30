import { useUserProfile } from './hooks/queryHooks'
import { useSessionContext } from './supabase/useSessionContext'

export const useUser = () => {
  const { session, isLoading: isLoadingSession } = useSessionContext()
  const user = session?.user
  const { profile, isLoading: isLoadingProfile } = useUserProfile()

  return {
    session,
    user,
    profile,
    isLoadingSession,
    isLoadingProfile,
    isLoading: isLoadingSession || isLoadingProfile,
  }
}
