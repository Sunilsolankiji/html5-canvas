import { useRef, useEffect, useState, useCallback } from 'react';
import CanvasComponent from '../components/CanvasComponent';
import { useResponsiveCanvas } from '../hooks';
import '../styles/shapes.css';

const VISUALIZER_MODES = {
  bars: { name: '📊 Bars', description: 'Classic frequency bars' },
  wave: { name: '🌊 Waveform', description: 'Audio waveform display' },
  circle: { name: '⭕ Circle', description: 'Circular visualizer' },
  particles: { name: '✨ Particles', description: 'Reactive particles' },
  spiral: { name: '🌀 Spiral', description: 'Spiral frequency display' },
  spectrum: { name: '🌈 Spectrum', description: 'Full spectrum analysis' },
};

const COLOR_MODES = {
  rainbow: 'Rainbow',
  fire: 'Fire',
  ocean: 'Ocean',
  neon: 'Neon',
  monochrome: 'Monochrome',
};

function AudioVisualizer() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const audioRef = useRef(null);
  const { width: canvasWidth, height: canvasHeight } = useResponsiveCanvas(600, 500);

  const [mode, setMode] = useState('bars');
  const [colorMode, setColorMode] = useState('rainbow');
  const [isPlaying, setIsPlaying] = useState(false);
  const [useMicrophone, setUseMicrophone] = useState(false);
  const [sensitivity, setSensitivity] = useState(1);
  const [smoothing, setSmoothing] = useState(0.8);
  const [audioFile, setAudioFile] = useState(null);

  const getColor = useCallback((i, total, value) => {
    const normalizedValue = value / 255;

    switch (colorMode) {
      case 'rainbow':
        return `hsl(${(i / total) * 360}, 80%, ${50 + normalizedValue * 30}%)`;
      case 'fire':
        return `hsl(${normalizedValue * 60}, 100%, ${30 + normalizedValue * 40}%)`;
      case 'ocean':
        return `hsl(${180 + normalizedValue * 60}, 80%, ${30 + normalizedValue * 40}%)`;
      case 'neon':
        return `hsl(${280 + (i / total) * 80}, 100%, ${50 + normalizedValue * 30}%)`;
      case 'monochrome':
        const v = 50 + normalizedValue * 50;
        return `rgb(${v}%, ${v}%, ${v}%)`;
      default:
        return `hsl(${(i / total) * 360}, 80%, 60%)`;
    }
  }, [colorMode]);

  const drawBars = useCallback((ctx, canvas, dataArray, bufferLength) => {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height * sensitivity * 0.8;

      ctx.fillStyle = getColor(i, bufferLength, dataArray[i]);
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

      // Mirror effect
      ctx.fillStyle = getColor(i, bufferLength, dataArray[i] * 0.3);
      ctx.fillRect(x, 0, barWidth - 1, barHeight * 0.2);

      x += barWidth;
    }
  }, [sensitivity, getColor]);

  const drawWave = useCallback((ctx, canvas, dataArray, bufferLength) => {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 3;
    ctx.strokeStyle = getColor(0, 1, 200);
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2 * sensitivity;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Draw filled area
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(72, 219, 251, 0.1)';
    ctx.fill();
  }, [sensitivity, getColor]);

  const drawCircle = useCallback((ctx, canvas, dataArray, bufferLength) => {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.4;

    for (let i = 0; i < bufferLength; i++) {
      const angle = (i / bufferLength) * Math.PI * 2;
      const value = dataArray[i] / 255;
      const length = radius + value * radius * sensitivity;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * length;
      const y2 = centerY + Math.sin(angle) * length;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = getColor(i, bufferLength, dataArray[i]);
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Inner circle glow
    const avgValue = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3 + (avgValue / 255) * 20, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(72, 219, 251, ${0.3 + avgValue / 500})`;
    ctx.fill();
  }, [sensitivity, getColor]);

  const drawSpiral = useCallback((ctx, canvas, dataArray, bufferLength) => {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.beginPath();
    for (let i = 0; i < bufferLength; i++) {
      const angle = (i / bufferLength) * Math.PI * 8;
      const value = dataArray[i] / 255;
      const radius = (i / bufferLength) * 200 + value * 50 * sensitivity;

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = getColor(i, bufferLength, dataArray[i]);
    }
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [sensitivity, getColor]);

  const drawSpectrum = useCallback((ctx, canvas, dataArray, bufferLength) => {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const barWidth = canvas.width / bufferLength;

    for (let i = 0; i < bufferLength; i++) {
      const value = (dataArray[i] / 255) * sensitivity;
      const height = value * centerY;

      const gradient = ctx.createLinearGradient(0, centerY - height, 0, centerY + height);
      gradient.addColorStop(0, getColor(i, bufferLength, dataArray[i]));
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(1, getColor(i, bufferLength, dataArray[i]));

      ctx.fillStyle = gradient;
      ctx.fillRect(i * barWidth, centerY - height, barWidth - 1, height * 2);
    }
  }, [sensitivity, getColor]);

  const visualize = useCallback(() => {
    const canvas = canvasRef.current?.getCanvas();
    const ctx = canvasRef.current?.getContext();
    const analyser = analyserRef.current;

    if (!canvas || !ctx || !analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      switch (mode) {
        case 'bars':
          drawBars(ctx, canvas, dataArray, bufferLength);
          break;
        case 'wave':
          analyser.getByteTimeDomainData(dataArray);
          drawWave(ctx, canvas, dataArray, bufferLength);
          break;
        case 'circle':
          drawCircle(ctx, canvas, dataArray, bufferLength);
          break;
        case 'spiral':
          drawSpiral(ctx, canvas, dataArray, bufferLength);
          break;
        case 'spectrum':
          drawSpectrum(ctx, canvas, dataArray, bufferLength);
          break;
        default:
          drawBars(ctx, canvas, dataArray, bufferLength);
      }
    };

    draw();
  }, [mode, drawBars, drawWave, drawCircle, drawSpiral, drawSpectrum]);

  const initAudio = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = smoothing;

      if (useMicrophone) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        sourceRef.current = audioContext.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);
      } else if (audioFile && audioRef.current) {
        if (sourceRef.current) {
          sourceRef.current.disconnect();
        }
        sourceRef.current = audioContext.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContext.destination);
        audioRef.current.play();
      }

      setIsPlaying(true);
      visualize();
    } catch (error) {
      console.error('Error initializing audio:', error);
      alert('Error accessing audio. Please ensure microphone permissions are granted.');
    }
  }, [useMicrophone, audioFile, smoothing, visualize]);

  const stopVisualization = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(URL.createObjectURL(file));
      setUseMicrophone(false);
    }
  };

  useEffect(() => {
    return () => {
      stopVisualization();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopVisualization]);

  useEffect(() => {
    if (analyserRef.current) {
      analyserRef.current.smoothingTimeConstant = smoothing;
    }
  }, [smoothing]);

  // Demo visualization when not playing
  useEffect(() => {
    if (!isPlaying) {
      const canvas = canvasRef.current?.getCanvas();
      const ctx = canvasRef.current?.getContext();
      if (!canvas || !ctx) return;

      let frame = 0;
      const demoAnimation = () => {
        if (isPlaying) return;

        const demoData = new Uint8Array(64);
        for (let i = 0; i < 64; i++) {
          demoData[i] = Math.sin(frame * 0.02 + i * 0.1) * 50 +
                        Math.sin(frame * 0.03 + i * 0.2) * 30 + 100;
        }

        switch (mode) {
          case 'bars':
            drawBars(ctx, canvas, demoData, 64);
            break;
          case 'circle':
            drawCircle(ctx, canvas, demoData, 64);
            break;
          case 'spiral':
            drawSpiral(ctx, canvas, demoData, 64);
            break;
          case 'spectrum':
            drawSpectrum(ctx, canvas, demoData, 64);
            break;
          default:
            drawBars(ctx, canvas, demoData, 64);
        }

        frame++;
        animationRef.current = requestAnimationFrame(demoAnimation);
      };

      demoAnimation();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying, mode, drawBars, drawCircle, drawSpiral, drawSpectrum]);

  return (
    <div className="shape-page">
      <h2>🎵 Audio Visualizer</h2>
      <p>Watch music come to life!</p>

      <div className="visualizer-layout" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <CanvasComponent ref={canvasRef} width={canvasWidth} height={canvasHeight} />

        <div className="controls-panel" style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '20px',
          borderRadius: '15px',
          minWidth: '280px',
          maxWidth: '100%',
          flex: '1 1 280px'
        }}>
          <div className="control-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
              Visualization Mode:
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {Object.entries(VISUALIZER_MODES).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          <div className="control-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
              Color Mode:
            </label>
            <select
              value={colorMode}
              onChange={(e) => setColorMode(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {Object.entries(COLOR_MODES).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          <div className="control-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
              Sensitivity: {sensitivity.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div className="control-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
              Smoothing: {smoothing.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="0.99"
              step="0.01"
              value={smoothing}
              onChange={(e) => setSmoothing(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          <div className="control-group" style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#fff' }}>
              Audio Source:
            </label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                className={`btn ${useMicrophone ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setUseMicrophone(true)}
                style={{ flex: 1 }}
              >
                🎤 Microphone
              </button>
              <button
                className={`btn ${!useMicrophone ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setUseMicrophone(false)}
                style={{ flex: 1 }}
              >
                🎵 File
              </button>
            </div>

            {!useMicrophone && (
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              />
            )}
          </div>

          {audioFile && !useMicrophone && (
            <audio
              ref={audioRef}
              src={audioFile}
              style={{ display: 'none' }}
              onEnded={() => setIsPlaying(false)}
            />
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {!isPlaying ? (
              <button
                className="btn btn-primary"
                onClick={initAudio}
                style={{ flex: 1 }}
              >
                ▶️ Start
              </button>
            ) : (
              <button
                className="btn btn-secondary"
                onClick={stopVisualization}
                style={{ flex: 1 }}
              >
                ⏹️ Stop
              </button>
            )}
          </div>

          <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '15px' }}>
            {isPlaying
              ? '🎵 Visualizing audio...'
              : useMicrophone
                ? '🎤 Click Start to use microphone'
                : audioFile
                  ? '🎵 Click Start to play audio'
                  : '📁 Select an audio file or use microphone'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AudioVisualizer;

