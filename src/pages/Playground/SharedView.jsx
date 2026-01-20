import { useMemo } from 'react';
import CanvasComponent from '../../components/CanvasComponent';
import { CONFETTI_COLORS, HEART_EMOJIS } from './constants';
import { BackgroundMusic } from './BackgroundMusic';
import './SharedView.css';

/**
 * Confetti effect component for surprise reveals
 */
function ConfettiEffect({ confettiData }) {
    return (
        <>
            {confettiData.map((data, i) => (
                <div
                    key={`confetti-${i}`}
                    className="confetti"
                    style={{
                        left: `${data.left}%`,
                        background: CONFETTI_COLORS[i % 6],
                        borderRadius: i % 3 === 0 ? '50%' : '0',
                        animationDuration: `${data.duration}s`,
                        animationDelay: `${data.delay}s`,
                    }}
                />
            ))}
        </>
    );
}

/**
 * Sparkle effect component
 */
function SparkleEffect({ sparkleData }) {
    return (
        <>
            {sparkleData.map((data, i) => (
                <div
                    key={`sparkle-${i}`}
                    className="sparkle"
                    style={{
                        left: `${data.left}%`,
                        top: `${data.top}%`,
                        animationDelay: `${data.delay}s`,
                    }}
                >
                    ✨
                </div>
            ))}
        </>
    );
}

/**
 * Floating hearts effect component
 */
function FloatingHearts({ heartData }) {
    return (
        <>
            {heartData.map((data, i) => (
                <div
                    key={`heart-${i}`}
                    className="heart-float"
                    style={{
                        left: `${data.left}%`,
                        animationDelay: `${i * 0.5}s`,
                    }}
                >
                    {HEART_EMOJIS[i % 6]}
                </div>
            ))}
        </>
    );
}

/**
 * Gift box component for surprise reveals
 */
function GiftBox({ onReveal }) {
    return (
        <div
            className="gift-box"
            onClick={onReveal}
            style={{
                marginTop: '30px',
                padding: '30px 50px',
                background: 'linear-gradient(135deg, rgba(255,107,107,0.2), rgba(254,202,87,0.2))',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '2px solid rgba(255, 107, 107, 0.3)',
                textAlign: 'center',
                cursor: 'pointer',
            }}
        >
            <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🎁</div>
            <p style={{
                margin: 0,
                color: '#feca57',
                fontSize: '1.1rem',
                fontWeight: 'bold',
            }}>
                You have a surprise message!
            </p>
            <p style={{
                margin: '8px 0 0 0',
                color: '#888',
                fontSize: '0.9rem',
            }}>
                👆 Click to open
            </p>
        </div>
    );
}

/**
 * Shared message display component
 */
function SharedMessage({ message, animation, isSurprise }) {
    return (
        <div
            className={`shared-message-container anim-${animation}`}
            style={{
                marginTop: '20px',
                padding: '20px 40px',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                maxWidth: '85%',
                textAlign: 'center',
            }}
        >
            <p
                className={`shared-message-text ${isSurprise ? 'rainbow' : ''}`}
                style={{
                    margin: 0,
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    letterSpacing: '0.5px',
                }}
            >
                &ldquo;{message}&rdquo;
            </p>
        </div>
    );
}

/**
 * Toast notification component
 */
export function Toast({ message }) {
    return (
        <div
            style={{
                position: 'fixed',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(72, 219, 251, 0.95)',
                color: '#000',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                zIndex: 10000,
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                animation: 'fadeIn 0.3s ease',
            }}
        >
            {message}
        </div>
    );
}

/**
 * Main Shared View component for displaying shared creations
 */
export function SharedView({
    canvasRef,
    backgroundColor,
    displayMessage,
    displayMessageAnimation,
    displaySurprise,
    giftRevealed,
    setGiftRevealed,
    toast,
    displayMusicUrl,
    displayMusicStartTime,
    displayMusicEndTime,
}) {
    // Memoized random data for confetti effects
    const confettiData = useMemo(() => [...Array(50)].map(() => ({
        left: Math.random() * 100,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 0.5,
    })), []);

    const sparkleData = useMemo(() => [...Array(15)].map(() => ({
        left: 10 + Math.random() * 80,
        top: 10 + Math.random() * 80,
        delay: Math.random() * 2,
    })), []);

    const heartData = useMemo(() => [...Array(10)].map(() => ({
        left: 10 + Math.random() * 80,
    })), []);

    const canvasWidth = Math.min(window.innerWidth - 40, 800);
    const canvasHeight = Math.min(window.innerHeight - (displayMessage ? 120 : 40), 600);

    return (
        <div
            className="shared-view"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: backgroundColor,
                zIndex: 9999,
                padding: '20px',
                overflow: 'hidden',
            }}
        >
            {/* Surprise Effects */}
            {displaySurprise && giftRevealed && (
                <>
                    <ConfettiEffect confettiData={confettiData} />
                    <SparkleEffect sparkleData={sparkleData} />
                    <FloatingHearts heartData={heartData} />
                </>
            )}

            {/* Canvas */}
            <CanvasComponent
                key={`shared-${canvasWidth}-${canvasHeight}`}
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                backgroundColor={backgroundColor}
            />

            {/* Message Display */}
            {displayMessage && (
                <>
                    {displaySurprise && !giftRevealed ? (
                        <GiftBox onReveal={() => setGiftRevealed(true)} />
                    ) : (
                        <SharedMessage
                            message={displayMessage}
                            animation={displayMessageAnimation}
                            isSurprise={displaySurprise}
                        />
                    )}
                </>
            )}

            {/* Toast */}
            {toast.show && <Toast message={toast.message} />}

            {/* Background Music */}
            {displayMusicUrl && (
                <BackgroundMusic
                    url={displayMusicUrl}
                    startTime={displayMusicStartTime}
                    endTime={displayMusicEndTime}
                    enabled={true}
                />
            )}
        </div>
    );
}

export default SharedView;

