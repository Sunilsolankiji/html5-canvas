import { useState, useEffect } from 'react';

/**
 * Custom hook to get responsive canvas dimensions based on viewport size
 * @param {number} baseWidth - The base/maximum width for the canvas
 * @param {number} baseHeight - The base/maximum height for the canvas
 * @param {number} padding - Padding to subtract from viewport width (default: 40)
 * @returns {{ width: number, height: number }} - Responsive canvas dimensions
 */
export function useResponsiveCanvas(baseWidth = 600, baseHeight = 500, padding = 40) {
  const [dimensions, setDimensions] = useState({
    width: baseWidth,
    height: baseHeight,
  });

  useEffect(() => {
    const calculateDimensions = () => {
      const viewportWidth = window.innerWidth;
      const maxWidth = viewportWidth - padding;

      if (maxWidth < baseWidth) {
        const scale = maxWidth / baseWidth;
        setDimensions({
          width: Math.floor(maxWidth),
          height: Math.floor(baseHeight * scale),
        });
      } else {
        setDimensions({
          width: baseWidth,
          height: baseHeight,
        });
      }
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);

    return () => window.removeEventListener('resize', calculateDimensions);
  }, [baseWidth, baseHeight, padding]);

  return dimensions;
}

