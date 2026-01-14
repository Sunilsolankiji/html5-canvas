/**
 * Wave configuration type
 * @typedef {Object} WaveConfig
 * @property {number} amplitude - Wave amplitude
 * @property {number} frequency - Wave frequency
 * @property {number} speed - Wave animation speed
 * @property {string} color - Wave color (rgba format)
 */

/**
 * Draw a single wave on canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {Object} options - Drawing options
 * @param {number} options.canvasWidth - Canvas width
 * @param {number} options.canvasHeight - Canvas height
 * @param {WaveConfig} options.wave - Wave configuration
 * @param {number} options.yOffset - Y offset for wave position
 * @param {number} options.time - Current animation time
 */
export function drawWave(ctx, { canvasWidth, canvasHeight, wave, yOffset, time }) {
  ctx.beginPath();
  ctx.moveTo(0, canvasHeight);

  for (let x = 0; x <= canvasWidth; x++) {
    const y = yOffset + Math.sin(x * wave.frequency + time * wave.speed * 60) * wave.amplitude;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(canvasWidth, canvasHeight);
  ctx.lineTo(0, canvasHeight);
  ctx.closePath();
  ctx.fillStyle = wave.color;
  ctx.fill();
}

/**
 * Draw night sky background with moon
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {Object} options - Drawing options
 * @param {number} options.canvasWidth - Canvas width
 * @param {number} options.canvasHeight - Canvas height
 * @param {number} options.moonX - Moon X position
 * @param {number} options.moonY - Moon Y position
 * @param {number} options.moonRadius - Moon radius
 */
export function drawNightSky(ctx, { canvasWidth, canvasHeight, moonX = 500, moonY = 100, moonRadius = 50 }) {
  // Draw gradient sky
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  gradient.addColorStop(0, '#0c2461');
  gradient.addColorStop(1, '#1e3799');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw moon with glow
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#f5f6fa';
  ctx.fill();
  ctx.shadowColor = '#f5f6fa';
  ctx.shadowBlur = 30;
  ctx.fill();
  ctx.shadowBlur = 0;
}

/**
 * Default wave configurations
 */
export const defaultWaves = [
  { amplitude: 50, frequency: 0.02, speed: 0.05, color: 'rgba(72, 219, 251, 0.8)' },
  { amplitude: 40, frequency: 0.025, speed: 0.03, color: 'rgba(255, 107, 107, 0.6)' },
  { amplitude: 30, frequency: 0.03, speed: 0.07, color: 'rgba(254, 202, 87, 0.6)' },
];

/**
 * Animate waves with night sky background
 * @param {Object} params - Animation parameters
 * @param {HTMLCanvasElement} params.canvas - Canvas element
 * @param {CanvasRenderingContext2D} params.ctx - Canvas 2D context
 * @param {WaveConfig[]} params.waves - Array of wave configurations
 * @param {React.MutableRefObject} params.animationRef - Ref to store animation frame ID
 */
export function animateWaves(params) {
  const {
    canvas,
    ctx,
    waves = defaultWaves,
    animationRef,
  } = params;

  if (!canvas || !ctx) return;

  let time = 0;

  const loop = () => {
    // Draw background and moon
    drawNightSky(ctx, {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
    });

    // Draw waves from back to front
    drawWave(ctx, {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      wave: waves[2],
      yOffset: canvas.height * 0.5,
      time,
    });

    drawWave(ctx, {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      wave: waves[1],
      yOffset: canvas.height * 0.6,
      time,
    });

    drawWave(ctx, {
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      wave: waves[0],
      yOffset: canvas.height * 0.7,
      time,
    });

    time += 0.016;
    animationRef.current = requestAnimationFrame(loop);
  };

  loop();
}
