import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import QuizResultsPage from '../../src/components/quiz/QuizResultsPage';

// Mock the princess data
vi.mock('../../src/data/princessData', () => ({
  getPrincessById: vi.fn(),
  getAllPrincesses: vi.fn(),
}));

// Mock the QuizResults component
vi.mock('../../src/components/quiz/QuizResults', () => ({
  default: vi.fn(({ quizResult, onRetakeQuiz }) => (
    <div data-testid="quiz-results">
      <h1>Quiz Results for {quizResult.matchedPrincess.name}</h1>
      <button onClick={onRetakeQuiz}>Retake Quiz</button>
    </div>
  )),
}));

// Mock React Router's useParams and useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ princessId: 'jasmine' }),
    useNavigate: () => mockNavigate,
  };
});

describe('QuizResultsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    render(
      <MemoryRouter>
        <QuizResultsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display quiz results for valid princess ID', async () => {
    const { getPrincessById } = await import('../../src/data/princessData');

    // Mock successful princess lookup
    (getPrincessById as any).mockReturnValue({
      id: 'jasmine',
      name: 'Jasmine',
      source: 'Aladdin',
      heroineScore: 28,
      bitchScore: 72,
      description: 'Palace rebel with a tiger sidekick...',
      imageUrl: '/images/jasmine.jpg',
      personalityMessage: 'You\'re a balanced trailblazer! ✨'
    });

    render(
      <MemoryRouter>
        <QuizResultsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('quiz-results')).toBeInTheDocument();
      expect(screen.getByText('Quiz Results for Jasmine')).toBeInTheDocument();
    });
  });

  it('should redirect to main quiz for invalid princess ID', async () => {
    const { getPrincessById } = await import('../../src/data/princessData');

    // Mock failed princess lookup
    (getPrincessById as any).mockReturnValue(undefined);

    render(
      <MemoryRouter>
        <QuizResultsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should handle princess data loading error gracefully', async () => {
    const { getPrincessById } = await import('../../src/data/princessData');

    // Mock error during princess lookup
    (getPrincessById as any).mockImplementation(() => {
      throw new Error('Database connection failed');
    });

    render(
      <MemoryRouter>
        <QuizResultsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
