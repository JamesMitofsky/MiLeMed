import React, { createContext, useContext, useState, ReactNode } from 'react'

import { ModeType } from '../utils/supabase/databaseTypes'

interface ModeProviderState {
  mode: ModeType
  setMode: (mode: ModeType) => void
}

interface ModeProviderProps {
  children: ReactNode
}

const ModeContext = createContext<ModeProviderState | undefined>(undefined)

export const ModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<ModeType>('THEORETICAL')

  const setMode = (mode: ModeType) => {
    setModeState(mode)
  }

  return <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>
}

export const useMode = (): ModeProviderState => {
  const context = useContext(ModeContext)
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider')
  }
  return context
}
