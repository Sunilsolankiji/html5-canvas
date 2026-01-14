import { useRef, useEffect, useState, useCallback } from 'react';
import CanvasComponent from '../components/CanvasComponent';
import { animateStar } from '../utils/starDrawing';
import { useResponsiveCanvas } from '../hooks';
import '../styles/shapes.css';

function Star() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const { width, height } = useResponsiveCanvas(600, 500);

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    const ctx = canvasRef.current?.getContext();

    if (canvas && ctx) {
      const scaleFactor = Math.min(width, height) / 500;
      animateStar({
        canvas,
        ctx,
        points: 5,
        outerRadius: Math.floor(200 * scaleFactor),
        innerRadius: Math.floor(80 * scaleFactor),
        animationRef,
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
      <h2>⭐ Glowing Star</h2>
      <p>A beautiful star that draws itself and glows!</p>
      <CanvasComponent ref={canvasRef} width={width} height={height} />
      <div className="controls">
        <button className="btn btn-primary" onClick={handleRestart}>
          🔄 Restart Animation
        </button>
      </div>
    </div>
  );
}

export default Star;
