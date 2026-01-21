import { useEffect, useRef } from 'react';
import { addScrollAnimation, clearScrollAnimation } from '../utils/initScrollAnimations';

/**
 * React hook for applying scroll animations to elements
 * @param {string} animationType - Type of animation: 'default', 'slide-left', 'slide-right', 'scale', 'fade', 'rotate'
 * @param {number} delayMs - Delay in milliseconds
 * @returns {React.RefObject} Ref to attach to element
 */
export function useScrollAnimation(animationType = 'default', delayMs = 0) {
  const elementRef = useRef(null);

  useEffect(() => {
    if (elementRef.current) {
      addScrollAnimation(elementRef.current, animationType, delayMs);
    }

    return () => {
      if (elementRef.current) {
        clearScrollAnimation(elementRef.current);
      }
    };
  }, [animationType, delayMs]);

  return elementRef;
}

/**
 * Hook to apply scroll animations to multiple children with cascading delays
 * @param {string} animationType - Type of animation
 * @param {number} delayInterval - Interval in milliseconds between each child
 * @returns {Function} Function to apply to each child (index parameter required)
 */
export function useCascadingAnimation(animationType = 'default', delayInterval = 100) {
  return (index) => {
    const elementRef = useRef(null);

    useEffect(() => {
      if (elementRef.current) {
        addScrollAnimation(elementRef.current, animationType, delayInterval * index);
      }

      return () => {
        if (elementRef.current) {
          clearScrollAnimation(elementRef.current);
        }
      };
    }, [index, animationType, delayInterval]);

    return elementRef;
  };
}
