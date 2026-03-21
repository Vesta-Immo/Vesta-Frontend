"use client";

import { createContext, useContext, useCallback, useRef, type ReactNode } from "react";

interface SessionResetContextValue {
  registerPropertyListReset: (resetFn: () => void) => void;
  clearAllState: () => void;
}

const SessionResetContext = createContext<SessionResetContextValue | null>(null);

export function SessionResetProvider({ children }: { children: ReactNode }) {
  const resetFunctions = useRef<{
    propertyListStore?: () => void;
  }>({});

  const registerPropertyListReset = useCallback((resetFn: () => void) => {
    resetFunctions.current.propertyListStore = resetFn;
  }, []);

  const clearAllState = useCallback(() => {
    if (resetFunctions.current.propertyListStore) {
      resetFunctions.current.propertyListStore();
    }
  }, []);

  return (
    <SessionResetContext.Provider value={{ registerPropertyListReset, clearAllState }}>
      {children}
    </SessionResetContext.Provider>
  );
}

export function useSessionReset() {
  const context = useContext(SessionResetContext);
  if (!context) {
    throw new Error(
      "useSessionReset doit être utilisé dans SessionResetProvider."
    );
  }
  return context;
}
