
# Implementation Plan: User Authentication with Clerk

**Branch**: `001-add-login-and` | **Date**: 2025-09-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-add-login-and/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Implement user authentication system using Clerk service for a Next.js web application. The system will provide secure user registration, login, logout, password reset, and session management with conditional email verification requirements and 30-minute session timeouts.

## Technical Context
**Language/Version**: TypeScript/JavaScript with Next.js 14.2.0
**Primary Dependencies**: @clerk/nextjs 5.7.4, React 18.2.0, Prisma 5.22.0, Supabase
**Storage**: PostgreSQL via Prisma ORM, Supabase backend
**Testing**: Playwright for E2E, Jest/React Testing Library (detected from dev deps)
**Target Platform**: Web application (Next.js SSR/SSG)
**Project Type**: web - Next.js frontend with integrated backend
**Performance Goals**: Standard web performance (<200ms auth response)
**Constraints**: Clerk service integration, 30-minute session timeout, email verification for sensitive features
**Scale/Scope**: Multi-user SaaS application with authentication requirements

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution Status**: ShipsMind SpecKit Constitution v1.0.0 - COMPLIANT
- ✅ **Principle I**: Complete specification with functional requirements and user stories
- ✅ **Principle II**: TDD approach with contract tests before implementation
- ✅ **Principle III**: Structured workflow followed (/specify → /clarify → /plan → /tasks)
- ✅ **Principle IV**: Using Clerk library instead of custom authentication
- ✅ **Principle V**: Performance targets specified (200ms auth, 100ms API responses)

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->
```
app/
├── (auth)/
│   ├── sign-in/
│   ├── sign-up/
│   └── password-reset/
├── api/
│   └── auth/
├── middleware.ts
└── layout.tsx

components/
├── auth/
│   ├── sign-in-form.tsx
│   ├── sign-up-form.tsx
│   ├── user-button.tsx
│   └── auth-guard.tsx
└── ui/

lib/
├── auth.ts
├── clerk.ts
└── utils.ts

tests/
├── auth/
│   ├── integration/
│   └── e2e/
└── components/
```

**Structure Decision**: Next.js web application structure selected. Authentication components will be integrated into existing app/ directory structure with middleware for route protection. Clerk provider will wrap the application at the root level.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Clerk setup and configuration tasks
- Database schema tasks (UserPreferences model)
- Middleware and route protection tasks
- Authentication component tasks
- API endpoint tasks for preferences
- Integration test tasks covering user stories
- E2E test tasks for complete auth flows

**Ordering Strategy**:
1. **Foundation Tasks**: Clerk setup, environment configuration, middleware
2. **Database Tasks**: Prisma schema updates, UserPreferences model
3. **API Contract Tests**: Create failing tests for all endpoints [P]
4. **Authentication Components**: Sign-in, sign-up, user button components [P]
5. **API Implementation**: Make contract tests pass
6. **Route Protection**: Implement middleware and auth guards
7. **Integration Tests**: User story validation tests
8. **E2E Tests**: Complete authentication flows with Playwright

**Estimated Output**: 28-32 numbered, ordered tasks in tasks.md

**Key Task Categories**:
- Clerk Integration (5 tasks): Setup, configuration, providers
- Database & Models (3 tasks): Schema, migrations, UserPreferences
- API Development (6 tasks): Contract tests + implementation
- UI Components (8 tasks): Auth forms, guards, user interface
- Testing (6-8 tasks): Integration tests, E2E flows, edge cases
- Documentation (2 tasks): API docs, deployment guide

**Parallel Execution Opportunities**:
- [P] Contract test creation (independent files)
- [P] Component development (isolated components)
- [P] API endpoint implementation (different routes)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
