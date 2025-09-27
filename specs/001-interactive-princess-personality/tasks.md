# Tasks: 16Princesses Test (Interactive Princess Personality Website)

**Input**: Design documents from `/specs/001-interactive-princess-personality/`
**Prerequisites**: plan.md (✓), research.md (✓), data-model.md (✓), contracts/ (✓)

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → ✓ Found: React SPA with Vite build tool and TypeScript integration
   → ✓ Extract: React 18+, Chart.js + react-chartjs-2, React Router stack
2. Load optional design documents:
   → ✓ data-model.md: Princess entity → data conversion & TypeScript interfaces
   → ✓ contracts/princess-data.json: JSON schema → data validation & type generation
   → ✓ research.md: React + Vite selection → modern dev workflow tasks
3. Generate tasks by category:
   → ✓ Setup: Vite project init, dependencies, TypeScript config
   → ✓ Tests: Component tests with React Testing Library, integration tests
   → ✓ Core: React components, TypeScript interfaces, styling
   → ✓ Integration: Chart.js wrapper, React Router navigation, state management
   → ✓ Polish: accessibility testing, build optimization, deployment prep
4. Apply task rules:
   → ✓ Different components marked [P] for parallel development
   → ✓ Same file = sequential (no [P])
   → ✓ Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → ✓ Princess data contract has TypeScript interfaces
   → ✓ All React components have unit tests
   → ✓ All user stories have integration tests
