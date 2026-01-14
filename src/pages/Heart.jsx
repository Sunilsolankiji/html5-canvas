import { useRef, useEffect, useState, useCallback } from 'react';
import CanvasComponent from '../components/CanvasComponent';
import { animateHeart } from '../utils/heartDrawing';
import { COLORS } from '../constants';
import '../styles/shapes.css';

function Heart() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    const ctx = canvasRef.current?.getContext();

    if (canvas && ctx) {
      animateHeart({
        canvas,
        ctx,
        baseScale: 15,
        animationRef,
        strokeColor: COLORS.HEART_STROKE,
        fillColor: COLORS.HEART_FILL,
      });
    }
  }, []);

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
      <CanvasComponent ref={canvasRef} width={600} height={500} />
      <div className="controls">
        <button className="btn btn-primary" onClick={handleRestart}>
          🔄 Restart Animation
        </button>
      </div>
    </div>
  );
}

export default Heart;
