import React from 'react';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  progressPercentage: number;
  hasCurrentAnswer?: boolean;
}

/**
 * Quiz progress component - shows only progress tracking
 * Navigation moved to bottom of page for better UX
 */
export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentQuestion,
  totalQuestions,
  progressPercentage,
  hasCurrentAnswer = false
}) => {
  
  return (
    <div className="quiz-progress-container">
      {/* Compact Question Counter with Remaining */}
      <div className="question-counter">
        <span className="counter-text">
          Question <strong>{currentQuestion}</strong> of <strong>{totalQuestions}</strong>
        </span>
        <span className="remaining-text">
          {totalQuestions - currentQuestion} remaining
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
      </div>

      {/* Answer Status */}
      <div className="answer-status-container">
        {hasCurrentAnswer ? (
          <span className="answer-status answered">
            ✅ Answered
          </span>
        ) : (
          <span className="answer-status unanswered">
            Select your answer below
          </span>
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
