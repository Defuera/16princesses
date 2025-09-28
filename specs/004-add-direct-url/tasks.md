# Tasks: Direct URL Navigation to Quiz Results

**Input**: Design documents from `/specs/004-add-direct-url/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup
- [x] T001 Create project structure per implementation plan (already exists - React/TypeScript/Vite setup)
- [x] T002 Initialize TypeScript project with React dependencies (already exists)
- [x] T003 [P] Configure linting and formatting tools (already configured)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T004 [P] Contract test QuizResultsPage component in tests/components/QuizResultsPage.test.tsx
- [x] T005 [P] Integration test URL navigation flow in tests/integration/test_url_navigation.test.tsx
- [x] T006 [P] Integration test invalid princess ID handling in tests/integration/test_invalid_princess.test.tsx

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T007 [P] QuizResultsPage route handler in src/App.tsx
- [x] T008 [P] Princess ID validation utility in src/utils/princessValidation.ts
- [x] T009 Modify QuizResults component to accept princessId prop in src/components/quiz/QuizResults.tsx
- [x] T010 [P] URL parameter extraction logic in src/components/quiz/QuizResultsPage.tsx
- [x] T011 Error handling and fallback navigation in src/components/quiz/QuizResultsPage.tsx

## Phase 3.4: Integration
- [x] T012 Update App.tsx routing configuration for new quiz-results route
- [x] T013 Add princess ID validation to existing princessData.ts utilities
- [x] T014 Ensure existing QuizResults component works with new URL-based flow

## Phase 3.5: Polish
- [x] T015 [P] Unit tests for princess validation logic in tests/utils/test_princess_validation.test.ts
- [x] T016 Performance tests (page load <500ms)
- [x] T017 [P] Update component documentation
- [x] T018 Manual testing verification using quickstart.md scenarios

## Dependencies
- Tests (T004-T006) before implementation (T007-T014)
- T007 (route setup) blocks T012 (routing config)
- T008 (validation utility) blocks T009 (component modification)
- T009 blocks T010, T011, T014
- Implementation before polish (T015-T018)

## Parallel Example
```
# Launch T004-T006 together:
Task: "Contract test QuizResultsPage component in tests/components/QuizResultsPage.test.tsx"
Task: "Integration test URL navigation flow in tests/integration/test_url_navigation.test.tsx"
Task: "Integration test invalid princess ID handling in tests/integration/test_invalid_princess.test.tsx"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task

2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks

3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **Ordering**:
   - Setup → Tests → Models → Services → Endpoints → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [x] All contracts have corresponding tests
- [x] All entities have model tasks
- [x] All tests come before implementation
- [x] Parallel tasks truly independent
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
