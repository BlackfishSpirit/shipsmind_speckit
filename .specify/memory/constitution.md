<!--
Sync Impact Report:
Version change: [TEMPLATE] → 1.0.0
Modified principles: All placeholders filled with project-specific content
Added sections: Quality Standards, Development Workflow
Removed sections: None
Templates requiring updates:
✅ Updated constitution.md
⚠ Pending: Manual review of plan-template.md Constitution Check section
⚠ Pending: Manual review of spec-template.md for constitutional alignment
Follow-up TODOs: None - all placeholders resolved
-->

# ShipsMind SpecKit Constitution

## Core Principles

### I. Specification-Driven Development
Every feature MUST begin with a complete specification document containing functional requirements, user stories, and acceptance criteria. No implementation SHALL commence without an approved spec.md that clearly defines the "what" and "why" without implementation details.

### II. Test-First Implementation (NON-NEGOTIABLE)
TDD is mandatory for all development: Tests written → Tests fail → Implementation → Tests pass. Contract tests MUST be created for all API endpoints before implementation. Integration tests MUST cover all user stories. This principle is non-negotiable and supersedes all delivery pressure.

### III. Structured Workflow Compliance
All feature development MUST follow the /specify → /clarify → /plan → /tasks → /implement workflow. Each phase MUST complete successfully before proceeding to the next. Phase gates cannot be bypassed without explicit constitutional amendment.

### IV. Library-First Integration
Prefer established libraries and services over custom implementations. Authentication MUST use proven services (e.g., Clerk, Auth0) rather than custom auth. Database operations MUST use established ORMs (e.g., Prisma, TypeORM). Custom implementations require justification in Complexity Tracking.

### V. Performance and Quality Standards
All authentication operations MUST complete within 200ms. API endpoints MUST respond within 100ms for GET requests, 200ms for mutations. Code coverage MUST exceed 80% for critical paths. Performance degradation requires explicit tracking and remediation plans.

## Quality Standards

### Code Quality Requirements
- TypeScript MUST be used for all JavaScript code with strict mode enabled
- ESLint and Prettier MUST pass without warnings before commits
- All components MUST have proper TypeScript interfaces and documentation
- Database schemas MUST be version-controlled and migrated through established tools

### Security Requirements
- All API endpoints MUST implement proper authentication and authorization
- Sensitive data MUST be handled through established security libraries
- Environment variables MUST be used for all configuration and secrets
- Security vulnerabilities MUST be addressed within 48 hours of discovery

## Development Workflow

### Requirement Definition
- Features MUST be specified using the standardized spec.md template
- Ambiguities MUST be resolved through the /clarify command before planning
- All user stories MUST include testable acceptance criteria
- Non-functional requirements MUST be quantified with measurable targets

### Implementation Process
- Planning phase MUST produce data models, contracts, and task breakdowns
- Tasks MUST be granular enough for independent implementation and testing
- Parallel execution opportunities MUST be identified with [P] markers
- All code changes MUST include corresponding test updates

### Quality Gates
- Specifications MUST pass constitutional compliance checks
- All tests MUST pass before merging to main branch
- Code reviews MUST verify adherence to constitutional principles
- Performance requirements MUST be validated before production deployment

## Governance

The constitution supersedes all other development practices and style guides. Amendments require explicit documentation of rationale, impact assessment, and migration plan for existing code. All feature specifications and implementation plans MUST verify constitutional compliance.

Constitutional violations MUST be documented in the Complexity Tracking section with justification. Repeated violations without justification indicate need for constitutional amendment or process improvement.

**Version**: 1.0.0 | **Ratified**: 2025-09-26 | **Last Amended**: 2025-09-26