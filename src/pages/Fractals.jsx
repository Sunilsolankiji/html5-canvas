import { useRef, useEffect, useState, useCallback } from 'react';
import CanvasComponent from '../components/CanvasComponent';
import '../styles/shapes.css';

const FRACTAL_TYPES = {
  mandelbrot: { name: '🔷 Mandelbrot Set', description: 'The classic Mandelbrot fractal' },
  julia: { name: '💠 Julia Set', description: 'Beautiful Julia set variations' },
  burningShip: { name: '🚢 Burning Ship', description: 'The burning ship fractal' },
  tricorn: { name: '🦄 Tricorn', description: 'Also known as Mandelbar' },
  sierpinski: { name: '🔺 Sierpinski Triangle', description: 'Classic recursive triangle' },
  tree: { name: '🌳 Fractal Tree', description: 'Recursive branching tree' },
};

const JULIA_PRESETS = [
  { name: 'Classic', c: { real: -0.7, imag: 0.27015 } },
  { name: 'Dendrite', c: { real: 0, imag: 1 } },
  { name: 'Spiral', c: { real: -0.8, imag: 0.156 } },
  { name: 'Rabbit', c: { real: -0.123, imag: 0.745 } },
  { name: 'Dragon', c: { real: -0.74543, imag: 0.11301 } },
  { name: 'Starfish', c: { real: -0.4, imag: 0.6 } },
];

const COLOR_SCHEMES = {
  classic: (n, max) => {
    if (n === max) return 'rgb(0, 0, 0)';
    const hue = (n / max) * 360;
    return `hsl(${hue}, 100%, 50%)`;
  },
  fire: (n, max) => {
    if (n === max) return 'rgb(0, 0, 0)';
    const t = n / max;
    const r = Math.floor(255 * Math.min(1, t * 3));
    const g = Math.floor(255 * Math.min(1, Math.max(0, t * 3 - 1)));
    const b = Math.floor(255 * Math.min(1, Math.max(0, t * 3 - 2)));
    return `rgb(${r}, ${g}, ${b})`;
  },
  ocean: (n, max) => {
    if (n === max) return 'rgb(0, 0, 0)';
    const t = n / max;
    const r = Math.floor(255 * t * 0.3);
    const g = Math.floor(255 * t * 0.7);
    const b = Math.floor(255 * (0.5 + t * 0.5));
    return `rgb(${r}, ${g}, ${b})`;
  },
  grayscale: (n, max) => {
    if (n === max) return 'rgb(0, 0, 0)';
    const v = Math.floor((n / max) * 255);
    return `rgb(${v}, ${v}, ${v})`;
  },
  neon: (n, max) => {
    if (n === max) return 'rgb(0, 0, 0)';
    const hue = (n / max) * 360 + 180;
    return `hsl(${hue % 360}, 100%, 60%)`;
  },
};

