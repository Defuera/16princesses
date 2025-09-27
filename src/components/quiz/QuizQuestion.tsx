import React, { useState, useEffect } from 'react';
import { ShuffledQuestion, QuizOption } from '../../types/quiz';

interface QuizQuestionProps {
  question: ShuffledQuestion;
  selectedValue?: number;
  onAnswerSelect: (questionId: number, selectedValue: number) => void;
  isLoading?: boolean;
}

/**
 * Individual quiz question component with multiple/forced choice options
 * Implements Fisher-Yates shuffling and anti-bias techniques
 */
export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedValue,
  onAnswerSelect,
  isLoading = false
}) => {
  const [selectedOption, setSelectedOption] = useState<number | undefined>(selectedValue);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update selected option when prop changes (navigation between questions)
  useEffect(() => {
    setSelectedOption(selectedValue);
  }, [selectedValue, question.id]);

  // Animation effect when question changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [question.id]);

  const handleOptionSelect = (option: QuizOption) => {
    if (isLoading) return;
    
    setSelectedOption(option.value);
    onAnswerSelect(question.id, option.value);
  };

  const getOptionsToDisplay = (): QuizOption[] => {
    // Use shuffled options if available (for multiple-choice questions)
    return question.shuffledOptions || question.options;
  };

  const renderOption = (option: QuizOption, index: number) => {
    const isSelected = selectedOption === option.value;
    const optionId = `q${question.id}-option${index}`;

    return (
      <div
        key={`${question.id}-${index}-${option.value}`}
        className={`quiz-option ${isSelected ? 'selected' : ''} ${question.type}`}
      >
        <input
          type="radio"
          id={optionId}
          name={`question-${question.id}`}
          value={option.value}
          checked={isSelected}
          onChange={() => handleOptionSelect(option)}
          disabled={isLoading}
          className="quiz-option-input"
        />
        <label 
          htmlFor={optionId}
          className="quiz-option-label"
        >
          <div className="option-content">
            <div className="option-indicator">
              {isSelected ? (
                <span className="selected-indicator">●</span>
              ) : (
                <span className="unselected-indicator">○</span>
              )}
            </div>
            <div className="option-text">
              {option.text}
            </div>
          </div>
        </label>
      </div>
    );
  };

  const getQuestionTypeLabel = () => {
    if (question.type === 'multiple') {
      return 'Choose the option that feels most natural to you:';
    } else if (question.type === 'forced') {
      return 'Pick the choice that better represents you:';
    }
    return 'Select your answer:';
  };

  const getQuestionTheme = () => {
    // Extract princess reference from question text for theming
    const lowerText = question.text.toLowerCase();
    
    if (lowerText.includes('cinderella')) return 'cinderella';
    if (lowerText.includes('rapunzel')) return 'rapunzel';
    if (lowerText.includes('aurora')) return 'aurora';
    if (lowerText.includes('pocahontas')) return 'pocahontas';
    if (lowerText.includes('mulan')) return 'mulan';
    if (lowerText.includes('mononoke')) return 'mononoke';
    if (lowerText.includes('nausicaa')) return 'nausicaa';
    if (lowerText.includes('kaguya')) return 'kaguya';
    if (lowerText.includes('belle')) return 'belle';
    if (lowerText.includes('jasmine')) return 'jasmine';
    if (lowerText.includes('elsa')) return 'elsa';
    if (lowerText.includes('merida')) return 'merida';
    if (lowerText.includes('moana')) return 'moana';
    if (lowerText.includes('chihiro')) return 'chihiro';
    if (lowerText.includes('sheeta')) return 'sheeta';
    if (lowerText.includes('sophie')) return 'sophie';
    
    return 'default';
  };

  if (!question) {
    return (
      <div className="quiz-question-container loading">
        <div className="question-placeholder">
          <div className="loading-spinner"></div>
          <p>Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`quiz-question-container ${isAnimating ? 'animating' : ''} theme-${getQuestionTheme()}`}>
      {/* Question Header */}
      <div className="question-header">
        <div className="question-meta">
          <span className="question-type">
            {question.type === 'multiple' ? 'Multiple Choice' : 'Choose One'}
          </span>
          <span className="question-axis">
            {question.axis === 'X' ? 'Independence' : 'Assertiveness'} Question
          </span>
          {question.reverse && (
            <span className="question-reverse" title="This question uses reverse scoring">
              ⚡ Reverse
            </span>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="question-content">
        <h2 className="question-text">
          {question.text}
        </h2>
        
        <p className="question-instruction">
          {getQuestionTypeLabel()}
        </p>
      </div>

      {/* Answer Options */}
      <div className={`question-options ${question.type}`}>
        {getOptionsToDisplay().map((option, index) => 
          renderOption(option, index)
        )}
      </div>

      {/* Question Info */}
      <div className="question-info">
        <div className="question-stats">
          <span className="option-count">
            {getOptionsToDisplay().length} options
          </span>
          {question.type === 'multiple' && (
            <span className="shuffle-note">
              📝 Options randomized
            </span>
          )}
        </div>
        
        {selectedOption !== undefined && (
          <div className="selection-feedback">
            ✅ Answer recorded
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="question-loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

/**
 * Question preview component (for debugging/admin)
 */
export const QuizQuestionPreview: React.FC<{ question: ShuffledQuestion }> = ({ question }) => {
  return (
    <div className="quiz-question-preview">
      <div className="preview-header">
        <span className="question-id">Q{question.id}</span>
        <span className="question-type">{question.type}</span>
        <span className="question-axis">{question.axis}-axis</span>
        {question.reverse && <span className="reverse-flag">Reverse</span>}
      </div>
      <div className="preview-text">{question.text}</div>
      <div className="preview-options">
        {question.options.map((option, index) => (
          <div key={index} className="preview-option">
            <span className="option-value">{option.value}%</span>
            <span className="option-text">{option.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;
