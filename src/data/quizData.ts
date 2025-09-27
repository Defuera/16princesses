import { QuizQuestion, ShuffledQuestion } from '../types/quiz';
import { shuffle } from '../utils/shuffle';
import quizDataJson from './quizData.json';

/**
 * Load and validate quiz questions from JSON data
 * Implements validation to ensure data matches expected structure
 */
export function loadQuizQuestions(): QuizQuestion[] {
  try {
    // Type assertion since we know the structure from QUEEZ.json
    const questions = quizDataJson as QuizQuestion[];
    
    // Validate the loaded data
    validateQuizData(questions);
    
    return questions;
  } catch (error) {
    console.error('Failed to load quiz data:', error);
    throw new Error('Quiz data could not be loaded or is invalid');
  }
}

/**
 * Get a single question by ID
 * @param id - Question ID to find
 * @returns Question or undefined if not found
 */
export function getQuestionById(id: number): QuizQuestion | undefined {
  const questions = loadQuizQuestions();
  return questions.find(q => q.id === id);
}

/**
 * Get questions by axis (X or Y)
 * @param axis - 'X' for Damsel→Heroine, 'Y' for Sweet→Fierce  
 * @returns Array of questions for that axis
 */
export function getQuestionsByAxis(axis: 'X' | 'Y'): QuizQuestion[] {
  const questions = loadQuizQuestions();
  return questions.filter(q => q.axis === axis);
}

/**
 * Get questions by type (multiple or forced choice)
 * @param type - 'multiple' for 4-option questions, 'forced' for 2-3 option questions
 * @returns Array of questions of that type
 */
export function getQuestionsByType(type: 'multiple' | 'forced'): QuizQuestion[] {
  const questions = loadQuizQuestions();
  return questions.filter(q => q.type === type);
}

/**
 * Prepare questions for quiz taking - shuffle multiple choice options
 * @param questions - Raw quiz questions
 * @returns Questions with shuffled options where applicable
 */
export function prepareQuestionsForQuiz(questions: QuizQuestion[]): ShuffledQuestion[] {
  return questions.map(question => {
    // Only shuffle multiple-choice questions (not forced choice)
    if (question.type === 'multiple') {
      return {
        ...question,
        shuffledOptions: shuffle(question.options)
      };
    }
    
    // Forced choice questions keep original order
    return {
      ...question,
      shuffledOptions: question.options // Keep original order for forced choice
    };
  });
}

/**
 * Get quiz statistics
 * @returns Object with quiz metadata
 */
export function getQuizStats() {
  const questions = loadQuizQuestions();
  const xQuestions = getQuestionsByAxis('X');
  const yQuestions = getQuestionsByAxis('Y');
  const multipleChoice = getQuestionsByType('multiple');
  const forcedChoice = getQuestionsByType('forced');
  const reverseQuestions = questions.filter(q => q.reverse);
  
  return {
    totalQuestions: questions.length,
    xAxisQuestions: xQuestions.length,
    yAxisQuestions: yQuestions.length,
    multipleChoiceQuestions: multipleChoice.length,
    forcedChoiceQuestions: forcedChoice.length,
    reverseQuestions: reverseQuestions.length,
    questionIds: questions.map(q => q.id).sort(),
  };
}

/**
 * Validate quiz data structure and content
 * Throws error if data is invalid
 */
function validateQuizData(questions: any[]): void {
  if (!Array.isArray(questions)) {
    throw new Error('Quiz data must be an array of questions');
  }
  
  if (questions.length === 0) {
    throw new Error('Quiz data cannot be empty');
  }
  
  // Validate each question
  questions.forEach((question, index) => {
    if (!question || typeof question !== 'object') {
      throw new Error(`Question at index ${index} is not a valid object`);
    }
    
    // Check required fields
    const required = ['id', 'text', 'axis', 'type', 'reverse', 'options'];
    for (const field of required) {
      if (!(field in question)) {
        throw new Error(`Question ${question.id || index} missing required field: ${field}`);
      }
    }
    
    // Validate field types and values
    if (typeof question.id !== 'number') {
      throw new Error(`Question ${index} has invalid id (must be number)`);
    }
    
    if (typeof question.text !== 'string' || question.text.trim() === '') {
      throw new Error(`Question ${question.id} has invalid text`);
    }
    
    if (!['X', 'Y'].includes(question.axis)) {
      throw new Error(`Question ${question.id} has invalid axis (must be 'X' or 'Y')`);
    }
    
    if (!['multiple', 'forced'].includes(question.type)) {
      throw new Error(`Question ${question.id} has invalid type (must be 'multiple' or 'forced')`);
    }
    
    if (typeof question.reverse !== 'boolean') {
      throw new Error(`Question ${question.id} has invalid reverse field (must be boolean)`);
    }
    
    // Validate options
    if (!Array.isArray(question.options) || question.options.length === 0) {
      throw new Error(`Question ${question.id} has invalid options array`);
    }
    
    question.options.forEach((option: any, optionIndex: number) => {
      if (!option || typeof option !== 'object') {
        throw new Error(`Question ${question.id} option ${optionIndex} is invalid`);
      }
      
      if (typeof option.text !== 'string' || option.text.trim() === '') {
        throw new Error(`Question ${question.id} option ${optionIndex} has invalid text`);
      }
      
      if (typeof option.value !== 'number' || option.value < 0 || option.value > 100) {
        throw new Error(`Question ${question.id} option ${optionIndex} has invalid value (must be 0-100)`);
      }
    });
  });
  
  // Check for duplicate IDs
  const ids = questions.map(q => q.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    throw new Error('Quiz contains duplicate question IDs');
  }
  
  // Validate expected question count (from guide: 16 questions)
  if (questions.length !== 16) {
    console.warn(`Expected 16 questions, got ${questions.length}`);
  }
  
  console.log('✅ Quiz data validation passed');
}
