import { CANVAS_DEFAULTS } from '../../constants';

// Default state values for the Playground
export const DEFAULT_STATE = {
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

