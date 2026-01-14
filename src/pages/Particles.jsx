import { useRef, useEffect, useState, useCallback } from 'react';
import CanvasComponent from '../components/CanvasComponent';
import { animateParticles } from '../utils/particleDrawing';
import '../styles/shapes.css';

function Particles() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null, radius: 100 });
  const [isAnimating, setIsAnimating] = useState(true);

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    const ctx = canvasRef.current?.getContext();

    if (canvas && ctx) {
      animateParticles({
        canvas,
        ctx,
        particlesRef,
        mouseRef,
        animationRef,
        particleCount: 100,
        connectionDistance: 100,
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

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.x = null;
    mouseRef.current.y = null;
  }, []);

  const handleRestart = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    particlesRef.current = [];
    canvasRef.current?.clear();
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 50);
  }, []);

  return (
    <div className="shape-page">
      <h2>✨ Interactive Particles</h2>
      <p>Move your mouse over the canvas to interact with particles!</p>
      <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <CanvasComponent ref={canvasRef} width={600} height={500} />
      </div>
      <div className="controls">
        <button className="btn btn-primary" onClick={handleRestart}>
          🔄 Reset Particles
        </button>
      </div>
    </div>
  );
}

export default Particles;
