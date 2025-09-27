# Personality Quiz Feature - Implementation Tasks

## Task Execution Overview

This document outlines all implementation tasks for adding the personality quiz feature to the 16Princesses Test. Tasks are organized by phase with clear dependencies and execution order.

**Execution Rules:**
- Tasks marked with [P] can run in parallel with other [P] tasks
- Sequential tasks must complete before dependent tasks begin
- Setup tasks must complete before core implementation
- Test tasks should run before their corresponding implementation tasks
- All tasks affecting the same file must run sequentially

## Phase 1: Setup and Infrastructure (Tasks 1-6)

### T001 [P] Move quiz data to proper location ✅
- **Description**: Move docs/QUEEZ.json to src/data/ for proper data loading
- **Files**: `src/data/quizData.json` (new), `docs/QUEEZ.json` (move)
- **Dependencies**: None
- **Validation**: Quiz data loads correctly in React app

### T002 [P] Create TypeScript interfaces for quiz ✅
- **Description**: Define Quiz, QuizQuestion, QuizOption, QuizResult interfaces
- **Files**: `src/types/quiz.ts` (new)
- **Dependencies**: None
- **Validation**: All interfaces match QUEEZ.json structure

### T003 [P] Create utility functions ✅
- **Description**: Implement Fisher-Yates shuffle and Euclidean distance functions
- **Files**: `src/utils/shuffle.ts` (new), `src/utils/distance.ts` (new)
- **Dependencies**: None
- **Validation**: Functions work with test data

### T004 Quiz data loading service ✅
- **Description**: Create service to load and validate quiz questions
- **Files**: `src/data/quizData.ts` (new)  
- **Dependencies**: T001, T002
- **Validation**: Loads 16 questions correctly, validates structure

### T005 Quiz scoring service ✅
- **Description**: Implement scoring algorithm from guide specification
- **Files**: `src/data/quizScoring.ts` (new)
- **Dependencies**: T002, T003
- **Validation**: Scoring matches guide algorithm exactly

### T006 Quiz state management hook ✅
- **Description**: Create React hook for quiz state management
- **Files**: `src/hooks/useQuiz.ts` (new)
- **Dependencies**: T002, T004
- **Validation**: State transitions work correctly

## Phase 2: Core Quiz Components (Tasks 7-11)

### T007 [P] Create QuizStart component ✅
- **Description**: Quiz introduction screen with disclaimer and start button
- **Files**: `src/components/quiz/QuizStart.tsx` (new)
- **Dependencies**: T006
- **Validation**: Displays intro, handles start action

### T008 [P] Create QuizProgress component ✅
- **Description**: Progress bar, question counter, navigation buttons
- **Files**: `src/components/quiz/QuizProgress.tsx` (new)
- **Dependencies**: T006
- **Validation**: Shows accurate progress, handles navigation

### T009 QuizQuestion component ✅
- **Description**: Display individual questions with multiple/forced choice options
- **Files**: `src/components/quiz/QuizQuestion.tsx` (new)
- **Dependencies**: T003, T006, T007, T008
- **Validation**: Renders correctly, handles option selection, applies shuffling

### T010 QuizResults wrapper component ✅
- **Description**: Results screen that integrates with existing graph and message components
- **Files**: `src/components/quiz/QuizResults.tsx` (new)
- **Dependencies**: T005, T009
- **Validation**: Displays results correctly, shows calculated position

### T011 Quiz-specific CSS styling ✅
- **Description**: Styles for quiz components with animations and responsive design
- **Files**: `src/styles/quiz.css` (new)
- **Dependencies**: T007, T008, T009, T010
- **Validation**: Quiz looks good on mobile and desktop

## Phase 3: Integration and Routing (Tasks 12-15)

### T012 Update App.tsx routing ✅
- **Description**: Add quiz routes and integrate with existing routing
- **Files**: `src/App.tsx` (update)
- **Dependencies**: T007, T009, T010
- **Validation**: Quiz routes work correctly with GitHub Pages

### T013 Update PrincessGraph for quiz results ✅
- **Description**: Modify graph to display user's calculated position
- **Files**: `src/components/PrincessGraph.tsx` (update)
- **Dependencies**: T005, T010
- **Validation**: User position displays correctly on graph

