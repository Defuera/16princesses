/**
 * Component Contract: PrincessRevealCarousel
 * 
 * Defines the interface for the princess reveal and exploration carousel
 * that displays matched princess details and allows browsing all princesses.
 */

import { QuizResult } from '../../../src/types/quiz';
import { Princess } from '../../../src/types/princess';

export interface PrincessRevealCarouselProps {
  /** User's quiz result with matched princess */
  quizResult: QuizResult;
  
  /** All available princesses for exploration */
  allPrincesses: Princess[];
  
  /** Whether to show the main reveal section */
  revealed?: boolean;
  
  /** Callback when user selects a princess from carousel */
  onPrincessSelect?: (princess: Princess) => void;
  
  /** Currently selected princess (for external state sync) */
  selectedPrincess?: Princess | null;
  
  /** Optional CSS class name */
  className?: string;
}

export interface PrincessRevealCarouselRef {
  /** Navigate to specific princess by index */
  navigateTo: (index: number) => void;
  
  /** Navigate to next princess */
  next: () => void;
  
  /** Navigate to previous princess */
  previous: () => void;
  
  /** Get currently selected princess index */
  getCurrentIndex: () => number;
}

/**
 * Carousel State Contract
 * Internal state management for princess selection and navigation
 */
export interface CarouselState {
  selectedIndex: number;
  isVisible: boolean;
  selectedPrincess: Princess | null;
  isTransitioning: boolean;
}

/**
 * Reveal Message Contract
 * Princess personality descriptions from reveal.json
 */
export interface RevealMessage {
  name: string;
  description: string;
}

export interface RevealData {
  princesses: RevealMessage[];
}

/**
 * Behavioral Requirements (from spec FR-006, FR-007, FR-009 to FR-012)
 */
export interface PrincessRevealCarouselBehavior {
  // FR-006: Display personalized princess description from reveal.json
  displayRevealMessage(princess: Princess): void;
  
  // FR-007: Show placeholder image representation
  renderPrincessImage(princess: Princess): void;
  
  // FR-009: Provide interactive carousel for exploration
  renderCarousel(princesses: Princess[]): void;
  
  // FR-010: Click princess to highlight on graph + show description
  handlePrincessClick(princess: Princess): void;
  
  // FR-011: Visually distinguish selected princess
  highlightSelectedPrincess(princess: Princess): void;
  
  // FR-012: Maintain distinction between user's match and others
  distinguishUserMatch(matchedPrincess: Princess): void;
}

/**
 * Navigation Contract
 * Carousel navigation and interaction patterns
 */
export interface CarouselNavigation {
  /** Handle left/right arrow key navigation */
  handleArrowNavigation(direction: 'left' | 'right'): void;
  
  /** Handle Enter/Space key selection */
  handleKeySelection(): void;
  
  /** Handle mouse/touch interactions */
  handlePointerSelection(princess: Princess): void;
  
  /** Navigate with wrap-around (last -> first, first -> last) */
  navigateWithWrapping: boolean;
}

/**
 * Accessibility Requirements
 */
export interface PrincessRevealCarouselA11y {
  /** ARIA label for carousel container */
  carouselAriaLabel: string;
  
  /** ARIA label for current selection */
  selectionAriaLabel: string;
  
  /** Navigation instructions for screen readers */
  navigationInstructions: string;
  
  /** Keyboard navigation support */
  handleKeyDown(event: KeyboardEvent): void;
  
  /** Focus management for carousel items */
  manageFocus(): void;
  
  /** Announce selection changes to screen readers */
  announceSelection(princess: Princess): void;
}

/**
 * Image Placeholder Contract
 * Placeholder representation until real images are available
 */
export interface PrincessImagePlaceholder {
  /** Princess identifier for placeholder */
  princessId: string;
  
  /** Display name for alt text */
  displayName: string;
  
  /** Optional emoji or icon representation */
  iconRepresentation?: string;
  
  /** Accessibility description */
  altText: string;
}
