import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizResult } from '../../types/quiz';
import { Princess } from '../../types/princess';
import PrincessGraph from '../PrincessGraph';
import PrincessMessage from '../PrincessMessage';
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

  // Load all princesses for the graph
  useEffect(() => {
    const princesses = getAllPrincesses();
    setAllPrincesses(princesses);
  }, []);

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

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

  const { archetype, personalityMessage, matchAccuracy } = getResultSummary();

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
      {/* Results Header */}
      <header className="results-header">
        <div className="results-title">
          <h1>Your Princess Archetype</h1>
          <h2 className="archetype-name">{archetype}</h2>
        </div>
        
        <div className="results-summary">
          <div className="score-display">
            <div className="score-item heroine">
              <span className="score-label">Heroine Level</span>
              <span className="score-value">{quizResult.xScore}%</span>
              <div className="score-bar">
                <div 
                  className="score-fill heroine-fill"
                  style={{ width: `${quizResult.xScore}%` }}
                />
              </div>
            </div>
            
            <div className="score-item fierce">
              <span className="score-label">Fierce Factor</span>
              <span className="score-value">{quizResult.yScore}%</span>
              <div className="score-bar">
                <div 
                  className="score-fill fierce-fill"
                  style={{ width: `${quizResult.yScore}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="match-info">
            <div className="matched-princess">
              <span className="match-label">Your closest match:</span>
              <span className="princess-name">{quizResult.matchedPrincess.name}</span>
              <span className="match-accuracy">{matchAccuracy}% match</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Results Content */}
      <main className="results-content">
        <div className="results-grid">
          {/* Interactive Graph */}
          <section className="graph-section">
            <h3>Your Position on the Princess Graph</h3>
            <div className="graph-container">
              <PrincessGraph 
                princesses={allPrincesses}
                selectedPrincess={quizResult.matchedPrincess}
                userCoordinates={{
                  x: quizResult.xScore,
                  y: quizResult.yScore,
                  name: 'You',
                  isUser: true
                }}
              />
            </div>
            <div className="graph-explanation">
              <p>
                The red dot shows your calculated position based on your quiz responses. 
                You're closest to <strong>{quizResult.matchedPrincess.name}</strong> from{' '}
                <em>{quizResult.matchedPrincess.source}</em>.
              </p>
            </div>
          </section>

          {/* Personality Message */}
          <section className="message-section">
            <h3>Your Princess Profile</h3>
            <div className="personality-card">
              <div className="personality-message">
                <h4>{personalityMessage}</h4>
              </div>
              
              <PrincessMessage 
                princess={quizResult.matchedPrincess}
                isQuizResult={true}
                userScores={{
                  xScore: quizResult.xScore,
                  yScore: quizResult.yScore
                }}
              />
            </div>
          </section>
        </div>
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
