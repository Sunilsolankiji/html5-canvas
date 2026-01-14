import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Heart from './pages/Heart';
import Spiral from './pages/Spiral';
import Star from './pages/Star';
import Wave from './pages/Wave';
import Particles from './pages/Particles';
import Playground from './pages/Playground';

// Lazy load heavier components
const Fractals = lazy(() => import('./pages/Fractals'));
const AudioVisualizer = lazy(() => import('./pages/AudioVisualizer'));
const Gallery = lazy(() => import('./pages/Gallery'));

// Loading fallback
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    fontSize: '2rem',
  }}>
    ⏳ Loading...
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="heart" element={<Heart />} />
        <Route path="spiral" element={<Spiral />} />
        <Route path="star" element={<Star />} />
        <Route path="wave" element={<Wave />} />
        <Route path="particles" element={<Particles />} />
        <Route path="fractals" element={
          <Suspense fallback={<LoadingFallback />}>
            <Fractals />
          </Suspense>
        } />
        <Route path="visualizer" element={
          <Suspense fallback={<LoadingFallback />}>
            <AudioVisualizer />
          </Suspense>
        } />
        <Route path="gallery" element={
          <Suspense fallback={<LoadingFallback />}>
            <Gallery />
          </Suspense>
        } />
        <Route path="playground" element={<Playground />} />
      </Route>
    </Routes>
  );
}

export default App;