### T014 Update PrincessMessage for quiz results ✅ 
- **Description**: Modify message component to show quiz-based personality text
- **Files**: `src/components/PrincessMessage.tsx` (update)
- **Dependencies**: T005, T010
- **Validation**: Quiz results show personalized messages

### T015 [P] Update princess data service ✅
- **Description**: Extend princess data functions to work with quiz results
- **Files**: `src/data/princessData.ts` (update)
- **Dependencies**: T005
- **Validation**: Princess matching works with calculated coordinates

## Phase 4: Anti-Bias and UX Polish (Tasks 16-20)

### T016 [P] Implement Fisher-Yates shuffling ✅
- **Description**: Apply option shuffling to multiple-choice questions
- **Files**: `src/components/quiz/QuizQuestion.tsx` (update)
- **Dependencies**: T003, T009
- **Validation**: Options randomize correctly per page load

### T017 [P] Implement reverse scoring logic ✅
- **Description**: Apply reverse scoring for questions with reverse: true
- **Files**: `src/data/quizScoring.ts` (update)  
- **Dependencies**: T005
- **Validation**: Reverse scoring follows guide specification

### T018 [P] Add CSS animations and transitions ✅
- **Description**: Smooth question transitions with fade-in effects
- **Files**: `src/styles/quiz.css` (update)
- **Dependencies**: T011
- **Validation**: Smooth animations between questions

### T019 Mobile responsive optimization ✅
- **Description**: Ensure quiz works well on mobile devices
- **Files**: `src/styles/quiz.css` (update)
- **Dependencies**: T016, T017, T018
- **Validation**: Quiz fully functional on mobile

### T020 Accessibility and keyboard navigation ✅
- **Description**: Add ARIA labels, keyboard support, focus management
- **Files**: `src/components/quiz/QuizQuestion.tsx` (update), `src/components/quiz/QuizProgress.tsx` (update)
- **Dependencies**: T016, T019
- **Validation**: Quiz accessible via keyboard, screen readers

## Phase 5: Final Integration and Testing (Tasks 21-23)

### T021 Update main CSS imports ✅
- **Description**: Import quiz styles in main application
- **Files**: `src/App.tsx` (update)
- **Dependencies**: T011, T018, T019
- **Validation**: Quiz styles load correctly

### T022 Add retake quiz functionality ✅
- **Description**: Allow users to restart quiz from results page
- **Files**: `src/components/quiz/QuizResults.tsx` (update)
- **Dependencies**: T020
- **Validation**: Users can retake quiz successfully

### T023 Final integration testing ✅
- **Description**: Test complete quiz flow end-to-end
- **Files**: All quiz components (validate)
- **Dependencies**: T021, T022
- **Validation**: Full quiz flow works: start → questions → scoring → results → retake

## Task Dependencies Summary

**Phase 1 (Setup)**: T001, T002, T003 can run in parallel → T004, T005, T006 sequential
**Phase 2 (Components)**: T007, T008 parallel → T009 → T010 → T011
**Phase 3 (Integration)**: T012, T013, T014, T015 can run in parallel after Phase 2
**Phase 4 (Polish)**: T016, T017, T018 parallel → T019 → T020 
**Phase 5 (Final)**: T021 → T022 → T023

## Validation Checklist

After implementation, verify:
- [ ] All 16 questions from QUEEZ.json load correctly
- [ ] Multiple-choice options shuffle using Fisher-Yates algorithm  
- [ ] Reverse scoring works for questions with reverse: true
- [ ] Scoring algorithm matches guide specification exactly
- [ ] Princess matching uses Euclidean distance calculation
- [ ] Results display format: "You're X% Heroine, Y% Fierce—like [Princess]..."
- [ ] Quiz works on mobile and desktop
- [ ] Smooth CSS animations between questions
- [ ] Keyboard navigation and accessibility support
- [ ] Integration with existing graph and message components
- [ ] GitHub Pages deployment compatibility maintained

## Expected Outcomes

Upon completion, the 16Princesses Test will have:
1. **Complete quiz flow** replacing direct princess selection
2. **Anti-bias techniques** ensuring honest user responses  
3. **Accurate scoring** matching closest princess archetype
4. **Smooth UX** with progress tracking and mobile optimization
5. **Full integration** with existing graph and results display
