/**
 * Contract: QuizResultsPage Component
 *
 * Defines the interface and behavior expectations for the direct URL quiz results page.
 * This contract ensures consistent behavior when accessing quiz results via direct URLs.
 */

export interface QuizResultsPageProps {
  /** The princess ID extracted from the URL path parameter */
  princessId: string;
}

export interface QuizResultsPageState {
  /** Whether the princess ID is valid and data is loading */
  isLoading: boolean;
  /** Whether the princess ID is valid */
  isValidPrincess: boolean;
  /** The princess data if valid, null if invalid */
  princess: any; // Princess type from existing codebase
  /** Any error that occurred during loading */
  error?: string;
}

export interface QuizResultsPageActions {
  /** Validate the princess ID and load princess data */
  validateAndLoadPrincess: (princessId: string) => Promise<void>;
  /** Handle navigation to main quiz page for invalid IDs */
  handleInvalidPrincess: (princessId: string) => void;
}

/**
 * Contract Requirements:
 *
 * 1. **URL Parameter Handling**: Component MUST extract princessId from URL path
 * 2. **Validation**: Component MUST validate princessId against available princess data
 * 3. **Loading State**: Component MUST show loading indicator while validating
 * 4. **Valid Princess**: Component MUST display complete results interface for valid IDs
 * 5. **Invalid Princess**: Component MUST redirect to main quiz page for invalid IDs
 * 6. **Error Handling**: Component MUST handle validation errors gracefully
 * 7. **Same Experience**: Direct URL access MUST provide identical experience to post-quiz results
 *
 * 8. **Performance**: Validation MUST complete within 100ms for cached data
 * 9. **Accessibility**: URL navigation MUST work with screen readers and keyboard navigation
 * 10. **Browser Support**: MUST work in all target browsers (Chrome, Firefox, Safari, Edge)
 */
