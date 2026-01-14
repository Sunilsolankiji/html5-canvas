/**
 * Calculate heart shape points
 * @param {Object} options - Options for calculating points
 * @param {number} options.scale - Scale factor
 * @param {number} options.offsetX - X offset (center X)
 * @param {number} options.offsetY - Y offset (center Y)
 * @param {number} options.numPoints - Number of points to calculate
 * @returns {Array} - Array of {x, y} points
 */
export function getHeartPoints({ scale, offsetX, offsetY, numPoints = 1000 }) {
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * 2 * Math.PI;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    points.push({
      x: x * scale + offsetX,
      y: -y * scale + offsetY,
    });
  }
  return points;
}

/**
 * Draw a heart shape on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {Object} options - Drawing options
 * @param {Array} options.points - Array of {x, y} points
 * @param {number} options.progress - Draw progress (0 to 1)
 * @param {number} options.fillAmount - Fill progress (0 to 1)
 * @param {number} options.scale - Scale factor
 * @param {number} options.offsetX - X offset (center X)
 * @param {number} options.offsetY - Y offset (center Y)
 * @param {string} options.strokeColor - Stroke color
 * @param {string} options.fillColor - Fill color
 * @param {number} options.lineWidth - Line width
 */
export function drawHeart(ctx, options) {
  const {
    points,
    progress,
    fillAmount = 0,
    scale,
    offsetX,
    offsetY,
    strokeColor = '#c0392b',
    fillColor = '#ff4757',
    lineWidth = 3,
  } = options;

  const pointsToDraw = Math.floor(points.length * progress);
  if (pointsToDraw < 2) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < pointsToDraw; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  if (progress >= 1) {
    ctx.closePath();
    if (fillAmount > 0) {
      ctx.save();
      ctx.clip();
      const minY = offsetY - 13 * scale;
      const maxY = offsetY + 17 * scale;
      const fillHeight = (maxY - minY) * fillAmount;
      const fillY = maxY - fillHeight;
      ctx.fillStyle = fillColor;
      ctx.fillRect(offsetX - 17 * scale, fillY, 34 * scale, fillHeight);
      ctx.restore();
    }
  }

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

/**
 * Animate heart drawing with phases: drawing, filling, pulsing
 * @param {Object} params - Animation parameters
 * @param {HTMLCanvasElement} params.canvas - Canvas element
 * @param {CanvasRenderingContext2D} params.ctx - Canvas 2D context
 * @param {number} params.baseScale - Base scale for the heart
 * @param {React.MutableRefObject} params.animationRef - Ref to store animation frame ID
 * @param {string} params.strokeColor - Stroke color
 * @param {string} params.fillColor - Fill color
 */
export function animateHeart(params) {
  const {
    canvas,
    ctx,
    baseScale = 15,
    animationRef,
    strokeColor = '#c0392b',
    fillColor = '#ff4757',
  } = params;

  if (!canvas || !ctx) return;

  let drawProgress = 0;
  let fillProgress = 0;
  let time = 0;
  let phase = 'drawing';

  const offsetX = canvas.width / 2;
  const offsetY = canvas.height / 2;

  const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let currentScale = baseScale;
    let currentFill = 0;

    switch (phase) {
      case 'drawing':
        drawProgress += 0.015;
        if (drawProgress >= 1) {
          drawProgress = 1;
          phase = 'filling';
        }
        break;
      case 'filling':
        fillProgress += 0.02;
        if (fillProgress >= 1) {
          fillProgress = 1;
          phase = 'pulsing';
        }
        currentFill = fillProgress;
        break;
      case 'pulsing':
        time += 0.05;
        currentScale = baseScale * (1 + 0.1 * Math.sin(time * 3));
        currentFill = 1;
        drawProgress = 1;
        break;
      default:
        break;
    }

    const points = getHeartPoints({
      scale: currentScale,
      offsetX,
      offsetY,
    });

    drawHeart(ctx, {
      points,
      progress: drawProgress,
      fillAmount: currentFill,
      scale: currentScale,
      offsetX,
      offsetY,
      strokeColor,
      fillColor,
    });

    animationRef.current = requestAnimationFrame(loop);
  };

  loop();
}
