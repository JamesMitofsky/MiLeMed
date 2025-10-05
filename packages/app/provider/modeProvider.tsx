import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ModeProviderState {
  mode: 'THEORETICAL' | 'PRACTICAL'
  setMode: (mode: 'THEORETICAL' | 'PRACTICAL') => void
}

interface ModeProviderProps {
  children: ReactNode
}

const ModeContext = createContext<ModeProviderState | undefined>(undefined)

export const ModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<ModeProviderState['mode']>('PRACTICAL')

  const setMode = (mode: ModeProviderState['mode']) => {
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
