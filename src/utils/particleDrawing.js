/**
 * Particle type
 * @typedef {Object} Particle
 * @property {number} x - Current X position
 * @property {number} y - Current Y position
 * @property {number} size - Particle size
 * @property {number} baseX - Base X position (home)
 * @property {number} baseY - Base Y position (home)
 * @property {number} density - Particle density (affects push force)
 * @property {string} color - Particle color
 */

/**
 * Create initial particles
 * @param {Object} options - Options for creating particles
 * @param {number} options.canvasWidth - Canvas width
 * @param {number} options.canvasHeight - Canvas height
 * @param {number} options.count - Number of particles
 * @returns {Particle[]} - Array of particles
 */
export function createParticles({ canvasWidth, canvasHeight, count = 100 }) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * canvasWidth;
    const y = Math.random() * canvasHeight;
    particles.push({
      x,
      y,
      size: Math.random() * 5 + 2,
      baseX: x,
      baseY: y,
      density: Math.random() * 30 + 1,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    });
  }
  return particles;
}

/**
 * Update particle position based on mouse interaction
 * @param {Particle} particle - Particle to update
 * @param {Object} mouse - Mouse position and radius
 * @param {number|null} mouse.x - Mouse X position
 * @param {number|null} mouse.y - Mouse Y position
 * @param {number} mouse.radius - Mouse interaction radius
 */
export function updateParticle(particle, mouse) {
  // Push away from mouse
  if (mouse.x !== null && mouse.y !== null) {
    const dx = mouse.x - particle.x;
    const dy = mouse.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius) {
      const force = (mouse.radius - distance) / mouse.radius;
      const directionX = dx / distance;
      const directionY = dy / distance;
      particle.x -= directionX * force * particle.density * 0.5;
      particle.y -= directionY * force * particle.density * 0.5;
    }
  }

  // Return to base position
  const dx = particle.baseX - particle.x;
  const dy = particle.baseY - particle.y;
  particle.x += dx * 0.05;
  particle.y += dy * 0.05;
}

/**
 * Draw a single particle
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {Particle} particle - Particle to draw
 */
export function drawParticle(ctx, particle) {
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
  ctx.fillStyle = particle.color;
  ctx.fill();
}

/**
 * Draw connection line between two particles
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {Particle} p1 - First particle
 * @param {Particle} p2 - Second particle
 * @param {number} maxDistance - Maximum distance for connection
 */
export function drawParticleConnection(ctx, p1, p2, maxDistance = 100) {
  const distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  if (distance < maxDistance) {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / maxDistance})`;
    ctx.lineWidth = 0.5;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
}

/**
 * Animate particles with mouse interaction
 * @param {Object} params - Animation parameters
 * @param {HTMLCanvasElement} params.canvas - Canvas element
 * @param {CanvasRenderingContext2D} params.ctx - Canvas 2D context
 * @param {React.MutableRefObject} params.particlesRef - Ref to particles array
 * @param {React.MutableRefObject} params.mouseRef - Ref to mouse position
 * @param {React.MutableRefObject} params.animationRef - Ref to store animation frame ID
 * @param {number} params.particleCount - Number of particles
 * @param {number} params.connectionDistance - Max distance for particle connections
 */
export function animateParticles(params) {
  const {
    canvas,
    ctx,
    particlesRef,
    mouseRef,
    animationRef,
    particleCount = 100,
    connectionDistance = 100,
  } = params;

  if (!canvas || !ctx) return;

  // Initialize particles if needed
  if (particlesRef.current.length === 0) {
    particlesRef.current = createParticles({
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      count: particleCount,
    });
  }

  const loop = () => {
    // Fade effect
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Update particle position
      updateParticle(p, mouse);

      // Draw particle
      drawParticle(ctx, p);

      // Draw connections to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        drawParticleConnection(ctx, p, particles[j], connectionDistance);
      }
    }

    animationRef.current = requestAnimationFrame(loop);
  };

  loop();
}
