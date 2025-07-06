import { useSupabase } from 'app/utils/supabase/useSupabase'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface VersionProviderState {
  appVersion: string
  dbVersion: string | null
  isLoading: boolean
  versionsMatch: boolean
  needsUpdate: boolean
}

interface VersionProviderProps {
  children: ReactNode
}

const VersionContext = createContext<VersionProviderState | undefined>(undefined)

// Compare version strings (e.g., "1.0", "1.2.0") and return true if version1 is less than version2
const isVersionLessThan = (version1: string, version2: string | null): boolean => {
  if (!version2) return false

  const v1Parts = version1.split('.').map(Number)
  const v2Parts = version2.split('.').map(Number)

  // Compare each part of the version
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = i < v1Parts.length ? v1Parts[i] : 0
    const v2Part = i < v2Parts.length ? v2Parts[i] : 0

    if (v1Part < v2Part) return true
    if (v1Part > v2Part) return false
  }

  // Versions are equal
  return false
}

export const VersionProvider: React.FC<VersionProviderProps> = ({ children }) => {
  const APP_VERSION = '2' // Hardcoded app version - update this when deploying a new version
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
    needsUpdate: isVersionLessThan(APP_VERSION, dbVersion),
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