function Fractals() {
  const canvasRef = useRef(null);
  const [fractalType, setFractalType] = useState('mandelbrot');
  const [juliaC, setJuliaC] = useState({ real: -0.7, imag: 0.27015 });
  const [maxIterations, setMaxIterations] = useState(100);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [colorScheme, setColorScheme] = useState('classic');
  const [isRendering, setIsRendering] = useState(false);
  const [treeAngle, setTreeAngle] = useState(25);
  const [treeDepth, setTreeDepth] = useState(10);

  const drawMandelbrot = useCallback((ctx, canvas) => {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    const colorFn = COLOR_SCHEMES[colorScheme];

    for (let px = 0; px < width; px++) {
      for (let py = 0; py < height; py++) {
        const x0 = (px - width / 2) / (0.5 * zoom * width) + offsetX;
        const y0 = (py - height / 2) / (0.5 * zoom * height) + offsetY;

        let x = 0;
        let y = 0;
        let iteration = 0;

        while (x * x + y * y <= 4 && iteration < maxIterations) {
          const xTemp = x * x - y * y + x0;
          y = 2 * x * y + y0;
          x = xTemp;
          iteration++;
        }

        const color = colorFn(iteration, maxIterations);
        const match = color.match(/\d+/g);
        const idx = (py * width + px) * 4;

        if (color.startsWith('hsl')) {
          const hsl = parseHSL(color);
          imageData.data[idx] = hsl.r;
          imageData.data[idx + 1] = hsl.g;
          imageData.data[idx + 2] = hsl.b;
        } else {
          imageData.data[idx] = parseInt(match[0]);
          imageData.data[idx + 1] = parseInt(match[1]);
          imageData.data[idx + 2] = parseInt(match[2]);
        }
        imageData.data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [zoom, offsetX, offsetY, maxIterations, colorScheme]);

  const drawJulia = useCallback((ctx, canvas) => {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    const colorFn = COLOR_SCHEMES[colorScheme];

    for (let px = 0; px < width; px++) {
      for (let py = 0; py < height; py++) {
        let x = (px - width / 2) / (0.5 * zoom * width) + offsetX;
        let y = (py - height / 2) / (0.5 * zoom * height) + offsetY;

        let iteration = 0;

        while (x * x + y * y <= 4 && iteration < maxIterations) {
          const xTemp = x * x - y * y + juliaC.real;
          y = 2 * x * y + juliaC.imag;
          x = xTemp;
          iteration++;
        }

        const color = colorFn(iteration, maxIterations);
        const idx = (py * width + px) * 4;

        if (color.startsWith('hsl')) {
          const hsl = parseHSL(color);
          imageData.data[idx] = hsl.r;
          imageData.data[idx + 1] = hsl.g;
          imageData.data[idx + 2] = hsl.b;
        } else {
          const match = color.match(/\d+/g);
          imageData.data[idx] = parseInt(match[0]);
          imageData.data[idx + 1] = parseInt(match[1]);
          imageData.data[idx + 2] = parseInt(match[2]);
        }
        imageData.data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [zoom, offsetX, offsetY, maxIterations, juliaC, colorScheme]);

  const drawBurningShip = useCallback((ctx, canvas) => {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    const colorFn = COLOR_SCHEMES[colorScheme];

    for (let px = 0; px < width; px++) {
      for (let py = 0; py < height; py++) {
        const x0 = (px - width / 2) / (0.5 * zoom * width) + offsetX;
        const y0 = (py - height / 2) / (0.5 * zoom * height) + offsetY;

        let x = 0;
        let y = 0;
        let iteration = 0;

        while (x * x + y * y <= 4 && iteration < maxIterations) {
          const xTemp = x * x - y * y + x0;
          y = Math.abs(2 * x * y) + y0;
          x = Math.abs(xTemp);
          iteration++;
        }

        const color = colorFn(iteration, maxIterations);
        const idx = (py * width + px) * 4;

        if (color.startsWith('hsl')) {
          const hsl = parseHSL(color);
          imageData.data[idx] = hsl.r;
          imageData.data[idx + 1] = hsl.g;
          imageData.data[idx + 2] = hsl.b;
        } else {
          const match = color.match(/\d+/g);
          imageData.data[idx] = parseInt(match[0]);
          imageData.data[idx + 1] = parseInt(match[1]);
          imageData.data[idx + 2] = parseInt(match[2]);
        }
        imageData.data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }, [zoom, offsetX, offsetY, maxIterations, colorScheme]);

  const drawSierpinski = useCallback((ctx, canvas) => {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawTriangle = (x1, y1, x2, y2, x3, y3, depth) => {
      if (depth === 0) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        const hue = (depth / treeDepth) * 120 + 180;
        ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
        ctx.fill();
        return;
      }

      const mx1 = (x1 + x2) / 2;
      const my1 = (y1 + y2) / 2;
      const mx2 = (x2 + x3) / 2;
      const my2 = (y2 + y3) / 2;
      const mx3 = (x1 + x3) / 2;
      const my3 = (y1 + y3) / 2;

      drawTriangle(x1, y1, mx1, my1, mx3, my3, depth - 1);
      drawTriangle(mx1, my1, x2, y2, mx2, my2, depth - 1);
      drawTriangle(mx3, my3, mx2, my2, x3, y3, depth - 1);
    };

    const size = Math.min(canvas.width, canvas.height) * 0.8;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const h = size * Math.sqrt(3) / 2;

    drawTriangle(
      cx, cy - h / 2,
      cx - size / 2, cy + h / 2,
      cx + size / 2, cy + h / 2,
      Math.min(treeDepth, 8)
    );
  }, [treeDepth]);

  const drawFractalTree = useCallback((ctx, canvas) => {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawBranch = (x, y, len, angle, depth) => {
      if (depth === 0 || len < 2) return;

      const endX = x + len * Math.sin(angle);
      const endY = y - len * Math.cos(angle);

      const hue = ((treeDepth - depth) / treeDepth) * 120;
      ctx.strokeStyle = `hsl(${hue}, 70%, ${40 + depth * 3}%)`;
      ctx.lineWidth = depth * 0.8;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      const angleRad = (treeAngle * Math.PI) / 180;
      drawBranch(endX, endY, len * 0.7, angle - angleRad, depth - 1);
      drawBranch(endX, endY, len * 0.7, angle + angleRad, depth - 1);
    };

    drawBranch(canvas.width / 2, canvas.height - 50, 100, 0, Math.min(treeDepth, 14));
  }, [treeAngle, treeDepth]);

  const renderFractal = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    const ctx = canvasRef.current?.getContext();
    if (!canvas || !ctx) return;

    setIsRendering(true);

    // Use setTimeout to allow UI to update before heavy computation
    setTimeout(() => {
      switch (fractalType) {
        case 'mandelbrot':
          drawMandelbrot(ctx, canvas);
          break;
        case 'julia':
          drawJulia(ctx, canvas);
          break;
        case 'burningShip':
          drawBurningShip(ctx, canvas);
          break;
        case 'sierpinski':
          drawSierpinski(ctx, canvas);
          break;
        case 'tree':
          drawFractalTree(ctx, canvas);
          break;
        default:
          drawMandelbrot(ctx, canvas);
      }
      setIsRendering(false);
    }, 50);
  }, [fractalType, drawMandelbrot, drawJulia, drawBurningShip, drawSierpinski, drawFractalTree]);

  useEffect(() => {
    renderFractal();
  }, [renderFractal]);

  const handleZoomIn = () => setZoom((z) => z * 1.5);
  const handleZoomOut = () => setZoom((z) => z / 1.5);
  const handleReset = () => {
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newOffsetX = (x - canvas.width / 2) / (0.5 * zoom * canvas.width) + offsetX;
    const newOffsetY = (y - canvas.height / 2) / (0.5 * zoom * canvas.height) + offsetY;

    setOffsetX(newOffsetX);
    setOffsetY(newOffsetY);
    setZoom((z) => z * 2);
  }, [zoom, offsetX, offsetY]);

  return (
    <div className="shape-page">
      <h2>🔷 Fractal Explorer</h2>
      <p>Explore infinite mathematical patterns</p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div onClick={handleCanvasClick} style={{ cursor: 'crosshair' }}>
          <CanvasComponent ref={canvasRef} width={600} height={500} />
        </div>

        <div className="controls-panel" style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '20px',
          borderRadius: '15px',
          minWidth: '280px'
        }}>
          <div className="control-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>Fractal Type:</label>
            <select
              value={fractalType}
              onChange={(e) => setFractalType(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {Object.entries(FRACTAL_TYPES).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          {fractalType === 'julia' && (
            <div className="control-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>Julia Preset:</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {JULIA_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setJuliaC(preset.c)}
                    className="btn btn-secondary"
                    style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(fractalType === 'sierpinski' || fractalType === 'tree') && (
            <div className="control-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
                Depth: {treeDepth}
              </label>
              <input
                type="range"
                min="1"
                max={fractalType === 'tree' ? 14 : 8}
                value={treeDepth}
                onChange={(e) => setTreeDepth(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          )}

          {fractalType === 'tree' && (
            <div className="control-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
                Branch Angle: {treeAngle}°
              </label>
              <input
                type="range"
                min="10"
                max="60"
                value={treeAngle}
                onChange={(e) => setTreeAngle(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          )}

          {['mandelbrot', 'julia', 'burningShip'].includes(fractalType) && (
            <>
              <div className="control-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
                  Iterations: {maxIterations}
                </label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  value={maxIterations}
                  onChange={(e) => setMaxIterations(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="control-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>Color Scheme:</label>
                <select
                  value={colorScheme}
                  onChange={(e) => setColorScheme(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.3)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <option value="classic">🌈 Classic</option>
                  <option value="fire">🔥 Fire</option>
                  <option value="ocean">🌊 Ocean</option>
                  <option value="neon">💜 Neon</option>
                  <option value="grayscale">⬛ Grayscale</option>
                </select>
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
            <button className="btn btn-primary" onClick={handleZoomIn} disabled={isRendering}>
              🔍+ Zoom In
            </button>
            <button className="btn btn-primary" onClick={handleZoomOut} disabled={isRendering}>
              🔍- Zoom Out
            </button>
            <button className="btn btn-secondary" onClick={handleReset} disabled={isRendering}>
              🔄 Reset
            </button>
          </div>

          {isRendering && (
            <p style={{ color: '#48dbfb', marginTop: '15px', textAlign: 'center' }}>
              ⏳ Rendering...
            </p>
          )}

          <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '15px' }}>
            💡 Click on the fractal to zoom into that area
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to convert HSL to RGB
function parseHSL(hslStr) {
  const match = hslStr.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return { r: 0, g: 0, b: 0 };

  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export default Fractals;

