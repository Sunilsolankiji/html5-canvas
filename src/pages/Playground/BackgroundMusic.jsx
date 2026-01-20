import { useEffect, useRef, useState } from 'react';
import { MUSIC_PLATFORMS, MUSIC_CONFIG } from './constants';

/**
 * Detect the music platform from URL
 */
function detectPlatform(url) {
    if (!url) return null;

    for (const [platform, config] of Object.entries(MUSIC_PLATFORMS)) {
        for (const pattern of config.patterns) {
            const match = url.match(pattern);
            if (match) {
                return { platform, match: match[1] || match[0], config };
            }
        }
    }
    return null;
}

/**
 * Extract YouTube video ID from various URL formats (including Shorts)
 */
function extractYouTubeId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

/**
 * BackgroundMusic component - plays music in background
 */
export function BackgroundMusic({ url, startTime = 0, endTime = 60, enabled = true }) {
    const audioRef = useRef(null);
    const iframeRef = useRef(null);
    const [showPlayer, setShowPlayer] = useState(false); // Hidden by default

    const platformInfo = detectPlatform(url);
    const duration = Math.min(endTime - startTime, MUSIC_CONFIG.MAX_DURATION);

    // Handle direct audio files - auto-play
    useEffect(() => {
        if (!enabled || !url || !platformInfo || platformInfo.platform !== 'direct') {
            return;
        }

        const audio = audioRef.current;
        if (!audio) return;

        audio.src = url;
        audio.currentTime = startTime;
        audio.volume = MUSIC_CONFIG.DEFAULT_VOLUME;
        audio.play().catch(() => {});

        const handleTimeUpdate = () => {
            if (audio.currentTime >= startTime + duration) {
                audio.currentTime = startTime;
            }
        };

        const handleEnded = () => {
            audio.currentTime = startTime;
            audio.play().catch(() => {});
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, [url, startTime, duration, enabled, platformInfo]);

    if (!enabled || !url || !platformInfo) {
        return null;
    }


    // Direct audio file
    if (platformInfo.platform === 'direct') {
        return (
            <>
                <audio ref={audioRef} style={{ display: 'none' }} preload="auto" loop />
                <MusicIndicator />
            </>
        );
    }

    // YouTube embed
    if (platformInfo.platform === 'youtube') {
        const videoId = extractYouTubeId(url);
        if (!videoId) return null;

        // Build YouTube embed URL with parameters
        const embedUrl = `https://www.youtube.com/embed/${videoId}?` + new URLSearchParams({
            autoplay: '1',
            start: Math.floor(startTime).toString(),
            end: Math.floor(startTime + duration).toString(),
            loop: '1',
            playlist: videoId,
            controls: '0',
            modestbranding: '1',
            rel: '0',
            showinfo: '0',
            iv_load_policy: '3',
            fs: '0',
            disablekb: '1',
        }).toString();

        return (
            <>
                {/* Minimized YouTube player - hidden off-screen by default */}
                <div
                    style={{
                        position: 'fixed',
                        bottom: showPlayer ? '70px' : '-300px',
                        right: '20px',
                        width: '200px',
                        height: '113px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                        zIndex: 9998,
                        transition: 'bottom 0.3s ease',
                        border: '2px solid rgba(168, 85, 247, 0.5)',
                    }}
                >
                    <iframe
                        ref={iframeRef}
                        src={embedUrl}
                        width="200"
                        height="113"
                        style={{ border: 'none' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Background Music"
                    />
                </div>

                {/* Music control indicator */}
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                        color: 'white',
                        padding: '10px 18px',
                        borderRadius: '25px',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        zIndex: 9999,
                        boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
                        cursor: 'pointer',
                    }}
                    onClick={() => setShowPlayer(!showPlayer)}
                >
                    <span>🎵</span>
                    <span>Playing</span>
                    <span style={{
                        fontSize: '0.7rem',
                        opacity: 0.8,
                        marginLeft: '5px',
                    }}>
                        {showPlayer ? '▼' : '▲'}
                    </span>
                </div>
            </>
        );
    }

    // Spotify/SoundCloud not supported message
    if (platformInfo.platform === 'spotify' || platformInfo.platform === 'soundcloud') {
        return (
            <div
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: 'rgba(245, 158, 11, 0.95)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    zIndex: 10000,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                }}
            >
                ⚠️ {platformInfo.config.name} links require the app to play
            </div>
        );
    }

    return null;
}

/**
 * Music playing indicator
 */
function MusicIndicator() {
    return (
        <div
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                color: 'white',
                padding: '10px 18px',
                borderRadius: '25px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                zIndex: 9999,
                boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
            }}
        >
            <span>🎵</span>
            <span>Playing</span>
        </div>
    );
}

