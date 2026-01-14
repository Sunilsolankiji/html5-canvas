import { useState, useEffect, useCallback } from 'react';

/**
 * Calculate responsive dimensions based on viewport
 */
function calculateResponsiveDimensions(baseWidth, baseHeight, padding) {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return { width: baseWidth, height: baseHeight };
  }

  const viewportWidth = window.innerWidth;
  const maxWidth = viewportWidth - padding;

  if (maxWidth < baseWidth) {
    const scale = maxWidth / baseWidth;
    return {
      width: Math.floor(maxWidth),
      height: Math.floor(baseHeight * scale),
    };
  }

  return {
    width: baseWidth,
    height: baseHeight,
  };
}

/**
 * Custom hook to get responsive canvas dimensions based on viewport size
 * @param {number} baseWidth - The base/maximum width for the canvas
 * @param {number} baseHeight - The base/maximum height for the canvas
 * @param {number} padding - Padding to subtract from viewport width (default: 40)
 * @returns {{ width: number, height: number }} - Responsive canvas dimensions
 */
export function useResponsiveCanvas(baseWidth = 600, baseHeight = 500, padding = 40) {
  // Calculate initial dimensions synchronously to avoid flash
  const [dimensions, setDimensions] = useState(() =>
    calculateResponsiveDimensions(baseWidth, baseHeight, padding)
  );

  const updateDimensions = useCallback(() => {
    const newDimensions = calculateResponsiveDimensions(baseWidth, baseHeight, padding);
    setDimensions(prev => {
      // Only update if dimensions actually changed
      if (prev.width !== newDimensions.width || prev.height !== newDimensions.height) {
        return newDimensions;
      }
      return prev;
    });
  }, [baseWidth, baseHeight, padding]);

  useEffect(() => {
    // Update on mount in case SSR dimensions differ
    updateDimensions();

    // Debounce resize handler to prevent excessive re-renders
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateDimensions, 100);
    };

    window.addEventListener('resize', handleResize);
    // Also listen for orientation change on mobile
    window.addEventListener('orientationchange', updateDimensions);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, [updateDimensions]);

  return dimensions;
}

