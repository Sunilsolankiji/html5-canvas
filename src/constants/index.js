/**
 * Application constants
 */

// Canvas default dimensions
export const CANVAS_DEFAULTS = {
  WIDTH: 600,
  HEIGHT: 500,
  BACKGROUND_COLOR: '#0a0a0a',
};

// Animation settings
export const ANIMATION_DEFAULTS = {
  SPEED: 1,
  FRAME_RATE: 60,
  DRAW_PROGRESS_INCREMENT: 0.01,
  MIN_SPEED: 0.1,
  MAX_SPEED: 5,
};

// Shape presets for playground - organized by category
export const SHAPE_PRESETS = {
  // Basic Shapes
  heart: {
    name: '❤️ Heart',
    category: 'basic',
    x: 't => 16 * Math.pow(Math.sin(t), 3)',
    y: 't => 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)',
    scale: 15,
    tEnd: 2 * Math.PI,
  },
  circle: {
    name: '⭕ Circle',
    category: 'basic',
    x: 't => Math.cos(t)',
    y: 't => Math.sin(t)',
    scale: 150,
    tEnd: 2 * Math.PI,
  },
  ellipse: {
    name: '⬭ Ellipse',
    category: 'basic',
    x: 't => 2 * Math.cos(t)',
    y: 't => Math.sin(t)',
    scale: 100,
    tEnd: 2 * Math.PI,
  },

  // Flowers & Nature
  rose3: {
    name: '🌹 Rose (3 petals)',
    category: 'flowers',
    x: 't => Math.cos(3*t) * Math.cos(t)',
    y: 't => Math.cos(3*t) * Math.sin(t)',
    scale: 180,
    tEnd: Math.PI,
  },
  rose4: {
    name: '🌸 Rose (4 petals)',
    category: 'flowers',
    x: 't => Math.cos(2*t) * Math.cos(t)',
    y: 't => Math.cos(2*t) * Math.sin(t)',
    scale: 180,
    tEnd: 2 * Math.PI,
  },
  rose5: {
    name: '🌺 Rose (5 petals)',
    category: 'flowers',
    x: 't => Math.cos(5*t) * Math.cos(t)',
    y: 't => Math.cos(5*t) * Math.sin(t)',
    scale: 180,
    tEnd: Math.PI,
  },
  rose6: {
    name: '💮 Rose (6 petals)',
    category: 'flowers',
    x: 't => Math.cos(3*t) * Math.cos(t)',
    y: 't => Math.cos(3*t) * Math.sin(t)',
    scale: 180,
    tEnd: 2 * Math.PI,
  },
  rose8: {
    name: '🏵️ Rose (8 petals)',
    category: 'flowers',
    x: 't => Math.cos(4*t) * Math.cos(t)',
    y: 't => Math.cos(4*t) * Math.sin(t)',
    scale: 180,
    tEnd: 2 * Math.PI,
  },
  daisy: {
    name: '🌼 Daisy',
    category: 'flowers',
    x: 't => (1 + 0.3 * Math.cos(8*t)) * Math.cos(t)',
    y: 't => (1 + 0.3 * Math.cos(8*t)) * Math.sin(t)',
    scale: 150,
    tEnd: 2 * Math.PI,
  },
  sunflower: {
    name: '🌻 Sunflower',
    category: 'flowers',
    x: 't => (1 + 0.5 * Math.cos(12*t)) * Math.cos(t)',
    y: 't => (1 + 0.5 * Math.cos(12*t)) * Math.sin(t)',
    scale: 120,
    tEnd: 2 * Math.PI,
  },
  clover: {
    name: '🍀 Clover',
    category: 'flowers',
    x: 't => Math.cos(t) * Math.cos(4*t)',
    y: 't => Math.sin(t) * Math.cos(4*t)',
    scale: 180,
    tEnd: 2 * Math.PI,
  },

  // Curves & Spirals
  spiral: {
    name: '🌀 Spiral',
    category: 'spirals',
    x: 't => t * Math.cos(t) / 10',
    y: 't => t * Math.sin(t) / 10',
    scale: 80,
    tEnd: 10 * Math.PI,
  },
  fibonacci: {
    name: '🐚 Fibonacci Spiral',
    category: 'spirals',
    x: 't => Math.pow(1.618, t/(2*Math.PI)) * Math.cos(t) / 50',
    y: 't => Math.pow(1.618, t/(2*Math.PI)) * Math.sin(t) / 50',
    scale: 150,
    tEnd: 8 * Math.PI,
  },
  fermat: {
    name: '🔄 Fermat Spiral',
    category: 'spirals',
    x: 't => Math.sqrt(t) * Math.cos(t)',
    y: 't => Math.sqrt(t) * Math.sin(t)',
    scale: 30,
    tEnd: 20 * Math.PI,
  },
  logarithmic: {
    name: '📈 Logarithmic Spiral',
    category: 'spirals',
    x: 't => Math.exp(0.1*t) * Math.cos(t) / 20',
    y: 't => Math.exp(0.1*t) * Math.sin(t) / 20',
    scale: 100,
    tEnd: 6 * Math.PI,
  },

  // Mathematical Curves
  lissajous: {
    name: '〰️ Lissajous',
    category: 'math',
    x: 't => Math.sin(3*t)',
    y: 't => Math.sin(2*t)',
    scale: 180,
    tEnd: 2 * Math.PI,
  },
  lissajous34: {
    name: '🔀 Lissajous 3:4',
    category: 'math',
    x: 't => Math.sin(3*t)',
    y: 't => Math.sin(4*t)',
    scale: 180,
    tEnd: 2 * Math.PI,
  },
  lissajous54: {
    name: '🔃 Lissajous 5:4',
    category: 'math',
    x: 't => Math.sin(5*t)',
    y: 't => Math.sin(4*t)',
    scale: 180,
    tEnd: 2 * Math.PI,
  },
  infinity: {
    name: '♾️ Infinity',
    category: 'math',
    x: 't => Math.cos(t) / (1 + Math.pow(Math.sin(t), 2))',
    y: 't => Math.sin(t) * Math.cos(t) / (1 + Math.pow(Math.sin(t), 2))',
    scale: 200,
    tEnd: 2 * Math.PI,
  },
  lemniscate: {
    name: '∞ Lemniscate',
    category: 'math',
    x: 't => Math.cos(t) / (1 + Math.sin(t) * Math.sin(t))',
    y: 't => Math.sin(t) * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t))',
    scale: 250,
    tEnd: 2 * Math.PI,
  },
  cardioid: {
    name: '💗 Cardioid',
    category: 'math',
    x: 't => (1 - Math.cos(t)) * Math.cos(t)',
    y: 't => (1 - Math.cos(t)) * Math.sin(t)',
    scale: 100,
    tEnd: 2 * Math.PI,
  },
  astroid: {
    name: '✴️ Astroid',
    category: 'math',
    x: 't => Math.pow(Math.cos(t), 3)',
    y: 't => Math.pow(Math.sin(t), 3)',
    scale: 180,
    tEnd: 2 * Math.PI,
  },
  deltoid: {
    name: '🔺 Deltoid',
    category: 'math',
    x: 't => 2 * Math.cos(t) + Math.cos(2*t)',
    y: 't => 2 * Math.sin(t) - Math.sin(2*t)',
    scale: 60,
    tEnd: 2 * Math.PI,
  },
  nephroid: {
    name: '🫘 Nephroid',
    category: 'math',
    x: 't => 3 * Math.cos(t) - Math.cos(3*t)',
    y: 't => 3 * Math.sin(t) - Math.sin(3*t)',
    scale: 45,
    tEnd: 2 * Math.PI,
  },
  epicycloid: {
    name: '🎡 Epicycloid',
    category: 'math',
    x: 't => 4 * Math.cos(t) - Math.cos(4*t)',
    y: 't => 4 * Math.sin(t) - Math.sin(4*t)',
    scale: 35,
    tEnd: 2 * Math.PI,
  },
  hypocycloid: {
    name: '🎯 Hypocycloid',
    category: 'math',
    x: 't => 3 * Math.cos(t) + Math.cos(3*t)',
    y: 't => 3 * Math.sin(t) - Math.sin(3*t)',
    scale: 45,
    tEnd: 2 * Math.PI,
  },

  // Stars & Polygons
  star: {
    name: '⭐ Star',
    category: 'stars',
    x: 't => (2 + Math.cos(5*t)) * Math.cos(t)',
    y: 't => (2 + Math.cos(5*t)) * Math.sin(t)',
    scale: 60,
    tEnd: 2 * Math.PI,
  },
  star6: {
    name: '✡️ 6-Point Star',
    category: 'stars',
    x: 't => (2 + Math.cos(6*t)) * Math.cos(t)',
    y: 't => (2 + Math.cos(6*t)) * Math.sin(t)',
    scale: 60,
    tEnd: 2 * Math.PI,
  },
  star8: {
    name: '✴️ 8-Point Star',
    category: 'stars',
    x: 't => (2 + Math.cos(8*t)) * Math.cos(t)',
    y: 't => (2 + Math.cos(8*t)) * Math.sin(t)',
    scale: 55,
    tEnd: 2 * Math.PI,
  },
  starburst: {
    name: '💥 Starburst',
    category: 'stars',
    x: 't => (1 + 0.8 * Math.cos(12*t)) * Math.cos(t)',
    y: 't => (1 + 0.8 * Math.cos(12*t)) * Math.sin(t)',
    scale: 100,
    tEnd: 2 * Math.PI,
  },
  pentagon: {
    name: '⬠ Pentagon',
    category: 'stars',
    x: 't => Math.cos(t) * (1/Math.cos((t % (2*Math.PI/5)) - Math.PI/5))',
    y: 't => Math.sin(t) * (1/Math.cos((t % (2*Math.PI/5)) - Math.PI/5))',
    scale: 120,
    tEnd: 2 * Math.PI,
  },
  hexagon: {
    name: '⬡ Hexagon',
    category: 'stars',
    x: 't => Math.cos(t) * (1/Math.cos((t % (Math.PI/3)) - Math.PI/6))',
    y: 't => Math.sin(t) * (1/Math.cos((t % (Math.PI/3)) - Math.PI/6))',
    scale: 120,
    tEnd: 2 * Math.PI,
  },

  // Creatures & Fun
  butterfly: {
    name: '🦋 Butterfly',
    category: 'creatures',
    x: 't => Math.sin(t) * (Math.exp(Math.cos(t)) - 2*Math.cos(4*t) - Math.pow(Math.sin(t/12), 5))',
    y: 't => Math.cos(t) * (Math.exp(Math.cos(t)) - 2*Math.cos(4*t) - Math.pow(Math.sin(t/12), 5))',
    scale: 50,
    tEnd: 12 * Math.PI,
  },
  fish: {
    name: '🐟 Fish',
    category: 'creatures',
    x: 't => Math.cos(t) - Math.pow(Math.sin(t), 2) / Math.sqrt(2)',
    y: 't => Math.cos(t) * Math.sin(t)',
    scale: 150,
    tEnd: 2 * Math.PI,
  },
  bird: {
    name: '🐦 Bird',
    category: 'creatures',
    x: 't => Math.sin(t) * (Math.exp(Math.cos(t)) - 2*Math.cos(4*t))',
    y: 't => Math.cos(t) * (Math.exp(Math.cos(t)) - 2*Math.cos(4*t))',
    scale: 60,
    tEnd: 2 * Math.PI,
  },
  bat: {
    name: '🦇 Bat',
    category: 'creatures',
    x: 't => Math.sin(t) * (5 + Math.sin(5*t))/6',
    y: 't => -Math.cos(t) * (5 + Math.sin(5*t))/6 - 0.5*Math.sin(3*t)',
    scale: 120,
    tEnd: 2 * Math.PI,
  },

  // Mandala & Patterns
  mandala1: {
    name: '🔮 Mandala 1',
    category: 'mandala',
    x: 't => (1 + 0.5*Math.cos(6*t) + 0.3*Math.cos(12*t)) * Math.cos(t)',
    y: 't => (1 + 0.5*Math.cos(6*t) + 0.3*Math.cos(12*t)) * Math.sin(t)',
    scale: 100,
    tEnd: 2 * Math.PI,
  },
  mandala2: {
    name: '💠 Mandala 2',
    category: 'mandala',
    x: 't => (1 + 0.4*Math.cos(8*t) + 0.2*Math.cos(16*t)) * Math.cos(t)',
    y: 't => (1 + 0.4*Math.cos(8*t) + 0.2*Math.cos(16*t)) * Math.sin(t)',
    scale: 110,
    tEnd: 2 * Math.PI,
  },
  mandala3: {
    name: '🪬 Mandala 3',
    category: 'mandala',
    x: 't => (2 + Math.cos(5*t) + 0.5*Math.cos(10*t)) * Math.cos(t)',
    y: 't => (2 + Math.cos(5*t) + 0.5*Math.cos(10*t)) * Math.sin(t)',
    scale: 45,
    tEnd: 2 * Math.PI,
  },
  kaleidoscope: {
    name: '🎆 Kaleidoscope',
    category: 'mandala',
    x: 't => (1 + 0.6*Math.sin(6*t)) * Math.cos(t) + 0.3*Math.cos(7*t)',
    y: 't => (1 + 0.6*Math.sin(6*t)) * Math.sin(t) + 0.3*Math.sin(7*t)',
    scale: 90,
    tEnd: 2 * Math.PI,
  },

  // Abstract & Artistic
  trefoil: {
    name: '☘️ Trefoil',
    category: 'abstract',
    x: 't => Math.sin(t) + 2*Math.sin(2*t)',
    y: 't => Math.cos(t) - 2*Math.cos(2*t)',
    scale: 50,
    tEnd: 2 * Math.PI,
  },
  gear: {
    name: '⚙️ Gear',
    category: 'abstract',
    x: 't => (1 + 0.2*Math.cos(20*t)) * Math.cos(t)',
    y: 't => (1 + 0.2*Math.cos(20*t)) * Math.sin(t)',
    scale: 140,
    tEnd: 2 * Math.PI,
  },
  atom: {
    name: '⚛️ Atom',
    category: 'abstract',
    x: 't => Math.cos(t) + 0.5*Math.cos(3*t)*Math.cos(t)',
    y: 't => Math.sin(t) + 0.5*Math.cos(3*t)*Math.sin(t)',
    scale: 120,
    tEnd: 2 * Math.PI,
  },
  wave: {
    name: '🌊 Wave Pattern',
    category: 'abstract',
    x: 't => t/3',
    y: 't => Math.sin(t) + 0.5*Math.sin(2*t) + 0.3*Math.sin(3*t)',
    scale: 50,
    tEnd: 6 * Math.PI,
  },
  dna: {
    name: '🧬 DNA',
    category: 'abstract',
    x: 't => Math.cos(t)',
    y: 't => t/10 + 0.5*Math.sin(4*t)',
    scale: 80,
    tEnd: 10 * Math.PI,
  },
  superellipse: {
    name: '🔳 Superellipse',
    category: 'abstract',
    x: 't => Math.sign(Math.cos(t)) * Math.pow(Math.abs(Math.cos(t)), 0.5)',
    y: 't => Math.sign(Math.sin(t)) * Math.pow(Math.abs(Math.sin(t)), 0.5)',
    scale: 180,
    tEnd: 2 * Math.PI,
  },
  squircle: {
    name: '⬜ Squircle',
    category: 'abstract',
    x: 't => Math.sign(Math.cos(t)) * Math.pow(Math.abs(Math.cos(t)), 0.7)',
    y: 't => Math.sign(Math.sin(t)) * Math.pow(Math.abs(Math.sin(t)), 0.7)',
    scale: 160,
    tEnd: 2 * Math.PI,
  },
};

