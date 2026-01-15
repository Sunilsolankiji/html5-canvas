import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { drawParametricShape } from '../../utils/canvasDrawing';
import {
    SHAPE_PRESETS,
    LINE_STYLES,
    GRADIENT_PRESETS,
    KEYBOARD_SHORTCUTS,
    COLOR_PALETTES,
} from '../../constants';
import { DEFAULT_STATE } from './constants';

/**
 * Custom hook to manage all Playground state
 */
export function usePlaygroundState() {
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
    const [previewKey, setPreviewKey] = useState(0);

    // Shared view state
    const [isSharedView, setIsSharedView] = useState(false);
    const [displayMessage, setDisplayMessage] = useState('');
    const [displayMessageAnimation, setDisplayMessageAnimation] = useState('reveal');
    const [displaySurprise, setDisplaySurprise] = useState(false);
    const [giftRevealed, setGiftRevealed] = useState(false);

    return {
        // Basic settings
        activeTab, setActiveTab,
        activeCategory, setActiveCategory,
        activePreset, setActivePreset,
        xFunction, setXFunction,
        yFunction, setYFunction,
        scale, setScale,
        tEnd, setTEnd,

        // Style settings
        strokeColor, setStrokeColor,
        fillColor, setFillColor,
        backgroundColor, setBackgroundColor,
        lineWidth, setLineWidth,
        lineStyle, setLineStyle,

        // Animation settings
        animationSpeed, setAnimationSpeed,
        showFill, setShowFill,
        animateDrawing, setAnimateDrawing,
        autoRefresh, setAutoRefresh,
        isPaused, setIsPaused,

        // Advanced effects
        showGlow, setShowGlow,
        glowIntensity, setGlowIntensity,
        showTrail, setShowTrail,
        showPathTracer, setShowPathTracer,
        showGrid, setShowGrid,
        showFormula, setShowFormula,
        useGradient, setUseGradient,
        selectedGradient, setSelectedGradient,
        selectedPalette, setSelectedPalette,

        // Export settings
        filename, setFilename,
        exportFormat, setExportFormat,
        shareMessage, setShareMessage,
        messageAnimation, setMessageAnimation,
        showSurprise, setShowSurprise,

        // UI state
        error, setError,
        showTutorial, setShowTutorial,
        tutorialStep, setTutorialStep,
        history, setHistory,
        historyIndex, setHistoryIndex,
        previewKey, setPreviewKey,

        // Shared view state
        isSharedView, setIsSharedView,
        displayMessage, setDisplayMessage,
        displayMessageAnimation, setDisplayMessageAnimation,
        displaySurprise, setDisplaySurprise,
        giftRevealed, setGiftRevealed,
    };
}

/**
 * Custom hook to handle URL parameters for shared links
 */
export function useUrlParams(state) {
    const [searchParams] = useSearchParams();
    const {
        setIsSharedView, setActivePreset, setXFunction, setYFunction,
        setScale, setTEnd, setStrokeColor, setFillColor, setBackgroundColor,
        setLineWidth, setLineStyle, setShowFill, setShowGlow, setGlowIntensity,
        setShowTrail, setShowPathTracer, setShowGrid, setShowFormula,
        setUseGradient, setSelectedGradient, setAnimationSpeed,
        setDisplayMessage, setDisplayMessageAnimation, setDisplaySurprise,
    } = state;

    useEffect(() => {
        const isShared = searchParams.get('shared') === 'true';
        setIsSharedView(isShared);

        // Check for preset parameter
        const preset = searchParams.get('preset');
        if (preset && SHAPE_PRESETS[preset]) {
            const presetData = SHAPE_PRESETS[preset];
            setActivePreset(preset);
            setXFunction(presetData.x);
            setYFunction(presetData.y);
            setScale(presetData.scale);
            setTEnd(presetData.tEnd);
        }

        // Share link parameters
        const xParam = searchParams.get('x');
        const yParam = searchParams.get('y');
        if (xParam && yParam) {
            setXFunction(xParam);
            setYFunction(yParam);
            setActivePreset(null);
        }

        // Numeric parameters
        const paramSetters = {
            's': (v) => setScale(parseFloat(v)),
            't': (v) => setTEnd(parseFloat(v)),
            'lw': (v) => setLineWidth(parseFloat(v)),
            'gi': (v) => setGlowIntensity(parseFloat(v)),
            'as': (v) => setAnimationSpeed(parseFloat(v)),
        };

        Object.entries(paramSetters).forEach(([param, setter]) => {
            const value = searchParams.get(param);
            if (value) setter(value);
        });

        // String parameters
        const stringParams = {
            'sc': setStrokeColor,
            'fc': setFillColor,
            'bg': setBackgroundColor,
            'ls': setLineStyle,
            'gp': setSelectedGradient,
            'ma': setDisplayMessageAnimation,
        };

        Object.entries(stringParams).forEach(([param, setter]) => {
            const value = searchParams.get(param);
            if (value) setter(value);
        });

        // Boolean parameters
        const boolParams = {
            'sf': setShowFill,
            'sg': setShowGlow,
            'st': setShowTrail,
            'sp': setShowPathTracer,
            'gr': setShowGrid,
            'fo': setShowFormula,
            'ug': setUseGradient,
        };

        Object.entries(boolParams).forEach(([param, setter]) => {
            const value = searchParams.get(param);
            if (value) setter(value === '1');
        });

        // Message and surprise
        const messageParam = searchParams.get('msg');
        if (messageParam) {
            const decodedMessage = decodeURIComponent(messageParam);
            setDisplayMessage(decodedMessage);
            if (isShared) {
                document.title = decodedMessage;
            }
        } else if (isShared) {
            document.title = 'Canvas Playground - Shared Shape';
        }

        const surpriseParam = searchParams.get('sur');
        if (surpriseParam === '1') {
            setDisplaySurprise(true);
        }

        return () => {
            document.title = 'Canvas Playground';
        };
    }, [searchParams]);
}

