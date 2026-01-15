import { TUTORIAL_STEPS } from './constants';

/**
 * Tutorial modal component
 */
export function TutorialModal({ tutorialStep, setTutorialStep, onClose }) {
    const step = TUTORIAL_STEPS[tutorialStep];
    const isLastStep = tutorialStep === TUTORIAL_STEPS.length - 1;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#1a1a2e',
                    padding: '40px',
                    borderRadius: '20px',
                    maxWidth: '500px',
                    textAlign: 'center',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                    {step.icon}
                </div>
                <h3>{step.title}</h3>
                <p style={{ color: '#888' }}>{step.description}</p>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '30px' }}>
                    {tutorialStep > 0 && (
                        <button
                            className="btn btn-secondary"
                            onClick={() => setTutorialStep(s => s - 1)}
                        >
                            ← Back
                        </button>
                    )}
                    {!isLastStep ? (
                        <button
                            className="btn btn-primary"
                            onClick={() => setTutorialStep(s => s + 1)}
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={onClose}
                        >
                            Get Started! 🚀
                        </button>
                    )}
                </div>

                {/* Progress dots */}
                <div style={{ marginTop: '20px' }}>
                    {TUTORIAL_STEPS.map((_, i) => (
                        <span
                            key={i}
                            style={{
                                display: 'inline-block',
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: i === tutorialStep ? '#48dbfb' : 'rgba(255,255,255,0.2)',
                                margin: '0 5px',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TutorialModal;

