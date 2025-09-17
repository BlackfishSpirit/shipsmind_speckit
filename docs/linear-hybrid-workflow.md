# Linear + GitHub Spec Kit: Hybrid Workflow

## Overview

This document describes the day-to-day workflow combining Linear MCP for project management with GitHub Spec Kit for technical specifications and local documentation for detailed architecture.

## Quick Reference

### Linear MCP Commands (via Claude)
```bash
# In Claude Code, ask:
"Show me my assigned Linear issues"
"Create a Linear issue for user authentication feature"
"Update Linear issue LIN-123 status to In Review"
"Add comment to LIN-456: Implementation completed"
"Show Linear project roadmap"
```

### Local Feature Commands
```bash
# Enhanced with Linear integration
pnpm features:create "Feature Name" "Description" --linear LIN-123
pnpm features:spec "Feature description" --linear-issue LIN-456
pnpm features:list --linear                  # Show Linear issue links
```

## Workflow Options

### Option A: Start with Linear (Recommended)

#### 1. Create Linear Issue
Ask Claude:
```
"Create a Linear issue for adding user authentication with email/password login.
Set priority to High and assign to me."
```

#### 2. Generate Technical Specification
```bash
# Link to Linear issue during spec generation
pnpm features:spec "User authentication with email/password login" --linear-issue LIN-123
```

#### 3. Implement with Claude Code
- Reference both Linear issue and generated specification
- Use Claude Code for implementation
- Comment on Linear issue with progress updates

#### 4. Track Progress in Linear
Ask Claude:
```
"Update Linear issue LIN-123 status to In Progress"
"Add comment to LIN-123: Backend authentication API completed"
"Update LIN-123 status to In Review when ready for review"
```

### Option B: Start with GitHub Spec Kit

#### 1. Generate Specification First
```bash
pnpm features:spec "Real-time chat support with AI assistance"
```

#### 2. Create Linear Issue from Spec
Ask Claude:
```
"Create a Linear issue for the real-time chat feature. Use the specification
from docs/features/backlog/feat-004-real-time-chat.md as the description."
```

#### 3. Link Systems
```bash
# Link local feature to Linear issue
pnpm features:create "Real-time Chat" "AI-powered chat support" --linear LIN-124
```

## Daily Workflow

### Morning Standup
Ask Claude:
```
"Show me my assigned Linear issues and their current status"
"What Linear issues are blocked or need attention?"
```

### Starting Work on a Feature
1. **Create Feature Branch**
   ```bash
   # Create and switch to feature branch
   git checkout -b feature/lin-123-user-authentication

   # Or using Linear issue naming convention
   git checkout -b feature/LIN-123-add-user-auth
   ```

2. **Update Linear Status**
   - Ask Claude: `"Update Linear issue LIN-123 to In Progress"`

3. **Review Technical Spec**
   - Check generated documentation in `docs/features/`
   - Review GitHub Spec Kit output for implementation guidance

4. **Implement with Claude Code**
   - Use generated architecture and task breakdown
   - Reference Linear issue for context and requirements
   - Make commits with Linear issue references

### Progress Updates
Ask Claude:
```
"Add comment to Linear issue LIN-123:
'Frontend components completed. Working on API integration next.'"
```

### Code Review Ready
1. **Push Feature Branch**
   ```bash
   # Push feature branch to remote
   git push -u origin feature/LIN-123-add-user-auth
   ```

2. **Create Pull Request**
   ```bash
   # Create PR with Linear issue reference
   gh pr create --title "Add user authentication (LIN-123)" --body "$(cat <<'EOF'
   ## Summary
   Implements user authentication with email/password login.

   ## Changes
   - Add JWT-based authentication API
   - Create login/logout components
   - Add user session management

   ## Linear Issue
   Closes LIN-123

   ## Test Plan
   - [ ] Test login with valid credentials
   - [ ] Test login with invalid credentials
   - [ ] Test logout functionality
   - [ ] Verify JWT token expiration
   EOF
   )"
   ```

3. **Update Linear Status**
   Ask Claude:
   ```
   "Update Linear issue LIN-123 status to In Review and add comment:
   'Feature implementation complete. PR created for code review.'"
   ```

### Deployment Ready
1. **Merge Pull Request**
   - After code review approval, merge PR
   - Delete feature branch: `git branch -d feature/LIN-123-add-user-auth`

2. **Update Linear Status**
   Ask Claude:
   ```
   "Update Linear issue LIN-123 status to Done and add comment:
   'Feature merged to main and deployed to production.'"
   ```