9. Return: SUCCESS (20 React-focused tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different components, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **React SPA project**: `src/` with components, types, data subdirectories
- All file paths relative to repository root: `/Users/admin/dev/projects/DM/princesses/`

## Phase 3.1: Setup & Configuration

- [ ] **T001** Initialize React project with Vite and TypeScript template: `npm create vite@latest . -- --template react-ts`
- [ ] **T002** Install project dependencies: `npm install chart.js react-chartjs-2 react-router-dom @types/react-router-dom`
- [ ] **T003** [P] Configure ESLint, Prettier, and Vitest for code quality and testing setup
- [ ] **T004** [P] Generate `src/data/princesses.json` from `/GRAPH.md` using conversion script following data-model.md structure

## Phase 3.2: Types & Data Layer

- [ ] **T005** [P] Create `src/types/princess.ts` - TypeScript interfaces for Princess entity and related types from data-model.md
- [ ] **T006** [P] Create `src/data/princessData.ts` - Data loading, validation, and personality message generation functions
- [ ] **T007** [P] Create `tests/data/princessData.test.ts` - Unit tests for data validation and message generation logic

## Phase 3.3: Core React Components (Tests First - TDD)

### Component Test Setup
- [ ] **T008** [P] Create `tests/components/PrincessList.test.tsx` - Test princess list rendering, clicking, and navigation
- [ ] **T009** [P] Create `tests/components/PrincessGraph.test.tsx` - Test graph rendering, highlighting, and message display
- [ ] **T010** [P] Create `tests/components/PrincessMessage.test.tsx` - Test personality message display logic

### Component Implementation
- [ ] **T011** Create `src/components/PrincessList.tsx` - Princess selection list with navigation to graph (make tests pass)
- [ ] **T012** Create `src/components/PrincessGraph.tsx` - Chart.js scatter plot integration with selected princess highlighting
- [ ] **T013** Create `src/components/PrincessMessage.tsx` - Display personality message for selected princess

## Phase 3.4: Navigation & App Structure

- [ ] **T014** Create `src/App.tsx` - Main app component with React Router setup for 2-step navigation flow
- [ ] **T015** Update `src/main.tsx` - React 18 root setup and router configuration
- [ ] **T016** Create routing logic for princess selection (`/`) and result display (`/result/:princessId`) routes

## Phase 3.5: Styling & User Interface

- [ ] **T017** [P] Create `src/styles/index.css` - Global styles, CSS variables, and responsive design foundation
- [ ] **T018** [P] Create `src/styles/components.css` - Component-specific styles with CSS modules approach
- [ ] **T019** [P] Implement mobile-first responsive design with breakpoints at 768px (mobile) and 1024px (desktop)

## Phase 3.6: Integration Testing

- [ ] **T020** [P] Create `tests/integration/user-flow.test.tsx` - End-to-end user story testing with React Testing Library
- [ ] **T021** [P] Create `tests/accessibility/wcag-compliance.test.tsx` - Accessibility testing for keyboard navigation and ARIA labels

## Phase 3.7: Build & Deployment

- [ ] **T022** Configure Vite build settings for static deployment and optimize bundle size
- [ ] **T023** [P] Add build scripts and deployment preparation (static file generation)

---

## Dependency Graph

```
T001 (Vite Setup) → T002, T003, T004
T002 (Dependencies) → T005, T006, T011, T012, T013
T005 (Types) → T006, T008, T009, T010
T006 (Data Layer) → T007, T011, T012, T013
T008-T010 (Component Tests) → T011-T013
T011-T013 (Components) → T014, T020
T014-T016 (App & Routing) → T020, T021
T017-T019 (Styling) → T021, T022
T020-T021 (Testing) → T022, T023
```

## Parallel Execution Examples

### Phase 3.1-3.2 Setup Tasks:
```bash
# After T001-T002 complete, can run in parallel:
Task T003: Configure dev tools (ESLint, Prettier, Vitest)
Task T004: Generate princess data JSON
Task T005: Create TypeScript interfaces
Task T006: Create data loading functions
```

### Phase 3.3 Component Development (TDD):
```bash
# Test files can be created in parallel:
Task T008: PrincessList component tests
Task T009: PrincessGraph component tests  
Task T010: PrincessMessage component tests

# Then components can be built in parallel (after respective tests):
Task T011: PrincessList component (after T008)
Task T012: PrincessGraph component (after T009)
Task T013: PrincessMessage component (after T010)
```

### Phase 3.5-3.6 Styling & Testing:
```bash
# Independent styling and testing tasks:
Task T017: Global styles and CSS variables
Task T018: Component-specific styles
Task T019: Responsive design implementation
Task T020: Integration testing
Task T021: Accessibility testing
```

## React-Specific Implementation Details

### Component Props & State Management:
- **PrincessList**: Receives princess data, handles click events, uses React Router navigation
- **PrincessGraph**: Receives selected princess ID, renders Chart.js via react-chartjs-2
- **PrincessMessage**: Receives princess data, displays personality message with animations

### TypeScript Integration:
- Strict type checking for princess data structure
- Interface definitions for component props
- Type-safe Chart.js configuration objects
- Typed React Router parameters

### Development Workflow:
- `npm run dev` - Start Vite dev server with hot reload
- `npm run test` - Run Vitest unit tests
- `npm run build` - Build static files for deployment
- `npm run preview` - Preview built site locally

## Constitutional Compliance Check

**Updated Constitution v1.1.0 Compliance**:
- [x] **I. User Experience First**: React components enable smooth interactions and instant feedback
- [x] **II. Development Speed First**: Vite + React + TypeScript maximize developer productivity with hot reload
- [x] **III. Interactive & Engaging Design**: Chart.js integration with React provides rich scatter plot interactions
- [x] **IV. Data Accuracy & Consistency**: TypeScript interfaces ensure data structure consistency from GRAPH.md
- [x] **V. Accessibility & Inclusivity**: React components support ARIA labels and keyboard navigation testing

## Task Completion Validation

**Setup Phase (T001-T004)**:
- [ ] Vite React TypeScript project initialized successfully
- [ ] All required dependencies installed and configured
- [ ] Princess JSON data generated with correct structure
- [ ] Development tools (ESLint, Prettier, Vitest) configured

**Types & Data Phase (T005-T007)**:
- [ ] TypeScript interfaces match data-model.md specification
- [ ] Data loading and validation functions work correctly
- [ ] Unit tests pass for data layer functionality

**Component Phase (T008-T013)**:  
- [ ] All component tests fail initially (TDD approach)
- [ ] React components render without errors
- [ ] Princess selection navigates between components
- [ ] Chart.js scatter plot displays all princesses
- [ ] Personality messages display correctly

**Integration Phase (T014-T019)**:
- [ ] React Router navigation works end-to-end
- [ ] Responsive design functions on mobile/tablet/desktop
- [ ] Component styling is scoped and consistent

**Testing & Deploy Phase (T020-T023)**:
- [ ] Integration tests cover all user story scenarios  
- [ ] Accessibility tests pass WCAG 2.1 AA standards
- [ ] Production build generates optimized static files
- [ ] Built site functions correctly in preview mode

---

**Estimated Implementation Time**: 8-12 hours for complete React MVP
**Critical Path**: T001 → T002 → T005/T006 → T008-T010 → T011-T013 → T014 → T020
**Major Parallel Opportunities**: Component tests (T008-T010), Component implementation (T011-T013), Styling (T017-T019)

Ready for React development! 🚀⚛️