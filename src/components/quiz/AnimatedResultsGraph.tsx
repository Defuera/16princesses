import React, { useState, useEffect, useRef } from 'react';
import { 
  AnimatedResultsGraphProps, 
  AnimationState, 
  AnimationPhase, 
  ANIMATION_TIMING 
} from '../../types/animation';
import { getAllPrincesses } from '../../data/princessData';
import { Princess } from '../../types/princess';
import { 
  announceToScreenReader, 
  getAnimationProgressAnnouncement, 
  getPrincessAriaLabel,
  prefersReducedMotion 
} from '../../utils/accessibility';
import '../../styles/animations.css';

const AnimatedResultsGraph: React.FC<AnimatedResultsGraphProps> = ({
  quizResult,
  onAnimationComplete,
  onUserInteraction,
  reducedMotion = prefersReducedMotion(),
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [allPrincesses, setAllPrincesses] = useState<Princess[]>([]);
  const [animationState, setAnimationState] = useState<AnimationState>({
    phase: AnimationPhase.IDLE,
    xProgress: 0,
    yProgress: 0,
    showIntersection: false,
    showRevealMessage: false,
    showOtherPrincesses: false,
    showCarousel: false,
    isSkippable: true
  });

  // Graph dimensions and configuration
  const width = 600;
  const height = 600;
  const margin = 80;
  const graphWidth = width - 2 * margin;
  const graphHeight = height - 2 * margin;

  // Convert percentage to SVG coordinates
  const scaleX = (value: number) => margin + (value / 100) * graphWidth;
  const scaleY = (value: number) => height - margin - (value / 100) * graphHeight;

  // User's coordinates
  const userX = scaleX(quizResult.xScore);
  const userY = scaleY(quizResult.yScore);

  // Load princess data
  useEffect(() => {
    const princesses = getAllPrincesses();
    setAllPrincesses(princesses);
  }, []);

  // Handle user interactions (click/keyboard)
  const handleUserInteraction = () => {
    if (animationState.isSkippable && onUserInteraction) {
      onUserInteraction();
      skipCurrentPhase();
    }
  };

  // Skip to next animation phase
  const skipCurrentPhase = () => {
    switch (animationState.phase) {
      case AnimationPhase.X_AXIS:
        setAnimationState(prev => ({
          ...prev,
          xProgress: quizResult.xScore,
          phase: AnimationPhase.Y_AXIS
        }));
        announceToScreenReader('Animation skipped to vertical line');
        break;
      case AnimationPhase.Y_AXIS:
        setAnimationState(prev => ({
          ...prev,
          yProgress: quizResult.yScore,
          phase: AnimationPhase.INTERSECTION,
          showIntersection: true
        }));
        announceToScreenReader('Animation skipped to intersection');
        break;
      case AnimationPhase.INTERSECTION:
        setAnimationState(prev => ({
          ...prev,
          phase: AnimationPhase.REVEAL,
          showRevealMessage: true
        }));
        announceToScreenReader('Animation skipped to princess reveal');
        break;
      case AnimationPhase.REVEAL:
        setAnimationState(prev => ({
          ...prev,
          phase: AnimationPhase.OTHER_PRINCESSES,
          showOtherPrincesses: true
        }));
        announceToScreenReader('Animation skipped to other princesses');
        break;
      case AnimationPhase.OTHER_PRINCESSES:
        setAnimationState(prev => ({
          ...prev,
          phase: AnimationPhase.COMPLETE,
          showCarousel: true
        }));
        announceToScreenReader('Animation complete');
        onAnimationComplete?.();
        break;
    }
  };

  // Animation sequence controller
  useEffect(() => {
    if (reducedMotion) {
      // Skip animations, show final state immediately
      setAnimationState({
        phase: AnimationPhase.COMPLETE,
        xProgress: quizResult.xScore,
        yProgress: quizResult.yScore,
        showIntersection: true,
        showRevealMessage: true,
        showOtherPrincesses: true,
        showCarousel: true,
        isSkippable: false
      });
      onAnimationComplete?.();
      return;
    }

    const runAnimationSequence = async () => {
      // Wait a moment before starting
      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 1: X-axis line animation (1.5s)
      setAnimationState(prev => ({ ...prev, phase: AnimationPhase.X_AXIS }));
      announceToScreenReader(getAnimationProgressAnnouncement('x-axis'));
      
      await animateValue(0, quizResult.xScore, ANIMATION_TIMING.lineAnimationDuration, (value) => {
        setAnimationState(prev => ({ ...prev, xProgress: value }));
      });

      // Phase 2: Y-axis line animation (1.5s)
      setAnimationState(prev => ({ ...prev, phase: AnimationPhase.Y_AXIS }));
      announceToScreenReader(getAnimationProgressAnnouncement('y-axis'));
      
      await animateValue(0, quizResult.yScore, ANIMATION_TIMING.lineAnimationDuration, (value) => {
        setAnimationState(prev => ({ ...prev, yProgress: value }));
      });

      // Phase 3: Show intersection marker
      setAnimationState(prev => ({ 
        ...prev, 
        phase: AnimationPhase.INTERSECTION,
        showIntersection: true 
      }));
      announceToScreenReader(getAnimationProgressAnnouncement('intersection'));

      // Phase 4: Reveal princess description (2s delay)
      await new Promise(resolve => setTimeout(resolve, ANIMATION_TIMING.revealDelay));
      setAnimationState(prev => ({ 
        ...prev, 
        phase: AnimationPhase.REVEAL,
        showRevealMessage: true 
      }));
      announceToScreenReader(getAnimationProgressAnnouncement('reveal'));

      // Phase 5: Show other princesses (2s delay)
      await new Promise(resolve => setTimeout(resolve, ANIMATION_TIMING.otherPrincessesDelay));
      setAnimationState(prev => ({ 
        ...prev, 
        phase: AnimationPhase.OTHER_PRINCESSES,
        showOtherPrincesses: true 
      }));
      announceToScreenReader(getAnimationProgressAnnouncement('other-princesses'));

      // Phase 6: Show carousel (1s fade-in delay)
      await new Promise(resolve => setTimeout(resolve, ANIMATION_TIMING.carouselFadeInDelay));
      setAnimationState(prev => ({ 
        ...prev, 
        phase: AnimationPhase.COMPLETE,
        showCarousel: true,
        isSkippable: false
      }));
      announceToScreenReader(getAnimationProgressAnnouncement('complete'));

      onAnimationComplete?.();
    };

    runAnimationSequence();
  }, [quizResult, reducedMotion, onAnimationComplete]);

  // Smooth animation utility
  const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void): Promise<void> => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const change = end - start;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = start + change * easedProgress;
        
        callback(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animate();
    });
  };

  return (
    <div className={`animated-results-graph ${className}`}>
      {/* Screen reader live region */}
      <div 
        id="animation-live-region"
        className="live-region" 
        aria-live="polite" 
        aria-atomic="true"
      />

      {/* Skip instructions */}
      <div className="sr-only">
        Click graph or press Enter to skip animation phases
      </div>

      {/* Main SVG Graph */}
      <svg 
        ref={svgRef}
        width={width} 
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="results-svg animate-performance"
        role="img"
        aria-label="Interactive personality graph showing your position and matched princess"
        tabIndex={0}
        onClick={handleUserInteraction}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleUserInteraction();
          }
        }}
        data-testid="personality-graph"
      >
        {/* Graph background */}
        <rect
          x={margin}
          y={margin}
          width={graphWidth}
          height={graphHeight}
          fill="transparent"
          stroke="#dee2e6"
        strokeWidth="2"
          rx="4"
        />

        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(value => (
          <g key={value} opacity="0.3">
            {/* Vertical grid lines */}
            <line
              x1={scaleX(value)}
              y1={margin}
              x2={scaleX(value)}
              y2={height - margin}
              stroke="#e9ecef"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
            {/* Horizontal grid lines */}
            <line
              x1={margin}
              y1={scaleY(value)}
              x2={width - margin}
              y2={scaleY(value)}
              stroke="#e9ecef"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          </g>
        ))}

        {/* Main Axes */}
        <g className="main-axes">
          {/* X-axis */}
          <line
            x1={margin}
            y1={height - margin}
            x2={width - margin}
            y2={height - margin}
            stroke="#495057"
            strokeWidth="3"
          />
          
          {/* Y-axis */}
          <line
            x1={margin}
            y1={margin}
            x2={margin}
            y2={height - margin}
            stroke="#495057"
            strokeWidth="3"
          />
        </g>

        {/* Animated User Lines */}
        <g className="user-lines">
          {/* X-axis line (horizontal to user position) */}
          <line
            x1={margin}
            y1={userY}
            x2={scaleX(animationState.xProgress)}
            y2={userY}
            stroke="#007bff"
            strokeWidth="4"
            className={`animated-line ${
              animationState.phase === AnimationPhase.X_AXIS ? 'animate' : 
              animationState.phase !== AnimationPhase.IDLE ? 'complete' : ''
            }`}
            data-testid="x-axis-line"
          />

          {/* Y-axis line (vertical to user position) */}
          {animationState.phase !== AnimationPhase.IDLE && animationState.phase !== AnimationPhase.X_AXIS && (
            <line
              x1={userX}
              y1={height - margin}
              x2={userX}
              y2={scaleY(animationState.yProgress)}
              stroke="#28a745"
              strokeWidth="4"
              className={`animated-line ${
                animationState.phase === AnimationPhase.Y_AXIS ? 'animate' : 'complete'
              }`}
              data-testid="y-axis-line"
            />
          )}
        </g>

        {/* User intersection point */}
        {animationState.showIntersection && (
          <g className="user-marker" data-testid="intersection-marker">
            <circle
              cx={userX}
              cy={userY}
              r="12"
              fill="#ff6b6b"
              stroke="#fff"
              strokeWidth="3"
              className="user-dot"
            />
            <text
              x={userX}
              y={userY - 20}
              textAnchor="middle"
              className="user-label show"
              fill="#495057"
              fontSize="14"
              fontWeight="bold"
            >
              {quizResult.matchedPrincess.name}
            </text>
          </g>
        )}

        {/* Other princess dots */}
        {animationState.showOtherPrincesses && allPrincesses.map((princess, index) => {
          if (princess.id === quizResult.matchedPrincess.id) return null;
          
          return (
            <circle
              key={princess.id}
              cx={scaleX(princess.feminismPercentage)}
              cy={scaleY(princess.bitchinessPercentage)}
              r="6"
              fill="#adb5bd"
              stroke="#fff"
              strokeWidth="2"
              className="other-princess-dot show"
              style={{
                animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both`
              }}
              data-testid="other-princess-dot"
              aria-label={getPrincessAriaLabel(princess, princess.feminismPercentage, princess.bitchinessPercentage)}
            />
          );
        })}

        {/* Axis labels with arrows */}
        <g className="axis-labels">
          {/* X-axis labels - Damsel on left, Heroine on right */}
          <text
            x={margin}
            y={height - margin + 25}
            textAnchor="start"
            className="axis-label"
            fill="#495057"
            fontSize="14"
            fontWeight="600"
          >
            Damsel
          </text>
          
          <text
            x={width - margin}
            y={height - margin + 25}
            textAnchor="end"
            className="axis-label"
            fill="#495057"
            fontSize="14"
            fontWeight="600"
          >
            Heroine
          </text>
          
          {/* Y-axis labels - Sweet at bottom, Bitch at top */}
          <text
            x={margin - 25}
            y={height - margin}
            textAnchor="middle"
            className="axis-label"
            fill="#495057"
            fontSize="14"
            fontWeight="600"
          >
            Sweet
          </text>
          
          <text
            x={margin}
            y={margin - 15}
            textAnchor="end"
            className="axis-label"
            fill="#495057"
            fontSize="14"
            fontWeight="600"
          >
            Bitch
          </text>
          
          {/* Y-axis directional arrow (at the very top) */}
          <g className="axis-arrow" stroke="#495057" strokeWidth="2" fill="#495057">
            <polygon points={`${margin-4},${margin + 10} ${margin},${margin} ${margin+4},${margin + 10}`} />
          </g>
          
          {/* X-axis directional arrow (at the very end) */}
          <g className="axis-arrow" stroke="#495057" strokeWidth="2" fill="#495057">
            <polygon points={`${width - margin - 10},${height - margin - 4} ${width - margin},${height - margin} ${width - margin - 10},${height - margin + 4}`} />
          </g>
        </g>

        {/* Score values on axes */}
        {animationState.xProgress > 0 && (
          <g className="axis-scores">
            {/* X-axis score (Heroine level) */}
            <text
              x={userX}
              y={height - margin + 25}
              textAnchor="middle"
              className="axis-score-label"
              fill="#007bff"
              fontSize="18"
              fontWeight="bold"
            >
              {Math.round(animationState.xProgress)}%
            </text>
          </g>
        )}
        
        {animationState.yProgress > 0 && (
          <g className="axis-scores">
            {/* Y-axis score (Bitch factor) */}
            <text
              x={margin - 35}
              y={userY + 6}
              textAnchor="middle"
              className="axis-score-label"
              fill="#28a745"
              fontSize="18"
              fontWeight="bold"
            >
              {Math.round(animationState.yProgress)}%
            </text>
          </g>
        )}

        {/* Corner labels for better UX */}
        <g className="corner-labels" fontSize="12" fill="#6c757d" opacity="0.7">
          <text x={margin + 10} y={height - margin - 10}>Sweet Damsel</text>
          <text x={width - margin - 100} y={height - margin - 10}>Sweet Heroine</text>
          <text x={margin + 10} y={margin + 20}>Bitch Damsel</text>
          <text x={width - margin - 100} y={margin + 20}>Bitch Heroine</text>
        </g>

      </svg>
    </div>
  );
};

export default AnimatedResultsGraph;