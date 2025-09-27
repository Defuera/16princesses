/**
 * Integration Test: Carousel Interaction and Graph Highlighting
 * 
 * Tests princess exploration carousel and graph synchronization
 * Based on quickstart.md Scenario 3 and FR-009 to FR-011
 * MUST FAIL initially (TDD requirement)
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import QuizResults from '../../src/components/quiz/QuizResults';
import { QuizResult } from '../../src/types/quiz';
import { Princess } from '../../src/types/princess';

// Mock multiple princesses for carousel testing
const mockPrincesses: Princess[] = [
  {
    id: 'princess-1',
    name: 'Test Princess 1',
    source: 'Test Story 1',
    feminismPercentage: 75,
    bitchinessPercentage: 60,
    personalityMessage: 'Test message 1'
  },
  {
    id: 'princess-2',
    name: 'Test Princess 2',
    source: 'Test Story 2', 
    feminismPercentage: 40,
    bitchinessPercentage: 80,
    personalityMessage: 'Test message 2'
  },
  {
    id: 'princess-3',
    name: 'Test Princess 3',
    source: 'Test Story 3',
    feminismPercentage: 90,
    bitchinessPercentage: 30,
    personalityMessage: 'Test message 3'
  }
];

const mockQuizResult: QuizResult = {
  xScore: 75,
  yScore: 60,
  matchedPrincess: mockPrincesses[0], // User matches first princess
  matchingDistance: 5.2,
  totalQuestions: 16,
  answeredQuestions: 16
};

// Mock reveal.json data
vi.mock('../../docs/reveal.json', () => ({
  default: {
    princesses: [
      { name: 'Test Princess 1', description: 'Reveal description 1' },
      { name: 'Test Princess 2', description: 'Reveal description 2' },
      { name: 'Test Princess 3', description: 'Reveal description 3' }
    ]
  }
}));

// Mock getAllPrincesses to return our test data
vi.mock('../../src/data/princessData', () => ({
  getAllPrincesses: () => mockPrincesses
}));

describe('Integration Test: Carousel Interaction and Graph Highlighting', () => {
  const mockRetakeQuiz = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Princess Selection and Graph Highlighting (FR-010)', () => {
    it('should highlight clicked princess on graph', async () => {
      // This test will FAIL until carousel and highlighting are implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Complete animation to reach carousel phase
      vi.advanceTimersByTime(8000);
      await waitFor(() => {
        expect(screen.getByRole('region', { name: /princess carousel/i })).toBeInTheDocument();
      });

      // Click on different princess in carousel
      const princess2Button = screen.getByRole('button', { name: /Test Princess 2/i });
      fireEvent.click(princess2Button);

      // Should highlight Princess 2 on graph
      await waitFor(() => {
        const princess2Dot = screen.getByTestId('princess-dot-princess-2');
        expect(princess2Dot).toHaveClass('highlighted');
        expect(princess2Dot).toHaveAttribute('stroke-width', '3');
      });

      // Should update description below carousel
      expect(screen.getByText(/Reveal description 2/i)).toBeInTheDocument();
    });

    it('should maintain user match distinction while allowing selection', async () => {
      // This test will FAIL until visual distinction is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Complete animation to carousel
      vi.advanceTimersByTime(8000);

      // User's matched princess should always be distinguished
      const userMatchButton = screen.getByRole('button', { name: /Test Princess 1/i });
      expect(userMatchButton).toHaveClass('user-match');

      // Click on different princess
      const princess2Button = screen.getByRole('button', { name: /Test Princess 2/i });
      fireEvent.click(princess2Button);

      // User match should still be distinguished even when another is selected
      await waitFor(() => {
        expect(userMatchButton).toHaveClass('user-match');
        expect(princess2Button).toHaveClass('selected');
        expect(princess2Button).not.toHaveClass('user-match');
      });
    });

    it('should synchronize carousel selection with graph highlighting', async () => {
      // This test will FAIL until synchronization is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      vi.advanceTimersByTime(8000);

      // Select princess in carousel
      const princess3Button = screen.getByRole('button', { name: /Test Princess 3/i });
      fireEvent.click(princess3Button);

      await waitFor(() => {
        // Graph dot should be highlighted
        const princess3Dot = screen.getByTestId('princess-dot-princess-3');
        expect(princess3Dot).toHaveClass('highlighted');
        
        // Carousel item should be selected
        expect(princess3Button).toHaveClass('selected');
        
        // Description should update
        expect(screen.getByText(/Reveal description 3/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Controls (FR-009)', () => {
    it('should navigate with previous/next buttons', async () => {
      // This test will FAIL until navigation controls are implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      vi.advanceTimersByTime(8000);

      // Get navigation buttons
      const nextButton = screen.getByRole('button', { name: /next/i });
      const prevButton = screen.getByRole('button', { name: /previous/i });

      // Navigate forward
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Test Princess 2/i)).toHaveClass('active');
      });

      // Navigate backward
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText(/Test Princess 1/i)).toHaveClass('active');
      });
    });

    it('should support keyboard navigation with arrow keys', async () => {
      // This test will FAIL until keyboard navigation is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      vi.advanceTimersByTime(8000);

      const carousel = screen.getByRole('region', { name: /princess carousel/i });
      carousel.focus();

      // Use arrow keys to navigate
      fireEvent.keyDown(carousel, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(screen.getByText(/Test Princess 2/i)).toHaveClass('active');
        expect(screen.getByTestId('princess-dot-princess-2')).toHaveClass('highlighted');
      });

      fireEvent.keyDown(carousel, { key: 'ArrowLeft' });

      await waitFor(() => {
        expect(screen.getByText(/Test Princess 1/i)).toHaveClass('active');
      });
    });

    it('should wrap around navigation (last to first, first to last)', async () => {
      // This test will FAIL until wrap-around is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      vi.advanceTimersByTime(8000);

      const nextButton = screen.getByRole('button', { name: /next/i });

      // Navigate past the last princess
      for (let i = 0; i < mockPrincesses.length; i++) {
        fireEvent.click(nextButton);
      }

      // Should wrap around to first princess
      await waitFor(() => {
        expect(screen.getByText(/Test Princess 1/i)).toHaveClass('active');
      });

      // Test reverse wrap-around
      const prevButton = screen.getByRole('button', { name: /previous/i });
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText(/Test Princess 3/i)).toHaveClass('active');
      });
    });
  });

  describe('Enhanced Visual Highlighting (FR-011)', () => {
    it('should provide enhanced highlighting for selected princess', async () => {
      // This test will FAIL until enhanced highlighting is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      vi.advanceTimersByTime(8000);

      // Select a princess
      const princess2Button = screen.getByRole('button', { name: /Test Princess 2/i });
      fireEvent.click(princess2Button);

      await waitFor(() => {
        const princess2Dot = screen.getByTestId('princess-dot-princess-2');
        
        // Enhanced visual styling
        expect(princess2Dot).toHaveClass('highlighted');
        expect(princess2Dot).toHaveAttribute('r', '8'); // Larger radius
        expect(princess2Dot).toHaveAttribute('stroke-width', '3'); // Thicker border
        expect(princess2Dot).toHaveStyle({ fill: '#007bff' }); // Highlight color
      });
    });

    it('should remove highlighting when selecting different princess', async () => {
      // This test will FAIL until highlight management is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      vi.advanceTimersByTime(8000);

      // Select first princess
      const princess1Button = screen.getByRole('button', { name: /Test Princess 1/i });
      fireEvent.click(princess1Button);

      // Select second princess
      const princess2Button = screen.getByRole('button', { name: /Test Princess 2/i });
      fireEvent.click(princess2Button);

      await waitFor(() => {
        // First princess should no longer be highlighted (unless it's user match)
        const princess1Dot = screen.getByTestId('princess-dot-princess-1');
        const princess2Dot = screen.getByTestId('princess-dot-princess-2');
        
        if (princess1Dot !== screen.getByTestId('user-marker')) {
          expect(princess1Dot).not.toHaveClass('highlighted');
        }
        expect(princess2Dot).toHaveClass('highlighted');
      });
    });
  });

  describe('Description Updates', () => {
    it('should update princess description when selection changes', async () => {
      // This test will FAIL until description updates are implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      vi.advanceTimersByTime(8000);

      // Initial state should show user's matched princess
      expect(screen.getByText(/Reveal description 1/i)).toBeInTheDocument();

      // Select different princess
      const princess3Button = screen.getByRole('button', { name: /Test Princess 3/i });
      fireEvent.click(princess3Button);

      await waitFor(() => {
        // Description should update to selected princess
        expect(screen.queryByText(/Reveal description 1/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Reveal description 3/i)).toBeInTheDocument();
      });

      // Princess details should also update
      expect(screen.getByText(/Test Story 3/i)).toBeInTheDocument();
      expect(screen.getByText(/90% Heroine/i)).toBeInTheDocument();
      expect(screen.getByText(/30% Bitch/i)).toBeInTheDocument();
    });

    it('should handle missing reveal data gracefully', async () => {
      // This test will FAIL until fallback handling is implemented
      
      // Mock missing reveal data
      vi.doMock('../../docs/reveal.json', () => ({
        default: {
          princesses: [
            { name: 'Test Princess 1', description: 'Reveal description 1' }
            // Missing descriptions for other princesses
          ]
        }
      }));

      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      vi.advanceTimersByTime(8000);

      // Select princess without reveal data
      const princess2Button = screen.getByRole('button', { name: /Test Princess 2/i });
      fireEvent.click(princess2Button);

      await waitFor(() => {
        // Should show fallback message
        expect(screen.getByText(/unique princess archetype/i)).toBeInTheDocument();
      });
    });
  });

  describe('Multi-modal Interaction', () => {
    it('should handle both mouse and keyboard interactions seamlessly', async () => {
      // This test will FAIL until multi-modal support is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      vi.advanceTimersByTime(8000);

      const carousel = screen.getByRole('region', { name: /princess carousel/i });

      // Use keyboard to navigate
      carousel.focus();
      fireEvent.keyDown(carousel, { key: 'ArrowRight' });

      await waitFor(() => {
        expect(screen.getByText(/Test Princess 2/i)).toHaveClass('active');
      });

      // Use mouse to select
      const princess3Button = screen.getByRole('button', { name: /Test Princess 3/i });
      fireEvent.click(princess3Button);

      await waitFor(() => {
        expect(screen.getByText(/Test Princess 3/i)).toHaveClass('active');
        expect(princess3Button).toHaveClass('selected');
      });

      // Use keyboard to navigate from new position
      fireEvent.keyDown(carousel, { key: 'ArrowLeft' });

      await waitFor(() => {
        expect(screen.getByText(/Test Princess 2/i)).toHaveClass('active');
      });
    });

    it('should support Enter/Space key selection after keyboard navigation', async () => {
      // This test will FAIL until keyboard selection is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      vi.advanceTimersByTime(8000);

      const carousel = screen.getByRole('region', { name: /princess carousel/i });
      carousel.focus();

      // Navigate with keyboard
      fireEvent.keyDown(carousel, { key: 'ArrowRight' });
      fireEvent.keyDown(carousel, { key: 'ArrowRight' });

      // Select with Enter key
      fireEvent.keyDown(carousel, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText(/Test Princess 3/i)).toHaveClass('selected');
        expect(screen.getByTestId('princess-dot-princess-3')).toHaveClass('highlighted');
      });
    });
  });

  describe('Visual Feedback and Animations', () => {
    it('should provide smooth transitions during selection changes', async () => {
      // This test will FAIL until smooth transitions are implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      vi.advanceTimersByTime(8000);

      const princess2Button = screen.getByRole('button', { name: /Test Princess 2/i });

      // Track transition states
      const princess2Dot = screen.getByTestId('princess-dot-princess-2');
      const initialRadius = princess2Dot.getAttribute('r');

      fireEvent.click(princess2Button);

      // Should have transition classes during animation
      await waitFor(() => {
        expect(princess2Dot).toHaveClass('transitioning');
      });

      // Should reach final highlighted state
      await waitFor(() => {
        expect(princess2Dot).toHaveClass('highlighted');
        expect(princess2Dot.getAttribute('r')).not.toBe(initialRadius);
      });
    });

    it('should provide hover effects for interactive elements', async () => {
      // This test will FAIL until hover effects are implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      vi.advanceTimersByTime(8000);

      const princess2Button = screen.getByRole('button', { name: /Test Princess 2/i });

      // Hover over princess button
      fireEvent.mouseEnter(princess2Button);

      await waitFor(() => {
        expect(princess2Button).toHaveClass('hover');
        // Graph dot should also show hover effect
        expect(screen.getByTestId('princess-dot-princess-2')).toHaveClass('hover');
      });

      fireEvent.mouseLeave(princess2Button);

      await waitFor(() => {
        expect(princess2Button).not.toHaveClass('hover');
      });
    });
  });

  describe('Performance and Responsiveness', () => {
    it('should handle rapid selection changes smoothly', async () => {
      // This test will FAIL until performance is optimized
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      vi.advanceTimersByTime(8000);

      // Rapid selections
      const buttons = [
        screen.getByRole('button', { name: /Test Princess 1/i }),
        screen.getByRole('button', { name: /Test Princess 2/i }),
        screen.getByRole('button', { name: /Test Princess 3/i })
      ];

      for (let i = 0; i < 10; i++) {
        const randomButton = buttons[i % buttons.length];
        fireEvent.click(randomButton);
        vi.advanceTimersByTime(50);
      }

      // Should end in consistent state
      await waitFor(() => {
        const selectedButtons = screen.getAllByRole('button').filter(btn => btn.classList.contains('selected'));
        expect(selectedButtons).toHaveLength(1);
      });
    });

    it('should maintain <100ms interaction response time', async () => {
      // This test will FAIL until response time is optimized
      const startTime = Date.now();
      
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      vi.advanceTimersByTime(8000);

      const princess2Button = screen.getByRole('button', { name: /Test Princess 2/i });
      fireEvent.click(princess2Button);

      await waitFor(() => {
        expect(screen.getByTestId('princess-dot-princess-2')).toHaveClass('highlighted');
      });

      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(100);
    });
  });
});

/**
 * EXPECTED TEST RESULTS:
 * ❌ ALL TESTS SHOULD FAIL - Carousel and highlighting not implemented yet
 * 
 * This integration test validates carousel interactions:
 * 1. Princess selection updates graph highlighting
 * 2. Graph highlighting synchronizes with carousel selection  
 * 3. Enhanced visual highlighting for selected princess
 * 4. Navigation controls (buttons and keyboard)
 * 5. Wrap-around navigation behavior
 * 6. Description updates on selection changes
 * 7. Multi-modal interaction (mouse + keyboard)
 * 8. Smooth transitions and hover effects
 * 9. Performance during rapid interactions
 * 10. Visual distinction between user match and selections
 */
