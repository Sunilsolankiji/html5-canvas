# HTML5 Canvas Playground - React Version

A beautiful showcase of HTML5 Canvas animations and interactive shapes, built with React 19 and Vite.

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

### Fix Lint Issues
```bash
npm run lint:fix
```

## 📁 Project Structure

```
react-canvas/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js          # ESLint configuration
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Router configuration
│   ├── components/
│   │   ├── Layout.jsx        # Main layout with sidebar
│   │   └── CanvasComponent.jsx  # Reusable canvas component
│   ├── pages/
│   │   ├── Home.jsx          # Home page with shape cards
│   │   ├── Heart.jsx         # ❤️ Animated heart
│   │   ├── Spiral.jsx        # 🌀 Rainbow spiral
│   │   ├── Star.jsx          # ⭐ Glowing star
│   │   ├── Wave.jsx          # 🌊 Ocean waves
│   │   ├── Particles.jsx     # ✨ Interactive particles
│   │   └── Playground.jsx    # 🎮 Shape playground
│   ├── constants/
│   │   └── index.js          # Shared constants and presets
│   ├── hooks/
│   │   ├── index.js          # Hook exports
│   │   └── useCanvasAnimation.js  # Custom animation hook
│   ├── utils/
│   │   ├── index.js          # Utility exports
│   │   ├── canvasDrawing.js  # Core canvas drawing
│   │   ├── heartDrawing.js   # Heart animation
│   │   ├── spiralDrawing.js  # Spiral animation
│   │   ├── starDrawing.js    # Star animation
│   │   ├── waveDrawing.js    # Wave animation
│   │   ├── particleDrawing.js # Particle animation
│   │   └── parseFunction.js  # Function parser for playground
│   └── styles/
│       ├── index.css         # Global styles
│       ├── layout.css        # Layout & sidebar
│       ├── home.css          # Home page styles
│       ├── canvas.css        # Canvas component styles
│       ├── shapes.css        # Shape page styles
│       └── playground.css    # Playground page styles
```

## ✨ Features

- **Heart Animation**: Watch the heart draw, fill, and pulse
- **Rainbow Spiral**: Mesmerizing spiral with rainbow colors
- **Glowing Star**: Star that draws itself and glows
- **Ocean Waves**: Relaxing waves with moonlight scene
- **Interactive Particles**: Mouse-reactive particle system
- **Shape Playground**: Create custom parametric shapes with math functions

## 🛠️ Tech Stack

- **React 19** - UI framework
- **React Router 7** - Client-side routing
- **Vite 6** - Build tool and dev server
- **ESLint** - Code linting

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |

## 📄 License

MIT
