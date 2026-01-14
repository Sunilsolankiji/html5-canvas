import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing canvas animations
 * @param {Function} animationCallback - The animation function to call
 * @param {Object} options - Animation options
 * @param {boolean} options.autoStart - Whether to start animation automatically
 * @param {Array} options.dependencies - Dependencies to restart animation on change
 * @returns {Object} Animation controls and refs
 */
export function useCanvasAnimation(animationCallback, options = {}) {
  const { autoStart = true, dependencies = [] } = options;

  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const startAnimation = useCallback(() => {
    stopAnimation();

    const canvas = canvasRef.current?.getCanvas?.() || canvasRef.current;
    const ctx = canvasRef.current?.getContext?.() || canvas?.getContext?.('2d');

    if (canvas && ctx && animationCallback) {
      animationCallback({ canvas, ctx, animationRef });
    }
  }, [animationCallback, stopAnimation]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas?.() || canvasRef.current;
    const ctx = canvasRef.current?.getContext?.() || canvas?.getContext?.('2d');

    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const restart = useCallback(() => {
    stopAnimation();
    clearCanvas();
    // Small delay to allow cleanup
    setTimeout(startAnimation, 50);
  }, [stopAnimation, clearCanvas, startAnimation]);

  useEffect(() => {
    if (autoStart) {
      startAnimation();
    }

    return stopAnimation;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, ...dependencies]);

  return {
    canvasRef,
    animationRef,
    startAnimation,
    stopAnimation,
    clearCanvas,
    restart,
  };
}

export default useCanvasAnimation;