// Shape categories for organization
export const SHAPE_CATEGORIES = {
  basic: { name: 'Basic', icon: '⭕' },
  flowers: { name: 'Flowers', icon: '🌸' },
  spirals: { name: 'Spirals', icon: '🌀' },
  math: { name: 'Math Curves', icon: '📐' },
  stars: { name: 'Stars & Polygons', icon: '⭐' },
  creatures: { name: 'Creatures', icon: '🦋' },
  mandala: { name: 'Mandala', icon: '🔮' },
  abstract: { name: 'Abstract', icon: '🎨' },
};

// Color palettes
export const COLOR_PALETTES = {
  neon: {
    name: 'Neon',
    colors: ['#ff006e', '#fb5607', '#ffbe0b', '#8338ec', '#3a86ff', '#06ffa5'],
  },
  pastel: {
    name: 'Pastel',
    colors: ['#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff', '#cdb4db', '#b5e48c'],
  },
  ocean: {
    name: 'Ocean',
    colors: ['#03045e', '#023e8a', '#0077b6', '#0096c7', '#00b4d8', '#48cae4'],
  },
  sunset: {
    name: 'Sunset',
    colors: ['#ff4e50', '#fc913a', '#f9d423', '#ede574', '#e1f5c4', '#ff6b6b'],
  },
  forest: {
    name: 'Forest',
    colors: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7'],
  },
  fire: {
    name: 'Fire',
    colors: ['#ff0000', '#ff5500', '#ff8800', '#ffaa00', '#ffcc00', '#ffff00'],
  },
  galaxy: {
    name: 'Galaxy',
    colors: ['#240046', '#3c096c', '#5a189a', '#7b2cbf', '#9d4edd', '#c77dff'],
  },
  rainbow: {
    name: 'Rainbow',
    colors: ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff', '#8000ff'],
  },
  monochrome: {
    name: 'Monochrome',
    colors: ['#ffffff', '#cccccc', '#999999', '#666666', '#333333', '#000000'],
  },
  candy: {
    name: 'Candy',
    colors: ['#ff69b4', '#ff1493', '#ff6347', '#ffa07a', '#98fb98', '#87ceeb'],
  },
};

