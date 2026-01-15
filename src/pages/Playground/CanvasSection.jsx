import CanvasComponent from '../../components/CanvasComponent';

/**
 * Canvas section with quick actions and tips
 */
export function CanvasSection({
    canvasRef,
    canvasWidth,
    canvasHeight,
    backgroundColor,
    isPaused,
    drawShape,
    handlePause,
    handleClear,
    handleRandomize,
    handleExport,
    handleSaveToGallery,
    handleCopyShareLink,
    handleFullscreen,
}) {
    return (
        <div className="canvas-section">
            <CanvasComponent
                key={`${canvasWidth}-${canvasHeight}`}
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                backgroundColor={backgroundColor}
            />

            <QuickActions
                isPaused={isPaused}
                drawShape={drawShape}
                handlePause={handlePause}
                handleClear={handleClear}
                handleRandomize={handleRandomize}
                handleExport={handleExport}
                handleSaveToGallery={handleSaveToGallery}
                handleCopyShareLink={handleCopyShareLink}
                handleFullscreen={handleFullscreen}
            />

            <FormulaHelp />
        </div>
    );
}

/**
 * Quick action buttons below the canvas
 */
function QuickActions({
    isPaused,
    drawShape,
    handlePause,
    handleClear,
    handleRandomize,
    handleExport,
    handleSaveToGallery,
    handleCopyShareLink,
    handleFullscreen,
}) {
    return (
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
    );
}

/**
 * Formula help tips section
 */
function FormulaHelp() {
    return (
        <div className="formula-help">
            <h4>📐 Tips & Shortcuts:</h4>
            <ul>
                <li>
                    <kbd>Space</kbd> Play/Pause • <kbd>R</kbd> Reset • <kbd>G</kbd> Grid • <kbd>S</kbd> Fill
                </li>
                <li>
                    <kbd>+</kbd>/<kbd>-</kbd> Speed • <kbd>E</kbd> Export • <kbd>F</kbd> Fullscreen
                </li>
                <li>
                    Use <code>t</code> as parameter • Available: <code>Math.sin</code>, <code>Math.cos</code>, <code>Math.pow</code>
                </li>
            </ul>
        </div>
    );
}

export default CanvasSection;

