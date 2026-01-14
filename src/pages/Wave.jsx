import { useRef, useEffect, useState, useCallback } from 'react';
import CanvasComponent from '../components/CanvasComponent';
import { animateWaves, defaultWaves } from '../utils/waveDrawing';
import { useResponsiveCanvas } from '../hooks';
import '../styles/shapes.css';

function Wave() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const { width, height } = useResponsiveCanvas(600, 500);

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    const ctx = canvasRef.current?.getContext();

    if (canvas && ctx) {
      animateWaves({
        canvas,
        ctx,
        waves: defaultWaves,
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
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 50);
  }, []);

  return (
    <div className="shape-page">
      <h2>🌊 Ocean Waves</h2>
      <p>Relaxing animated waves with multiple layers!</p>
      <CanvasComponent
        key={`${width}-${height}`}
        ref={canvasRef}
        width={width}
        height={height}
      />
      <div className="controls">
        <button className="btn btn-primary" onClick={handleRestart}>
          🔄 Reset Waves
        </button>
      </div>
    </div>
  );
}

export default Wave;