// Gradient presets
export const GRADIENT_PRESETS = {
  rainbow: {
    name: 'Rainbow',
    type: 'linear',
    stops: [
      { offset: 0, color: '#ff0000' },
      { offset: 0.17, color: '#ff8000' },
      { offset: 0.33, color: '#ffff00' },
      { offset: 0.5, color: '#00ff00' },
      { offset: 0.67, color: '#0080ff' },
      { offset: 0.83, color: '#8000ff' },
      { offset: 1, color: '#ff0080' },
    ],
  },
  sunset: {
    name: 'Sunset',
    type: 'linear',
    stops: [
      { offset: 0, color: '#ff512f' },
      { offset: 1, color: '#dd2476' },
    ],
  },
  ocean: {
    name: 'Ocean',
    type: 'linear',
    stops: [
      { offset: 0, color: '#2193b0' },
      { offset: 1, color: '#6dd5ed' },
    ],
  },
  fire: {
    name: 'Fire',
    type: 'radial',
    stops: [
      { offset: 0, color: '#ffff00' },
      { offset: 0.5, color: '#ff8000' },
      { offset: 1, color: '#ff0000' },
    ],
  },
  neon: {
    name: 'Neon',
    type: 'linear',
    stops: [
      { offset: 0, color: '#ff00ff' },
      { offset: 0.5, color: '#00ffff' },
      { offset: 1, color: '#ff00ff' },
    ],
  },
};

