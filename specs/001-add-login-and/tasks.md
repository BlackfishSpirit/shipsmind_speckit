# Tasks: User Authentication with Clerk

**Input**: Design documents from `/specs/001-add-login-and/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: Next.js 14.2.0, TypeScript, Clerk, Prisma, PostgreSQL
   → Structure: Next.js App Router with app/ directory
2. Load design documents:
   → data-model.md: UserPreferences entity
   → contracts/: auth-api.yaml, clerk-integration.yaml
   → quickstart.md: Registration, login, session management scenarios
3. Generate tasks by category:
   → Setup: Clerk configuration, environment, database schema
   → Tests: Contract tests for API endpoints, integration tests for user flows
   → Core: Middleware, auth components, API endpoints
   → Integration: Route protection, session management, preferences
   → Polish: E2E tests, error handling, documentation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Tests before implementation (TDD)
   → Clerk setup before everything else
5. Number tasks sequentially (T001, T002...)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
Next.js App Router structure:
- **Authentication routes**: `app/(auth)/sign-in/`, `app/(auth)/sign-up/`
- **API routes**: `app/api/auth/`
- **Components**: `components/auth/`
- **Middleware**: `middleware.ts`
- **Database**: `prisma/schema.prisma`
- **Tests**: `tests/auth/`

## Phase 3.1: Setup & Configuration
- [x] T001 Configure Clerk environment variables and application settings
- [x] T002 Update Prisma schema with UserPreferences model in prisma/schema.prisma
- [x] T003 [P] Create database migration for UserPreferences table
- [x] T004 [P] Set up Clerk provider in app/layout.tsx
- [x] T005 [P] Configure authentication middleware in middleware.ts

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T006 [P] Contract test GET /api/auth/preferences in tests/auth/contract/preferences-get.test.ts
- [x] T007 [P] Contract test POST /api/auth/preferences in tests/auth/contract/preferences-post.test.ts
- [x] T008 [P] Contract test PATCH /api/auth/preferences in tests/auth/contract/preferences-patch.test.ts
- [x] T009 [P] Contract test GET /api/auth/session in tests/auth/contract/session-get.test.ts
- [x] T010 [P] Contract test GET /api/auth/verification-status in tests/auth/contract/verification-status.test.ts
- [x] T011 [P] Integration test user registration flow in tests/auth/integration/registration.test.ts
- [x] T012 [P] Integration test user login flow in tests/auth/integration/login.test.ts
- [x] T013 [P] Integration test session timeout in tests/auth/integration/session-timeout.test.ts
- [x] T014 [P] Integration test email verification flow in tests/auth/integration/email-verification.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T015 [P] Create UserPreferences Prisma model service in lib/services/user-preferences.ts
- [ ] T016 [P] Create authentication utilities in lib/auth.ts
- [ ] T017 [P] Create sign-in page component in app/(auth)/sign-in/page.tsx
- [ ] T018 [P] Create sign-up page component in app/(auth)/sign-up/page.tsx
- [ ] T019 [P] Create user button component in components/auth/user-button.tsx
- [ ] T020 [P] Create auth guard component in components/auth/auth-guard.tsx
- [ ] T021 GET /api/auth/preferences endpoint in app/api/auth/preferences/route.ts
- [ ] T022 POST /api/auth/preferences endpoint in app/api/auth/preferences/route.ts
- [ ] T023 PATCH /api/auth/preferences endpoint in app/api/auth/preferences/route.ts
- [ ] T024 GET /api/auth/session endpoint in app/api/auth/session/route.ts
- [ ] T025 GET /api/auth/verification-status endpoint in app/api/auth/verification-status/route.ts
- [ ] T026 Implement route protection for restricted pages in lib/route-protection.ts

## Phase 3.4: Integration & Route Protection
- [ ] T027 Implement route protection middleware logic in middleware.ts
- [ ] T028 Create protected route wrapper in components/auth/protected-route.tsx
- [ ] T029 Add session timeout notification system in components/auth/session-timeout.tsx
- [ ] T030 Integrate user preferences with authentication state in lib/hooks/use-auth.ts
- [ ] T031 Add email verification prompts for sensitive features in components/auth/verification-prompt.tsx

## Phase 3.5: Error Handling & Edge Cases
- [ ] T032 [P] Add error boundary for authentication errors in components/auth/auth-error-boundary.tsx
- [ ] T033 [P] Implement failed login attempt handling in lib/auth-utils.ts
- [ ] T034 [P] Add loading states for authentication components in components/auth/auth-loading.tsx
- [ ] T035 Handle offline/network error scenarios in lib/auth-error-handler.ts

## Phase 3.6: End-to-End Tests & Validation
- [ ] T036 [P] E2E test complete registration flow in tests/auth/e2e/registration.spec.ts
- [ ] T037 [P] E2E test complete login flow in tests/auth/e2e/login.spec.ts
- [ ] T038 [P] E2E test password reset flow in tests/auth/e2e/password-reset.spec.ts
- [ ] T039 [P] E2E test session management in tests/auth/e2e/session.spec.ts
- [ ] T040 [P] E2E test route protection in tests/auth/e2e/route-protection.spec.ts
- [ ] T041 [P] E2E test email verification flow in tests/auth/e2e/email-verification.spec.ts

## Phase 3.7: Polish & Documentation
- [ ] T042 [P] Add TypeScript types for authentication in types/auth.ts
- [ ] T043 [P] Add comprehensive error messages and user feedback
- [ ] T044 [P] Performance optimization for auth state management to meet 200ms authentication target
- [ ] T045 [P] Update README with authentication setup instructions
- [ ] T046 Run quickstart.md validation tests to ensure all requirements met

## Dependencies
**Critical Dependencies:**
- T001-T005 (Setup) must complete before any other tasks
- T006-T014 (Tests) must complete before T015-T026 (Implementation)
- T021-T023 (Preferences API) depends on T015 (UserPreferences service)
- T026 (Route Protection) depends on T016 (Auth utilities)
- T027-T031 (Integration) depends on T016 (Auth utilities) and T017-T020 (Components)
- T032-T035 (Error Handling) can run after basic implementation
- T036-T041 (E2E Tests) require full implementation (T015-T031)

**Parallel Blocks:**
- Block 1: T003, T004, T005 (different files, setup phase)
- Block 2: T006-T014 (contract/integration tests, different files)
- Block 3: T015-T020 (models, utilities, components - different files)
- Block 4: T032-T034 (error handling components, different files)
- Block 5: T036-T041 (E2E tests, different spec files)
- Block 6: T042, T043, T045 (types, docs, different files)

## Parallel Execution Examples

### Setup Phase (after T001, T002)
```bash
# Launch T003-T005 together:
Task: "Create database migration for UserPreferences table"
Task: "Set up Clerk provider in app/layout.tsx"
Task: "Configure authentication middleware in middleware.ts"
```

### Contract Tests Phase
```bash
# Launch T006-T010 together:
Task: "Contract test GET /api/auth/preferences in tests/auth/contract/preferences-get.test.ts"
Task: "Contract test POST /api/auth/preferences in tests/auth/contract/preferences-post.test.ts"
Task: "Contract test PATCH /api/auth/preferences in tests/auth/contract/preferences-patch.test.ts"
Task: "Contract test GET /api/auth/session in tests/auth/contract/session-get.test.ts"
Task: "Contract test GET /api/auth/verification-status in tests/auth/contract/verification-status.test.ts"
```

### Integration Tests Phase
```bash
# Launch T011-T014 together:
Task: "Integration test user registration flow in tests/auth/integration/registration.test.ts"
Task: "Integration test user login flow in tests/auth/integration/login.test.ts"
Task: "Integration test session timeout in tests/auth/integration/session-timeout.test.ts"
Task: "Integration test email verification flow in tests/auth/integration/email-verification.test.ts"
```

### Core Components Phase
```bash
# Launch T015-T020 together:
Task: "Create UserPreferences Prisma model service in lib/services/user-preferences.ts"
Task: "Create authentication utilities in lib/auth.ts"
Task: "Create sign-in page component in app/(auth)/sign-in/page.tsx"
Task: "Create sign-up page component in app/(auth)/sign-up/page.tsx"
Task: "Create user button component in components/auth/user-button.tsx"
Task: "Create auth guard component in components/auth/auth-guard.tsx"
```

### E2E Tests Phase
```bash
# Launch T036-T041 together:
Task: "E2E test complete registration flow in tests/auth/e2e/registration.spec.ts"
Task: "E2E test complete login flow in tests/auth/e2e/login.spec.ts"
Task: "E2E test password reset flow in tests/auth/e2e/password-reset.spec.ts"
Task: "E2E test session management in tests/auth/e2e/session.spec.ts"
Task: "E2E test route protection in tests/auth/e2e/route-protection.spec.ts"
Task: "E2E test email verification flow in tests/auth/e2e/email-verification.spec.ts"
```

## Notes
- [P] tasks = different files, no dependencies between them
- Verify tests fail before implementing functionality
- Each API endpoint task (T021-T026) handles all HTTP methods for that route
- Clerk handles user registration/login UI - we only create pages that use Clerk components
- Focus on integration between Clerk and application-specific features (preferences, route protection)
- All authentication data flows through Clerk - only UserPreferences stored locally

## Task Generation Rules Applied

1. **From Contracts**:
   - auth-api.yaml → T006-T010 (contract tests) + T021-T025 (implementation)
   - clerk-integration.yaml → T011-T014 (integration tests)

2. **From Data Model**:
   - UserPreferences entity → T002 (schema), T015 (service)
   - Clerk integration → T016 (utilities), T001 (config)

3. **From User Stories (quickstart.md)**:
   - Registration flow → T011, T017, T036
   - Login flow → T012, T018, T037
   - Session management → T013, T029, T039
   - Email verification → T014, T031, T041

4. **Ordering Applied**:
   - Setup (T001-T005) → Tests (T006-T014) → Implementation (T015-T026) → Integration (T027-T031) → Polish (T032-T046)

## Validation Checklist
- [x] All contracts have corresponding tests (T006-T010 cover auth-api.yaml)
- [x] All entities have model tasks (T002, T015 for UserPreferences)
- [x] All tests come before implementation (T006-T014 before T015-T025)
- [x] Parallel tasks are truly independent (different files, no shared state)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] TDD approach: failing tests before implementation
- [x] All user stories from quickstart.md covered by integration/E2E tests