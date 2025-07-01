import { useSupabase } from 'app/utils/supabase/useSupabase'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface VersionProviderState {
  appVersion: string
  dbVersion: string | null
  isLoading: boolean
  versionsMatch: boolean
}

interface VersionProviderProps {
  children: ReactNode
}

const VersionContext = createContext<VersionProviderState | undefined>(undefined)

export const VersionProvider: React.FC<VersionProviderProps> = ({ children }) => {
  const APP_VERSION = '1.0' // Hardcoded app version - update this when deploying a new version
  const [dbVersion, setDbVersion] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = useSupabase()

  useEffect(() => {
    const fetchDbVersion = async () => {
      try {
        const { data, error } = await supabase
          .from('db_version')
          .select('version')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()

        if (error) {
          console.error('Error fetching DB version:', error)
          setIsLoading(false)
          return
        }

        setDbVersion(data?.version || null)
      } catch (error) {
        console.error('Failed to fetch DB version:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDbVersion()
  }, [supabase])

  const value: VersionProviderState = {
    appVersion: APP_VERSION,
    dbVersion,
    isLoading,
    versionsMatch: dbVersion === APP_VERSION,
  }

  return <VersionContext.Provider value={value}>{children}</VersionContext.Provider>
}

export const useVersion = (): VersionProviderState => {
  const context = useContext(VersionContext)
  if (context === undefined) {
    throw new Error('useVersion must be used within a VersionProvider')
  }
  return context
}
