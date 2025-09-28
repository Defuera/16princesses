# Data Model: Direct URL Navigation to Quiz Results

## Core Entities

### QuizResultsPage
**Purpose**: Represents a direct URL access to quiz results for a specific princess

**Key Attributes**:
- `princessId`: string (required)
  - The unique identifier of the princess (e.g., "jasmine", "ariel")
  - Must exist in the unified-princesses.json data
  - Used to look up princess details and display appropriate results

**Validation Rules**:
- Must be a valid princess ID from the existing data set
- Case-sensitive matching (IDs are lowercase with hyphens)
- Invalid IDs trigger fallback to main quiz page

**Relationships**:
- **Belongs to**: Princess (1:1 relationship)
  - References the complete princess data from unified-princesses.json
- **Displays**: QuizResult data structure
  - Shows the same personality analysis as post-quiz results

### URL Structure
**Format**: `/quiz-results/[princess-id]`

**Examples**:
- `/quiz-results/jasmine` → Shows Jasmine's results
- `/quiz-results/princess-mononoke` → Shows Mononoke's results
- `/quiz-results/invalid-id` → Redirects to main quiz page

## Data Flow

### URL Parameter Extraction
1. React Router extracts `princessId` from URL path parameter
2. Component validates ID against available princess data
3. If valid: Load princess data and display results page
4. If invalid: Redirect to main quiz route (`/`)

### Princess Data Resolution
- Use existing `getPrincessById(princessId)` function
- If princess not found → fallback to main quiz
- If princess found → display complete results interface

### State Management
- **URL Parameter**: `princessId` (string)
- **Validation Result**: `isValidPrincess` (boolean)
- **Princess Data**: `Princess` object (if valid) or `null` (if invalid)
- **Fallback Action**: Navigation to `/` route

## Interface Requirements

### QuizResultsPage Props
```typescript
interface QuizResultsPageProps {
  princessId: string;  // From URL parameter
}
```

### Component Behavior
- **Valid Princess**: Display complete results interface (graph, info, carousel)
- **Invalid Princess**: Trigger navigation to main quiz page
- **Loading State**: Show loading indicator while validating princess ID
- **Error State**: Graceful fallback with user-friendly messaging

## Data Constraints

### Princess ID Format
- **Pattern**: Lowercase alphanumeric with hyphens (e.g., "snow-white", "princess-mononoke")
- **Source**: Derived from existing `unified-princesses.json` structure
- **Validation**: Must exist in `princesses[].id` array

### URL Encoding
- **Safe Characters**: Alphanumeric, hyphens, underscores
- **Encoding**: Standard URL encoding for special characters
- **Browser Support**: Works across all target browsers

## Integration Points

### Existing Components
- **QuizResults**: Modified to accept optional `princessId` prop
- **App.tsx**: Extended routing configuration
- **princessData.ts**: Existing validation functions reused

### New Functionality
- **Route Handler**: New `/quiz-results/:princessId` route
- **ID Validation**: Princess existence check
- **Navigation**: Programmatic redirect for invalid IDs

## Testing Data Scenarios

### Valid Princess IDs
- "jasmine", "ariel", "belle", "mulan", "moana"
- "princess-mononoke", "snow-white", "cinderella"

### Invalid Princess IDs
- "invalid-princess", "fake-id", "nonexistent"
- Empty string, null, undefined
- IDs with invalid characters

### Edge Cases
- Princess ID with special URL characters
- Very long princess IDs
- Case sensitivity in URL vs data