/**
 * Music URL input and configuration component for Share tab
 */
export function MusicConfig({
    musicUrl,
    setMusicUrl,
    musicStartTime,
    setMusicStartTime,
    musicEndTime,
    setMusicEndTime,
    musicEnabled,
    setMusicEnabled,
}) {
    const platformInfo = detectPlatform(musicUrl);
    const duration = musicEndTime - musicStartTime;
    const isValidDuration = duration > 0 && duration <= MUSIC_CONFIG.MAX_DURATION;

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{
            marginTop: '20px',
            padding: '15px',
            background: 'linear-gradient(135deg, rgba(138,43,226,0.1), rgba(72,219,251,0.1))',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '15px'
            }}>
                <h4 style={{ margin: 0, color: '#a855f7', fontSize: '0.95rem' }}>
                    🎵 Background Music
                </h4>
                <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                }}>
                    <input
                        type="checkbox"
                        checked={musicEnabled}
                        onChange={(e) => setMusicEnabled(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: musicEnabled ? '#a855f7' : '#888' }}>
                        {musicEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                </label>
            </div>

            {musicEnabled && (
                <>
                    <div className="control-group">
                        <label>Music URL:</label>
                        <input
                            type="text"
                            value={musicUrl}
                            onChange={(e) => setMusicUrl(e.target.value)}
                            placeholder="YouTube URL or direct audio link (.mp3)"
                            style={{ width: '100%', fontSize: '0.85rem' }}
                        />
                        {platformInfo && (
                            <small style={{
                                color: platformInfo.platform === 'youtube' || platformInfo.platform === 'direct'
                                    ? '#10b981'
                                    : '#f59e0b',
                                fontSize: '0.75rem',
                                marginTop: '5px',
                                display: 'block'
                            }}>
                                {platformInfo.platform === 'youtube' || platformInfo.platform === 'direct'
                                    ? `✓ ${platformInfo.config.icon} ${platformInfo.config.name} detected`
                                    : `⚠️ ${platformInfo.config.name} - limited support`
                                }
                            </small>
                        )}
                        {musicUrl && !platformInfo && (
                            <small style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '5px', display: 'block' }}>
                                ✗ Unsupported format. Try YouTube or .mp3 links.
                            </small>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                        <div className="control-group" style={{ flex: 1 }}>
                            <label>
                                Start: <span className="value-badge">{formatTime(musicStartTime)}</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="300"
                                value={musicStartTime}
                                onChange={(e) => {
                                    const newStart = Number(e.target.value);
                                    setMusicStartTime(newStart);
                                    if (musicEndTime <= newStart) {
                                        setMusicEndTime(Math.min(newStart + MUSIC_CONFIG.MAX_DURATION, 300));
                                    }
                                }}
                            />
                        </div>
                        <div className="control-group" style={{ flex: 1 }}>
                            <label>
                                End: <span className="value-badge">{formatTime(musicEndTime)}</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="300"
                                value={musicEndTime}
                                onChange={(e) => {
                                    const newEnd = Number(e.target.value);
                                    setMusicEndTime(newEnd);
                                    if (musicStartTime >= newEnd) {
                                        setMusicStartTime(Math.max(newEnd - MUSIC_CONFIG.MAX_DURATION, 0));
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div style={{
                        marginTop: '10px',
                        padding: '10px',
                        background: isValidDuration ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '8px',
                        border: `1px solid ${isValidDuration ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    }}>
                        <p style={{
                            margin: 0,
                            fontSize: '0.8rem',
                            color: isValidDuration ? '#10b981' : '#ef4444',
                            textAlign: 'center',
                        }}>
                            {isValidDuration
                                ? `⏱️ Duration: ${formatTime(duration)} (max 1 min, loops)`
                                : `⚠️ Duration must be 1-${MUSIC_CONFIG.MAX_DURATION} seconds`
                            }
                        </p>
                    </div>

                    <p style={{
                        color: '#888',
                        fontSize: '0.7rem',
                        marginTop: '12px',
                        margin: '12px 0 0 0',
                    }}>
                        💡 YouTube shows a mini player. Direct audio (.mp3) plays hidden.
                    </p>
                </>
            )}
        </div>
    );
}

export default BackgroundMusic;
