/**
 * Component Contract: AnimatedResultsGraph
 * 
 * Defines the interface for the step-by-step animated graph component
 * that displays user quiz results with cross-axis line animations.
 */

import { QuizResult } from '../../../src/types/quiz';

export interface AnimatedResultsGraphProps {
  /** User's quiz result containing scores and matched princess */
  quizResult: QuizResult;
  
  /** Callback fired when all animations complete */
  onAnimationComplete?: () => void;
  
  /** Callback fired when user interacts to skip animation */
  onUserInteraction?: () => void;
  
  /** Respect user's reduced motion preference */
  reducedMotion?: boolean;
  
  /** Optional CSS class name for styling */
  className?: string;
}

export interface AnimatedResultsGraphRef {
  /** Programmatically skip to final animation state */
  skipToEnd: () => void;
  
  /** Get current animation progress (0-1) */
  getProgress: () => number;
  
  /** Reset animation to initial state */
  reset: () => void;
}

/**
 * Animation State Contract
 * Internal state management for the animation sequence
 */
export interface AnimationState {
  phase: AnimationPhase;
  xProgress: number;        // 0-100
  yProgress: number;        // 0-100
  showIntersection: boolean;
  showRevealMessage: boolean;
  showOtherPrincesses: boolean;
  isSkippable: boolean;
}

export enum AnimationPhase {
  IDLE = 'idle',
  X_AXIS = 'x-axis',
  Y_AXIS = 'y-axis', 
  INTERSECTION = 'intersection',
  REVEAL = 'reveal',
  OTHER_PRINCESSES = 'other-princesses',
  COMPLETE = 'complete'
}

/**
 * Behavioral Requirements (from spec FR-001 to FR-008, FR-013)
 */
export interface AnimatedResultsGraphBehavior {
  // FR-001: Display cross-axis graph with labeled axes
  renderAxes(): void;
  
  // FR-002: Animate horizontal line over 1.5 seconds
  animateXAxis(targetX: number): Promise<void>;
  
  // FR-003: Animate vertical line after horizontal completes
  animateYAxis(targetY: number): Promise<void>;
  
  // FR-004: Display prominent marker dot at intersection
  showIntersectionMarker(): void;
  
  // FR-005: Show matched princess name on marker
  displayPrincessName(name: string): void;
  
  // FR-008: Plot other princesses after 2 second delay
  plotOtherPrincesses(delay: number): Promise<void>;
  
  // FR-013: Allow instant completion on user interaction
  handleUserInteraction(): void;
}

/**
 * Accessibility Requirements
 */
export interface AnimatedResultsGraphA11y {
  /** ARIA label for the graph container */
  graphAriaLabel: string;
  
  /** Live region for animation announcements */
  liveRegionText: string;
  
  /** Keyboard navigation support */
  handleKeyDown(event: KeyboardEvent): void;
  
  /** Focus management during animation */
  manageFocus(): void;
}
