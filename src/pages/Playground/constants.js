import { CANVAS_DEFAULTS } from '../../constants';

// Default state values for the Playground
export const DEFAULT_STATE = {
    xFunction: 't => 16 * Math.pow(Math.sin(t), 3)',
    yFunction: 't => 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)',
    scale: 14,
    tEnd: 2 * Math.PI,
    strokeColor: '#ff6b6b',
    fillColor: '#ff6b6b',
    backgroundColor: CANVAS_DEFAULTS.BACKGROUND_COLOR,
    lineWidth: 2,
    animationSpeed: 1,
    showFill: true,
    animateDrawing: true,
    autoRefresh: true,
};

// Message animation options
export const MESSAGE_ANIMATIONS = [
    { key: 'reveal', name: 'Reveal', icon: '✨' },
    { key: 'bounce', name: 'Bounce', icon: '🎾' },
    { key: 'wave', name: 'Wave', icon: '🌊' },
    { key: 'fadeScale', name: 'Scale', icon: '🔍' },
    { key: 'slideUp', name: 'Slide', icon: '⬆️' },
    { key: 'flip', name: 'Flip', icon: '🔄' },
    { key: 'shake', name: 'Shake', icon: '📳' },
];

// Tutorial steps
export const TUTORIAL_STEPS = [
    { icon: '🎮', title: 'Welcome!', description: 'Learn to create beautiful mathematical shapes!' },
    { icon: '📦', title: 'Presets', description: 'Start by selecting a preset shape from the library.' },
    { icon: '✏️', title: 'Custom', description: 'Customize the X(t) and Y(t) functions for unique shapes.' },
    { icon: '🎨', title: 'Style', description: 'Change colors, line width, and add effects.' },
    { icon: '📤', title: 'Export', description: 'Save your creation or share it with others!' },
];

// Confetti colors
export const CONFETTI_COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'];

// Heart emojis for floating effect
export const HEART_EMOJIS = ['❤️', '💖', '💕', '💗', '✨', '🌟'];

// Custom animation types for canvas shapes
export const CUSTOM_ANIMATIONS = [
    { key: 'none', name: 'None', icon: '⏹️', description: 'No continuous animation' },
    { key: 'rotate', name: 'Rotate', icon: '🔄', description: 'Rotate the shape continuously' },
    { key: 'pulse', name: 'Pulse', icon: '💓', description: 'Scale up and down rhythmically' },
    { key: 'breathe', name: 'Breathe', icon: '🌬️', description: 'Gentle breathing effect' },
    { key: 'bounce', name: 'Bounce', icon: '⚡', description: 'Bouncy elastic motion' },
    { key: 'wave', name: 'Wave', icon: '🌊', description: 'Wavy distortion effect' },
    { key: 'spiral', name: 'Spiral', icon: '🌀', description: 'Spiral inward/outward' },
    { key: 'shake', name: 'Shake', icon: '📳', description: 'Vibrating shake effect' },
    { key: 'morph', name: 'Morph', icon: '✨', description: 'Morphing shape transformation' },
];

// Custom animation timing options
export const ANIMATION_TIMING = {
    DURING_DRAWING: 'duringDrawing',      // Animate while shape is being drawn
    AFTER_DRAWING: 'afterDrawing',        // Only animate after shape is complete
    BOTH: 'both',                          // Animate during and after drawing
};

export const ANIMATION_TIMING_OPTIONS = [
    { key: 'duringDrawing', name: 'During Drawing', icon: '✏️', description: 'Animate only while drawing' },
    { key: 'afterDrawing', name: 'After Drawing', icon: '✅', description: 'Animate only after complete' },
    { key: 'both', name: 'Both', icon: '🔁', description: 'Animate during and after drawing' },
];

