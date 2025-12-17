'use client';

import { useAnimation } from '@/contexts/animation-context';
import { Coins } from 'lucide-react';

export function CoinAnimationOverlay() {
  const { isAnimating, onAnimationComplete } = useAnimation();

  if (!isAnimating) {
    return null;
  }

  const coinCount = 15;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      {Array.from({ length: coinCount }).map((_, i) => (
        <div
          key={i}
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            // Stagger the animation start time for each coin
            animationDelay: `${i * 0.1}s`,
          }}
          // When the last coin's animation ends, signal completion
          onAnimationEnd={i === coinCount - 1 ? onAnimationComplete : undefined}
        >
          <div 
            className="coin-animation"
            style={{
                // Randomize horizontal position and rotation for a more dynamic effect
                transform: `translateX(${(Math.random() - 0.5) * 400}px) rotate(${Math.random() * 360}deg)`
            }}
          >
            <Coins className="h-8 w-8 text-primary" style={{ filter: `hue-rotate(${Math.random() * 360}deg) drop-shadow(0 0 5px hsl(var(--primary)))` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
