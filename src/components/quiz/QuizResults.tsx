import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizResult } from '../../types/quiz';
import { Princess } from '../../types/princess';
import PrincessGraph from '../PrincessGraph';
import AnimatedResultsGraph from './AnimatedResultsGraph';
import PrincessRevealCarousel from './PrincessRevealCarousel';
import { getAllPrincesses } from '../../data/princessData';
import { generatePersonalityMessage } from '../../data/quizScoring';

interface QuizResultsProps {
  quizResult: QuizResult;
  onRetakeQuiz: () => void;
  isLoading?: boolean;
}

/**
 * Quiz results wrapper that integrates with existing graph and message components
 * Displays calculated scores, matched princess, and personalized results
 */
export const QuizResults: React.FC<QuizResultsProps> = ({
  quizResult,
  onRetakeQuiz,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const [allPrincesses, setAllPrincesses] = useState<Princess[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [selectedExplorePrincess, setSelectedExplorePrincess] = useState<Princess | null>(null);
  const [revealData, setRevealData] = useState<any>(null);

  // Load all princesses for the graph
  useEffect(() => {
    const princesses = getAllPrincesses();
    setAllPrincesses(princesses);
  }, []);

  // Load reveal.json data
  useEffect(() => {
    const loadRevealData = async () => {
      try {
        const response = await fetch('/docs/reveal.json');
        const data = await response.json();
        setRevealData(data);
      } catch (error) {
        console.warn('Failed to load reveal data:', error);
        setRevealData({ princesses: [] });
      }
    };
    loadRevealData();
  }, []);

  // Get reveal description for a princess
  const getRevealDescription = (princessName: string) => {
    if (!revealData?.princesses) return "You're a unique princess archetype! Your combination of traits creates an interesting personality profile.";
    const princess = revealData.princesses.find((p: any) => p.name === princessName);
    return princess?.description || "You're a unique princess archetype! Your combination of traits creates an interesting personality profile.";
  };

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  const handlePrincessExplore = (princess: Princess) => {
    setSelectedExplorePrincess(princess);
  };

  const handleRetakeQuiz = () => {
    setIsVisible(false);
    onRetakeQuiz();
    navigate('/');
  };

  const handleShareResults = () => {
    const { xScore, yScore, matchedPrincess } = quizResult;
    const shareText = `I took the 16Princesses Test and I'm ${xScore}% Heroine, ${yScore}% Fierce—like ${matchedPrincess.name}! 👑✨`;
    
    if (navigator.share) {
      navigator.share({
        title: '16Princesses Test Results',
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Results copied to clipboard!');
      }).catch(() => {
        // Fallback to showing share text
        prompt('Copy this text to share your results:', shareText);
      });
    } else {
      prompt('Copy this text to share your results:', shareText);
    }
  };

  const getResultSummary = () => {
    const { xScore, yScore, matchingDistance } = quizResult;
    
    let archetype = '';
    if (xScore >= 60 && yScore >= 60) archetype = 'Fierce Heroine';
    else if (xScore >= 60 && yScore < 60) archetype = 'Gentle Heroine';
    else if (xScore < 60 && yScore >= 60) archetype = 'Fierce Heart';
    else archetype = 'Classic Princess';

    return {
      archetype,
      personalityMessage: generatePersonalityMessage(quizResult),
      matchAccuracy: Math.round((100 - matchingDistance) * 10) / 10
    };
  };

  const { archetype, matchAccuracy } = getResultSummary();

  if (isLoading) {
    return (
      <div className="quiz-results-container loading">
        <div className="results-loading">
          <div className="loading-spinner large"></div>
          <h2>Calculating your princess match...</h2>
          <p>Analyzing your responses and finding your perfect archetype!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`quiz-results-container ${isVisible ? 'visible' : ''}`}>
      {/* Main Results Content */}
      <main className="results-content">
        {/* Single Card: Graph + Description Side by Side */}
        <div className="results-main-card">
          <div className="main-results-card">
            {/* Left: Animated Results Graph */}
            <section className="graph-section">
              <div className="animated-graph-container">
                <AnimatedResultsGraph
                  quizResult={quizResult}
                  onAnimationComplete={handleAnimationComplete}
                  onUserInteraction={() => {
                    // Handle user interaction during animations
                    console.log('Animation interaction detected');
                  }}
                  className="main-results-graph"
                />
              </div>
            </section>

            {/* Right: Princess Description + Image */}
            {animationComplete && (
              <section className="princess-info-section">
                <div className="princess-description">
                  <h3>{quizResult.matchedPrincess.name}</h3>
                  <p className="princess-source">from {quizResult.matchedPrincess.source}</p>
                  <div className="reveal-message">
                    <p>{getRevealDescription(quizResult.matchedPrincess.name)}</p>
                  </div>
                </div>
                
                <div className="princess-image-display">
                  <div className="princess-image-placeholder">
                    <div className="image-placeholder" role="img" aria-label={`${quizResult.matchedPrincess.name} image placeholder`}>
                      <span className="placeholder-text" aria-hidden="true">👑</span>
                      <span className="image-label">Princess Image</span>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* 3. Princess Exploration Carousel */}
        {animationComplete && (
          <section className="carousel-section">
            <PrincessRevealCarousel
              quizResult={quizResult}
              allPrincesses={allPrincesses}
              revealed={animationComplete}
              onPrincessSelect={handlePrincessExplore}
              selectedPrincess={selectedExplorePrincess}
              className="main-carousel"
            />
          </section>
        )}

        {/* Fallback: Traditional Graph (for accessibility/preference) */}
        {animationComplete && (
          <section className="fallback-graph-section">
            <details>
              <summary>View Static Graph</summary>
              <div className="static-graph-container">
                <PrincessGraph 
                  princesses={allPrincesses}
                  selectedPrincess={selectedExplorePrincess || quizResult.matchedPrincess}
                  userCoordinates={{
                    x: quizResult.xScore,
                    y: quizResult.yScore,
                    name: 'You',
                    isUser: true
                  }}
                />
              </div>
            </details>
          </section>
        )}
      </main>

      {/* Action Buttons */}
      <footer className="results-actions">
        <div className="action-buttons">
          <button 
            className="retake-button"
            onClick={handleRetakeQuiz}
          >
            <span className="button-icon">🔄</span>
            Take Quiz Again
          </button>
          
          <button 
            className="share-button"
            onClick={handleShareResults}
          >
            <span className="button-icon">📤</span>
            Share Results
          </button>
          
          <button 
            className="explore-button"
            onClick={() => navigate('/')}
          >
            <span className="button-icon">🏰</span>
            Explore Princesses
          </button>
        </div>
        
        <div className="results-stats">
          <span className="stat">
            Based on {quizResult.answeredQuestions} of {quizResult.totalQuestions} questions
          </span>
          <span className="stat">
            Distance from {quizResult.matchedPrincess.name}: {quizResult.matchingDistance.toFixed(1)} units
          </span>
        </div>
      </footer>
    </div>
  );
};

/**
 * Loading state component for quiz results
 */
export const QuizResultsLoading: React.FC = () => {
  return (
    <div className="quiz-results-loading">
      <div className="loading-content">
        <div className="loading-spinner large"></div>
        <h2>Finding your princess match...</h2>
        <p>Calculating your personality scores and finding the perfect archetype!</p>
        
        <div className="loading-steps">
          <div className="loading-step">📊 Analyzing your responses...</div>
          <div className="loading-step">🧮 Calculating personality scores...</div>
          <div className="loading-step">👑 Matching to closest princess...</div>
          <div className="loading-step">✨ Preparing your results...</div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
