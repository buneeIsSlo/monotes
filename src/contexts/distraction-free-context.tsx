"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DistractionFreeContextType {
  isDistracted: boolean;
  triggerDistraction: () => void;
  resetDistraction: () => void;
}

const DistractionFreeContext = createContext<DistractionFreeContextType | undefined>(undefined);

export function DistractionFreeProvider({ children }: { children: ReactNode }) {
  const [isDistracted, setIsDistracted] = useState(false);

  const triggerDistraction = () => {
    setIsDistracted(true);
  };

  const resetDistraction = () => {
    setIsDistracted(false);
  };

  return (
    <DistractionFreeContext.Provider
      value={{
        isDistracted,
        triggerDistraction,
        resetDistraction,
      }}
    >
      {children}
    </DistractionFreeContext.Provider>
  );
}

export function useDistractionFree() {
  const context = useContext(DistractionFreeContext);
  if (context === undefined) {
    throw new Error("useDistractionFree must be used within a DistractionFreeProvider");
  }
  return context;
}
