import React from 'react';
import { useNavigate } from 'react-router-dom';

interface QuizStartProps {
  onStartQuiz: () => void;
  isLoading?: boolean;
  error?: string | null;
}

/**
 * Quiz introduction screen with disclaimer and start button
 * Implements anti-bias disclaimer as specified in the guide
 */
export const QuizStart: React.FC<QuizStartProps> = ({ 
  onStartQuiz, 
  isLoading = false, 
  error = null 
}) => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    onStartQuiz();
    navigate('/quiz');
  };

  if (error) {
    return (
      <div className="quiz-start-container error">
        <div className="quiz-start-content">
          <h1 className="quiz-title">16Princesses Test</h1>
          <div className="error-message">
            <h3>❌ Something went wrong</h3>
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-start-container">
      <div className="quiz-start-content">
        <header className="quiz-header">
          <h1 className="quiz-title">16Princesses Test</h1>
          <p className="quiz-subtitle">
            Discover which princess archetype matches your personality!
          </p>
        </header>

        <main className="quiz-intro">
          <div className="quiz-description">
            <h2>How It Works</h2>
            <p>
              Take our personality quiz to discover your inner princess archetype! 
              You'll answer 16 questions about how you handle different life scenarios, 
              and we'll map your responses to find your closest princess match.
            </p>
            
            <div className="quiz-axes">
              <div className="axis-explanation">
                <h3>📊 What We Measure:</h3>
                <ul>
                  <li><strong>Heroine Level</strong>: How much agency and independence you show</li>
                  <li><strong>Fierce Factor</strong>: Your assertiveness and boldness in tough situations</li>
                </ul>
              </div>
            </div>

            <div className="quiz-features">
              <h3>✨ What to Expect:</h3>
              <ul>
                <li>16 engaging scenario-based questions</li>
                <li>Interactive results on a personality graph</li>
                <li>Personalized princess match with fun insights</li>
                <li>About 5-10 minutes to complete</li>
              </ul>
            </div>
          </div>

          <div className="disclaimer">
            <div className="disclaimer-box">
              <h3>🏰 Before We Begin...</h3>
              <p>
                <strong>No judgments, just princess vibes—be honest!</strong>
              </p>
              <p>
                This quiz works best when you answer based on your genuine instincts 
                and reactions. There are no "right" or "wrong" answers, just different 
                princess archetypes waiting to be discovered.
              </p>
            </div>
          </div>

          <div className="quiz-actions">
            <button 
              className="start-quiz-button"
              onClick={handleStartQuiz}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Loading Quiz...
                </>
              ) : (
                <>
                  <span className="button-icon">👑</span>
                  Start Your Journey
                </>
              )}
            </button>
            
            <p className="quiz-note">
              Ready to discover your princess archetype?
            </p>
          </div>
        </main>

        <footer className="quiz-start-footer">
          <p>
            Based on Disney and anime princess personalities • 
            Inspired by <em>16Personalities</em> methodology
          </p>
        </footer>
      </div>
    </div>
  );
};

export default QuizStart;
