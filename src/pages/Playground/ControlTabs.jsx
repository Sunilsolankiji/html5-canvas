import {
    SHAPE_PRESETS,
    SHAPE_CATEGORIES,
    COLOR_PALETTES,
    BACKGROUND_PRESETS,
    LINE_STYLES,
    GRADIENT_PRESETS,
} from '../../constants';
import { MESSAGE_ANIMATIONS, CUSTOM_ANIMATIONS, ANIMATION_TIMING_OPTIONS } from './constants';

/**
 * Tab navigation component
 */
export function ControlTabs({ activeTab, setActiveTab }) {
    const tabs = [
        { key: 'presets', icon: '📦', label: 'Presets' },
        { key: 'custom', icon: '✏️', label: 'Custom' },
        { key: 'style', icon: '🎨', label: 'Style' },
        { key: 'effects', icon: '✨', label: 'Effects' },
        { key: 'export', icon: '📥', label: 'Export' },
        { key: 'share', icon: '🔗', label: 'Share' },
    ];

    return (
        <div className="control-tabs">
            {tabs.map(({ key, icon, label }) => (
                <button
                    key={key}
                    className={`tab-btn ${activeTab === key ? 'active' : ''}`}
                    onClick={() => setActiveTab(key)}
                >
                    {icon} {label}
                </button>
            ))}
        </div>
    );
}

/**
 * Presets tab content
 */
