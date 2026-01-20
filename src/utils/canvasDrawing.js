import { parseFunction } from './parseFunction';

/**
 * Calculate points for a parametric shape
 * @param {Object} options - Drawing options
 * @returns {Array} - Array of {x, y} points
 */
export function calculatePoints(options) {
  const {
    xFunction,
    yFunction,
    tEnd,
    scale,
    centerX,
    centerY,
    numPoints = 1000,
    progress = 1,
  } = options;

  const getX = parseFunction(xFunction);
  const getY = parseFunction(yFunction);

  const points = [];
  const pointCount = Math.floor(numPoints * progress);

  for (let i = 0; i <= pointCount; i++) {
    const t = (i / numPoints) * tEnd;
    const x = getX(t);
    const y = getY(t);
    if (isNaN(x) || isNaN(y) || !isFinite(x) || !isFinite(y)) {
      continue;
    }
    points.push({
      x: centerX + x * scale,
      y: centerY - y * scale,
      t, // Store t value for gradient coloring
    });
  }

  return points;
}

/**
 * Create a gradient from preset
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} canvas - Canvas element
 * @param {Object} gradientPreset - Gradient configuration
 * @returns {CanvasGradient} - Canvas gradient
 */
export function createGradientFromPreset(ctx, canvas, gradientPreset) {
  if (!gradientPreset) return null;

  let gradient;
  if (gradientPreset.type === 'radial') {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = Math.min(cx, cy);
    gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  } else {
    gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  }

  gradientPreset.stops.forEach(stop => {
    gradient.addColorStop(stop.offset, stop.color);
  });

  return gradient;
}

/**
 * Draw a parametric shape on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {Object} options - Drawing options
 */
export function drawPath(ctx, options) {
  const {
    points,
    strokeColor,
    fillColor,
    lineWidth,
    showFill,
    closePath = true,
    lineDash = [],
    showGlow = false,
    glowIntensity = 20,
    useGradient = false,
    gradient = null,
  } = options;

  if (points.length < 2) return;

  ctx.setLineDash(lineDash);

  // Apply glow effect
  if (showGlow) {
    ctx.shadowColor = strokeColor;
    ctx.shadowBlur = glowIntensity;
  } else {
    ctx.shadowBlur = 0;
  }

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  if (closePath) {
    ctx.closePath();
    if (showFill) {
      ctx.fillStyle = useGradient && gradient ? gradient : fillColor;
      ctx.fill();
    }
  }

  ctx.strokeStyle = useGradient && gradient ? gradient : strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // Reset
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;
}

/**
 * Draw path tracer dot
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} point - Current point {x, y}
 * @param {string} color - Dot color
 */
export function drawPathTracer(ctx, point, color = '#ff0000') {
  if (!point) return;

  ctx.beginPath();
  ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Inner dot
  ctx.beginPath();
  ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
}

/**
 * Draw rainbow gradient along path
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Array} points - Array of points
 * @param {number} lineWidth - Line width
 */
