import { useState, useCallback, useEffect } from 'react';
import { QuizState, QuizResult, ShuffledQuestion } from '../types/quiz';
import { loadQuizQuestions, prepareQuestionsForQuiz } from '../data/quizData';
import { generateQuizResult, isQuizComplete, getCompletionPercentage } from '../data/quizScoring';

/**
 * Custom hook for managing quiz state and interactions
 * Handles question navigation, answer storage, and completion logic
 */
export function useQuiz() {
  // Core quiz state
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: new Map<number, number>(),
    isComplete: false,
    isStarted: false
  });
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>([]);

  /**
   * Initialize the quiz - load questions and prepare for taking
   */
  const initializeQuiz = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const questions = loadQuizQuestions();
      const shuffled = prepareQuestionsForQuiz(questions);
      
      setQuizState({
        questions,
        currentQuestionIndex: 0,
        userAnswers: new Map(),
        isComplete: false,
        isStarted: false
      });
      
      setShuffledQuestions(shuffled);
      console.log('✅ Quiz initialized with', questions.length, 'questions');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize quiz';
      setError(errorMessage);
      console.error('❌ Quiz initialization failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Start the quiz
   */
  const startQuiz = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      isStarted: true,
      currentQuestionIndex: 0
    }));
  }, []);

  /**
   * Record an answer for the current question
   */
  const answerQuestion = useCallback((questionId: number, selectedValue: number) => {
    setQuizState(prev => {
      const newAnswers = new Map(prev.userAnswers);
      newAnswers.set(questionId, selectedValue);
      
      const complete = isQuizComplete(newAnswers);
      
      return {
        ...prev,
        userAnswers: newAnswers,
        isComplete: complete
      };
    });
  }, []);

  /**
   * Navigate to next question
   */
  const nextQuestion = useCallback(() => {
    setQuizState(prev => {
      const nextIndex = Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1);
      return {
        ...prev,
        currentQuestionIndex: nextIndex
      };
    });
  }, []);

  /**
   * Navigate to previous question  
   */
  const previousQuestion = useCallback(() => {
    setQuizState(prev => {
      const prevIndex = Math.max(prev.currentQuestionIndex - 1, 0);
      return {
        ...prev,
        currentQuestionIndex: prevIndex
      };
    });
  }, []);

  /**
   * Jump to a specific question by index
   */
  const goToQuestion = useCallback((index: number) => {
    setQuizState(prev => {
      const validIndex = Math.max(0, Math.min(index, prev.questions.length - 1));
      return {
        ...prev,
        currentQuestionIndex: validIndex
      };
    });
  }, []);

  /**
   * Get the current question with shuffled options
   */
  const getCurrentQuestion = useCallback((): ShuffledQuestion | null => {
    if (shuffledQuestions.length === 0 || quizState.currentQuestionIndex >= shuffledQuestions.length) {
      return null;
    }
    return shuffledQuestions[quizState.currentQuestionIndex];
  }, [shuffledQuestions, quizState.currentQuestionIndex]);

  /**
   * Get the user's answer for the current question
   */
  const getCurrentAnswer = useCallback((): number | undefined => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return undefined;
    
    return quizState.userAnswers.get(currentQuestion.id);
  }, [getCurrentQuestion, quizState.userAnswers]);

  /**
   * Check if user can navigate forward
   */
  const canGoForward = useCallback((): boolean => {
    return quizState.currentQuestionIndex < quizState.questions.length - 1;
  }, [quizState.currentQuestionIndex, quizState.questions.length]);

  /**
   * Check if user can navigate backward
   */
  const canGoBack = useCallback((): boolean => {
    return quizState.currentQuestionIndex > 0;
  }, [quizState.currentQuestionIndex]);

  /**
   * Get completion percentage
   */
  const getProgress = useCallback(() => {
    const percentage = getCompletionPercentage(quizState.userAnswers);
    return {
      current: quizState.currentQuestionIndex + 1,
      total: quizState.questions.length,
      percentage,
      answered: quizState.userAnswers.size
    };
  }, [quizState.currentQuestionIndex, quizState.questions.length, quizState.userAnswers]);

  /**
   * Calculate final quiz result
   */
  const calculateResult = useCallback((): QuizResult | null => {
    if (!quizState.isComplete) return null;
    
    try {
      return generateQuizResult(quizState.userAnswers);
    } catch (err) {
      console.error('❌ Failed to calculate quiz result:', err);
      setError('Failed to calculate quiz result');
      return null;
    }
  }, [quizState.isComplete, quizState.userAnswers]);

  /**
   * Reset quiz to initial state
   */
  const resetQuiz = useCallback(() => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      userAnswers: new Map(),
      isComplete: false,
      isStarted: false
    }));
    setError(null);
  }, []);

  /**
   * Restart quiz (reset and reinitialize)
   */
  const restartQuiz = useCallback(async () => {
    resetQuiz();
    await initializeQuiz();
  }, [resetQuiz, initializeQuiz]);

  // Initialize quiz on mount
  useEffect(() => {
    initializeQuiz();
  }, [initializeQuiz]);

  // Return hook interface
  return {
    // State
    isLoading,
    error,
    isStarted: quizState.isStarted,
    isComplete: quizState.isComplete,
    currentQuestionIndex: quizState.currentQuestionIndex,
    totalQuestions: quizState.questions.length,
    
    // Current question data
    currentQuestion: getCurrentQuestion(),
    currentAnswer: getCurrentAnswer(),
    
    // Navigation
    canGoForward: canGoForward(),
    canGoBack: canGoBack(),
    progress: getProgress(),
    
    // Actions
    startQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    calculateResult,
    resetQuiz,
    restartQuiz,
    initializeQuiz,
    
    // Utility
    userAnswers: quizState.userAnswers,
    allQuestions: quizState.questions,
    shuffledQuestions
  };
}

/**
 * Helper hook for quiz navigation only (lighter weight)
 */
export function useQuizNavigation(totalQuestions: number, currentIndex: number) {
  const canGoForward = currentIndex < totalQuestions - 1;
  const canGoBack = currentIndex > 0;
  const progress = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  
  return {
    canGoForward,
    canGoBack,
    progress,
    current: currentIndex + 1,
    total: totalQuestions
  };
}
