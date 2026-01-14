import { useRef, useEffect, useState, useCallback } from 'react';
import CanvasComponent from '../components/CanvasComponent';
import { animateSpiral } from '../utils/spiralDrawing';
import '../styles/shapes.css';

function Spiral() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    const ctx = canvasRef.current?.getContext();

    if (canvas && ctx) {
      animateSpiral({
        canvas,
        ctx,
        maxRotations: 8,
        totalPoints: 1000,
        maxRadius: 250,
        pointsPerFrame: 5,
        pointSize: 3,
        animationRef,
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
    canvasRef.current?.clear();
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 50);
  }, []);

  return (
    <div className="shape-page">
      <h2>🌀 Rainbow Spiral</h2>
      <p>A mesmerizing spiral with rainbow colors!</p>
      <CanvasComponent ref={canvasRef} width={600} height={500} />
      <div className="controls">
        <button className="btn btn-primary" onClick={handleRestart}>
          🔄 Restart Animation
        </button>
      </div>
    </div>
  );
}

export default Spiral;
