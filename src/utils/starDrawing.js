/**
 * Calculate star shape points
 * @param {Object} options - Options for calculating points
 * @param {number} options.centerX - Center X coordinate
 * @param {number} options.centerY - Center Y coordinate
 * @param {number} options.points - Number of star points
 * @param {number} options.outerRadius - Outer radius
 * @param {number} options.innerRadius - Inner radius
 * @param {number} options.rotation - Rotation angle in radians
 * @returns {Array} - Array of {x, y} points
 */
export function getStarPoints({
  centerX,
  centerY,
  points = 5,
  outerRadius = 200,
  innerRadius = 80,
  rotation = -Math.PI / 2,
}) {
  const starPoints = [];
  const step = Math.PI / points;
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = rotation + i * step;
    starPoints.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    });
  }
  return starPoints;
}

/**
 * Draw a star shape on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {Object} options - Drawing options
 * @param {Array} options.starPoints - Array of {x, y} points
 * @param {number} options.progress - Draw progress (0 to 1)
 * @param {number} options.glow - Glow intensity (0 to 1)
 * @param {number} options.centerX - Center X coordinate
 * @param {number} options.centerY - Center Y coordinate
 * @param {number} options.outerRadius - Outer radius
 * @param {string} options.strokeColor - Stroke color
 * @param {number} options.lineWidth - Line width
 */
export function drawStar(ctx, options) {
  const {
    starPoints,
    progress,
    glow = 0,
    centerX,
    centerY,
    outerRadius,
    strokeColor = '#ff8c00',
    lineWidth = 4,
  } = options;

  const pointsToDraw = Math.floor(starPoints.length * progress) + 1;
  if (pointsToDraw < 2) return;

  // Draw glow effect
  if (glow > 0) {
    ctx.save();
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 30 * glow;
    ctx.beginPath();
    ctx.moveTo(starPoints[0].x, starPoints[0].y);
    for (let i = 1; i < starPoints.length; i++) {
      ctx.lineTo(starPoints[i].x, starPoints[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 215, 0, ${0.5 * glow})`;
    ctx.fill();
    ctx.restore();
  }

  // Draw star outline
  ctx.beginPath();
  ctx.moveTo(starPoints[0].x, starPoints[0].y);
  for (let i = 1; i < Math.min(pointsToDraw, starPoints.length); i++) {
    ctx.lineTo(starPoints[i].x, starPoints[i].y);
  }

  // Fill when complete
  if (progress >= 1) {
    ctx.closePath();
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, outerRadius);
    gradient.addColorStop(0, '#fff7ad');
    gradient.addColorStop(0.5, '#ffd700');
    gradient.addColorStop(1, '#ff8c00');
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

/**
 * Animate star drawing with phases: drawing, glowing
 * @param {Object} params - Animation parameters
 * @param {HTMLCanvasElement} params.canvas - Canvas element
 * @param {CanvasRenderingContext2D} params.ctx - Canvas 2D context
 * @param {number} params.points - Number of star points
 * @param {number} params.outerRadius - Outer radius
 * @param {number} params.innerRadius - Inner radius
 * @param {React.MutableRefObject} params.animationRef - Ref to store animation frame ID
 */
export function animateStar(params) {
  const {
    canvas,
    ctx,
    points = 5,
    outerRadius = 200,
    innerRadius = 80,
    animationRef,
  } = params;

  if (!canvas || !ctx) return;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  let rotation = -Math.PI / 2;
  let drawProgress = 0;
  let phase = 'drawing';

  const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const starPoints = getStarPoints({
      centerX,
      centerY,
      points,
      outerRadius,
      innerRadius,
      rotation,
    });

    switch (phase) {
      case 'drawing':
        drawProgress += 0.02;
        if (drawProgress >= 1) {
          drawProgress = 1;
          phase = 'glowing';
        }
        drawStar(ctx, {
          starPoints,
          progress: drawProgress,
          glow: 0,
          centerX,
          centerY,
          outerRadius,
        });
        break;
      case 'glowing': {
        const glowIntensity = 0.5 + 0.5 * Math.sin(Date.now() * 0.003);
        rotation += 0.005;
        drawStar(ctx, {
          starPoints,
          progress: 1,
          glow: glowIntensity,
          centerX,
          centerY,
          outerRadius,
        });
        break;
      }
      default:
        break;
    }

    animationRef.current = requestAnimationFrame(loop);
  };

  loop();
}