## Integration Points

### GitHub PR → Linear
When creating PRs, include Linear issue in commit messages:
```bash
git commit -m "Add user authentication API

Implements email/password login with JWT tokens.
Closes LIN-123"
```

Linear automatically links PR and updates issue status.

### Linear → Documentation
When Linear issues are updated, maintain local documentation:
```bash
# Sync status changes
pnpm features:move feat-001 review  # When Linear issue moves to "In Review"
```

### Spec Kit → Linear
When generating specifications, create corresponding Linear issues:
```bash
# Generate spec and create Linear issue
pnpm features:spec "Feature description" --create-linear --priority high
```

## Advanced Features

### Sprint Planning with Claude
```
"Show me all Linear issues in the current sprint"
"Create a sprint summary for this week's completed work"
"What are the priority items for next sprint?"
```

### Project Reporting
```
"Generate a status report for the ShipsMind project from Linear"
"Show velocity metrics for the development team"
"What features are at risk of missing their deadlines?"
```

### Team Coordination
```
"Show me what each team member is working on in Linear"
"List all blocked issues that need attention"
"Create a Linear issue for the bug reported in Slack"
```

## File Organization

### Local Documentation Structure
```
docs/features/
├── active/                    # Features currently being worked on
│   ├── feat-001-auth.md      # Detailed technical documentation
│   └── feat-002-chat.md      # GitHub Spec Kit generated specs
├── completed/                 # Completed features (for reference)
└── templates/                 # Documentation templates

.feature-tracking/
├── data/
│   ├── backlog.json          # Local feature data with Linear links
│   └── linear-sync.log       # Sync history
└── scripts/                   # Management and sync tools
```

### Linear Organization
- **Projects**: Major initiatives (e.g., "User Experience Overhaul")
- **Issues**: Individual features and tasks
- **Labels**: Technical tags (frontend, backend, api, etc.)
- **Cycles**: Sprint planning and execution

## Best Practices

### Issue Naming
- **Linear**: User-facing names ("Add user authentication")
- **Local Docs**: Technical names ("feat-001-oauth-jwt-implementation")

### Status Synchronization
Keep Linear as source of truth for status:
1. Update Linear status first
2. Sync local documentation to match
3. Use Claude to automate updates when possible

### Documentation Strategy
- **Linear**: High-level requirements, business context, team communication
- **Local Docs**: Technical specifications, architecture details, implementation notes
- **GitHub**: Code, PRs, technical discussions

### Team Communication
- Use Linear comments for project updates and blockers
- Use local documentation for technical implementation details
- Use GitHub for code-specific discussions and reviews

## Troubleshooting

### Linear MCP Issues
```bash
# Check Linear MCP connection
claude mcp list
# Should show: linear: Linear project management - Connected

# If not connected, reinstall
claude mcp add linear --transport http https://api.linear.app/mcp
```

### Sync Issues
```bash
# Check sync status
python .feature-tracking/scripts/linear-integration.py status

# Force sync
python .feature-tracking/scripts/linear-integration.py sync --force
```

### Common Problems

**Linear issue not linking to local feature:**
```bash
# Add Linear link to existing feature
pnpm features:create "Feature Name" "Description" --linear LIN-123
```

**Local documentation out of sync:**
```bash
# Update based on Linear status
pnpm features:sync-from-linear LIN-123
```

## Migration Checklist

For teams migrating from local-only tracking:

- [ ] Install Linear MCP via Claude Code
- [ ] Create Linear workspace and invite team
- [ ] Run migration script: `python .feature-tracking/scripts/linear-migration.py migrate`
- [ ] Verify migrated issues in Linear
- [ ] Train team on hybrid workflow
- [ ] Update team documentation and processes

## Benefits of Hybrid Approach

### Immediate Gains:
- ✅ Professional project management interface
- ✅ Real-time team collaboration and visibility
- ✅ Automated time tracking and sprint metrics
- ✅ Client-facing roadmaps and progress sharing

### Technical Benefits:
- ✅ Maintains GitHub Spec Kit integration
- ✅ Detailed technical documentation preserved
- ✅ Local development dashboard still available
- ✅ No vendor lock-in (data remains in repository)

### Team Benefits:
- ✅ Industry-standard workflow familiar to new hires
- ✅ Better sprint planning and retrospectives
- ✅ Automated notifications and progress tracking
- ✅ Scalable as team grows

---

**Quick Start**: Try asking Claude: `"Show me my Linear issues and help me plan today's work"`