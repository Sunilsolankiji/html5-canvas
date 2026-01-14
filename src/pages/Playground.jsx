import { useRef, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import CanvasComponent from '../components/CanvasComponent';
import { drawParametricShape } from '../utils/canvasDrawing';
import {
  SHAPE_PRESETS,
  SHAPE_CATEGORIES,
  CANVAS_DEFAULTS,
  COLOR_PALETTES,
  LINE_STYLES,
  BACKGROUND_PRESETS,
  GRADIENT_PRESETS,
  KEYBOARD_SHORTCUTS,
} from '../constants';
import '../styles/playground.css';

// Default state values
const DEFAULT_STATE = {
  xFunction: 't => 16 * Math.pow(Math.sin(t), 3)',
  yFunction: 't => 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)',
  scale: 15,
  tEnd: 2 * Math.PI,
  strokeColor: '#48dbfb',
  fillColor: '#ff6b6b',
  backgroundColor: CANVAS_DEFAULTS.BACKGROUND_COLOR,
  lineWidth: 2,
  animationSpeed: 1,
  showFill: false,
  animateDrawing: true,
  autoRefresh: true,
};

function Playground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const isInitialMount = useRef(true);
  const [searchParams] = useSearchParams();

  // Basic settings
  const [activeTab, setActiveTab] = useState('presets');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePreset, setActivePreset] = useState(null);
  const [xFunction, setXFunction] = useState(DEFAULT_STATE.xFunction);
  const [yFunction, setYFunction] = useState(DEFAULT_STATE.yFunction);
  const [scale, setScale] = useState(DEFAULT_STATE.scale);
  const [tEnd, setTEnd] = useState(DEFAULT_STATE.tEnd);

  // Style settings
  const [strokeColor, setStrokeColor] = useState(DEFAULT_STATE.strokeColor);
  const [fillColor, setFillColor] = useState(DEFAULT_STATE.fillColor);
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_STATE.backgroundColor);
  const [lineWidth, setLineWidth] = useState(DEFAULT_STATE.lineWidth);
  const [lineStyle, setLineStyle] = useState('solid');

  // Animation settings
  const [animationSpeed, setAnimationSpeed] = useState(DEFAULT_STATE.animationSpeed);
  const [showFill, setShowFill] = useState(DEFAULT_STATE.showFill);
  const [animateDrawing, setAnimateDrawing] = useState(DEFAULT_STATE.animateDrawing);
  const [autoRefresh, setAutoRefresh] = useState(DEFAULT_STATE.autoRefresh);
  const [isPaused, setIsPaused] = useState(false);

  // Advanced effects
  const [showGlow, setShowGlow] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(20);
  const [showTrail, setShowTrail] = useState(false);
  const [showPathTracer, setShowPathTracer] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showFormula, setShowFormula] = useState(false);
  const [useGradient, setUseGradient] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState('rainbow');
  const [selectedPalette, setSelectedPalette] = useState('neon');

  // Export settings
  const [filename, setFilename] = useState('canvas-shape');
  const [exportFormat, setExportFormat] = useState('png');

  // UI state
  const [error, setError] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const isPausedRef = useRef(isPaused);

  // Load from URL parameters (share links or gallery links)
  useEffect(() => {
    // Check for preset parameter (from Gallery)
    const preset = searchParams.get('preset');
    if (preset && SHAPE_PRESETS[preset]) {
      const presetData = SHAPE_PRESETS[preset];
      setActivePreset(preset);
      setXFunction(presetData.x);
      setYFunction(presetData.y);
      setScale(presetData.scale);
      setTEnd(presetData.tEnd);
    }

    // Check for share link parameters (x, y, s, t, sc, fc, bg)
    const xParam = searchParams.get('x');
    const yParam = searchParams.get('y');
    if (xParam && yParam) {
      setXFunction(xParam);
      setYFunction(yParam);
      setActivePreset(null); // Custom shape
    }

    const scaleParam = searchParams.get('s');
    if (scaleParam) {
      setScale(parseFloat(scaleParam));
    }

    const tEndParam = searchParams.get('t');
    if (tEndParam) {
      setTEnd(parseFloat(tEndParam));
    }

    const strokeParam = searchParams.get('sc');
    if (strokeParam) {
      setStrokeColor(strokeParam);
    }

    const fillParam = searchParams.get('fc');
    if (fillParam) {
      setFillColor(fillParam);
    }

    const bgParam = searchParams.get('bg');
    if (bgParam) {
      setBackgroundColor(bgParam);
    }
  }, [searchParams]);

  // Keep isPausedRef in sync with isPaused state
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e) => {
      // Don't trigger when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case KEYBOARD_SHORTCUTS.PLAY_PAUSE:
          e.preventDefault();
          setIsPaused(p => !p);
          break;
        case KEYBOARD_SHORTCUTS.RESET:
          handleReset();
          break;
        case KEYBOARD_SHORTCUTS.EXPORT:
          handleExport();
          break;
        case KEYBOARD_SHORTCUTS.FULLSCREEN:
          handleFullscreen();
          break;
        case KEYBOARD_SHORTCUTS.CLEAR:
          handleClear();
          break;
        case KEYBOARD_SHORTCUTS.TOGGLE_GRID:
          setShowGrid(g => !g);
          break;
        case KEYBOARD_SHORTCUTS.TOGGLE_FILL:
          setShowFill(f => !f);
          break;
        case KEYBOARD_SHORTCUTS.SPEED_UP:
          setAnimationSpeed(s => Math.min(5, s + 0.5));
          break;
        case KEYBOARD_SHORTCUTS.SPEED_DOWN:
          setAnimationSpeed(s => Math.max(0.1, s - 0.5));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawShape = useCallback((animated = true) => {
    const canvas = canvasRef.current?.getCanvas();
    const ctx = canvasRef.current?.getContext();

    if (!canvas || !ctx) return;

    // Apply line style
    const lineDash = LINE_STYLES[lineStyle]?.dash || [];

    // Apply glow effect
    if (showGlow) {
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = glowIntensity;
    } else {
      ctx.shadowBlur = 0;
    }

    drawParametricShape({
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
      animated,
      animateDrawing,
      animationSpeed,
      animationRef,
      isPausedRef,
      lineDash,
      showGlow,
      glowIntensity,
      showTrail,
      showPathTracer,
      useGradient,
      gradientPreset: GRADIENT_PRESETS[selectedGradient],
      backgroundColor,
      showGrid,
      showFormula,
      onError: (msg) => setError(msg),
    });

    setError('');
  }, [xFunction, yFunction, scale, tEnd, strokeColor, fillColor, lineWidth,
      showFill, animateDrawing, animationSpeed, lineStyle, showGlow, glowIntensity,
      showTrail, showPathTracer, showGrid, showFormula, useGradient, selectedGradient, backgroundColor]);

  // Initial draw on mount only
  useEffect(() => {
    drawShape();

    const currentAnimationRef = animationRef.current;
    return () => {
      if (currentAnimationRef) {
        cancelAnimationFrame(currentAnimationRef);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-refresh when values change (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!autoRefresh) return;

    // Cancel any existing animation before starting new one
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Use animation for function/preset changes, no animation for style changes only
    const timer = setTimeout(() => drawShape(animateDrawing), 100);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xFunction, yFunction, scale, tEnd, strokeColor, fillColor, backgroundColor,
      lineWidth, showFill, autoRefresh, lineStyle, showGlow, glowIntensity,
      showGrid, showFormula, useGradient, selectedGradient, animateDrawing]);

  const handlePresetClick = useCallback((key) => {
    const preset = SHAPE_PRESETS[key];
    setActivePreset(key);
    setXFunction(preset.x);
    setYFunction(preset.y);
    setScale(preset.scale);
    setTEnd(preset.tEnd);

    // Add to history
    addToHistory({ type: 'preset', key, preset });
  }, []);

  const addToHistory = (action) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(action);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleExport = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    let dataUrl;
    let mimeType;

    switch (exportFormat) {
      case 'jpg':
        mimeType = 'image/jpeg';
        dataUrl = canvas.toDataURL(mimeType, 0.95);
        break;
      case 'png':
      default:
        mimeType = 'image/png';
        dataUrl = canvas.toDataURL(mimeType);
        break;
    }

    const link = document.createElement('a');
    link.download = `${filename || 'canvas-shape'}.${exportFormat}`;
    link.href = dataUrl;
    link.click();
  }, [filename, exportFormat]);

  const handleSaveToGallery = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    if (!canvas) return;

    const thumbnail = canvas.toDataURL('image/png');
    const galleryItem = {
      id: `user-${Date.now()}`,
      name: filename || 'Untitled',
      type: 'playground',
      preset: activePreset,
      xFunction,
      yFunction,
      scale,
      tEnd,
      colors: {
        stroke: strokeColor,
        fill: fillColor,
        background: backgroundColor,
      },
      settings: {
        lineWidth,
        showFill,
        showGlow,
        glowIntensity,
      },
      thumbnail,
      createdAt: Date.now(),
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('canvas-playground-gallery') || '[]');
    existing.unshift(galleryItem);
    localStorage.setItem('canvas-playground-gallery', JSON.stringify(existing));

    alert('Saved to Gallery! 🎉');
  }, [filename, activePreset, xFunction, yFunction, scale, tEnd, strokeColor,
      fillColor, backgroundColor, lineWidth, showFill, showGlow, glowIntensity]);

  const handleCopyShareLink = useCallback(() => {
    const params = new URLSearchParams({
      ...(activePreset && { preset: activePreset }),
      x: xFunction,
      y: yFunction,
      s: scale,
      t: tEnd,
      sc: strokeColor,
      fc: fillColor,
      bg: backgroundColor,
    });

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    alert('Share link copied to clipboard! 🔗');
  }, [activePreset, xFunction, yFunction, scale, tEnd, strokeColor, fillColor, backgroundColor]);

  const handleFullscreen = useCallback(() => {
    canvasRef.current?.requestFullscreen();
  }, []);

  const handlePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const handleClear = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    canvasRef.current?.clear();
  }, []);

  const handleReset = useCallback(() => {
    setStrokeColor(DEFAULT_STATE.strokeColor);
    setFillColor(DEFAULT_STATE.fillColor);
    setBackgroundColor(DEFAULT_STATE.backgroundColor);
    setLineWidth(DEFAULT_STATE.lineWidth);
    setAnimationSpeed(DEFAULT_STATE.animationSpeed);
    setShowFill(DEFAULT_STATE.showFill);
    setAnimateDrawing(DEFAULT_STATE.animateDrawing);
    setAutoRefresh(DEFAULT_STATE.autoRefresh);
    setScale(DEFAULT_STATE.scale);
    setTEnd(DEFAULT_STATE.tEnd);
    setXFunction(DEFAULT_STATE.xFunction);
    setYFunction(DEFAULT_STATE.yFunction);
    setActivePreset(null);
    setShowGlow(false);
    setShowTrail(false);
    setShowPathTracer(false);
    setShowGrid(false);
    setShowFormula(false);
    setUseGradient(false);
    setLineStyle('solid');
  }, []);

  const handleRandomize = useCallback(() => {
    const presetKeys = Object.keys(SHAPE_PRESETS);
    const randomKey = presetKeys[Math.floor(Math.random() * presetKeys.length)];
    handlePresetClick(randomKey);

    // Randomize colors
    const palette = COLOR_PALETTES[selectedPalette]?.colors || COLOR_PALETTES.neon.colors;
    setStrokeColor(palette[Math.floor(Math.random() * palette.length)]);
    setFillColor(palette[Math.floor(Math.random() * palette.length)]);
  }, [handlePresetClick, selectedPalette]);

  // Filter presets by category
  const filteredPresets = Object.entries(SHAPE_PRESETS).filter(([, preset]) => {
    if (activeCategory === 'all') return true;
    return preset.category === activeCategory;
  });

  return (
    <div className="playground-page">
      <div className="playground-header">
        <h2>🎮 Shape Playground</h2>
        <p>Create custom parametric shapes with mathematical functions!</p>
        <button
          className="btn btn-secondary"
          style={{ fontSize: '0.8rem', padding: '5px 10px' }}
          onClick={() => setShowTutorial(true)}
        >
          📚 Tutorial
        </button>
      </div>

      <div className="playground-layout">
        <div className="canvas-section">
          <CanvasComponent
            ref={canvasRef}
            width={700}
            height={500}
            backgroundColor={backgroundColor}
          />

          <div className="quick-actions">
            <button className="btn btn-primary" onClick={() => drawShape()}>
              🎨 Draw
            </button>
            <button
              className={`btn btn-secondary ${isPaused ? 'paused' : ''}`}
              onClick={handlePause}
            >
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
            <button className="btn btn-secondary" onClick={handleClear}>
              🗑️ Clear
            </button>
            <button className="btn btn-secondary" onClick={handleRandomize}>
              🎲 Random
            </button>
            <button className="btn btn-labeled" onClick={handleExport}>
              📥 Export
            </button>
            <button className="btn btn-labeled" onClick={handleSaveToGallery}>
              💾 Save
            </button>
            <button className="btn btn-labeled" onClick={handleCopyShareLink}>
              🔗 Share
            </button>
            <button className="btn btn-labeled" onClick={handleFullscreen}>
              ⛶ Full
            </button>
          </div>

          <div className="formula-help">
            <h4>📐 Tips & Shortcuts:</h4>
            <ul>
              <li><kbd>Space</kbd> Play/Pause • <kbd>R</kbd> Reset • <kbd>G</kbd> Grid • <kbd>S</kbd> Fill</li>
              <li><kbd>+</kbd>/<kbd>-</kbd> Speed • <kbd>E</kbd> Export • <kbd>F</kbd> Fullscreen</li>
              <li>Use <code>t</code> as parameter • Available: <code>Math.sin</code>, <code>Math.cos</code>, <code>Math.pow</code></li>
            </ul>
          </div>
        </div>

        <div className="controls-section">
          <div className="control-tabs">
            <button
              className={`tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
              onClick={() => setActiveTab('presets')}
            >
              📦 Presets
            </button>
            <button
              className={`tab-btn ${activeTab === 'custom' ? 'active' : ''}`}
              onClick={() => setActiveTab('custom')}
            >
              ✏️ Custom
            </button>
            <button
              className={`tab-btn ${activeTab === 'style' ? 'active' : ''}`}
              onClick={() => setActiveTab('style')}
            >
              🎨 Style
            </button>
            <button
              className={`tab-btn ${activeTab === 'effects' ? 'active' : ''}`}
              onClick={() => setActiveTab('effects')}
            >
              ✨ Effects
            </button>
            <button
              className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
              onClick={() => setActiveTab('export')}
            >
              📤 Export
            </button>
          </div>

          {activeTab === 'presets' && (
            <div className="tab-content">
              {/* Category filter */}
              <div style={{ display: 'flex', gap: '5px', marginBottom: '15px', flexWrap: 'wrap' }}>
                <button
                  className={`preset-btn ${activeCategory === 'all' ? 'active' : ''}`}
                  style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                  onClick={() => setActiveCategory('all')}
                >
                  All
                </button>
                {Object.entries(SHAPE_CATEGORIES).map(([key, { name, icon }]) => (
                  <button
                    key={key}
                    className={`preset-btn ${activeCategory === key ? 'active' : ''}`}
                    style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                    onClick={() => setActiveCategory(key)}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              <div className="preset-grid" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {filteredPresets.map(([key, preset]) => (
                  <button
                    key={key}
                    className={`preset-btn ${activePreset === key ? 'active' : ''}`}
                    onClick={() => handlePresetClick(key)}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>

              <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '10px' }}>
                {filteredPresets.length} shapes available
              </p>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="tab-content">
              <div className="control-group">
                <label>X(t) Function:</label>
                <textarea
                  value={xFunction}
                  onChange={(e) => setXFunction(e.target.value)}
                  rows={3}
                  spellCheck={false}
                />
              </div>
              <div className="control-group">
                <label>Y(t) Function:</label>
                <textarea
                  value={yFunction}
                  onChange={(e) => setYFunction(e.target.value)}
                  rows={3}
                  spellCheck={false}
                />
              </div>
              <div className="control-group">
                <label>
                  Scale: <span className="value-badge">{scale}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="300"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                />
              </div>
              <div className="control-group">
                <label>
                  t End: <span className="value-badge">{(tEnd / Math.PI).toFixed(1)}π</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={(tEnd / Math.PI) * 2}
                  onChange={(e) => setTEnd((Number(e.target.value) / 2) * Math.PI)}
                />
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="tab-content">
              <div className="color-picker-row">
                <div className="color-picker-item">
                  <label>Stroke</label>
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                  />
                </div>
                <div className="color-picker-item">
                  <label>Fill</label>
                  <input
                    type="color"
                    value={fillColor}
                    onChange={(e) => setFillColor(e.target.value)}
                  />
                </div>
                <div className="color-picker-item">
                  <label>BG</label>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                  />
                </div>
              </div>

              {/* Color palettes */}
              <div className="control-group">
                <label>Color Palette:</label>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {Object.entries(COLOR_PALETTES).map(([key, palette]) => (
                    <button
                      key={key}
                      className={`preset-btn ${selectedPalette === key ? 'active' : ''}`}
                      style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                      onClick={() => {
                        setSelectedPalette(key);
                        setStrokeColor(palette.colors[0]);
                        setFillColor(palette.colors[1]);
                      }}
                    >
                      {palette.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background presets */}
              <div className="control-group">
                <label>Background Preset:</label>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {Object.entries(BACKGROUND_PRESETS).map(([key, preset]) => (
                    <button
                      key={key}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '5px',
                        background: preset.color,
                        border: backgroundColor === preset.color ? '2px solid #48dbfb' : '2px solid transparent',
                        cursor: 'pointer',
                      }}
                      title={preset.name}
                      onClick={() => setBackgroundColor(preset.color)}
                    />
                  ))}
                </div>
              </div>

              <div className="control-group">
                <label>
                  Line Width: <span className="value-badge">{lineWidth}px</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={lineWidth}
                  onChange={(e) => setLineWidth(Number(e.target.value))}
                />
              </div>

              <div className="control-group">
                <label>Line Style:</label>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {Object.entries(LINE_STYLES).map(([key, style]) => (
                    <button
                      key={key}
                      className={`preset-btn ${lineStyle === key ? 'active' : ''}`}
                      style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                      onClick={() => setLineStyle(key)}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="control-group">
                <label>
                  Animation Speed: <span className="value-badge">{animationSpeed}x</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                />
              </div>

              <div className="toggle-options">
                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={showFill}
                    onChange={(e) => setShowFill(e.target.checked)}
                  />
                  <span>Show Fill</span>
                </label>
                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={animateDrawing}
                    onChange={(e) => setAnimateDrawing(e.target.checked)}
                  />
                  <span>Animate Drawing</span>
                </label>
                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                  />
                  <span>Auto Refresh</span>
                </label>
              </div>

              <button className="btn btn-reset" onClick={handleReset}>
                🔄 Reset to Defaults
              </button>
            </div>
          )}

          {activeTab === 'effects' && (
            <div className="tab-content">
              <div className="toggle-options">
                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={showGlow}
                    onChange={(e) => setShowGlow(e.target.checked)}
                  />
                  <span>✨ Glow Effect</span>
                </label>
                {showGlow && (
                  <div className="control-group" style={{ marginLeft: '30px' }}>
                    <label>Intensity: {glowIntensity}</label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={glowIntensity}
                      onChange={(e) => setGlowIntensity(Number(e.target.value))}
                    />
                  </div>
                )}

                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={showTrail}
                    onChange={(e) => setShowTrail(e.target.checked)}
                  />
                  <span>🌠 Trail Effect</span>
                </label>

                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={showPathTracer}
                    onChange={(e) => setShowPathTracer(e.target.checked)}
                  />
                  <span>🔴 Path Tracer</span>
                </label>

                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                  />
                  <span>📐 Show Grid</span>
                </label>

                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={showFormula}
                    onChange={(e) => setShowFormula(e.target.checked)}
                  />
                  <span>📝 Show Formula</span>
                </label>

                <label className="toggle-option">
                  <input
                    type="checkbox"
                    checked={useGradient}
                    onChange={(e) => setUseGradient(e.target.checked)}
                  />
                  <span>🌈 Use Gradient</span>
                </label>
              </div>

              {useGradient && (
                <div className="control-group">
                  <label>Gradient Preset:</label>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {Object.entries(GRADIENT_PRESETS).map(([key, preset]) => (
                      <button
                        key={key}
                        className={`preset-btn ${selectedGradient === key ? 'active' : ''}`}
                        style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                        onClick={() => setSelectedGradient(key)}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'export' && (
            <div className="tab-content">
              <div className="control-group">
                <label>Filename:</label>
                <div className="filename-input-group">
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="canvas-shape"
                  />
                  <span className="file-extension">.{exportFormat}</span>
                </div>
              </div>

              <div className="control-group">
                <label>Format:</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['png', 'jpg'].map((fmt) => (
                    <button
                      key={fmt}
                      className={`preset-btn ${exportFormat === fmt ? 'active' : ''}`}
                      onClick={() => setExportFormat(fmt)}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn btn-export" onClick={handleExport}>
                📥 Download Image
              </button>

              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '10px' }}
                onClick={handleSaveToGallery}
              >
                💾 Save to Gallery
              </button>

              <button
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '10px' }}
                onClick={handleCopyShareLink}
              >
                🔗 Copy Share Link
              </button>

              <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#feca57' }}>💡 Export Tips</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#888', fontSize: '0.85rem' }}>
                  <li>PNG for transparent backgrounds</li>
                  <li>JPG for smaller file size</li>
                  <li>Share links include all your settings</li>
                </ul>
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowTutorial(false)}
        >
          <div
            style={{
              background: '#1a1a2e',
              padding: '40px',
              borderRadius: '20px',
              maxWidth: '500px',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
              {['🎮', '📦', '✏️', '🎨', '📤'][tutorialStep]}
            </div>
            <h3>{['Welcome!', 'Presets', 'Custom', 'Style', 'Export'][tutorialStep]}</h3>
            <p style={{ color: '#888' }}>
              {[
                'Learn to create beautiful mathematical shapes!',
                'Start by selecting a preset shape from the library.',
                'Customize the X(t) and Y(t) functions for unique shapes.',
                'Change colors, line width, and add effects.',
                'Save your creation or share it with others!',
              ][tutorialStep]}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '30px' }}>
              {tutorialStep > 0 && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setTutorialStep(s => s - 1)}
                >
                  ← Back
                </button>
              )}
              {tutorialStep < 4 ? (
                <button
                  className="btn btn-primary"
                  onClick={() => setTutorialStep(s => s + 1)}
                >
                  Next →
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowTutorial(false)}
                >
                  Get Started! 🚀
                </button>
              )}
            </div>
            <div style={{ marginTop: '20px' }}>
              {[0, 1, 2, 3, 4].map(i => (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: i === tutorialStep ? '#48dbfb' : 'rgba(255,255,255,0.2)',
                    margin: '0 5px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Playground;

