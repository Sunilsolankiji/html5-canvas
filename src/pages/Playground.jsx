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
    const [shareMessage, setShareMessage] = useState('');
    const [messageAnimation, setMessageAnimation] = useState('reveal');
    const [showSurprise, setShowSurprise] = useState(false);

    // UI state
    const [error, setError] = useState('');
    const [showTutorial, setShowTutorial] = useState(false);
    const [tutorialStep, setTutorialStep] = useState(0);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [isSharedView, setIsSharedView] = useState(false);
    const [displayMessage, setDisplayMessage] = useState('');
    const [displayMessageAnimation, setDisplayMessageAnimation] = useState('reveal');
    const [displaySurprise, setDisplaySurprise] = useState(false);
    const [giftRevealed, setGiftRevealed] = useState(false);
    const [previewKey, setPreviewKey] = useState(0);

    const isPausedRef = useRef(isPaused);

    // Show toast notification
    const showToast = useCallback((message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    }, []);

    // Load from URL parameters (share links or gallery links)
    useEffect(() => {
        // Check if this is a shared view (has share parameter)
        const isShared = searchParams.get('shared') === 'true';
        setIsSharedView(isShared);

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

        // Load additional customization options
        const lineWidthParam = searchParams.get('lw');
        if (lineWidthParam) {
            setLineWidth(parseFloat(lineWidthParam));
        }

        const lineStyleParam = searchParams.get('ls');
        if (lineStyleParam) {
            setLineStyle(lineStyleParam);
        }

        const showFillParam = searchParams.get('sf');
        if (showFillParam) {
            setShowFill(showFillParam === '1');
        }

        const showGlowParam = searchParams.get('sg');
        if (showGlowParam) {
            setShowGlow(showGlowParam === '1');
        }

        const glowIntensityParam = searchParams.get('gi');
        if (glowIntensityParam) {
            setGlowIntensity(parseFloat(glowIntensityParam));
        }

        const showTrailParam = searchParams.get('st');
        if (showTrailParam) {
            setShowTrail(showTrailParam === '1');
        }

        const showPathTracerParam = searchParams.get('sp');
        if (showPathTracerParam) {
            setShowPathTracer(showPathTracerParam === '1');
        }

        const showGridParam = searchParams.get('gr');
        if (showGridParam) {
            setShowGrid(showGridParam === '1');
        }

        const showFormulaParam = searchParams.get('fo');
        if (showFormulaParam) {
            setShowFormula(showFormulaParam === '1');
        }

        const useGradientParam = searchParams.get('ug');
        if (useGradientParam) {
            setUseGradient(useGradientParam === '1');
        }

        const gradientPresetParam = searchParams.get('gp');
        if (gradientPresetParam) {
            setSelectedGradient(gradientPresetParam);
        }

        const animSpeedParam = searchParams.get('as');
        if (animSpeedParam) {
            setAnimationSpeed(parseFloat(animSpeedParam));
        }

        // Get custom message for shared view
        const messageParam = searchParams.get('msg');
        if (messageParam) {
            const decodedMessage = decodeURIComponent(messageParam);
            setDisplayMessage(decodedMessage);
            // Set page title to the custom message for shared links
            if (isShared) {
                document.title = decodedMessage;
            }
        } else if (isShared) {
            document.title = 'Canvas Playground - Shared Shape';
        }

        // Get message animation style
        const animParam = searchParams.get('ma');
        if (animParam) {
            setDisplayMessageAnimation(animParam);
        }

        // Get surprise setting
        const surpriseParam = searchParams.get('sur');
        if (surpriseParam === '1') {
            setDisplaySurprise(true);
        }

        // Cleanup: restore original title when leaving
        return () => {
            document.title = 'Canvas Playground';
        };
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
                lineStyle,
                showFill,
                showGlow,
                glowIntensity,
                showTrail,
                showPathTracer,
                showGrid,
                showFormula,
                useGradient,
                selectedGradient,
                animationSpeed,
            },
            thumbnail,
            createdAt: Date.now(),
        };

        // Save to localStorage
        const existing = JSON.parse(localStorage.getItem('canvas-playground-gallery') || '[]');
        existing.unshift(galleryItem);
        localStorage.setItem('canvas-playground-gallery', JSON.stringify(existing));

        showToast('💾 Saved to Gallery!');
    }, [filename, activePreset, xFunction, yFunction, scale, tEnd, strokeColor,
        fillColor, backgroundColor, lineWidth, lineStyle, showFill, showGlow, glowIntensity,
        showTrail, showPathTracer, showGrid, showFormula, useGradient, selectedGradient,
        animationSpeed, showToast]);

    const handleCopyShareLink = useCallback(() => {
        const params = new URLSearchParams({
            shared: 'true',
            ...(activePreset && { preset: activePreset }),
            x: xFunction,
            y: yFunction,
            s: scale.toString(),
            t: tEnd.toString(),
            sc: strokeColor,
            fc: fillColor,
            bg: backgroundColor,
            lw: lineWidth.toString(),
            ls: lineStyle,
            sf: showFill ? '1' : '0',
            sg: showGlow ? '1' : '0',
            gi: glowIntensity.toString(),
            st: showTrail ? '1' : '0',
            sp: showPathTracer ? '1' : '0',
            gr: showGrid ? '1' : '0',
            fo: showFormula ? '1' : '0',
            ug: useGradient ? '1' : '0',
            gp: selectedGradient,
            as: animationSpeed.toString(),
            ...(shareMessage && { msg: encodeURIComponent(shareMessage) }),
            ...(shareMessage && { ma: messageAnimation }),
            ...(showSurprise && { sur: '1' }),
        });

        // Use hash-based URL for HashRouter compatibility
        const url = `${window.location.origin}${window.location.pathname}#/playground?${params.toString()}`;
        navigator.clipboard.writeText(url);
        showToast('🔗 Share link copied to clipboard!');
    }, [activePreset, xFunction, yFunction, scale, tEnd, strokeColor, fillColor, backgroundColor,
        lineWidth, lineStyle, showFill, showGlow, glowIntensity, showTrail, showPathTracer,
        showGrid, showFormula, useGradient, selectedGradient, animationSpeed, shareMessage,
        messageAnimation, showSurprise, showToast]);

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

    // Shared view - show only canvas
    if (isSharedView) {
        return (
            <div className="shared-view" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: backgroundColor,
                zIndex: 9999,
                padding: '20px',
                overflow: 'hidden',
            }}>
                {/* Surprise Confetti Effect - only shows after gift is revealed */}
                {displaySurprise && giftRevealed && (
                    <style>
                        {`
              @keyframes confettiFall {
                0% {
                  transform: translateY(-100vh) rotate(0deg);
                  opacity: 1;
                }
                100% {
                  transform: translateY(100vh) rotate(720deg);
                  opacity: 0;
                }
              }
              @keyframes sparkle {
                0%, 100% { opacity: 0; transform: scale(0); }
                50% { opacity: 1; transform: scale(1); }
              }
              @keyframes floatUp {
                0% { transform: translateY(100vh) scale(0); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
              }
              .confetti {
                position: fixed;
                width: 10px;
                height: 10px;
                translateY(-100vh) rotate(0deg);
                opacity: 1;
                animation: confettiFall linear forwards;
              }
              .sparkle {
                position: fixed;
                font-size: 24px;
                opacity: 0; 
                transform: scale(0);
                animation: sparkle 1.5s ease-in-out infinite;
              }
              .heart-float {
                position: fixed;
                font-size: 30px;
                transform: translateY(100vh) scale(0);
                 opacity: 0;
                animation: floatUp 4s ease-out forwards;
              }
            `}
                    </style>
                )}
                {displaySurprise && giftRevealed && [...Array(50)].map((_, i) => (
                    <div
                        key={`confetti-${i}`}
                        className="confetti"
                        style={{
                            left: `${Math.random() * 100}%`,
                            background: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'][i % 6],
                            borderRadius: i % 3 === 0 ? '50%' : '0',
                            animationDuration: `${2 + Math.random() * 3}s`,
                            animationDelay: `${Math.random() * 0.5}s`,
                        }}
                    />
                ))}
                {displaySurprise && giftRevealed && [...Array(15)].map((_, i) => (
                    <div
                        key={`sparkle-${i}`}
                        className="sparkle"
                        style={{
                            left: `${10 + Math.random() * 80}%`,
                            top: `${10 + Math.random() * 80}%`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    >
                        ✨
                    </div>
                ))}
                {displaySurprise && giftRevealed && [...Array(10)].map((_, i) => (
                    <div
                        key={`heart-${i}`}
                        className="heart-float"
                        style={{
                            left: `${10 + Math.random() * 80}%`,
                            animationDelay: `${i * 0.5}s`,
                        }}
                    >
                        {['❤️', '💖', '💕', '💗', '✨', '🌟'][i % 6]}
                    </div>
                ))}

                <CanvasComponent
                    ref={canvasRef}
                    width={Math.min(window.innerWidth - 40, 800)}
                    height={Math.min(window.innerHeight - (displayMessage ? 120 : 40), 600)}
                    backgroundColor={backgroundColor}
                />

                {/* Custom message display with animations */}
                {displayMessage && (
                    <>
                        <style>
                            {`
                /* Gift Box Animations */
                @keyframes giftWiggle {
                  0%, 100% { transform: rotate(-3deg); }
                  50% { transform: rotate(3deg); }
                }
                @keyframes giftPulse {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                }
                @keyframes giftOpen {
                  0% { transform: scale(1) rotate(0deg); }
                  20% { transform: scale(1.2) rotate(-10deg); }
                  40% { transform: scale(0.8) rotate(10deg); }
                  60% { transform: scale(1.3) rotate(-5deg); }
                  80% { transform: scale(0.5) rotate(0deg); opacity: 0.5; }
                  100% { transform: scale(0) rotate(0deg); opacity: 0; }
                }
                @keyframes confettiBurst {
                  0% { transform: translateY(0) scale(0); opacity: 1; }
                  100% { transform: translateY(-100px) scale(1); opacity: 0; }
                }
                @keyframes messageReveal {
                  0% { opacity: 0; transform: scale(0.5) translateY(20px); }
                  50% { transform: scale(1.1) translateY(-10px); }
                  100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                
                /* Reveal Animation */
                @keyframes revealMessage {
                  0% {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                    filter: blur(10px);
                  }
                  100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    filter: blur(0);
                  }
                }
                
                /* Bounce Animation */
                @keyframes bounceIn {
                  0% { opacity: 0; transform: scale(0.3) translateY(50px); }
                  50% { transform: scale(1.05) translateY(-10px); }
                  70% { transform: scale(0.95) translateY(5px); }
                  100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                
                /* Glow Pulse Animation */
                @keyframes glowPulse {
                  0%, 100% {
                    box-shadow: 0 0 20px rgba(255, 107, 107, 0.3), 0 0 40px rgba(72, 219, 251, 0.2);
                  }
                  50% {
                    box-shadow: 0 0 30px rgba(254, 202, 87, 0.4), 0 0 60px rgba(255, 107, 107, 0.3);
                  }
                }
                
                /* Wave Animation */
                @keyframes waveIn {
                  0% { opacity: 0; transform: translateX(-100px) rotate(-10deg); }
                  60% { transform: translateX(10px) rotate(2deg); }
                  100% { opacity: 1; transform: translateX(0) rotate(0); }
                }
                
                /* Fade Scale Animation */
                @keyframes fadeScale {
                  0% { opacity: 0; transform: scale(0); }
                  50% { transform: scale(1.1); }
                  100% { opacity: 1; transform: scale(1); }
                }
                
                /* Slide Up Animation */
                @keyframes slideUp {
                  0% { opacity: 0; transform: translateY(100px); }
                  100% { opacity: 1; transform: translateY(0); }
                }
                
                /* Flip Animation */
                @keyframes flipIn {
                  0% { opacity: 0; transform: perspective(400px) rotateX(90deg); }
                  40% { transform: perspective(400px) rotateX(-10deg); }
                  70% { transform: perspective(400px) rotateX(10deg); }
                  100% { opacity: 1; transform: perspective(400px) rotateX(0); }
                }
                
                /* Gradient Shift Animation */
                @keyframes gradientShift {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                
                /* Rainbow Animation */
                @keyframes rainbow {
                  0% { filter: hue-rotate(0deg); }
                  100% { filter: hue-rotate(360deg); }
                }
                
                /* Shake Animation */
                @keyframes shakeIn {
                  0% { opacity: 0; transform: translateX(-50px); }
                  20% { transform: translateX(30px); }
                  40% { transform: translateX(-20px); }
                  60% { transform: translateX(10px); }
                  80% { transform: translateX(-5px); }
                  100% { opacity: 1; transform: translateX(0); }
                }
                
                .gift-box {
                  cursor: pointer;
                  animation: giftWiggle 0.5s ease-in-out infinite, giftPulse 2s ease-in-out infinite;
                  transition: transform 0.3s ease;
                }
                .gift-box:hover {
                  transform: scale(1.1);
                }
                .gift-box.opening {
                  animation: giftOpen 0.8s ease-out forwards;
                }
                
                .shared-message-container {
                  opacity: 0;
                }
                
                .shared-message-container.anim-reveal {
                  animation: revealMessage 1s ease-out forwards, glowPulse 3s ease-in-out 1s infinite;
                }
                
                .shared-message-container.anim-bounce {
                  animation: bounceIn 1s ease-out forwards, glowPulse 3s ease-in-out 1s infinite;
                }
                
                .shared-message-container.anim-wave {
                  animation: waveIn 1s ease-out forwards, glowPulse 3s ease-in-out 1s infinite;
                }
                
                .shared-message-container.anim-fadeScale {
                  animation: fadeScale 0.8s ease-out forwards, glowPulse 3s ease-in-out 1s infinite;
                }
                
                .shared-message-container.anim-slideUp {
                  animation: slideUp 0.8s ease-out forwards, glowPulse 3s ease-in-out 1s infinite;
                }
                
                .shared-message-container.anim-flip {
                  animation: flipIn 1s ease-out forwards, glowPulse 3s ease-in-out 1s infinite;
                }
                
                .shared-message-container.anim-shake {
                  animation: shakeIn 0.8s ease-out forwards, glowPulse 3s ease-in-out 1s infinite;
                }
                
                .shared-message-text {
                  background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff6b6b);
                  background-size: 300% 100%;
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  animation: gradientShift 4s ease infinite;
                }
                
                .shared-message-text.rainbow {
                  animation: gradientShift 4s ease infinite, rainbow 5s linear infinite;
                }
              `}
                        </style>

                        {/* Gift Box (when surprise is enabled and not yet revealed) */}
                        {displaySurprise && !giftRevealed ? (
                            <div
                                className="gift-box"
                                onClick={() => setGiftRevealed(true)}
                                style={{
                                    marginTop: '30px',
                                    padding: '30px 50px',
                                    background: 'linear-gradient(135deg, rgba(255,107,107,0.2), rgba(254,202,87,0.2))',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '20px',
                                    border: '2px solid rgba(255, 107, 107, 0.3)',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <div style={{ fontSize: '4rem', marginBottom: '15px' }}>
                                    🎁
                                </div>
                                <p style={{
                                    margin: 0,
                                    color: '#feca57',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                }}>
                                    You have a surprise message!
                                </p>
                                <p style={{
                                    margin: '8px 0 0 0',
                                    color: '#888',
                                    fontSize: '0.9rem',
                                }}>
                                    👆 Click to open
                                </p>
                            </div>
                        ) : (
                            /* Message Display (normal or after gift reveal) */
                            <div
                                className={`shared-message-container anim-${displayMessageAnimation}`}
                                style={{
                                    marginTop: '20px',
                                    padding: '20px 40px',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    maxWidth: '85%',
                                    textAlign: 'center',
                                }}
                            >
                                <p
                                    className={`shared-message-text ${displaySurprise ? 'rainbow' : ''}`}
                                    style={{
                                        margin: 0,
                                        fontSize: '1.3rem',
                                        fontWeight: 'bold',
                                        fontStyle: 'italic',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    &ldquo;{displayMessage}&rdquo;
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Toast notification */}
                {toast.show && (
                    <div style={{
                        position: 'fixed',
                        bottom: '30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(72, 219, 251, 0.95)',
                        color: '#000',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        zIndex: 10000,
                        animation: 'fadeIn 0.3s ease',
                    }}>
                        {toast.message}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="playground-page">
            {/* Toast notification */}
            {toast.show && (
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(72, 219, 251, 0.95)',
                    color: '#000',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    zIndex: 10000,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}>
                    {toast.message}
                </div>
            )}

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
                            <li><kbd>Space</kbd> Play/Pause • <kbd>R</kbd> Reset • <kbd>G</kbd> Grid • <kbd>S</kbd> Fill
                            </li>
                            <li><kbd>+</kbd>/<kbd>-</kbd> Speed • <kbd>E</kbd> Export • <kbd>F</kbd> Fullscreen</li>
                            <li>Use <code>t</code> as parameter •
                                Available: <code>Math.sin</code>, <code>Math.cos</code>, <code>Math.pow</code></li>
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
                            📥 Export
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'share' ? 'active' : ''}`}
                            onClick={() => setActiveTab('share')}
                        >
                            🔗 Share
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

                            <div style={{
                                marginTop: '20px',
                                padding: '15px',
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: '10px'
                            }}>
                                <h4 style={{ margin: '0 0 10px 0', color: '#feca57' }}>💡 Export Tips</h4>
                                <ul style={{ margin: 0, paddingLeft: '20px', color: '#888', fontSize: '0.85rem' }}>
                                    <li>PNG for transparent backgrounds</li>
                                    <li>JPG for smaller file size</li>
                                    <li>Use the Share tab to create shareable links</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'share' && (
                        <div className="tab-content">
                            <div style={{
                                padding: '15px',
                                background: 'linear-gradient(135deg, rgba(255,107,107,0.1), rgba(72,219,251,0.1))',
                                borderRadius: '12px',
                                marginBottom: '20px',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <h4 style={{ margin: '0 0 5px 0', color: '#48dbfb' }}>🔗 Share Your Creation</h4>
                                <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>
                                    Create a shareable link with custom message and animations!
                                </p>
                            </div>

                            <div className="control-group">
                                <label>📝 Share Message:</label>
                                <input
                                    type="text"
                                    value={shareMessage}
                                    onChange={(e) => setShareMessage(e.target.value)}
                                    placeholder="Add a message to display..."
                                    style={{ width: '100%' }}
                                />
                                <small
                                    style={{ color: '#888', fontSize: '0.75rem', marginTop: '5px', display: 'block' }}>
                                    This message will appear below the shape when shared
                                </small>
                            </div>

                            <div className="control-group" style={{ marginTop: '15px' }}>
                                <label>🎬 Message Animation:</label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                                    {[
                                        { key: 'reveal', name: 'Reveal', icon: '✨' },
                                        { key: 'bounce', name: 'Bounce', icon: '🎾' },
                                        { key: 'wave', name: 'Wave', icon: '🌊' },
                                        { key: 'fadeScale', name: 'Scale', icon: '🔍' },
                                        { key: 'slideUp', name: 'Slide', icon: '⬆️' },
                                        { key: 'flip', name: 'Flip', icon: '🔄' },
                                        { key: 'shake', name: 'Shake', icon: '📳' },
                                    ].map((anim) => (
                                        <button
                                            key={anim.key}
                                            className={`preset-btn ${messageAnimation === anim.key ? 'active' : ''}`}
                                            style={{
                                                padding: '8px 12px',
                                                fontSize: '0.8rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
                                            onClick={() => {
                                                setMessageAnimation(anim.key);
                                                setPreviewKey(prev => prev + 1);
                                            }}
                                            title={anim.name}
                                        >
                                            <span>{anim.icon}</span>
                                            <span>{anim.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Animated Message Preview */}
                            {shareMessage && (
                                <div style={{
                                    marginTop: '20px',
                                    padding: '20px',
                                    background: 'rgba(0,0,0,0.4)',
                                    borderRadius: '16px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '15px'
                                    }}>
                                        <h5 style={{ margin: 0, color: '#48dbfb', fontSize: '0.85rem' }}>
                                            🎬 Animation Preview
                                        </h5>
                                        <button
                                            onClick={() => setPreviewKey(prev => prev + 1)}
                                            style={{
                                                background: 'rgba(72, 219, 251, 0.2)',
                                                border: '1px solid rgba(72, 219, 251, 0.3)',
                                                borderRadius: '6px',
                                                padding: '4px 10px',
                                                color: '#48dbfb',
                                                cursor: 'pointer',
                                                fontSize: '0.75rem',
                                            }}
                                        >
                                            ▶️ Replay
                                        </button>
                                    </div>
                                    <style>
                                        {`
                      @keyframes previewReveal {
                        0% { opacity: 0; transform: translateY(10px) scale(0.95); filter: blur(5px); }
                        100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                      }
                      @keyframes previewBounce {
                        0% { opacity: 0; transform: scale(0.3) translateY(20px); }
                        50% { transform: scale(1.05) translateY(-5px); }
                        70% { transform: scale(0.95) translateY(2px); }
                        100% { opacity: 1; transform: scale(1) translateY(0); }
                      }
                      @keyframes previewWave {
                        0% { opacity: 0; transform: translateX(-30px) rotate(-5deg); }
                        60% { transform: translateX(5px) rotate(1deg); }
                        100% { opacity: 1; transform: translateX(0) rotate(0); }
                      }
                      @keyframes previewScale {
                        0% { opacity: 0; transform: scale(0); }
                        50% { transform: scale(1.1); }
                        100% { opacity: 1; transform: scale(1); }
                      }
                      @keyframes previewSlide {
                        0% { opacity: 0; transform: translateY(30px); }
                        100% { opacity: 1; transform: translateY(0); }
                      }
                      @keyframes previewFlip {
                        0% { opacity: 0; transform: perspective(200px) rotateX(60deg); }
                        100% { opacity: 1; transform: perspective(200px) rotateX(0); }
                      }
                      @keyframes previewShake {
                        0% { opacity: 0; transform: translateX(-20px); }
                        20% { transform: translateX(15px); }
                        40% { transform: translateX(-10px); }
                        60% { transform: translateX(5px); }
                        80% { transform: translateX(-2px); }
                        100% { opacity: 1; transform: translateX(0); }
                      }
                      @keyframes previewGradient {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                      }
                    `}
                                    </style>
                                    <div
                                        key={previewKey}
                                        style={{
                                            padding: '15px',
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '10px',
                                            textAlign: 'center',
                                            animation: `preview${messageAnimation.charAt(0).toUpperCase() + messageAnimation.slice(1)} 0.8s ease-out forwards`,
                                            opacity: 0,
                                        }}
                                    >
                                        <p style={{
                                            margin: 0,
                                            fontSize: '1.1rem',
                                            fontStyle: 'italic',
                                            fontWeight: 'bold',
                                            background: 'linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff6b6b)',
                                            backgroundSize: '300% 100%',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            animation: 'previewGradient 3s ease infinite',
                                        }}>
                                            &ldquo;{shareMessage}&rdquo;
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Gift Box Surprise Toggle */}
                            <div className="control-group" style={{ marginTop: '20px' }}>
                                <div
                                    onClick={() => setShowSurprise(!showSurprise)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        padding: '20px',
                                        background: showSurprise
                                            ? 'linear-gradient(135deg, rgba(255,107,107,0.15), rgba(254,202,87,0.15), rgba(72,219,251,0.15))'
                                            : 'rgba(255, 255, 255, 0.03)',
                                        borderRadius: '16px',
                                        border: showSurprise
                                            ? '2px solid rgba(255, 107, 107, 0.4)'
                                            : '2px dashed rgba(255, 255, 255, 0.15)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* Animated gift box */}
                                    <div style={{
                                        fontSize: '2.5rem',
                                        transition: 'transform 0.3s ease',
                                        transform: showSurprise ? 'scale(1.1)' : 'scale(1)',
                                        filter: showSurprise ? 'drop-shadow(0 0 10px rgba(255,107,107,0.5))' : 'none',
                                    }}>
                                        {showSurprise ? '🎁✨' : '🎁'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontWeight: 'bold',
                                            fontSize: '1.1rem',
                                            color: showSurprise ? '#feca57' : '#fff',
                                            marginBottom: '4px',
                                        }}>
                                            {showSurprise ? '🎉 Surprise Enabled!' : 'Add Surprise Gift Box'}
                                        </div>
                                        <small style={{
                                            color: '#888',
                                            fontSize: '0.8rem',
                                            display: 'block',
                                        }}>
                                            {showSurprise
                                                ? 'Message hidden in gift box - click to reveal! 💝'
                                                : 'Hide message in a gift box that reveals on click'}
                                        </small>
                                    </div>
                                    {/* Toggle indicator */}
                                    <div style={{
                                        width: '50px',
                                        height: '26px',
                                        borderRadius: '13px',
                                        background: showSurprise
                                            ? 'linear-gradient(90deg, #ff6b6b, #feca57)'
                                            : 'rgba(255,255,255,0.1)',
                                        position: 'relative',
                                        transition: 'all 0.3s ease',
                                    }}>
                                        <div style={{
                                            width: '22px',
                                            height: '22px',
                                            borderRadius: '50%',
                                            background: '#fff',
                                            position: 'absolute',
                                            top: '2px',
                                            left: showSurprise ? '26px' : '2px',
                                            transition: 'left 0.3s ease',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                        }}/>
                                    </div>
                                    {/* Sparkle effects when enabled */}
                                    {showSurprise && (
                                        <style>
                                            {`
                        @keyframes sparkleFloat {
                          0%, 100% { opacity: 0.3; transform: translateY(0) scale(0.8); }
                          50% { opacity: 1; transform: translateY(-5px) scale(1); }
                        }
                      `}
                                        </style>
                                    )}
                                    {showSurprise && ['✨', '💖', '🌟', '💫'].map((emoji, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                position: 'absolute',
                                                fontSize: '0.8rem',
                                                animation: `sparkleFloat 1.5s ease-in-out ${i * 0.3}s infinite`,
                                                top: `${10 + (i % 2) * 60}%`,
                                                right: `${10 + i * 15}%`,
                                                pointerEvents: 'none',
                                            }}
                                        >
                      {emoji}
                    </span>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="btn btn-primary"
                                style={{
                                    width: '100%',
                                    marginTop: '20px',
                                    padding: '15px',
                                    fontSize: '1rem',
                                    background: 'linear-gradient(90deg, #ff6b6b, #feca57)',
                                }}
                                onClick={handleCopyShareLink}
                            >
                                🔗 Copy Share Link
                            </button>

                            <div style={{
                                marginTop: '15px',
                                padding: '12px',
                                background: 'rgba(72, 219, 251, 0.1)',
                                borderRadius: '10px',
                                border: '1px solid rgba(72, 219, 251, 0.2)'
                            }}>
                                <p style={{ margin: 0, color: '#48dbfb', fontSize: '0.8rem', textAlign: 'center' }}>
                                    💡 Share link includes all your shape settings, colors, effects, and message!
                                </p>
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