// Line style presets
export const LINE_STYLES = {
  solid: { name: 'Solid', dash: [] },
  dashed: { name: 'Dashed', dash: [10, 5] },
  dotted: { name: 'Dotted', dash: [2, 3] },
  dashDot: { name: 'Dash-Dot', dash: [10, 5, 2, 5] },
  longDash: { name: 'Long Dash', dash: [20, 10] },
};

// Background presets
export const BACKGROUND_PRESETS = {
  dark: { name: 'Dark', color: '#0a0a0a' },
  light: { name: 'Light', color: '#ffffff' },
  midnight: { name: 'Midnight', color: '#1a1a2e' },
  navy: { name: 'Navy', color: '#16213e' },
  forest: { name: 'Forest', color: '#1b4332' },
  wine: { name: 'Wine', color: '#4a1942' },
  charcoal: { name: 'Charcoal', color: '#2d3436' },
  slate: { name: 'Slate', color: '#34495e' },
};

// Navigation items
export const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/heart', label: 'Heart', icon: '❤️' },
  { path: '/spiral', label: 'Spiral', icon: '🌀' },
  { path: '/star', label: 'Star', icon: '⭐' },
  { path: '/wave', label: 'Wave', icon: '🌊' },
  { path: '/particles', label: 'Particles', icon: '✨' },
  { path: '/fractals', label: 'Fractals', icon: '🔷' },
  { path: '/visualizer', label: 'Visualizer', icon: '🎵' },
  { path: '/gallery', label: 'Gallery', icon: '🖼️' },
  { path: '/playground', label: 'Playground', icon: '🎮' },
];

