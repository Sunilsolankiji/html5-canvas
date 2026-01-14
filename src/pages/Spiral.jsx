import { useRef, useEffect, useState, useCallback } from 'react';
import CanvasComponent from '../components/CanvasComponent';
import { animateSpiral } from '../utils/spiralDrawing';
import { useResponsiveCanvas } from '../hooks';
import '../styles/shapes.css';

function Spiral() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const { width, height } = useResponsiveCanvas(600, 500);

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    const ctx = canvasRef.current?.getContext();

    if (canvas && ctx) {
      const scaleFactor = Math.min(width, height) / 500;
      animateSpiral({
        canvas,
        ctx,
        maxRotations: 8,
        totalPoints: 1000,
        maxRadius: Math.floor(250 * scaleFactor),
        pointsPerFrame: 5,
        pointSize: Math.max(2, Math.floor(3 * scaleFactor)),
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
    canvasRef.current?.clear();
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 50);
  }, []);

  return (
    <div className="shape-page">
      <h2>🌀 Rainbow Spiral</h2>
      <p>A mesmerizing spiral with rainbow colors!</p>
      <CanvasComponent ref={canvasRef} width={width} height={height} />
      <div className="controls">
        <button className="btn btn-primary" onClick={handleRestart}>
          🔄 Restart Animation
        </button>
      </div>
    </div>
  );
}

export default Spiral;
