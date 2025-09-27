/**
 * Accessibility Utilities for Polished Results Page
 * 
 * ARIA helpers, focus management, and screen reader support
 * for the animated results graph and carousel components
 */

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Announce text to screen readers using ARIA live region
 */
export function announceToScreenReader(
  message: string, 
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof document === 'undefined') return;

  // Find or create live region
  let liveRegion = document.getElementById(`live-region-${priority}`) as HTMLElement;
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = `live-region-${priority}`;
    liveRegion.className = 'live-region';
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
  }

  // Clear previous message and announce new one
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);

  // Clean up after announcement
  setTimeout(() => {
    liveRegion.textContent = '';
  }, 5000);
}

/**
 * Generate accessible description for animation progress
 */
export function getAnimationProgressAnnouncement(phase: string, progress?: number): string {
  const announcements: Record<string, string> = {
    'x-axis': 'Drawing horizontal line to show your independence level',
    'y-axis': 'Drawing vertical line to show your assertiveness level',
    'intersection': 'Marking your position on the personality graph',
    'reveal': 'Revealing your matched princess character',
    'other-princesses': 'Showing all other princess positions for comparison',
    'carousel': 'Princess exploration carousel is now available',
    'complete': 'Animation complete. Use arrow keys to explore other princesses'
  };

  let announcement = announcements[phase] || `Animation phase: ${phase}`;
  
  if (progress !== undefined) {
    announcement += `. Progress: ${Math.round(progress)}%`;
  }

  return announcement;
}

/**
 * Generate ARIA label for princess on graph
 */
export function getPrincessAriaLabel(
  princess: { name: string; source: string },
  xScore: number,
  yScore: number,
  isUser = false
): string {
  const position = `${Math.round(xScore)}% independent, ${Math.round(yScore)}% assertive`;
  
  if (isUser) {
    return `Your position: ${position}. Matched to ${princess.name} from ${princess.source}`;
  }
  
  return `${princess.name} from ${princess.source}. Position: ${position}`;
}

/**
 * Focus management utilities
 */
export class FocusManager {
  private focusStack: HTMLElement[] = [];
  private trapContainer: HTMLElement | null = null;

  /**
   * Save current focus and set new focus
   */
  saveFocus(newFocus?: HTMLElement): void {
    const currentFocus = document.activeElement as HTMLElement;
    if (currentFocus && currentFocus !== document.body) {
      this.focusStack.push(currentFocus);
    }
    
    if (newFocus) {
      newFocus.focus();
    }
  }

  /**
   * Restore previously saved focus
   */
  restoreFocus(): void {
    const previousFocus = this.focusStack.pop();
    if (previousFocus && document.contains(previousFocus)) {
      previousFocus.focus();
    }
  }

  /**
   * Set up focus trap within container
   */
  trapFocus(container: HTMLElement): void {
    this.trapContainer = container;
    container.addEventListener('keydown', this.handleFocusTrap);
  }

  /**
   * Remove focus trap
   */
  releaseFocusTrap(): void {
    if (this.trapContainer) {
      this.trapContainer.removeEventListener('keydown', this.handleFocusTrap);
      this.trapContainer = null;
    }
  }

  /**
   * Handle Tab key for focus trapping
   */
  private handleFocusTrap = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab' || !this.trapContainer) return;

    const focusableElements = this.getFocusableElements(this.trapContainer);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  /**
   * Get all focusable elements within container
   */
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selectors = [
      'button',
      '[href]',
      'input',
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]'
    ];

    const elements = container.querySelectorAll(selectors.join(',')) as NodeListOf<HTMLElement>;
    return Array.from(elements).filter(el => 
      !el.hasAttribute('disabled') && 
      !el.getAttribute('aria-hidden') &&
      el.offsetWidth > 0 && 
      el.offsetHeight > 0
    );
  }
}

/**
 * Keyboard navigation utilities
 */
export class KeyboardNavigation {
  private items: HTMLElement[] = [];
  private currentIndex = 0;
  private onSelectionChange?: (index: number, item: HTMLElement) => void;

  constructor(
    items: HTMLElement[] = [],
    onSelectionChange?: (index: number, item: HTMLElement) => void
  ) {
    this.items = items;
    this.onSelectionChange = onSelectionChange;
  }

  /**
   * Update navigation items
   */
  updateItems(items: HTMLElement[]): void {
    this.items = items;
    this.currentIndex = Math.min(this.currentIndex, items.length - 1);
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyDown(event: KeyboardEvent): boolean {
    if (this.items.length === 0) return false;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        this.navigate(-1);
        return true;

      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        this.navigate(1);
        return true;

      case 'Home':
        event.preventDefault();
        this.navigateTo(0);
        return true;

      case 'End':
        event.preventDefault();
        this.navigateTo(this.items.length - 1);
        return true;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.select();
        return true;

      default:
        return false;
    }
  }

  /**
   * Navigate by offset
   */
  private navigate(offset: number): void {
    const newIndex = (this.currentIndex + offset + this.items.length) % this.items.length;
    this.navigateTo(newIndex);
  }

  /**
   * Navigate to specific index
   */
  private navigateTo(index: number): void {
    if (index < 0 || index >= this.items.length) return;
    
    this.currentIndex = index;
    const item = this.items[index];
    
    // Update visual focus
    this.items.forEach((el, i) => {
      el.setAttribute('tabindex', i === index ? '0' : '-1');
    });
    
    item.focus();
    this.onSelectionChange?.(index, item);
  }

  /**
   * Select current item
   */
  private select(): void {
    const item = this.items[this.currentIndex];
    if (item) {
      item.click();
    }
  }

  /**
   * Get current selection
   */
  getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * Set current selection
   */
  setCurrentIndex(index: number): void {
    if (index >= 0 && index < this.items.length) {
      this.navigateTo(index);
    }
  }
}

/**
 * Create accessible tooltip
 */
export function createTooltip(
  trigger: HTMLElement,
  content: string,
  position: 'top' | 'bottom' | 'left' | 'right' = 'top'
): () => void {
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
  
  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.id = tooltipId;
  tooltip.className = `tooltip tooltip-${position}`;
  tooltip.textContent = content;
  tooltip.setAttribute('role', 'tooltip');
  tooltip.style.display = 'none';
  
  document.body.appendChild(tooltip);
  
  // Set up ARIA relationship
  trigger.setAttribute('aria-describedby', tooltipId);
  
  // Show/hide handlers
  const showTooltip = () => {
    tooltip.style.display = 'block';
  };
  
  const hideTooltip = () => {
    tooltip.style.display = 'none';
  };
  
  // Event listeners
  trigger.addEventListener('mouseenter', showTooltip);
  trigger.addEventListener('mouseleave', hideTooltip);
  trigger.addEventListener('focus', showTooltip);
  trigger.addEventListener('blur', hideTooltip);
  
  // Cleanup function
  return () => {
    trigger.removeEventListener('mouseenter', showTooltip);
    trigger.removeEventListener('mouseleave', hideTooltip);
    trigger.removeEventListener('focus', showTooltip);
    trigger.removeEventListener('blur', hideTooltip);
    trigger.removeAttribute('aria-describedby');
    tooltip.remove();
  };
}

// Export singleton instances for common use cases
export const focusManager = new FocusManager();

export default {
  prefersReducedMotion,
  announceToScreenReader,
  getAnimationProgressAnnouncement,
  getPrincessAriaLabel,
  FocusManager,
  KeyboardNavigation,
  createTooltip,
  focusManager
};