export function drawRainbowPath(ctx, points, lineWidth = 2) {
  if (points.length < 2) return;

  for (let i = 1; i < points.length; i++) {
    const hue = (i / points.length) * 360;
    ctx.beginPath();
    ctx.moveTo(points[i - 1].x, points[i - 1].y);
    ctx.lineTo(points[i].x, points[i].y);
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

/**
 * Draw a parametric shape with optional animation
 * @param {Object} params - Parameters for drawing
 */
export function drawParametricShape(params) {
  const {
    canvas,
    ctx,
    xFunction,
    yFunction,
    scale,
    tEnd,
    strokeColor,
    fillColor,
    lineWidth,
    showFill,
    animated = true,
    animateDrawing = true,
    animationSpeed = 1,
    animationRef,
    isPausedRef,
    lineDash = [],
    showGlow = false,
    glowIntensity = 20,
    showTrail = false,
    showPathTracer = false,
    useGradient = false,
    gradientPreset = null,
    backgroundColor = '#0a0a0a',
    showGrid = false,
    showFormula = false,
    customAnimation = 'none',
    animationIntensity = 1,
    animationDirection = 1,
    animationTiming = 'afterDrawing', // 'duringDrawing', 'afterDrawing', 'both'
    onError,
  } = params;

  if (!canvas || !ctx) return;

  // Cancel any existing animation
  if (animationRef?.current) {
    cancelAnimationFrame(animationRef.current);
  }

  // Validate functions
  try {
    const getX = parseFunction(xFunction);
    const getY = parseFunction(yFunction);
    getX(0);
    getY(0);
  } catch (e) {
    onError?.(e.message);
    return;
  }

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const numPoints = 1000;

  // Create gradient if needed
  const gradient = useGradient ? createGradientFromPreset(ctx, canvas, gradientPreset) : null;

  // Animation time tracker for custom animations
  let animTime = 0;

  /**
   * Apply custom animation transformations
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} time - Animation time
   * @param {string} animType - Animation type
   * @param {number} intensity - Animation intensity
   * @param {number} direction - Animation direction (1 or -1)
   */
  const applyCustomAnimation = (ctx, time, animType, intensity, direction) => {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const t = time * direction;

    switch (animType) {
      case 'rotate':
        ctx.translate(cx, cy);
        ctx.rotate(t * 0.02 * intensity);
        ctx.translate(-cx, -cy);
        break;
      case 'pulse':
        const pulseScale = 1 + Math.sin(t * 0.05 * intensity) * 0.15 * intensity;
        ctx.translate(cx, cy);
        ctx.scale(pulseScale, pulseScale);
        ctx.translate(-cx, -cy);
        break;
      case 'breathe':
        const breatheScale = 1 + Math.sin(t * 0.02 * intensity) * 0.1 * intensity;
        const breatheY = Math.sin(t * 0.02 * intensity) * 5 * intensity;
        ctx.translate(cx, cy + breatheY);
        ctx.scale(breatheScale, breatheScale);
        ctx.translate(-cx, -cy);
        break;
      case 'bounce':
        const bounceY = Math.abs(Math.sin(t * 0.04 * intensity)) * 30 * intensity;
        const squash = 1 + Math.abs(Math.sin(t * 0.04 * intensity + Math.PI / 2)) * 0.1;
        ctx.translate(cx, cy - bounceY);
        ctx.scale(1 / squash, squash);
        ctx.translate(-cx, -cy);
        break;
      case 'wave':
        const waveSkew = Math.sin(t * 0.03 * intensity) * 0.1 * intensity;
        ctx.translate(cx, cy);
        ctx.transform(1, waveSkew, waveSkew, 1, 0, 0);
        ctx.translate(-cx, -cy);
        break;
      case 'spiral':
        const spiralScale = 1 + Math.sin(t * 0.02 * intensity) * 0.2 * intensity;
        const spiralRotate = t * 0.01 * intensity;
        ctx.translate(cx, cy);
        ctx.rotate(spiralRotate);
        ctx.scale(spiralScale, spiralScale);
        ctx.translate(-cx, -cy);
        break;
      case 'shake':
        const shakeX = (Math.random() - 0.5) * 8 * intensity;
        const shakeY = (Math.random() - 0.5) * 8 * intensity;
        ctx.translate(shakeX, shakeY);
        break;
      case 'morph':
        const morphX = 1 + Math.sin(t * 0.025 * intensity) * 0.15 * intensity;
        const morphY = 1 + Math.cos(t * 0.025 * intensity) * 0.15 * intensity;
        ctx.translate(cx, cy);
        ctx.scale(morphX, morphY);
        ctx.translate(-cx, -cy);
        break;
      default:
        break;
    }
  };

  const draw = (progress) => {
    // Save context state before transformations
    ctx.save();

    // Trail effect: don't fully clear canvas
    if (showTrail) {
      ctx.fillStyle = backgroundColor.replace(/[^,]+(?=\))/, '0.05').includes('rgba')
        ? backgroundColor.replace(/[^,]+(?=\))/, '0.05')
        : 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Clear and fill with background color
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw grid if enabled (before transformations)
    if (showGrid) {
      drawGrid(ctx, canvas);
    }

    // Determine if we should apply custom animation based on timing
    const isDrawingComplete = progress >= 1;
    const shouldAnimate = customAnimation && customAnimation !== 'none' && (
      (animationTiming === 'duringDrawing' && !isDrawingComplete) ||
      (animationTiming === 'afterDrawing' && isDrawingComplete) ||
      (animationTiming === 'both')
    );

    // Apply custom animation transformation
    if (shouldAnimate) {
      applyCustomAnimation(ctx, animTime, customAnimation, animationIntensity, animationDirection);
    }

    const points = calculatePoints({
      xFunction,
      yFunction,
      tEnd,
      scale,
      centerX,
      centerY,
      numPoints,
      progress,
    });

    // Draw rainbow path if gradient is rainbow
    if (useGradient && gradientPreset?.name === 'Rainbow') {
      drawRainbowPath(ctx, points, lineWidth);
    } else {
      drawPath(ctx, {
        points,
        strokeColor,
        fillColor,
        lineWidth,
        showFill,
        closePath: progress >= 1,
        lineDash,
        showGlow,
        glowIntensity,
        useGradient,
        gradient,
      });
    }

    // Draw path tracer
    if (showPathTracer && points.length > 0) {
      drawPathTracer(ctx, points[points.length - 1], strokeColor);
    }

    // Restore context state (removes transformations)
    ctx.restore();

    // Draw formula overlay (after restore so it's not transformed)
    if (showFormula) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(10, 10, 300, 70);
      ctx.fillStyle = '#48dbfb';
      ctx.font = '12px monospace';
      ctx.fillText(`X(t) = ${xFunction.replace('t => ', '')}`, 20, 35);
      ctx.fillText(`Y(t) = ${yFunction.replace('t => ', '')}`, 20, 55);
      ctx.fillStyle = '#888';
      ctx.fillText(`t ∈ [0, ${(tEnd / Math.PI).toFixed(2)}π]`, 20, 75);
    }
  };

  if (animated && animateDrawing) {
    let progress = 0;
    const hasCustomAnimation = customAnimation && customAnimation !== 'none';
    // Determine if we need to continue animating after drawing completes
    const shouldContinueAfterDrawing = hasCustomAnimation &&
      (animationTiming === 'afterDrawing' || animationTiming === 'both');

    const animate = () => {
      if (isPausedRef?.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Increment animation time for custom animations
      animTime += animationSpeed;

      progress += 0.01 * animationSpeed;
      if (progress > 1) {
        progress = 1;
      }
      draw(progress);
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else if (showPathTracer || shouldContinueAfterDrawing) {
        // Continue animating for path tracer or custom animations (if timing allows)
        if (showPathTracer) {
          progress = 0;
        }
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animate();
  } else if (customAnimation && customAnimation !== 'none' &&
             (animationTiming === 'afterDrawing' || animationTiming === 'both')) {
    // If not animating drawing but has custom animation that should run after drawing
    const animateCustom = () => {
      if (isPausedRef?.current) {
        animationRef.current = requestAnimationFrame(animateCustom);
        return;
      }
      animTime += animationSpeed;
      draw(1);
      animationRef.current = requestAnimationFrame(animateCustom);
    };
    animateCustom();
  } else {
    draw(1);
  }
}

/**
 * Draw coordinate grid
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} options - Grid options
 */
export function drawGrid(ctx, canvas, options = {}) {
  const {
    gridSize = 50,
    color = 'rgba(255,255,255,0.1)',
    centerColor = 'rgba(255,255,255,0.3)',
    showLabels = false,
  } = options;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  // Vertical lines
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Center lines
  ctx.strokeStyle = centerColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();

  if (showLabels) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px monospace';
    ctx.fillText('0', canvas.width / 2 + 5, canvas.height / 2 - 5);
    ctx.fillText('x', canvas.width - 15, canvas.height / 2 - 5);
    ctx.fillText('y', canvas.width / 2 + 5, 15);
  }
}

/**
 * Export canvas as image
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {string} format - Export format (png, jpg)
 * @param {string} filename - Output filename
 * @param {number} quality - JPEG quality (0-1)
 */
export function exportCanvasAsImage(canvas, format = 'png', filename = 'canvas', quality = 0.95) {
  const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
  const dataUrl = canvas.toDataURL(mimeType, quality);

  const link = document.createElement('a');
  link.download = `${filename}.${format}`;
  link.href = dataUrl;
  link.click();
}

/**
 * Export canvas as SVG (approximate)
 * @param {Array} points - Shape points
 * @param {Object} options - SVG options
 * @returns {string} - SVG string
 */
export function exportAsSVG(points, options = {}) {
  const {
    width = 600,
    height = 500,
    strokeColor = '#48dbfb',
    strokeWidth = 2,
    fill = 'none',
  } = options;

  if (points.length < 2) return '';

  const pathData = points.reduce((acc, point, i) => {
    return acc + (i === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
  }, '') + ' Z';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <path d="${pathData}" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="${fill}"/>
</svg>`;
}

