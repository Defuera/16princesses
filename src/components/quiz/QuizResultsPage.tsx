import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPrincessById } from '../../data/princessData';
import { Princess } from '../../types/princess';
import { QuizResult } from '../../types/quiz';
import QuizResults from './QuizResults';

/**
 * QuizResultsPage - Direct URL access to quiz results for specific princess
 *
 * Allows accessing quiz results via URL like /quiz-results/jasmine
 * Provides same experience as post-quiz results but accessible via direct link
 * Handles both direct URL access and navigation from completed quiz
 */
const QuizResultsPage: React.FC = () => {
  const { princessId } = useParams<{ princessId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [princess, setPrincess] = useState<Princess | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have quiz result from navigation state (existing flow)
    const stateQuizResult = location.state?.quizResult;

    if (stateQuizResult) {
      // We have a complete quiz result from navigation
      setQuizResult(stateQuizResult);
      setPrincess(stateQuizResult.matchedPrincess);
      setIsLoading(false);
      return;
    }

    // No quiz result in state - this is direct URL access
    if (!princessId) {
      setError('No princess ID provided');
      setIsLoading(false);
      navigate('/');
      return;
    }

    try {
      // Look up the princess by ID
      const foundPrincess = getPrincessById(princessId);

      if (!foundPrincess) {
        // Invalid princess ID - redirect to main quiz
        console.log(`Invalid princess ID: ${princessId}`);
        navigate('/');
        return;
      }

      // Valid princess - create mock quiz result for direct URL access
      const mockQuizResult: QuizResult = {
        xScore: foundPrincess.heroineScore,
        yScore: foundPrincess.bitchScore,
        matchedPrincess: foundPrincess,
        matchingDistance: 0, // Perfect match for direct access
        totalQuestions: 10,
        answeredQuestions: 10,
      };

      setPrincess(foundPrincess);
      setQuizResult(mockQuizResult);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading princess data:', err);
      setError('Failed to load princess data');
      setIsLoading(false);
      navigate('/');
    }
  }, [princessId, navigate, location.state]);

  // Loading state
  if (isLoading) {
    return (
      <div className="quiz-results-container">
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Error state (shouldn't reach here due to redirects, but safety check)
  if (error || !princess) {
    return (
      <div className="quiz-results-container">
        <div className="error-container">
          <p>Unable to load quiz results</p>
          <button onClick={() => navigate('/')}>Return to Quiz</button>
        </div>
      </div>
    );
  }

  // Render results once we have the quiz result
  if (!quizResult || !princess) {
    return (
      <div className="quiz-results-container">
        <div className="error-container">
          <p>Unable to load quiz results</p>
          <button onClick={() => navigate('/')}>Return to Quiz</button>
        </div>
      </div>
    );
  }

  return (
    <QuizResults
      quizResult={quizResult}
      onRetakeQuiz={() => navigate('/')}
      isLoading={false}
    />
  );
};

export default QuizResultsPage;