// Home page shape cards
export const SHAPE_CARDS = [
  { path: '/heart', icon: '❤️', name: 'Heart', description: 'Animated beating heart with drawing effect' },
  { path: '/spiral', icon: '🌀', name: 'Spiral', description: 'Rainbow spiral with continuous animation' },
  { path: '/star', icon: '⭐', name: 'Star', description: 'Glowing star with rotation effect' },
  { path: '/wave', icon: '🌊', name: 'Wave', description: 'Ocean waves with moonlight scene' },
  { path: '/particles', icon: '✨', name: 'Particles', description: 'Interactive particle system' },
  { path: '/fractals', icon: '🔷', name: 'Fractals', description: 'Explore mathematical fractals' },
  { path: '/visualizer', icon: '🎵', name: 'Audio Visualizer', description: 'Music-reactive animations' },
  { path: '/gallery', icon: '🖼️', name: 'Gallery', description: 'Browse and save creations' },
  { path: '/playground', icon: '🎮', name: 'Playground', description: 'Create your own parametric shapes!', featured: true },
];

// Default colors
export const COLORS = {
  PRIMARY: '#ff6b6b',
  SECONDARY: '#48dbfb',
  ACCENT: '#feca57',
  HEART_STROKE: '#c0392b',
  HEART_FILL: '#ff4757',
  STAR_STROKE: '#ff8c00',
  STAR_FILL: '#ffd700',
  SUCCESS: '#2ecc71',
  WARNING: '#f39c12',
  ERROR: '#e74c3c',
  INFO: '#3498db',
};

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  PLAY_PAUSE: ' ', // Space
  RESET: 'r',
  EXPORT: 'e',
  FULLSCREEN: 'f',
  CLEAR: 'c',
  UNDO: 'z',
  REDO: 'y',
  SPEED_UP: '+',
  SPEED_DOWN: '-',
  TOGGLE_GRID: 'g',
  TOGGLE_FILL: 's',
};

