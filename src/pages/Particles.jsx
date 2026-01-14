import { useRef, useEffect, useState, useCallback } from 'react';
import CanvasComponent from '../components/CanvasComponent';
import { animateParticles } from '../utils/particleDrawing';
import { useResponsiveCanvas } from '../hooks';
import '../styles/shapes.css';

function Particles() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null, radius: 100 });
  const [isAnimating, setIsAnimating] = useState(true);
  const { width, height } = useResponsiveCanvas(600, 500);

  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    const ctx = canvasRef.current?.getContext();

    if (canvas && ctx) {
      const scaleFactor = Math.min(width, height) / 500;
      animateParticles({
        canvas,
        ctx,
        particlesRef,
        mouseRef,
        animationRef,
        particleCount: Math.floor(100 * scaleFactor),
        connectionDistance: Math.floor(100 * scaleFactor),
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

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas || !e.touches[0]) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = e.touches[0].clientX - rect.left;
    mouseRef.current.y = e.touches[0].clientY - rect.top;
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
      <p>Move your mouse or touch the canvas to interact with particles!</p>
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
      >
        <CanvasComponent ref={canvasRef} width={width} height={height} />
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
