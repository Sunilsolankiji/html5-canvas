/**
 * Draw a spiral point
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {Object} options - Drawing options
 * @param {number} options.x - X coordinate
 * @param {number} options.y - Y coordinate
 * @param {number} options.hue - HSL hue value (0-360)
 * @param {number} options.size - Point size
 */
export function drawSpiralPoint(ctx, { x, y, hue, size = 3 }) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
  ctx.fill();
}

/**
 * Calculate spiral point position and color
 * @param {Object} options - Options for calculating point
 * @param {number} options.index - Point index
 * @param {number} options.totalPoints - Total number of points
 * @param {number} options.maxRotations - Maximum number of rotations
 * @param {number} options.maxRadius - Maximum radius
 * @param {number} options.centerX - Center X coordinate
 * @param {number} options.centerY - Center Y coordinate
 * @returns {Object} - Point with x, y, and hue
 */
export function getSpiralPoint({ index, totalPoints, maxRotations, maxRadius, centerX, centerY }) {
  const t = (index / totalPoints) * maxRotations * Math.PI * 2;
  const radius = (index / totalPoints) * maxRadius;
  return {
    x: centerX + Math.cos(t) * radius,
    y: centerY + Math.sin(t) * radius,
    hue: (index / totalPoints) * 360,
  };
}

/**
 * Animate spiral drawing
 * @param {Object} params - Animation parameters
 * @param {HTMLCanvasElement} params.canvas - Canvas element
 * @param {CanvasRenderingContext2D} params.ctx - Canvas 2D context
 * @param {number} params.maxRotations - Maximum number of rotations
 * @param {number} params.totalPoints - Total number of points
 * @param {number} params.maxRadius - Maximum radius
 * @param {number} params.pointsPerFrame - Points to draw per frame
 * @param {number} params.pointSize - Size of each point
 * @param {React.MutableRefObject} params.animationRef - Ref to store animation frame ID
 */
export function animateSpiral(params) {
  const {
    canvas,
    ctx,
    maxRotations = 8,
    totalPoints = 1000,
    maxRadius = 250,
    pointsPerFrame = 5,
    pointSize = 3,
    animationRef,
  } = params;

  if (!canvas || !ctx) return;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  let drawProgress = 0;

  const loop = () => {
    // Fade effect
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const startPoint = Math.floor(drawProgress * totalPoints);
    const endPoint = Math.min(startPoint + pointsPerFrame, totalPoints);

    for (let i = startPoint; i < endPoint; i++) {
      const point = getSpiralPoint({
        index: i,
        totalPoints,
        maxRotations,
        maxRadius,
        centerX,
        centerY,
      });

      drawSpiralPoint(ctx, {
        x: point.x,
        y: point.y,
        hue: point.hue,
        size: pointSize,
      });
    }

    drawProgress += pointsPerFrame / totalPoints;

    // Reset when complete
    if (drawProgress >= 1) {
      drawProgress = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    animationRef.current = requestAnimationFrame(loop);
  };

  loop();
}
