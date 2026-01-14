import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { CANVAS_DEFAULTS } from '../constants';
import '../styles/canvas.css';

const CanvasComponent = forwardRef(function CanvasComponent(
  {
    width = CANVAS_DEFAULTS.WIDTH,
    height = CANVAS_DEFAULTS.HEIGHT,
    onDraw,
    backgroundColor = CANVAS_DEFAULTS.BACKGROUND_COLOR,
    className = '',
  },
  ref
) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    getContext: () => canvasRef.current?.getContext('2d'),
    clear: () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }
    },
    toDataURL: () => canvasRef.current?.toDataURL('image/png'),
    requestFullscreen: () => containerRef.current?.requestFullscreen(),
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && onDraw) {
      const ctx = canvas.getContext('2d');
      onDraw(ctx, canvas);
    }
  }, [onDraw]);

  return (
    <div className={`canvas-container ${className}`.trim()} ref={containerRef}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ backgroundColor }}
      />
    </div>
  );
});

export default CanvasComponent;
