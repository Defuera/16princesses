/**
 * Integration Test: Basic Animation Sequence
 * 
 * Tests the complete animation flow from quiz completion to carousel
 * Based on quickstart.md Scenario 1
 * MUST FAIL initially (TDD requirement)
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

// Mock reveal.json data
vi.mock('../../docs/reveal.json', () => ({
  default: {
    princesses: [
      {
        name: 'Test Princess',
        description: 'Test personality description from reveal.json'
      }
    ]
  }
}));

describe('Integration Test: Basic Animation Sequence', () => {
  const mockRetakeQuiz = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset any animation timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Complete Animation Flow (Quickstart Scenario 1)', () => {
    it('should display cross-axis graph with labeled axes', async () => {
      // This test will FAIL until AnimatedResultsGraph is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Should show cross-axis graph
      expect(screen.getByRole('img', { name: /personality graph/i })).toBeInTheDocument();
      
      // Should have proper axis labels  
      expect(screen.getByText(/damsel.*heroine/i)).toBeInTheDocument();
      expect(screen.getByText(/sweet.*bitch/i)).toBeInTheDocument();
    });

    it('should animate horizontal line from 0% to user X-score (1.5s)', async () => {
      // This test will FAIL until animation is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Initially, line should not be visible or at 0%
      const horizontalLine = screen.getByTestId('x-axis-line');
      expect(horizontalLine).toHaveAttribute('stroke-dashoffset', '100%');

      // After animation starts, line should begin moving
      vi.advanceTimersByTime(100);
      await waitFor(() => {
        expect(horizontalLine).toHaveClass('animate');
      });

      // After 1.5 seconds, horizontal line should be complete
      vi.advanceTimersByTime(1500);
      await waitFor(() => {
        expect(horizontalLine).toHaveAttribute('stroke-dashoffset', '0%');
      });
    });

    it('should animate vertical line after horizontal completes (1.5s)', async () => {
      // This test will FAIL until animation is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      const verticalLine = screen.getByTestId('y-axis-line');
      
      // Initially, vertical line should not be animating
      expect(verticalLine).toHaveAttribute('stroke-dashoffset', '100%');

      // Complete horizontal animation (1.5s)
      vi.advanceTimersByTime(1500);
      
      // Vertical animation should start
      await waitFor(() => {
        expect(verticalLine).toHaveClass('animate');
      });

      // After another 1.5 seconds, vertical line should be complete
      vi.advanceTimersByTime(1500);
      await waitFor(() => {
        expect(verticalLine).toHaveAttribute('stroke-dashoffset', '0%');
      });
    });

    it('should show intersection marker with princess name', async () => {
      // This test will FAIL until intersection marker is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Complete both line animations (3s total)
      vi.advanceTimersByTime(3000);

      // Intersection marker should appear
      await waitFor(() => {
        expect(screen.getByTestId('intersection-marker')).toBeInTheDocument();
      });

      // Princess name should be displayed
      expect(screen.getByText(mockPrincess.name)).toBeInTheDocument();
    });

    it('should reveal princess description below graph (2s delay)', async () => {
      // This test will FAIL until reveal functionality is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Complete line animations and intersection (3s)
      vi.advanceTimersByTime(3000);

      // Description should not be visible immediately
      expect(screen.queryByText(/test personality description/i)).not.toBeInTheDocument();

      // After 2 second delay, description should appear
      vi.advanceTimersByTime(2000);
      await waitFor(() => {
        expect(screen.getByText(/test personality description/i)).toBeInTheDocument();
      });
    });

    it('should plot other princesses as smaller dots (2s delay)', async () => {
      // This test will FAIL until other princess plotting is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Complete main animation sequence (5s: lines + intersection + reveal)
      vi.advanceTimersByTime(5000);

      // Other princess dots should not be visible yet
      expect(screen.queryAllByTestId('other-princess-dot')).toHaveLength(0);

      // After 2 second delay, other princesses should appear
      vi.advanceTimersByTime(2000);
      await waitFor(() => {
        const otherDots = screen.getAllByTestId('other-princess-dot');
        expect(otherDots.length).toBeGreaterThan(0);
        otherDots.forEach(dot => {
          expect(dot).toHaveClass('show');
        });
      });
    });

    it('should show interactive carousel for exploration', async () => {
      // This test will FAIL until carousel is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Complete full animation sequence (7s total)
      vi.advanceTimersByTime(7000);

      // Carousel should be visible
      await waitFor(() => {
        expect(screen.getByRole('region', { name: /princess carousel/i })).toBeInTheDocument();
      });

      // Navigation controls should be present
      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });
  });

  describe('Animation Timing Validation', () => {
    it('should follow specified timing: 1.5s lines + 2s delays', async () => {
      const onAnimationComplete = vi.fn();
      
      // This test will FAIL until timing is implemented correctly
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // Timeline validation:
      // 0-1.5s: X-axis line animation
      // 1.5-3.0s: Y-axis line animation  
      // 3.0s: Intersection marker appears
      // 3.0-5.0s: 2s delay for reveal
      // 5.0s: Princess description appears
      // 5.0-7.0s: 2s delay for other princesses
      // 7.0s: Other princesses appear
      // 8.0s: Carousel appears (1s fade in)

      const timeline = [
        { time: 1500, expected: 'x-line-complete' },
        { time: 3000, expected: 'y-line-complete' },
        { time: 3000, expected: 'intersection-visible' },
        { time: 5000, expected: 'reveal-visible' },
        { time: 7000, expected: 'other-princesses-visible' },
        { time: 8000, expected: 'carousel-visible' }
      ];

      for (const checkpoint of timeline) {
        vi.advanceTimersByTime(checkpoint.time);
        
        switch (checkpoint.expected) {
          case 'x-line-complete':
            await waitFor(() => {
              expect(screen.getByTestId('x-axis-line')).toHaveAttribute('stroke-dashoffset', '0%');
            });
            break;
          case 'y-line-complete':
            await waitFor(() => {
              expect(screen.getByTestId('y-axis-line')).toHaveAttribute('stroke-dashoffset', '0%');
            });
            break;
          case 'intersection-visible':
            await waitFor(() => {
              expect(screen.getByTestId('intersection-marker')).toBeInTheDocument();
            });
            break;
          case 'reveal-visible':
            await waitFor(() => {
              expect(screen.getByText(/test personality description/i)).toBeInTheDocument();
            });
            break;
          case 'other-princesses-visible':
            await waitFor(() => {
              expect(screen.getAllByTestId('other-princess-dot').length).toBeGreaterThan(0);
            });
            break;
          case 'carousel-visible':
            await waitFor(() => {
              expect(screen.getByRole('region', { name: /princess carousel/i })).toBeInTheDocument();
            });
            break;
        }
      }
    });

    it('should maintain smooth 60fps animation performance', async () => {
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

      // Run animation for 1 second
      vi.advanceTimersByTime(1000);
      
      // Should maintain ~60fps (16.67ms per frame)
      const frameIntervals = performanceMarks.slice(1).map((mark, i) => mark - performanceMarks[i]);
      const averageInterval = frameIntervals.reduce((sum, interval) => sum + interval, 0) / frameIntervals.length;
      
      expect(averageInterval).toBeLessThanOrEqual(17); // Allow slight variance from 16.67ms

      window.requestAnimationFrame = originalRAF;
    });
  });

  describe('User Experience Validation', () => {
    it('should create engaging step-by-step reveal experience', async () => {
      // This test will FAIL until full experience is implemented
      render(
        <MemoryRouter>
          <QuizResults 
            quizResult={mockQuizResult} 
            onRetakeQuiz={mockRetakeQuiz}
          />
        </MemoryRouter>
      );

      // User should see progressive disclosure
      expect(screen.getByRole('img', { name: /personality graph/i })).toBeInTheDocument();
      
      // Each phase should build anticipation
      const phases = [
        'x-axis-animation',
        'y-axis-animation', 
        'intersection-reveal',
        'princess-description',
        'other-princesses',
        'exploration-carousel'
      ];

      for (let i = 0; i < phases.length; i++) {
        vi.advanceTimersByTime(i < 2 ? 1500 : 2000);
        
        await waitFor(() => {
          expect(screen.getByTestId(phases[i])).toBeInTheDocument();
        });
      }
    });
  });
});

/**
 * EXPECTED TEST RESULTS:
 * ❌ ALL TESTS SHOULD FAIL - Components not implemented yet
 * 
 * This integration test validates the complete animation sequence:
 * 1. Cross-axis graph with proper labels
 * 2. Sequential line animations (1.5s each)
 * 3. Intersection marker with princess name
 * 4. Princess description reveal (2s delay)
 * 5. Other princesses plotting (2s delay)
 * 6. Interactive carousel appearance
 * 7. Proper timing and performance
 * 8. Engaging user experience flow
 */
