import React from 'react';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  progressPercentage: number;
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isComplete?: boolean;
  hasCurrentAnswer?: boolean;
}

/**
 * Quiz progress component with navigation and progress tracking
 * Shows current question, progress bar, and navigation buttons
 */
export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentQuestion,
  totalQuestions,
  progressPercentage,
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
    <div className="quiz-progress-container">
      {/* Question Counter */}
      <div className="question-counter">
        <span className="counter-text">
          Question <strong>{currentQuestion}</strong> of <strong>{totalQuestions}</strong>
        </span>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="progress-text">
          {progressPercentage}% Complete
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="quiz-navigation">
        <button
          className="nav-button nav-back"
          onClick={onPrevious}
          disabled={!canGoBack}
          title={canGoBack ? 'Previous question' : 'Already at first question'}
        >
          <span className="button-icon">⬅️</span>
          Back
        </button>

        <div className="nav-center">
          {hasCurrentAnswer ? (
            <span className="answer-status answered">
              ✅ Answered
            </span>
          ) : (
            <span className="answer-status unanswered">
              Please select an answer
            </span>
          )}
        </div>

        <button
          className={`nav-button nav-forward ${isComplete ? 'submit-button' : ''}`}
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
              <span className="button-icon">🏁</span>
              See Results
            </>
          ) : (
            <>
              Next
              <span className="button-icon">➡️</span>
            </>
          )}
        </button>
      </div>

      {/* Quiz Status */}
      <div className="quiz-status">
        {isComplete ? (
          <div className="status-complete">
            <span className="status-icon">🎉</span>
            <span className="status-text">Quiz complete! Ready to see your results?</span>
          </div>
        ) : (
          <div className="status-in-progress">
            <span className="status-icon">⏳</span>
            <span className="status-text">
              {totalQuestions - currentQuestion} questions remaining
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Simplified progress indicator for minimal UI
 */
export const QuizProgressSimple: React.FC<{
  current: number;
  total: number;
  percentage: number;
}> = ({ current, total, percentage }) => {
  return (
    <div className="quiz-progress-simple">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="progress-label">
        {current} / {total}
      </span>
    </div>
  );
};

/**
 * Progress dots indicator (alternative visual style)
 */
export const QuizProgressDots: React.FC<{
  current: number;
  total: number;
  onGoToQuestion?: (index: number) => void;
}> = ({ current, total, onGoToQuestion }) => {
  return (
    <div className="quiz-progress-dots">
      {Array.from({ length: total }, (_, index) => {
        const questionNumber = index + 1;
        const isActive = questionNumber === current;
        const isCompleted = questionNumber < current;
        
        return (
          <button
            key={index}
            className={`progress-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            onClick={() => onGoToQuestion?.(index)}
            title={`Go to question ${questionNumber}`}
            disabled={!onGoToQuestion}
          >
            {isCompleted ? '✓' : questionNumber}
          </button>
        );
      })}
    </div>
  );
};

export default QuizProgress;
