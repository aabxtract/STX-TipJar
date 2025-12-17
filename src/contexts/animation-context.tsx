'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface AnimationContextType {
  isAnimating: boolean;
  triggerAnimation: () => void;
  onAnimationComplete: () => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = useCallback(() => {
    setIsAnimating(true);
  }, []);
  
  const onAnimationComplete = useCallback(() => {
    setIsAnimating(false);
  }, []);

  const value = { isAnimating, triggerAnimation, onAnimationComplete };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}
