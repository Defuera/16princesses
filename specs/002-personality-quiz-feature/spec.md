# Personality Quiz Feature Specification

## Overview
Transform the 16Princesses Test from direct princess selection to an interactive personality quiz that calculates user scores and matches them to their closest princess archetype.

## User Stories

### Primary User Story
**As a user**, I want to take a personality quiz so that I can discover which princess archetype matches my personality based on my choices, rather than just picking one directly.

### Acceptance Scenarios

**Scenario 1: Taking the Quiz**
- **Given** I visit the 16Princesses Test website
- **When** I click "Start Quiz" 
- **Then** I am presented with the first question out of 16
- **And** I can see my progress (e.g., "Question 3 of 16")
- **And** I can select one of the multiple choice answers
- **And** clicking "Next" advances to the next question

**Scenario 2: Quiz Completion and Results**
- **Given** I have answered all 16 questions
- **When** I submit my final answer
- **Then** my scores are calculated for X-axis (feminism) and Y-axis (assertiveness)
- **And** I am matched to the closest princess based on my coordinates
- **And** I am taken to the results page showing my princess match
- **And** I can see the interactive graph with my calculated position highlighted
- **And** I receive personalized text based on my quiz results

**Scenario 3: Quiz Navigation**
- **Given** I am taking the quiz
- **When** I want to review or change previous answers
- **Then** I can click "Back" to return to previous questions
- **And** my previous selections are preserved and editable

## Functional Requirements

### Quiz Engine (FR-001)
The system MUST implement a quiz engine that:
- Loads questions from QUEEZ.json (16 questions total)
- Presents questions in sequence with progress tracking
- Handles both "multiple" and "forced" choice question types
- Stores user selections and allows navigation between questions
- Implements proper scoring algorithm with reverse logic support

### Scoring Algorithm (FR-002)
The system MUST calculate personality scores by:
- Processing X-axis questions (IDs 1-8) for Damsel→Heroine (agency/independence) score
- Processing Y-axis questions (IDs 9-16) for Sweet→Fierce (assertiveness/attitude) score  
- Applying reverse scoring where `reverse: true` (invert: 0→100, 33→66, 66→33, 100→0)
- Averaging scores for each axis: sum all axis values ÷ count = final percentage (0-100)
- Finding closest princess match using Euclidean distance: `Math.sqrt((userX - princessX)² + (userY - princessY)²)`

### Quiz UI Components (FR-003)
The system MUST provide:
- QuizStart component with engaging introduction
- QuizQuestion component supporting multiple choice and forced choice formats
- QuizProgress component showing current question number and progress bar
- QuizNavigation component with Back/Next buttons
- QuizResults component displaying calculated scores and matched princess

### Results Integration (FR-004)
The system MUST integrate quiz results with existing features:
- Display user's calculated position on the princess personality graph
- Generate personalized message based on quiz-derived scores
- Maintain all existing graph and message functionality
- Provide option to retake quiz from results page

### Anti-Bias Techniques (FR-005)
The system MUST implement anti-bias techniques to ensure honest responses:
- **Randomized Options**: Shuffle multiple-choice options using Fisher-Yates algorithm per page load
- **Reverse Scoring**: Questions with `reverse: true` invert scoring (0→100, 33→66, 66→33, 100→0) to catch impulsive picks
- **Forced Choice**: Present 2-3 options that force trade-offs, obscuring the "best" choice
- **Indirect Phrasing**: Use scenario-based questions (not direct trait questions) to prompt genuine reflection
- **Anonymity Assurance**: Display intro text like "No judgments, just princess vibes—be honest!"

### User Experience (FR-006)
The system MUST provide:
- Smooth transitions between questions with CSS animations (fade-in recommended)
- Visual feedback for selected options
- Progress bar showing "Question X of 16"
- Loading states during score calculation  
- Mobile-responsive quiz interface
- Accessible keyboard navigation
- Radio buttons for multiple choice, buttons/dropdown for forced choice

## Key Entities

### Quiz
- questions: QuizQuestion[]
- currentQuestionIndex: number
- userAnswers: Map<questionId, selectedValue>
- isComplete: boolean

### QuizQuestion  
- id: number
- text: string
- axis: "X" | "Y"  
- type: "multiple" | "forced"
- reverse: boolean
- options: QuizOption[]

### QuizOption
- text: string
- value: number (0-100)

### QuizResult
- xScore: number (0-100, feminism/independence)
- yScore: number (0-100, assertiveness/bitchiness) 
- matchedPrincess: Princess
- matchingDistance: number

## Technical Implementation

### Scoring Logic
The system MUST implement the following JavaScript scoring algorithm:
```javascript
// 1. Shuffle multiple-choice options (Fisher-Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 2. Calculate scores
let xScores = [], yScores = [];
answers.forEach(ans => {
  let q = questions.find(q => q.id === ans.id);
  let value = ans.selectedValue;
  
  // Apply reverse scoring if needed
  if (q.reverse) value = 100 - value;
  
  // Add to appropriate axis
  if (q.axis === 'X') xScores.push(value);
  if (q.axis === 'Y') yScores.push(value);
});

// 3. Calculate final percentages
const xPercent = xScores.reduce((a, b) => a + b, 0) / xScores.length;
const yPercent = yScores.reduce((a, b) => a + b, 0) / yScores.length;

// 4. Find closest princess using Euclidean distance
const closest = princesses.reduce((min, p) => {
  let dist = Math.sqrt((xPercent - p.feminismPercentage)**2 + (yPercent - p.bitchinessPercentage)**2);
  return dist < min.dist ? {princess: p, dist} : min;
}, {dist: Infinity}).princess;
```

### Result Display Format
Results MUST display in format: **"You're X% Heroine, Y% Fierce—like [Princess] with a twist of [fun trait]!"**

## Technical Constraints
- MUST maintain compatibility with existing React + TypeScript + Vite stack
- MUST preserve all existing princess data and graph functionality  
- MUST load quiz data from the existing QUEEZ.json file (docs/QUEEZ.json)
- MUST maintain static site deployment compatibility
- MUST use Chart.js to plot user coordinates and highlight closest princess match
- MUST support mobile and desktop responsive design
- MUST implement Fisher-Yates shuffle for anti-bias randomization

## Acceptance Criteria
- [ ] Users can start and complete the 16-question personality quiz
- [ ] Quiz properly calculates X/Y scores using the scoring algorithm
- [ ] Users are matched to closest princess based on calculated coordinates
- [ ] Results page shows user's position on the personality graph
- [ ] Quiz supports both multiple choice and forced choice question types  
- [ ] Users can navigate backward/forward through quiz questions
- [ ] Quiz progress is clearly indicated throughout the experience
- [ ] All existing functionality (graph, messages) works with quiz results
- [ ] Quiz interface is fully responsive and accessible

## Success Metrics
- Users complete the full quiz flow (start → questions → results)
- Quiz results accurately map to expected princess archetypes
- Quiz completion time is reasonable (5-10 minutes)
- Mobile and desktop experiences are equally smooth

## Future Considerations
- Quiz result sharing functionality
- Multiple quiz variations or themes
- User result history/profiles
- A/B testing different question sets or UI flows
