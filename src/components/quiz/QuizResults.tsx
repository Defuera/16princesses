import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizResult } from '../../types/quiz';
import { Princess } from '../../types/princess';
import AnimatedResultsGraph from './AnimatedResultsGraph';
import PrincessRevealCarousel from './PrincessRevealCarousel';
import PrincessInfo from './PrincessInfo';
import { getAllPrincesses } from '../../data/princessData';

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
  const [selectedExplorePrincess, setSelectedExplorePrincess] = useState<Princess | null>(null);

  // Load all princesses for the graph
  useEffect(() => {
    const princesses = getAllPrincesses();
    setAllPrincesses(princesses);
  }, []);

  const handlePrincessExplore = (princess: Princess) => {
    setSelectedExplorePrincess(princess);
  };

  const handleRetakeQuiz = () => {
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
    <div className="quiz-results-container visible">
      {/* Main Results Content */}
      <main className="results-content">
        {/* Single Flattened Card: Graph + Princess Info */}
        <div className="main-results-card">
          {/* Left: Static Graph */}
          <section className="graph-section">
            <AnimatedResultsGraph
              quizResult={quizResult}
              onAnimationComplete={() => {}}
              onUserInteraction={() => {}}
              selectedPrincess={selectedExplorePrincess}
              reducedMotion={true}
              className="main-results-graph"
            />
          </section>

          {/* Right: Princess Info */}
          <PrincessInfo 
            princess={selectedExplorePrincess || quizResult.matchedPrincess}
          />
        </div>

        {/* Princess Exploration Carousel */}
        <section className="carousel-section">
          <PrincessRevealCarousel
            quizResult={quizResult}
            allPrincesses={allPrincesses}
            revealed={true}
            onPrincessSelect={handlePrincessExplore}
            selectedPrincess={selectedExplorePrincess}
            className="main-carousel"
          />
        </section>

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
