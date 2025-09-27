import React, { useState, useEffect, useRef } from 'react';
import { Princess } from '../../types/princess';
import { QuizResult } from '../../types/quiz';
import { getAllPrincesses } from '../../data/princessData';

interface AnimatedResultsGraphProps {
  quizResult: QuizResult;
  onAnimationComplete?: () => void;
}

interface AnimationState {
  phase: 'idle' | 'x-axis' | 'y-axis' | 'intersection' | 'reveal' | 'other-princesses' | 'complete';
  xProgress: number;
  yProgress: number;
  showIntersection: boolean;
  showOtherPrincesses: boolean;
}

export const AnimatedResultsGraph: React.FC<AnimatedResultsGraphProps> = ({
  quizResult,
  onAnimationComplete
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [animationState, setAnimationState] = useState<AnimationState>({
    phase: 'idle',
    xProgress: 0,
    yProgress: 0,
    showIntersection: false,
    showOtherPrincesses: false,
  });

  const [allPrincesses, setAllPrincesses] = useState<Princess[]>([]);

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

  useEffect(() => {
    const princesses = getAllPrincesses();
    setAllPrincesses(princesses);
  }, []);

  useEffect(() => {
    const animateGraph = async () => {
      // Wait a moment before starting
      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 1: Animate X-axis line
      setAnimationState(prev => ({ ...prev, phase: 'x-axis' }));
      await animateValue(0, quizResult.xScore, 1500, (value) => {
        setAnimationState(prev => ({ ...prev, xProgress: value }));
      });

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 300));

      // Phase 2: Animate Y-axis line
      setAnimationState(prev => ({ ...prev, phase: 'y-axis' }));
      await animateValue(0, quizResult.yScore, 1500, (value) => {
        setAnimationState(prev => ({ ...prev, yProgress: value }));
      });

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 300));

      // Phase 3: Show intersection point
      setAnimationState(prev => ({ 
        ...prev, 
        phase: 'intersection',
        showIntersection: true 
      }));

      // Wait for reveal
      await new Promise(resolve => setTimeout(resolve, 800));

      // Phase 4: Show reveal message
      setAnimationState(prev => ({ ...prev, phase: 'reveal' }));

      // Wait before showing other princesses
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Phase 5: Show other princesses
      setAnimationState(prev => ({ 
        ...prev, 
        phase: 'other-princesses',
        showOtherPrincesses: true 
      }));

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Complete
      setAnimationState(prev => ({ ...prev, phase: 'complete' }));
      onAnimationComplete?.();
    };

    animateGraph();
  }, [quizResult.xScore, quizResult.yScore, onAnimationComplete]);

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
    <div className="animated-results-graph">
      <div className="graph-container">
        <svg 
          ref={svgRef}
          width={width} 
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="results-svg"
        >
          {/* Graph background */}
          <rect
            x={margin}
            y={margin}
            width={graphWidth}
            height={graphHeight}
            fill="#f8f9fa"
            stroke="#dee2e6"
            strokeWidth="2"
          />

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(value => (
            <g key={value}>
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

          {/* Axes */}
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

          {/* Animated X-axis line (horizontal to user position) */}
          {animationState.phase !== 'idle' && (
            <line
              x1={margin}
              y1={userY}
              x2={scaleX(animationState.xProgress)}
              y2={userY}
              stroke="#007bff"
              strokeWidth="4"
              className="animated-line"
            />
          )}

          {/* Animated Y-axis line (vertical to user position) */}
          {(animationState.phase === 'y-axis' || animationState.phase === 'intersection' || animationState.phase === 'reveal' || animationState.phase === 'other-princesses' || animationState.phase === 'complete') && (
            <line
              x1={userX}
              y1={height - margin}
              x2={userX}
              y2={scaleY(animationState.yProgress)}
              stroke="#28a745"
              strokeWidth="4"
              className="animated-line"
            />
          )}

          {/* User intersection point */}
          {animationState.showIntersection && (
            <g className="user-marker">
              <circle
                cx={userX}
                cy={userY}
                r="12"
                fill="#ff6b6b"
                stroke="#fff"
                strokeWidth="3"
                className="user-dot pulse-animation"
              />
              <text
                x={userX}
                y={userY - 20}
                textAnchor="middle"
                className="user-label"
                fill="#495057"
                fontSize="14"
                fontWeight="bold"
              >
                {quizResult.matchedPrincess.name}
              </text>
            </g>
          )}

          {/* Other princesses */}
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
                className="other-princess-dot"
                style={{
                  animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both`
                }}
              />
            );
          })}

          {/* Axis labels */}
          <text
            x={width / 2}
            y={height - 20}
            textAnchor="middle"
            className="axis-label"
            fill="#495057"
            fontSize="16"
            fontWeight="600"
          >
            Damsel ← → Heroine
          </text>
          
          <text
            x={25}
            y={height / 2}
            textAnchor="middle"
            className="axis-label"
            fill="#495057"
            fontSize="16"
            fontWeight="600"
            transform={`rotate(-90, 25, ${height / 2})`}
          >
            Sweet ← → Bitch
          </text>

          {/* Corner labels */}
          <text x={margin + 10} y={height - margin - 10} className="corner-label" fontSize="12" fill="#6c757d">
            Sweet Damsel
          </text>
          <text x={width - margin - 80} y={height - margin - 10} className="corner-label" fontSize="12" fill="#6c757d">
            Sweet Heroine
          </text>
          <text x={margin + 10} y={margin + 20} className="corner-label" fontSize="12" fill="#6c757d">
            Bitch Damsel
          </text>
          <text x={width - margin - 80} y={margin + 20} className="corner-label" fontSize="12" fill="#6c757d">
            Bitch Heroine
          </text>
        </svg>
      </div>
      
      {/* Score display */}
      <div className="scores-display">
        <div className="score-item">
          <span className="score-label">Heroine Level:</span>
          <span className="score-value">{Math.round(animationState.xProgress)}%</span>
        </div>
        <div className="score-item">
          <span className="score-label">Bitch Factor:</span>
          <span className="score-value">{Math.round(animationState.yProgress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedResultsGraph;
