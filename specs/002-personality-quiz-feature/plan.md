# Personality Quiz Feature - Technical Implementation Plan

## Project Overview
Transform the 16Princesses Test from direct princess selection to an interactive personality quiz using QUEEZ.json, implementing anti-bias techniques and proper scoring algorithms as specified in the 16_Princesses_Test_Guide.markdown.

## Technical Context

### Current Stack
- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite 5+ with hot reload and optimization
- **Routing**: React Router with basename for GitHub Pages
- **Charting**: Chart.js with react-chartjs-2 wrapper
- **Styling**: CSS modules with responsive design
- **Deployment**: Static site on GitHub Pages

### New Components Required
- **Quiz Engine**: Question flow, state management, scoring logic
- **Quiz UI Components**: Start screen, questions, progress, results
- **Anti-Bias System**: Option shuffling, reverse scoring, forced choices
- **Score Calculator**: Euclidean distance matching to closest princess

## Architecture Overview

### Project Type
Single Page Application (React SPA) with client-side routing, compiled to static files for GitHub Pages deployment.

### Route Structure
```
/ (Home) → Quiz Start Screen
/quiz → Quiz Questions (with question state)
/result/:calculatedScores → Results with matched princess
```

### Data Flow
```
QUEEZ.json → Quiz Engine → User Answers → Score Calculator → Princess Matcher → Results Display
```

### Core State Management
- Quiz progress state (current question, answers)
- User responses (question ID → selected value mapping)
- Calculated scores (X%, Y% coordinates)
- Matched princess and result data

## Implementation Strategy

### Phase 1: Core Quiz Infrastructure
1. **Quiz Data Layer**
   - Load and validate QUEEZ.json (16 questions)
   - Create TypeScript interfaces for Quiz, QuizQuestion, QuizOption
   - Implement Fisher-Yates shuffle for multiple-choice options
   - Add quiz data validation and error handling

2. **Quiz State Management**
   - Create quiz context/state management (React hooks or context)
   - Track current question index, user answers, completion status
   - Implement navigation (next/back) with answer persistence
   - Handle quiz restart and state reset

### Phase 2: Quiz UI Components
1. **QuizStart Component**
   - Engaging introduction screen
   - "No judgments, just princess vibes—be honest!" disclaimer
   - Start quiz button triggering routing to /quiz

2. **QuizQuestion Component**
   - Support both multiple-choice (radio buttons) and forced-choice formats
   - Randomized options for multiple-choice questions  
   - Visual feedback for selected options
   - Smooth transitions with CSS animations (fade-in)

3. **QuizProgress Component**
   - Progress bar: "Question X of 16"
   - Navigation buttons (Back/Next)
   - Completion percentage indicator

### Phase 3: Scoring & Results
1. **Score Calculator**
   - Implement scoring algorithm from guide specification
   - Handle reverse scoring (invert values for reverse: true questions)
   - Calculate X-axis (Damsel→Heroine) and Y-axis (Sweet→Fierce) percentages
   - Find closest princess using Euclidean distance formula

2. **Quiz Results Integration**
   - Extend existing PrincessGraph to show user's calculated position
   - Update PrincessMessage to show quiz-based personality text
   - Format: "You're X% Heroine, Y% Fierce—like [Princess] with a twist of [fun trait]!"
   - Add "Retake Quiz" functionality

### Phase 4: Enhanced UX
1. **Anti-Bias Implementation**
   - Fisher-Yates shuffle implementation for option randomization
   - Reverse scoring logic for questions with reverse: true
   - Forced-choice UI (buttons/dropdown) for trade-off questions
   - Scenario-based question presentation (indirect phrasing)

2. **Polish & Accessibility**
   - Mobile-responsive quiz interface
   - Keyboard navigation support
   - Loading states during score calculation
   - Error handling and validation

## Source Code Structure

```
src/
├── components/
│   ├── quiz/
│   │   ├── QuizStart.tsx          # Quiz introduction screen
│   │   ├── QuizQuestion.tsx       # Individual question display
│   │   ├── QuizProgress.tsx       # Progress bar and navigation
│   │   └── QuizResults.tsx        # Results wrapper component
│   ├── PrincessGraph.tsx          # Updated to show user position
│   ├── PrincessMessage.tsx        # Updated for quiz results
│   └── PrincessList.tsx           # Legacy component (may remove)
├── data/
│   ├── quizData.ts               # Quiz loading and validation
│   ├── quizScoring.ts            # Scoring algorithm implementation
│   └── princessData.ts           # Existing princess data (updated)
├── hooks/
│   ├── useQuiz.ts                # Quiz state management hook
│   └── useQuizScoring.ts         # Scoring logic hook
├── types/
│   ├── quiz.ts                   # Quiz-related TypeScript interfaces
│   └── princess.ts               # Updated princess interfaces
├── utils/
│   ├── shuffle.ts                # Fisher-Yates shuffle implementation
│   └── distance.ts               # Euclidean distance calculation
└── styles/
    └── quiz.css                  # Quiz-specific styling
```

## External Dependencies

### New Dependencies (to install)
None required - using existing React, TypeScript, Chart.js, React Router stack.

### Data Sources
- `docs/QUEEZ.json` - Quiz questions and options (existing)
- `src/data/princesses.json` - Princess coordinates (existing) 

## Development Workflow

### Local Development
1. `npm run dev` - Start Vite dev server with hot reload
2. Navigate to `localhost:5173/16princesses/` 
3. Test quiz flow: Start → Questions → Scoring → Results
4. Verify anti-bias techniques (option shuffling, reverse scoring)

### Testing Strategy
- Manual testing with sample responses to validate scoring
- Test multiple quiz completions to verify princess matching accuracy
- Validate mobile responsive design
- Test browser navigation (back/forward) during quiz

### Deployment Process
1. `npm run build` - Build production bundle
2. `npm run deploy:gh-pages` - Deploy to GitHub Pages
3. Verify at `https://defuera.github.io/16princesses/`

## Risk Assessment

### Technical Risks
- **Browser refresh during quiz**: Mitigate with localStorage persistence
- **Quiz data loading failure**: Implement error boundaries and fallbacks
- **Mobile performance**: Optimize bundle size and implement lazy loading

### User Experience Risks
- **Quiz abandonment**: Keep questions engaging, show progress clearly
- **Gaming the system**: Anti-bias techniques should reduce but not eliminate
- **Princess matching accuracy**: Validate algorithm with diverse test cases

## Success Metrics

### Functional Success
- [ ] All 16 questions load and display correctly
- [ ] Scoring algorithm matches guide specification exactly
- [ ] Princess matching uses proper Euclidean distance calculation
- [ ] Anti-bias techniques work (shuffling, reverse scoring)

### User Experience Success
- [ ] Quiz completion rate >70% (estimated baseline)
- [ ] Mobile and desktop experiences equally smooth
- [ ] Results feel accurate and engaging to users
- [ ] Performance: Quiz loads in <2 seconds, questions transition smoothly

## Timeline Estimate

**Total Duration**: 2-3 development sessions

- **Phase 1** (Core Infrastructure): 1 session - Quiz data, state management
- **Phase 2** (UI Components): 1 session - Quiz flow, question display
- **Phase 3** (Scoring & Results): 1 session - Algorithm, integration  
- **Phase 4** (Polish): Optional - UX refinements, accessibility

## Next Steps

1. Create detailed task breakdown in `tasks.md`
2. Begin Phase 1 implementation
3. Validate scoring logic against guide specification
4. Test quiz flow end-to-end before deployment
