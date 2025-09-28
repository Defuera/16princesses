import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import QuizStart from './components/quiz/QuizStart';
import QuizQuestion from './components/quiz/QuizQuestion';
import QuizProgress from './components/quiz/QuizProgress';
import QuizResults from './components/quiz/QuizResults';
import { useQuiz } from './hooks/useQuiz';
import './styles/index.css';
import './styles/components.css';
import './styles/quiz.css';


const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="error-container">
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <button 
        onClick={() => navigate('/')}
        className="back-button"
      >
        Back to Princess Selection
      </button>
    </div>
  );
};

// Quiz Start Page Component  
const QuizStartPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  return <QuizStart onStartQuiz={handleStartQuiz} />;
};

// Quiz Questions Page Component
const QuizQuestionsPage: React.FC = () => {
  const {
    isLoading,
    error,
    isComplete,
    currentQuestion,
    currentAnswer,
    canGoForward,
    canGoBack,
    progress,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    calculateResult,
  } = useQuiz();

  const navigate = useNavigate();

  // Handle quiz completion and navigation to results
  React.useEffect(() => {
    if (isComplete) {
      const result = calculateResult();
      if (result) {
        // Navigate to results with quiz data
        navigate('/quiz-results', { state: { quizResult: result } });
      }
    }
  }, [isComplete, calculateResult, navigate]);

  if (error) {
    return (
      <div className="quiz-error">
        <h2>Quiz Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Back to Start</button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner large"></div>
        <p>Loading question...</p>
      </div>
    );
  }

  const handleSubmitQuiz = () => {
    const result = calculateResult();
    if (result) {
      navigate('/quiz-results', { state: { quizResult: result } });
    }
  };

  return (
    <div className="quiz-page">
      <QuizProgress
        currentQuestion={progress.current}
        totalQuestions={progress.total}
        progressPercentage={progress.percentage}
        hasCurrentAnswer={currentAnswer !== undefined}
        canGoBack={canGoBack}
        canGoForward={canGoForward || isComplete}
        onPrevious={previousQuestion}
        onNext={nextQuestion}
        onSubmit={handleSubmitQuiz}
        isComplete={isComplete}
      />
      
      <QuizQuestion
        question={currentQuestion}
        selectedValue={currentAnswer}
        onAnswerSelect={answerQuestion}
        onAutoAdvance={isComplete ? handleSubmitQuiz : nextQuestion}
        isLoading={isLoading}
      />
    </div>
  );
};

const QuizResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quizResult = location.state?.quizResult;

  if (!quizResult) {
    return (
      <div className="quiz-error">
        <h2>No Quiz Results</h2>
        <p>Please complete the quiz first.</p>
        <button onClick={() => navigate('/')}>Take Quiz</button>
      </div>
    );
  }

  const handleRetakeQuiz = () => {
    navigate('/', { replace: true });
  };

  return (
    <QuizResults 
      quizResult={quizResult} 
      onRetakeQuiz={handleRetakeQuiz}
    />
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/16princesses">
      <div className="App">
        <Routes>
          {/* Quiz flow (new primary flow) */}
          <Route path="/" element={<QuizStartPage />} />
          <Route path="/quiz" element={<QuizQuestionsPage />} />
          <Route path="/quiz-results" element={<QuizResultsPage />} />
          
          
          {/* 404 handler */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