export function PresetsTab({
    activeCategory,
    setActiveCategory,
    filteredPresets,
    activePreset,
    handlePresetClick,
}) {
    return (
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
                {Object.entries(SHAPE_CATEGORIES).map(([key, { icon }]) => (
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
    );
}

/**
 * Custom functions tab content
 */
export function CustomTab({
    xFunction, setXFunction,
    yFunction, setYFunction,
    scale, setScale,
    tEnd, setTEnd,
}) {
    return (
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
    );
}

/**
 * Style tab content
 */
export function StyleTab({
    strokeColor, setStrokeColor,
    fillColor, setFillColor,
    backgroundColor, setBackgroundColor,
    selectedPalette, setSelectedPalette,
    lineWidth, setLineWidth,
    lineStyle, setLineStyle,
    animationSpeed, setAnimationSpeed,
    showFill, setShowFill,
    animateDrawing, setAnimateDrawing,
    autoRefresh, setAutoRefresh,
    handleReset,
}) {
    return (
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
    );
}

/**
 * Effects tab content
 */
export function EffectsTab({
    showGlow, setShowGlow,
    glowIntensity, setGlowIntensity,
    showTrail, setShowTrail,
    showPathTracer, setShowPathTracer,
    showGrid, setShowGrid,
    showFormula, setShowFormula,
    useGradient, setUseGradient,
    selectedGradient, setSelectedGradient,
    customAnimation, setCustomAnimation,
    animationIntensity, setAnimationIntensity,
    animationDirection, setAnimationDirection,
    animationTiming, setAnimationTiming,
}) {
    return (
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

            {/* Custom Animation Section */}
            <div style={{
                marginTop: '20px',
                padding: '15px',
                background: 'linear-gradient(135deg, rgba(255,107,107,0.1), rgba(72,219,251,0.1))',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#feca57', fontSize: '0.95rem' }}>
                    🎬 Custom Animation
                </h4>

                <div className="control-group">
                    <label>Animation Type:</label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                        {CUSTOM_ANIMATIONS.map((anim) => (
                            <button
                                key={anim.key}
                                className={`preset-btn ${customAnimation === anim.key ? 'active' : ''}`}
                                style={{
                                    padding: '8px 12px',
                                    fontSize: '0.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    transition: 'all 0.2s ease',
                                }}
                                onClick={() => setCustomAnimation(anim.key)}
                                title={anim.description}
                            >
                                <span>{anim.icon}</span>
                                <span>{anim.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {customAnimation && customAnimation !== 'none' && (
                    <>
                        <div className="control-group" style={{ marginTop: '15px' }}>
                            <label>
                                Intensity: <span className="value-badge">{animationIntensity.toFixed(1)}x</span>
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="3"
                                step="0.1"
                                value={animationIntensity}
                                onChange={(e) => setAnimationIntensity(Number(e.target.value))}
                            />
                        </div>

                        <div className="control-group" style={{ marginTop: '10px' }}>
                            <label>Direction:</label>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                <button
                                    className={`preset-btn ${animationDirection === 1 ? 'active' : ''}`}
                                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                                    onClick={() => setAnimationDirection(1)}
                                >
                                    ▶️ Forward
                                </button>
                                <button
                                    className={`preset-btn ${animationDirection === -1 ? 'active' : ''}`}
                                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                                    onClick={() => setAnimationDirection(-1)}
                                >
                                    ◀️ Reverse
                                </button>
                            </div>
                        </div>

                        <div className="control-group" style={{ marginTop: '15px' }}>
                            <label>Animation Timing:</label>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                                {ANIMATION_TIMING_OPTIONS.map((timing) => (
                                    <button
                                        key={timing.key}
                                        className={`preset-btn ${animationTiming === timing.key ? 'active' : ''}`}
                                        style={{
                                            padding: '8px 12px',
                                            fontSize: '0.75rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onClick={() => setAnimationTiming(timing.key)}
                                        title={timing.description}
                                    >
                                        <span>{timing.icon}</span>
                                        <span>{timing.name}</span>
                                    </button>
                                ))}
                            </div>
                            <small style={{ color: '#888', fontSize: '0.7rem', marginTop: '5px', display: 'block' }}>
                                {ANIMATION_TIMING_OPTIONS.find(t => t.key === animationTiming)?.description}
                            </small>
                        </div>

                        <p style={{
                            color: '#888',
                            fontSize: '0.75rem',
                            marginTop: '12px',
                            fontStyle: 'italic',
                            margin: '12px 0 0 0'
                        }}>
                            💡 {CUSTOM_ANIMATIONS.find(a => a.key === customAnimation)?.description}
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

/**
 * Export tab content
 */
export function ExportTab({
    filename, setFilename,
    exportFormat, setExportFormat,
    handleExport,
    handleSaveToGallery,
}) {
    return (
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
    );
}

/**
 * Share tab content
 */
export function ShareTab({
    shareMessage, setShareMessage,
    messageAnimation, setMessageAnimation,
    showSurprise, setShowSurprise,
    previewKey, setPreviewKey,
    handleCopyShareLink,
}) {
    return (
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
                <small style={{ color: '#888', fontSize: '0.75rem', marginTop: '5px', display: 'block' }}>
                    This message will appear below the shape when shared
                </small>
            </div>

            <div className="control-group" style={{ marginTop: '15px' }}>
                <label>🎬 Message Animation:</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {MESSAGE_ANIMATIONS.map((anim) => (
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

            {/* Animation Preview */}
            {shareMessage && (
                <MessagePreview
                    message={shareMessage}
                    animation={messageAnimation}
                    previewKey={previewKey}
                    setPreviewKey={setPreviewKey}
                />
            )}

            {/* Surprise Toggle */}
            <SurpriseToggle
                showSurprise={showSurprise}
                setShowSurprise={setShowSurprise}
            />

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
    );
}

/**
 * Message animation preview component
 */
function MessagePreview({ message, animation, previewKey, setPreviewKey }) {
    return (
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
                    @keyframes previewFadeScale {
                        0% { opacity: 0; transform: scale(0); }
                        50% { transform: scale(1.1); }
                        100% { opacity: 1; transform: scale(1); }
                    }
                    @keyframes previewSlideUp {
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
                    animation: `preview${animation.charAt(0).toUpperCase() + animation.slice(1)} 0.8s ease-out forwards`,
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
                    &ldquo;{message}&rdquo;
                </p>
            </div>
        </div>
    );
}

/**
 * Surprise gift box toggle component
 */
function SurpriseToggle({ showSurprise, setShowSurprise }) {
    return (
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
                {showSurprise && (
                    <>
                        <style>
                            {`
                                @keyframes sparkleFloat {
                                    0%, 100% { opacity: 0.3; transform: translateY(0) scale(0.8); }
                                    50% { opacity: 1; transform: translateY(-5px) scale(1); }
                                }
                            `}
                        </style>
                        {['✨', '💖', '🌟', '💫'].map((emoji, i) => (
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
                    </>
                )}
            </div>
        </div>
    );
}

