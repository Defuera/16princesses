import React from 'react';

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
  const handleStartQuiz = () => {
    onStartQuiz();
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
            Find out which one you are
          </p>
        </header>

        <main className="quiz-intro">
          <div className="quiz-description">
            <p>
              There are different type of princesses. There are those who need to be rescued and those who plot against their own father, those with good manners and the rebellious ones. Those forced to marriage of convenience and those who destined to rule. There are ones who enjoy torturing not only their opponents, but their servants as much. And those who faint by the first sight of a blood drop on the tip of a finger. Princesses who will die on the streets and princesses who were born peasants. There are those who serve to their people and those who exploit.
            </p>
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
                  Start Test
                </>
              )}
            </button>
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
