# Data Model: Polished Results Page

**Feature**: 003-polish-results-page  
**Date**: 2025-09-27

## Core Entities

### AnimationState
Manages the step-by-step animation sequence and timing.

```typescript
interface AnimationState {
  phase: AnimationPhase;
  xProgress: number;        // 0-100, current X-axis line progress
  yProgress: number;        // 0-100, current Y-axis line progress
  showIntersection: boolean;
  showRevealMessage: boolean;
  showOtherPrincesses: boolean;
  showCarousel: boolean;
  isSkippable: boolean;     // User can interact to skip
}

enum AnimationPhase {
  IDLE = 'idle',
  X_AXIS = 'x-axis',       // Horizontal line animating
  Y_AXIS = 'y-axis',       // Vertical line animating  
  INTERSECTION = 'intersection', // Showing user marker
  REVEAL = 'reveal',       // Princess description displayed
  OTHER_PRINCESSES = 'other-princesses', // All dots plotted
  CAROUSEL = 'carousel',   // Interactive exploration
  COMPLETE = 'complete'
}
```

**Validation Rules**:
- `xProgress` and `yProgress` must be 0-100
- `phase` transitions must follow sequence: idle → x-axis → y-axis → intersection → reveal → other-princesses → carousel → complete
- Only one phase can be active at a time

**State Transitions**:
- Auto-advance after timing delays (1.5s for lines, 2s for reveals)
- User interaction skips current phase and advances immediately
- Error states reset to IDLE

### CarouselState
Manages princess selection and exploration in the carousel component.

```typescript
interface CarouselState {
  selectedPrincessIndex: number;  // Index in princess array
  isVisible: boolean;
  selectedPrincess: Princess | null;
  highlightedOnGraph: string | null; // Princess ID highlighted on graph
}
```

**Validation Rules**:
- `selectedPrincessIndex` must be valid array index
- `selectedPrincess` must match the princess at `selectedPrincessIndex`
- `highlightedOnGraph` must be valid princess ID or null

### RevealMessage
Princess personality descriptions from reveal.json with matching logic.

```typescript
interface RevealMessage {
  name: string;           // Princess name (must match princess data)
  description: string;    // Personality description from reveal.json
}

interface RevealData {
  princesses: RevealMessage[];
}
```

**Validation Rules**:
- `name` must exactly match princess names in princess data
- `description` must be non-empty string
- All princesses should have corresponding reveal messages

## Component Contracts

### AnimatedResultsGraph Props

```typescript
interface AnimatedResultsGraphProps {
  quizResult: QuizResult;           // User's quiz scores and matched princess
  onAnimationComplete?: () => void; // Callback when all animations finish
  onUserInteraction?: () => void;   // Callback for skip interactions
  reducedMotion?: boolean;          // Accessibility: respect prefers-reduced-motion
}
```

### PrincessRevealCarousel Props

```typescript
interface PrincessRevealCarouselProps {
  quizResult: QuizResult;
  allPrincesses: Princess[];
  revealed: boolean;                      // Show main result card
  onPrincessSelect?: (princess: Princess) => void; // Graph highlighting callback
  selectedPrincess?: Princess | null;     // Currently selected in carousel
}
```

## Animation Timing Configuration

```typescript
interface AnimationTiming {
  lineAnimationDuration: number;    // 1500ms per clarifications
  revealDelay: number;             // 2000ms per clarifications  
  otherPrincessesDelay: number;    // 2000ms per clarifications
  carouselFadeInDelay: number;     // 1000ms for smooth transition
}

const ANIMATION_TIMING: AnimationTiming = {
  lineAnimationDuration: 1500,
  revealDelay: 2000,
  otherPrincessesDelay: 2000,
  carouselFadeInDelay: 1000,
};
```

## Graph Coordinates

Reuses existing princess coordinate system from princessData.ts:

```typescript
// Existing interfaces (reference only)
interface Princess {
  id: string;
  name: string;
  source: string;
  feminismPercentage: number;    // X-axis (0-100): Damsel → Heroine
  bitchinessPercentage: number;  // Y-axis (0-100): Sweet → Bitch
  personalityMessage: string;
  imageUrl?: string;
}

interface QuizResult {
  xScore: number;                // User's X coordinate (0-100)
  yScore: number;                // User's Y coordinate (0-100)  
  matchedPrincess: Princess;     // Closest princess by Euclidean distance
  matchingDistance: number;
  totalQuestions: number;
  answeredQuestions: number;
}
```

## Accessibility Attributes

```typescript
interface AccessibilityProps {
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
```

## Error Handling

```typescript
interface AnimationError {
  type: 'TIMING_ERROR' | 'DATA_MISSING' | 'RENDER_ERROR';
  message: string;
  recovery: () => void;           // Reset to safe state
}
```

**Error Recovery Strategies**:
- Missing reveal data: Use fallback generic message
- Animation timing issues: Skip to final state
- Princess data inconsistencies: Fall back to matched princess only
- Rendering errors: Display static graph as fallback

## Performance Considerations

- **Animation State**: Use React.useMemo for expensive calculations
- **Carousel Rendering**: Virtualize if princess list grows beyond 20 items
- **Graph Rendering**: Use CSS transforms for hardware acceleration
- **Memory Management**: Clean up timers and event listeners on unmount
