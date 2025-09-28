/**
 * Animation Types for Polished Results Page
 * 
 * TypeScript interfaces for the animated results graph and carousel components
 * Based on data-model.md specifications
 */

import { Princess } from './princess';
import { QuizResult } from './quiz';

/**
 * Animation sequence phases for the results presentation
 */
export enum AnimationPhase {
  IDLE = 'idle',
  X_AXIS = 'x-axis',
  Y_AXIS = 'y-axis',
  INTERSECTION = 'intersection',
  REVEAL = 'reveal',
  OTHER_PRINCESSES = 'other-princesses',
  CAROUSEL = 'carousel',
  COMPLETE = 'complete'
}

/**
 * State management for step-by-step animation sequence
 */
export interface AnimationState {
  phase: AnimationPhase;
  xProgress: number;        // 0-100, current X-axis line progress
  yProgress: number;        // 0-100, current Y-axis line progress
  showIntersection: boolean;
  showRevealMessage: boolean;
  showOtherPrincesses: boolean;
  showCarousel: boolean;
  isSkippable: boolean;     // User can interact to skip
}

/**
 * Carousel state management for princess exploration
 */
export interface CarouselState {
  selectedIndex: number;
  isVisible: boolean;
  selectedPrincess: Princess | null;
  isTransitioning: boolean;
  highlightedOnGraph: string | null; // Princess ID highlighted on graph
}

/**
 * Princess personality descriptions from reveal.json
 */
export interface RevealMessage {
  name: string;           // Princess name (must match princess data)
  description: string;    // Personality description from reveal.json
}

export interface RevealData {
  princesses: RevealMessage[];
}

/**
 * Animation timing configuration
 * Based on clarifications: 1.5s per line + 2s delays
 */
export interface AnimationTiming {
  lineAnimationDuration: number;    // 1500ms per clarifications
  revealDelay: number;             // 2000ms per clarifications  
  otherPrincessesDelay: number;    // 2000ms per clarifications
  carouselFadeInDelay: number;     // 1000ms for smooth transition
}

export const ANIMATION_TIMING: AnimationTiming = {
  lineAnimationDuration: 1500,
  revealDelay: 2000,
  otherPrincessesDelay: 2000,
  carouselFadeInDelay: 1000,
};

/**
 * Accessibility configuration for dynamic content
 */
export interface AccessibilityProps {
  // ARIA labels for dynamic content
  graphAriaLabel: string;
  animationAnnouncementText: string;
  carouselAriaLabel: string;
  
  // Live region updates
  liveRegionText: string;
  liveRegionPoliteness: 'polite' | 'assertive';
  
  // Keyboard navigation
  focusableElements: HTMLElement[];
  currentFocusIndex: number;
}

/**
 * Error handling for animation and data loading
 */
export interface AnimationError {
  type: 'TIMING_ERROR' | 'DATA_MISSING' | 'RENDER_ERROR';
  message: string;
  recovery: () => void;           // Reset to safe state
}

/**
 * Component prop interfaces based on contracts
 */
export interface AnimatedResultsGraphProps {
  quizResult: QuizResult;
  onAnimationComplete?: () => void;
  onUserInteraction?: (princess: Princess) => void;
  selectedPrincess?: Princess | null;
  reducedMotion?: boolean;
  className?: string;
}

export interface PrincessRevealCarouselProps {
  quizResult: QuizResult;
  allPrincesses: Princess[];
  revealed?: boolean;
  onPrincessSelect?: (princess: Princess) => void;
  selectedPrincess?: Princess | null;
  className?: string;
}
