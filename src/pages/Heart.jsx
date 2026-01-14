import { useRef, useEffect, useState, useCallback } from 'react';
import CanvasComponent from '../components/CanvasComponent';
import { animateHeart } from '../utils/heartDrawing';
import { useResponsiveCanvas } from '../hooks';
import { COLORS } from '../constants';
import '../styles/shapes.css';

function Heart() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const { width, height } = useResponsiveCanvas(600, 500);

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    const ctx = canvasRef.current?.getContext();

    if (canvas && ctx) {
      // Scale the heart based on canvas size
      const baseScale = Math.min(width, height) / 40;
      animateHeart({
        canvas,
        ctx,
        baseScale,
        animationRef,
        strokeColor: COLORS.HEART_STROKE,
        fillColor: COLORS.HEART_FILL,
      });
    }
  }, [width, height]);

  useEffect(() => {
    if (isAnimating) {
      startAnimation();
    }

    const currentAnimationRef = animationRef.current;
    return () => {
      if (currentAnimationRef) {
        cancelAnimationFrame(currentAnimationRef);
      }
    };
  }, [isAnimating, startAnimation]);

  const handleRestart = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 50);
  }, []);

  return (
    <div className="shape-page">
      <h2>❤️ Animated Heart</h2>
      <p>Watch the heart draw, fill, and pulse with love!</p>
      <CanvasComponent
        key={`${width}-${height}`}
        ref={canvasRef}
        width={width}
        height={height}
      />
      <div className="controls">
        <button className="btn btn-primary" onClick={handleRestart}>
          🔄 Restart Animation
        </button>
      </div>
    </div>
  );
}

export default Heart;
