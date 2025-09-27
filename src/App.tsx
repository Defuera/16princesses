import React from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import PrincessList from './components/PrincessList';
import PrincessGraph from './components/PrincessGraph';
import PrincessMessage from './components/PrincessMessage';
import QuizStart from './components/quiz/QuizStart';
import QuizQuestion from './components/quiz/QuizQuestion';
import QuizProgress from './components/quiz/QuizProgress';
import QuizResults from './components/quiz/QuizResults';
import { getAllPrincesses, getPrincessById } from './data/princessData';
import { useQuiz } from './hooks/useQuiz';
import './styles/index.css';
import './styles/components.css';
import './styles/quiz.css';

const ResultPage: React.FC = () => {
  const { princessId } = useParams<{ princessId: string }>();
  const allPrincesses = getAllPrincesses();
  const selectedPrincess = princessId ? getPrincessById(princessId) : undefined;

  if (!selectedPrincess) {
    return (
      <div className="error-container">
        <h2>Princess not found!</h2>
        <p>The princess you're looking for doesn't exist.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="back-button"
        >
          Back to Princess Selection
        </button>
      </div>
    );
  }

  return (
    <div className="result-page">
      <div className="result-content">
        <div className="graph-section">
          <PrincessGraph 
            princesses={allPrincesses}
            selectedPrincess={selectedPrincess}
          />
        </div>
        <div className="message-section">
          <PrincessMessage princess={selectedPrincess} />
        </div>
      </div>
    </div>
  );
};

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
        canGoBack={canGoBack}
        canGoForward={canGoForward || isComplete}
        onPrevious={previousQuestion}
        onNext={nextQuestion}
        onSubmit={handleSubmitQuiz}
        isComplete={isComplete}
        hasCurrentAnswer={currentAnswer !== undefined}
      />
      
      <QuizQuestion
        question={currentQuestion}
        selectedValue={currentAnswer}
        onAnswerSelect={answerQuestion}
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
          
          {/* Legacy princess selection (keep for compatibility) */}
          <Route path="/princesses" element={<PrincessList />} />
          <Route path="/result/:princessId" element={<ResultPage />} />
          
          {/* 404 handler */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
