import { useRef, useEffect, useCallback, useState } from 'react';
import { SHAPE_PRESETS } from '../../constants';
import { useResponsiveCanvas } from '../../hooks';

// Local imports
import {
    usePlaygroundState,
    useUrlParams,
    useKeyboardShortcuts,
    useCanvasDrawing,
    usePlaygroundActions,
} from './hooks';
import { SharedView, Toast } from './SharedView';
import { CanvasSection } from './CanvasSection';
import {
    ControlTabs,
    PresetsTab,
    CustomTab,
    StyleTab,
    EffectsTab,
    ExportTab,
    ShareTab,
} from './ControlTabs';
import { TutorialModal } from './TutorialModal';

import '../../styles/playground.css';

/**
 * Playground - Main component for creating and customizing parametric shapes
 */
function Playground() {
    // Refs
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    // Get responsive canvas dimensions
    const { width: canvasWidth, height: canvasHeight } = useResponsiveCanvas(700, 500);

    // All playground state
    const state = usePlaygroundState();

    // Toast state (separate for cleaner callback handling)
    const [toast, setToast] = useState({ show: false, message: '' });

    // Show toast notification
    const showToast = useCallback((message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    }, []);

    // Handle URL parameters for shared links
    useUrlParams(state);

    // Canvas drawing hook
    const { drawShape, isInitialMount } = useCanvasDrawing(canvasRef, animationRef, state);

    // Action handlers
    const actions = usePlaygroundActions(canvasRef, animationRef, state, drawShape, showToast);

    // Keyboard shortcuts
    useKeyboardShortcuts({
        ...actions,
        setIsPaused: state.setIsPaused,
        setShowGrid: state.setShowGrid,
        setShowFill: state.setShowFill,
        setAnimationSpeed: state.setAnimationSpeed,
    });

    // Initial draw on mount and when canvas dimensions change
    useEffect(() => {
        const timer = setTimeout(() => {
            drawShape();
        }, 50);

        const currentAnimationRef = animationRef.current;
        return () => {
            clearTimeout(timer);
            if (currentAnimationRef) {
                cancelAnimationFrame(currentAnimationRef);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canvasWidth, canvasHeight]);

    // Redraw when gift is revealed in shared view
    useEffect(() => {
        if (state.isSharedView && state.giftRevealed) {
            const timer = setTimeout(() => {
                drawShape(false);
            }, 100);
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.giftRevealed, state.isSharedView]);

    // Auto-refresh when values change
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (!state.autoRefresh) return;

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }

        const timer = setTimeout(() => drawShape(state.animateDrawing), 100);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        state.xFunction, state.yFunction, state.scale, state.tEnd,
        state.strokeColor, state.fillColor, state.backgroundColor,
        state.lineWidth, state.showFill, state.autoRefresh, state.lineStyle,
        state.showGlow, state.glowIntensity, state.showGrid, state.showFormula,
        state.useGradient, state.selectedGradient, state.animateDrawing,
        state.customAnimation, state.animationIntensity, state.animationDirection,
        state.animationTiming
    ]);

    // Filter presets by category
    const filteredPresets = Object.entries(SHAPE_PRESETS).filter(([, preset]) => {
        if (state.activeCategory === 'all') return true;
        return preset.category === state.activeCategory;
    });

    // Render shared view if in shared mode
    if (state.isSharedView) {
        return (
            <SharedView
                canvasRef={canvasRef}
                backgroundColor={state.backgroundColor}
                displayMessage={state.displayMessage}
                displayMessageAnimation={state.displayMessageAnimation}
                displaySurprise={state.displaySurprise}
                giftRevealed={state.giftRevealed}
                setGiftRevealed={state.setGiftRevealed}
                toast={toast}
                displayMusicUrl={state.displayMusicUrl}
                displayMusicStartTime={state.displayMusicStartTime}
                displayMusicEndTime={state.displayMusicEndTime}
            />
        );
    }

    // Render main playground
    return (
        <div className="playground-page">
            {/* Toast notification */}
            {toast.show && <Toast message={toast.message} />}

            {/* Header */}
            <div className="playground-header">
                <h2>🎮 Shape Playground</h2>
                <p>Create custom parametric shapes with mathematical functions!</p>
                <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                    onClick={() => state.setShowTutorial(true)}
                >
                    📚 Tutorial
                </button>
            </div>

            <div className="playground-layout">
                {/* Canvas Section */}
                <CanvasSection
                    canvasRef={canvasRef}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                    backgroundColor={state.backgroundColor}
                    isPaused={state.isPaused}
                    drawShape={drawShape}
                    handlePause={actions.handlePause}
                    handleClear={actions.handleClear}
                    handleRandomize={actions.handleRandomize}
                    handleExport={actions.handleExport}
                    handleSaveToGallery={actions.handleSaveToGallery}
                    handleCopyShareLink={actions.handleCopyShareLink}
                    handleFullscreen={actions.handleFullscreen}
                />

                {/* Controls Section */}
                <div className="controls-section">
                    <ControlTabs
                        activeTab={state.activeTab}
                        setActiveTab={state.setActiveTab}
                    />

                    {state.activeTab === 'presets' && (
                        <PresetsTab
                            activeCategory={state.activeCategory}
                            setActiveCategory={state.setActiveCategory}
                            filteredPresets={filteredPresets}
                            activePreset={state.activePreset}
                            handlePresetClick={actions.handlePresetClick}
                        />
                    )}

                    {state.activeTab === 'custom' && (
                        <CustomTab
                            xFunction={state.xFunction}
                            setXFunction={state.setXFunction}
                            yFunction={state.yFunction}
                            setYFunction={state.setYFunction}
                            scale={state.scale}
                            setScale={state.setScale}
                            tEnd={state.tEnd}
                            setTEnd={state.setTEnd}
                        />
                    )}

                    {state.activeTab === 'style' && (
                        <StyleTab
                            strokeColor={state.strokeColor}
                            setStrokeColor={state.setStrokeColor}
                            fillColor={state.fillColor}
                            setFillColor={state.setFillColor}
                            backgroundColor={state.backgroundColor}
                            setBackgroundColor={state.setBackgroundColor}
                            selectedPalette={state.selectedPalette}
                            setSelectedPalette={state.setSelectedPalette}
                            lineWidth={state.lineWidth}
                            setLineWidth={state.setLineWidth}
                            lineStyle={state.lineStyle}
                            setLineStyle={state.setLineStyle}
                            animationSpeed={state.animationSpeed}
                            setAnimationSpeed={state.setAnimationSpeed}
                            showFill={state.showFill}
                            setShowFill={state.setShowFill}
                            animateDrawing={state.animateDrawing}
                            setAnimateDrawing={state.setAnimateDrawing}
                            autoRefresh={state.autoRefresh}
                            setAutoRefresh={state.setAutoRefresh}
                            handleReset={actions.handleReset}
                        />
                    )}

                    {state.activeTab === 'effects' && (
                        <EffectsTab
                            showGlow={state.showGlow}
                            setShowGlow={state.setShowGlow}
                            glowIntensity={state.glowIntensity}
                            setGlowIntensity={state.setGlowIntensity}
                            showTrail={state.showTrail}
                            setShowTrail={state.setShowTrail}
                            showPathTracer={state.showPathTracer}
                            setShowPathTracer={state.setShowPathTracer}
                            showGrid={state.showGrid}
                            setShowGrid={state.setShowGrid}
                            showFormula={state.showFormula}
                            setShowFormula={state.setShowFormula}
                            useGradient={state.useGradient}
                            setUseGradient={state.setUseGradient}
                            selectedGradient={state.selectedGradient}
                            setSelectedGradient={state.setSelectedGradient}
                            customAnimation={state.customAnimation}
                            setCustomAnimation={state.setCustomAnimation}
                            animationIntensity={state.animationIntensity}
                            setAnimationIntensity={state.setAnimationIntensity}
                            animationDirection={state.animationDirection}
                            setAnimationDirection={state.setAnimationDirection}
                            animationTiming={state.animationTiming}
                            setAnimationTiming={state.setAnimationTiming}
                        />
                    )}

                    {state.activeTab === 'export' && (
                        <ExportTab
                            filename={state.filename}
                            setFilename={state.setFilename}
                            exportFormat={state.exportFormat}
                            setExportFormat={state.setExportFormat}
                            handleExport={actions.handleExport}
                            handleSaveToGallery={actions.handleSaveToGallery}
                        />
                    )}

                    {state.activeTab === 'share' && (
                        <ShareTab
                            shareMessage={state.shareMessage}
                            setShareMessage={state.setShareMessage}
                            messageAnimation={state.messageAnimation}
                            setMessageAnimation={state.setMessageAnimation}
                            showSurprise={state.showSurprise}
                            setShowSurprise={state.setShowSurprise}
                            previewKey={state.previewKey}
                            setPreviewKey={state.setPreviewKey}
                            handleCopyShareLink={actions.handleCopyShareLink}
                            musicUrl={state.musicUrl}
                            setMusicUrl={state.setMusicUrl}
                            musicStartTime={state.musicStartTime}
                            setMusicStartTime={state.setMusicStartTime}
                            musicEndTime={state.musicEndTime}
                            setMusicEndTime={state.setMusicEndTime}
                            musicEnabled={state.musicEnabled}
                            setMusicEnabled={state.setMusicEnabled}
                        />
                    )}

                    {state.error && <div className="error-message">{state.error}</div>}
                </div>
            </div>

            {/* Tutorial Modal */}
            {state.showTutorial && (
                <TutorialModal
                    tutorialStep={state.tutorialStep}
                    setTutorialStep={state.setTutorialStep}
                    onClose={() => state.setShowTutorial(false)}
                />
            )}
        </div>
    );
}

export default Playground;