// Export settings
export const EXPORT_SETTINGS = {
  formats: ['png', 'jpg', 'svg', 'gif'],
  defaultFormat: 'png',
  quality: 0.95,
  gifFrameRate: 30,
  gifDuration: 3000,
};

// Tutorial steps for educational features
export const TUTORIAL_STEPS = {
  playground: [
    {
      title: 'Welcome to Shape Playground!',
      content: 'Learn to create beautiful mathematical shapes using parametric equations.',
    },
    {
      title: 'Choose a Preset',
      content: 'Start by selecting a preset shape from the grid. Each shape uses different mathematical functions.',
    },
    {
      title: 'Customize Your Shape',
      content: 'Use the Custom tab to modify the X(t) and Y(t) functions. The parameter t goes from 0 to t End.',
    },
    {
      title: 'Style Your Creation',
      content: 'Change colors, line width, and animation speed in the Style tab.',
    },
    {
      title: 'Export Your Art',
      content: 'Save your creation as an image or share it with others!',
    },
  ],
};

// Formula explanations
export const FORMULA_EXPLANATIONS = {
  'Math.sin': 'Sine function - creates smooth wave oscillations',
  'Math.cos': 'Cosine function - similar to sine but shifted by 90°',
  'Math.pow': 'Power function - raises a number to an exponent',
  'Math.exp': 'Exponential function - e raised to a power',
  'Math.sqrt': 'Square root function',
  'Math.abs': 'Absolute value - makes negative numbers positive',
  'Math.PI': 'Pi constant ≈ 3.14159',
};