/**
 * Custom hook for keyboard shortcuts
 */
export function useKeyboardShortcuts(handlers) {
    const { handleReset, handleExport, handleFullscreen, handleClear } = handlers;
    const { setIsPaused, setShowGrid, setShowFill, setAnimationSpeed } = handlers;

    useEffect(() => {
        const handleKeydown = (e) => {
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
    }, [handleReset, handleExport, handleFullscreen, handleClear, setIsPaused, setShowGrid, setShowFill, setAnimationSpeed]);
}

/**
 * Custom hook for drawing shape on canvas
 */
export function useCanvasDrawing(canvasRef, animationRef, state) {
    const isPausedRef = useRef(state.isPaused);
    const isInitialMount = useRef(true);

    // Keep isPausedRef in sync
    useEffect(() => {
        isPausedRef.current = state.isPaused;
    }, [state.isPaused]);

    const drawShape = useCallback((animated = true) => {
        const canvas = canvasRef.current?.getCanvas();
        const ctx = canvasRef.current?.getContext();

        if (!canvas || !ctx) return;

        const lineDash = LINE_STYLES[state.lineStyle]?.dash || [];

        if (state.showGlow) {
            ctx.shadowColor = state.strokeColor;
            ctx.shadowBlur = state.glowIntensity;
        } else {
            ctx.shadowBlur = 0;
        }

        const baseWidth = 700;
        const baseHeight = 500;
        const scaleFactor = Math.min(canvas.width / baseWidth, canvas.height / baseHeight);
        const adjustedScale = state.scale * scaleFactor;
        const adjustedLineWidth = Math.max(1, state.lineWidth * scaleFactor);

        drawParametricShape({
            canvas,
            ctx,
            xFunction: state.xFunction,
            yFunction: state.yFunction,
            scale: adjustedScale,
            tEnd: state.tEnd,
            strokeColor: state.strokeColor,
            fillColor: state.fillColor,
            lineWidth: adjustedLineWidth,
            showFill: state.showFill,
            animated,
            animateDrawing: state.animateDrawing,
            animationSpeed: state.animationSpeed,
            animationRef,
            isPausedRef,
            lineDash,
            showGlow: state.showGlow,
            glowIntensity: Math.max(5, state.glowIntensity * scaleFactor),
            showTrail: state.showTrail,
            showPathTracer: state.showPathTracer,
            useGradient: state.useGradient,
            gradientPreset: GRADIENT_PRESETS[state.selectedGradient],
            backgroundColor: state.backgroundColor,
            showGrid: state.showGrid,
            showFormula: state.showFormula,
            onError: (msg) => state.setError(msg),
        });

        state.setError('');
    }, [
        state.xFunction, state.yFunction, state.scale, state.tEnd,
        state.strokeColor, state.fillColor, state.lineWidth, state.showFill,
        state.animateDrawing, state.animationSpeed, state.lineStyle,
        state.showGlow, state.glowIntensity, state.showTrail, state.showPathTracer,
        state.showGrid, state.showFormula, state.useGradient, state.selectedGradient,
        state.backgroundColor, canvasRef, animationRef
    ]);

    return { drawShape, isPausedRef, isInitialMount };
}

/**
 * Custom hook for playground action handlers
 */
export function usePlaygroundActions(canvasRef, animationRef, state, drawShape, showToast) {
    const handlePresetClick = useCallback((key) => {
        const preset = SHAPE_PRESETS[key];
        state.setActivePreset(key);
        state.setXFunction(preset.x);
        state.setYFunction(preset.y);
        state.setScale(preset.scale);
        state.setTEnd(preset.tEnd);

        // Add to history
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push({ type: 'preset', key, preset });
        state.setHistory(newHistory);
        state.setHistoryIndex(newHistory.length - 1);
    }, [state]);

    const handleExport = useCallback(() => {
        const canvas = canvasRef.current?.getCanvas();
        if (!canvas) return;

        let dataUrl;
        let mimeType;

        switch (state.exportFormat) {
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
        link.download = `${state.filename || 'canvas-shape'}.${state.exportFormat}`;
        link.href = dataUrl;
        link.click();
    }, [state.filename, state.exportFormat, canvasRef]);

    const handleSaveToGallery = useCallback(() => {
        const canvas = canvasRef.current?.getCanvas();
        if (!canvas) return;

        const thumbnail = canvas.toDataURL('image/png');
        const galleryItem = {
            id: `user-${Date.now()}`,
            name: state.filename || 'Untitled',
            type: 'playground',
            preset: state.activePreset,
            xFunction: state.xFunction,
            yFunction: state.yFunction,
            scale: state.scale,
            tEnd: state.tEnd,
            colors: {
                stroke: state.strokeColor,
                fill: state.fillColor,
                background: state.backgroundColor,
            },
            settings: {
                lineWidth: state.lineWidth,
                lineStyle: state.lineStyle,
                showFill: state.showFill,
                showGlow: state.showGlow,
                glowIntensity: state.glowIntensity,
                showTrail: state.showTrail,
                showPathTracer: state.showPathTracer,
                showGrid: state.showGrid,
                showFormula: state.showFormula,
                useGradient: state.useGradient,
                selectedGradient: state.selectedGradient,
                animationSpeed: state.animationSpeed,
            },
            thumbnail,
            createdAt: Date.now(),
        };

        const existing = JSON.parse(localStorage.getItem('canvas-playground-gallery') || '[]');
        existing.unshift(galleryItem);
        localStorage.setItem('canvas-playground-gallery', JSON.stringify(existing));

        showToast('💾 Saved to Gallery!');
    }, [state, canvasRef, showToast]);

    const handleCopyShareLink = useCallback(() => {
        const params = new URLSearchParams({
            shared: 'true',
            ...(state.activePreset && { preset: state.activePreset }),
            x: state.xFunction,
            y: state.yFunction,
            s: state.scale.toString(),
            t: state.tEnd.toString(),
            sc: state.strokeColor,
            fc: state.fillColor,
            bg: state.backgroundColor,
            lw: state.lineWidth.toString(),
            ls: state.lineStyle,
            sf: state.showFill ? '1' : '0',
            sg: state.showGlow ? '1' : '0',
            gi: state.glowIntensity.toString(),
            st: state.showTrail ? '1' : '0',
            sp: state.showPathTracer ? '1' : '0',
            gr: state.showGrid ? '1' : '0',
            fo: state.showFormula ? '1' : '0',
            ug: state.useGradient ? '1' : '0',
            gp: state.selectedGradient,
            as: state.animationSpeed.toString(),
            ...(state.shareMessage && { msg: encodeURIComponent(state.shareMessage) }),
            ...(state.shareMessage && { ma: state.messageAnimation }),
            ...(state.showSurprise && { sur: '1' }),
        });

        const url = `${window.location.origin}${window.location.pathname}#/playground?${params.toString()}`;
        navigator.clipboard.writeText(url);
        showToast('🔗 Share link copied to clipboard!');
    }, [state, showToast]);

    const handleFullscreen = useCallback(() => {
        canvasRef.current?.requestFullscreen();
    }, [canvasRef]);

    const handlePause = useCallback(() => {
        state.setIsPaused((prev) => !prev);
    }, [state]);

    const handleClear = useCallback(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        canvasRef.current?.clear();
    }, [animationRef, canvasRef]);

    const handleReset = useCallback(() => {
        state.setStrokeColor(DEFAULT_STATE.strokeColor);
        state.setFillColor(DEFAULT_STATE.fillColor);
        state.setBackgroundColor(DEFAULT_STATE.backgroundColor);
        state.setLineWidth(DEFAULT_STATE.lineWidth);
        state.setAnimationSpeed(DEFAULT_STATE.animationSpeed);
        state.setShowFill(DEFAULT_STATE.showFill);
        state.setAnimateDrawing(DEFAULT_STATE.animateDrawing);
        state.setAutoRefresh(DEFAULT_STATE.autoRefresh);
        state.setScale(DEFAULT_STATE.scale);
        state.setTEnd(DEFAULT_STATE.tEnd);
        state.setXFunction(DEFAULT_STATE.xFunction);
        state.setYFunction(DEFAULT_STATE.yFunction);
        state.setActivePreset(null);
        state.setShowGlow(false);
        state.setShowTrail(false);
        state.setShowPathTracer(false);
        state.setShowGrid(false);
        state.setShowFormula(false);
        state.setUseGradient(false);
        state.setLineStyle('solid');
    }, [state]);

    const handleRandomize = useCallback(() => {
        const presetKeys = Object.keys(SHAPE_PRESETS);
        const randomKey = presetKeys[Math.floor(Math.random() * presetKeys.length)];
        handlePresetClick(randomKey);

        const palette = COLOR_PALETTES[state.selectedPalette]?.colors || COLOR_PALETTES.neon.colors;
        state.setStrokeColor(palette[Math.floor(Math.random() * palette.length)]);
        state.setFillColor(palette[Math.floor(Math.random() * palette.length)]);
    }, [handlePresetClick, state]);

    return {
        handlePresetClick,
        handleExport,
        handleSaveToGallery,
        handleCopyShareLink,
        handleFullscreen,
        handlePause,
        handleClear,
        handleReset,
        handleRandomize,
    };
}

