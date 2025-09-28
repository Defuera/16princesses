import React from 'react';

interface QuizNavigationProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isComplete?: boolean;
  hasCurrentAnswer?: boolean;
}

/**
 * Quiz navigation component - bottom navigation buttons
 * Separated from progress for better UX
 */
export const QuizNavigation: React.FC<QuizNavigationProps> = ({
  canGoBack,
  canGoForward,
  onPrevious,
  onNext,
  onSubmit,
  isComplete = false,
  hasCurrentAnswer = false
}) => {
  
  const handleNext = () => {
    if (isComplete && onSubmit) {
      onSubmit();
    } else if (canGoForward) {
      onNext();
    }
  };

  return (
    <div className="quiz-navigation-container">
      <div className="quiz-navigation">
        <button
          className="nav-button nav-back"
          onClick={onPrevious}
          disabled={!canGoBack}
          title={canGoBack ? 'Previous question' : 'Already at first question'}
        >
          ⬅️ Back
        </button>

        <div className="nav-center">
        </div>

        <button
          className={`nav-button nav-forward ${isComplete ? 'submit-button' : ''} ${!hasCurrentAnswer && !isComplete ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={!hasCurrentAnswer && !isComplete}
          title={
            isComplete 
              ? 'Submit quiz and see results'
              : hasCurrentAnswer
                ? 'Next question'
                : 'Please answer current question first'
          }
        >
          {isComplete ? (
            <>
              🏁 See Results
            </>
          ) : (
            <>
              Next ➡️
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizNavigation;
