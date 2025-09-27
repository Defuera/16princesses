/**
 * Integration Test: User Interaction Skip Functionality
 * 
 * Tests animation interruption and instant completion behavior
 * Based on quickstart.md Scenario 2 and FR-013 requirement
 * MUST FAIL initially (TDD requirement)
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import QuizResults from '../../src/components/quiz/QuizResults';
import { QuizResult } from '../../src/types/quiz';
import { Princess } from '../../src/types/princess';

// Mock princess data for testing
const mockPrincess: Princess = {
  id: 'test-princess',
  name: 'Test Princess',
  source: 'Test Story',
  feminismPercentage: 75,
  bitchinessPercentage: 60,
  personalityMessage: 'Test message'
};

const mockQuizResult: QuizResult = {
  xScore: 75,
  yScore: 60,
  matchedPrincess: mockPrincess,
  matchingDistance: 5.2,
  totalQuestions: 16,
  answeredQuestions: 16
};

describe('Integration Test: User Interaction Skip Functionality', () => {
  const mockRetakeQuiz = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Animation Skip During X-Axis Phase (FR-013)', () => {
    it('should skip to complete X-axis line on click during horizontal animation', async () => {
      // This test will FAIL until skip functionality is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Start X-axis animation
      vi.advanceTimersByTime(500);
      
      const horizontalLine = screen.getByTestId('x-axis-line');
      expect(horizontalLine).toHaveClass('animate');
      expect(horizontalLine).not.toHaveAttribute('stroke-dashoffset', '0%');

      // Click during animation
      const graph = screen.getByRole('img', { name: /personality graph/i });
      fireEvent.click(graph);

      // Should instantly complete current animation and start next phase
      await waitFor(() => {
        expect(horizontalLine).toHaveAttribute('stroke-dashoffset', '0%');
        expect(horizontalLine).toHaveClass('instant');
      });

      // Y-axis animation should start immediately
      const verticalLine = screen.getByTestId('y-axis-line');
      await waitFor(() => {
        expect(verticalLine).toHaveClass('animate');
      });
    });

    it('should handle keyboard interaction during X-axis animation', async () => {
      // This test will FAIL until keyboard skip is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Start X-axis animation and focus graph
      vi.advanceTimersByTime(500);
      const graph = screen.getByRole('img', { name: /personality graph/i });
      graph.focus();

      // Press Enter or Space to skip
      fireEvent.keyDown(graph, { key: 'Enter' });

      const horizontalLine = screen.getByTestId('x-axis-line');
      await waitFor(() => {
        expect(horizontalLine).toHaveAttribute('stroke-dashoffset', '0%');
      });
    });
  });

  describe('Animation Skip During Y-Axis Phase', () => {
    it('should skip to complete Y-axis line on click during vertical animation', async () => {
      // This test will FAIL until skip functionality is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Complete X-axis and start Y-axis animation
      vi.advanceTimersByTime(2000); // 1.5s + 0.5s into Y-axis

      const verticalLine = screen.getByTestId('y-axis-line');
      expect(verticalLine).toHaveClass('animate');

      // Click during Y-axis animation
      const graph = screen.getByRole('img', { name: /personality graph/i });
      fireEvent.click(graph);

      // Should instantly complete Y-axis and show intersection
      await waitFor(() => {
        expect(verticalLine).toHaveAttribute('stroke-dashoffset', '0%');
        expect(screen.getByTestId('intersection-marker')).toBeInTheDocument();
      });
    });

    it('should maintain proper sequence after Y-axis skip', async () => {
      // This test will FAIL until skip sequence is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Complete X-axis and start Y-axis
      vi.advanceTimersByTime(2000);

      // Skip Y-axis animation
      const graph = screen.getByRole('img', { name: /personality graph/i });
      fireEvent.click(graph);

      // Intersection should appear immediately
      await waitFor(() => {
        expect(screen.getByTestId('intersection-marker')).toBeInTheDocument();
      });

      // Then reveal should still follow proper delay
      expect(screen.queryByText(/test personality description/i)).not.toBeInTheDocument();
      
      vi.advanceTimersByTime(2000); // Reveal delay
      await waitFor(() => {
        expect(screen.getByText(/test personality description/i)).toBeInTheDocument();
      });
    });
  });

  describe('Skip During Reveal Phase', () => {
    it('should skip delay and show princess description immediately', async () => {
      // This test will FAIL until reveal skip is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Complete line animations to reach reveal phase
      vi.advanceTimersByTime(3000);
      
      // Click during reveal delay
      const graph = screen.getByRole('img', { name: /personality graph/i });
      fireEvent.click(graph);

      // Princess description should appear immediately
      await waitFor(() => {
        expect(screen.getByText(/test personality description/i)).toBeInTheDocument();
      });
    });

    it('should continue to other princesses phase after reveal skip', async () => {
      // This test will FAIL until phase progression is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Complete to reveal phase and skip
      vi.advanceTimersByTime(3000);
      const graph = screen.getByRole('img', { name: /personality graph/i });
      fireEvent.click(graph);

      // Should proceed to other princesses after normal delay
      vi.advanceTimersByTime(2000);
      await waitFor(() => {
        expect(screen.getAllByTestId('other-princess-dot').length).toBeGreaterThan(0);
      });
    });
  });

  describe('Skip During Other Princesses Phase', () => {
    it('should skip delay and show other princesses immediately', async () => {
      // This test will FAIL until other princesses skip is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Complete to other princesses delay phase
      vi.advanceTimersByTime(5000);
      
      // Click during other princesses delay
      const graph = screen.getByRole('img', { name: /personality graph/i });
      fireEvent.click(graph);

      // Other princess dots should appear immediately
      await waitFor(() => {
        const otherDots = screen.getAllByTestId('other-princess-dot');
        expect(otherDots.length).toBeGreaterThan(0);
        otherDots.forEach(dot => {
          expect(dot).toHaveClass('show');
        });
      });
    });

    it('should show carousel after other princesses skip', async () => {
      // This test will FAIL until carousel appearance is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Complete to other princesses phase and skip
      vi.advanceTimersByTime(5000);
      const graph = screen.getByRole('img', { name: /personality graph/i });
      fireEvent.click(graph);

      // Carousel should appear with normal fade-in delay
      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(screen.getByRole('region', { name: /princess carousel/i })).toBeInTheDocument();
      });
    });
  });

  describe('Multiple Skip Interactions', () => {
    it('should handle rapid click interactions gracefully', async () => {
      // This test will FAIL until interaction throttling is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      const graph = screen.getByRole('img', { name: /personality graph/i });

      // Rapid clicks during animation
      vi.advanceTimersByTime(500);
      fireEvent.click(graph);
      fireEvent.click(graph);
      fireEvent.click(graph);

      // Should not cause errors or broken animation states
      await waitFor(() => {
        expect(screen.getByTestId('x-axis-line')).toHaveAttribute('stroke-dashoffset', '0%');
      });

      // Continue to next phase normally
      await waitFor(() => {
        expect(screen.getByTestId('y-axis-line')).toHaveClass('animate');
      });
    });

    it('should skip through entire sequence with consecutive clicks', async () => {
      // This test will FAIL until full skip sequence is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      const graph = screen.getByRole('img', { name: /personality graph/i });

      // Skip through all phases rapidly
      const phases = [
        'x-axis-animation',
        'y-axis-animation',
        'reveal-phase',
        'other-princesses-phase'
      ];

      for (const phase of phases) {
        vi.advanceTimersByTime(500);
        fireEvent.click(graph);
        
        await waitFor(() => {
          // Each phase should complete and advance
          expect(screen.getByTestId(phase)).toHaveClass('complete');
        });
      }

      // Final carousel should appear
      vi.advanceTimersByTime(1000);
      await waitFor(() => {
        expect(screen.getByRole('region', { name: /princess carousel/i })).toBeInTheDocument();
      });
    });
  });

  describe('No Animation Glitches or Broken States', () => {
    it('should maintain visual consistency during skips', async () => {
      // This test will FAIL until visual state management is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Skip during X-axis
      vi.advanceTimersByTime(500);
      const graph = screen.getByRole('img', { name: /personality graph/i });
      fireEvent.click(graph);

      // Visual elements should be in correct final state
      await waitFor(() => {
        const horizontalLine = screen.getByTestId('x-axis-line');
        expect(horizontalLine).toHaveAttribute('stroke-dashoffset', '0%');
        expect(horizontalLine).not.toHaveClass('animate');
        expect(horizontalLine).toHaveClass('complete');
      });
    });

    it('should clean up animation timers on skip', async () => {
      // This test will FAIL until timer cleanup is implemented
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Skip during animation
      vi.advanceTimersByTime(500);
      const graph = screen.getByRole('img', { name: /personality graph/i });
      fireEvent.click(graph);

      // Advanced timers should not cause errors
      vi.advanceTimersByTime(10000);
      
      expect(consoleError).not.toHaveBeenCalled();
      consoleError.mockRestore();
    });

    it('should maintain proper focus management during skips', async () => {
      // This test will FAIL until focus management is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      const graph = screen.getByRole('img', { name: /personality graph/i });
      graph.focus();
      
      // Skip through phases
      fireEvent.click(graph);
      
      // Focus should remain on interactive element
      expect(document.activeElement).toBe(graph);
    });
  });

  describe('Accessibility During Interactions', () => {
    it('should announce skip actions to screen readers', async () => {
      // This test will FAIL until skip announcements are implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      vi.advanceTimersByTime(500);
      const graph = screen.getByRole('img', { name: /personality graph/i });
      fireEvent.click(graph);

      // Should announce skip to screen readers
      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent(/animation skipped/i);
      });
    });

    it('should provide skip instructions for users', () => {
      // This test will FAIL until skip instructions are implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Should show skip instructions
      expect(screen.getByText(/click or press enter to skip/i)).toBeInTheDocument();
    });
  });

  describe('Performance During Interactions', () => {
    it('should maintain smooth performance during rapid interactions', async () => {
      // This test will FAIL until performance is optimized
      const performanceMarks: number[] = [];
      const originalRAF = window.requestAnimationFrame;
      
      window.requestAnimationFrame = vi.fn((callback) => {
        performanceMarks.push(Date.now());
        return originalRAF(callback);
      });

      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      const graph = screen.getByRole('img', { name: /personality graph/i });

      // Rapid interactions
      for (let i = 0; i < 10; i++) {
        vi.advanceTimersByTime(100);
        fireEvent.click(graph);
      }

      // Should not cause performance degradation
      const frameIntervals = performanceMarks.slice(1).map((mark, i) => mark - performanceMarks[i]);
      const averageInterval = frameIntervals.reduce((sum, interval) => sum + interval, 0) / frameIntervals.length;
      
      expect(averageInterval).toBeLessThanOrEqual(17); // Maintain 60fps

      window.requestAnimationFrame = originalRAF;
    });
  });
});

/**
 * EXPECTED TEST RESULTS:
 * ❌ ALL TESTS SHOULD FAIL - Skip functionality not implemented yet
 * 
 * This integration test validates user interaction behaviors:
 * 1. Click/keyboard skip during any animation phase
 * 2. Instant completion of current animation
 * 3. Immediate advancement to next phase
 * 4. Proper sequence maintenance after skips
 * 5. Visual consistency without glitches
 * 6. Timer cleanup and performance
 * 7. Accessibility announcements for skip actions
 * 8. Graceful handling of rapid interactions
 */
