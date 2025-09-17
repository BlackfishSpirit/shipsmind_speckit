# Linear MCP Migration Plan

## Overview

This document outlines the migration from our custom feature tracking system to Linear MCP while preserving the benefits of GitHub Spec Kit integration and technical documentation.

## Migration Strategy: Hybrid Approach

### **Linear MCP Will Handle:**
- ✅ Primary issue/feature tracking
- ✅ Sprint planning and roadmaps
- ✅ Team collaboration (comments, mentions, notifications)
- ✅ Time tracking and velocity metrics
- ✅ Project management workflows
- ✅ Client-facing roadmaps

### **Current System Will Complement:**
- ✅ GitHub Spec Kit integration
- ✅ Technical documentation templates
- ✅ Spec-driven development workflow
- ✅ Local development dashboard (backup/reference)
- ✅ Detailed architecture documentation

## Phase 1: Linear MCP Setup (Week 1)

### Step 1: Linear Workspace Configuration
```bash
# 1. Create Linear workspace at https://linear.app
# 2. Set up teams (e.g., "Development", "Product", "Design")
# 3. Configure projects (e.g., "ShipsMind Website", "Core Platform")
# 4. Set up issue types:
#    - Feature, Bug, Task, Epic, Spike
# 5. Configure workflows:
#    - Backlog → In Progress → In Review → Testing → Done
```

### Step 2: Install Linear MCP
```bash
# Add Linear MCP to Claude Code
claude mcp add linear --transport http https://api.linear.app/mcp

# Verify installation
claude mcp list
# Expected: linear: Linear project management - Connected
```

### Step 3: Configure GitHub Integration
```bash
# In Linear settings:
# 1. Go to Settings → Integrations → GitHub
# 2. Connect your GitHub repository
# 3. Enable automatic issue linking
# 4. Configure PR/commit → Linear issue linking
```

### Step 4: Team Setup
```bash
# 1. Invite team members to Linear workspace
# 2. Assign team roles and permissions
# 3. Set up notification preferences
# 4. Configure Slack/Discord integration (optional)
```

## Phase 2: Migration Script & Data Transfer (Week 1-2)

### Automated Migration
Run the migration script to transfer existing features:

```bash
# Execute migration
python .feature-tracking/scripts/linear-migration.py migrate --workspace your-workspace

# Verify migration
python .feature-tracking/scripts/linear-migration.py verify
```

### What Gets Migrated:
- **Features → Linear Issues** with proper labels and priorities
- **Epics → Linear Projects** or Epic-type issues
- **Status mapping** to Linear workflow states
- **Documentation links** preserved in issue descriptions

### Manual Steps:
- Review migrated issues in Linear
- Adjust priorities and assignments
- Set up sprints/cycles
- Configure project roadmaps

## Phase 3: Workflow Integration (Week 2)

### New Feature Development Workflow

#### Option A: Start with Linear
```bash
# 1. Create Linear issue (via web UI or Claude)
# Ask Claude: "Create a Linear issue for user authentication feature"

# 2. Generate specification with GitHub Spec Kit
pnpm features:spec "User authentication with email/password login" --linear-issue LIN-123

# 3. Link documentation to Linear issue
# 4. Track progress in Linear
```

#### Option B: Start with GitHub Spec Kit
```bash
# 1. Generate specification
pnpm features:spec "User authentication system"

# 2. Create Linear issue with generated spec
python .feature-tracking/scripts/linear-integration.py create-from-spec feat-001

# 3. Link and track in Linear
```

### Updated Commands
```bash
# Enhanced feature commands with Linear integration
pnpm features:create --linear                    # Create in both systems
pnpm features:sync feat-001                      # Sync status with Linear
pnpm features:spec "description" --linear        # Create spec + Linear issue
```

## Phase 4: Team Migration (Week 2-3)

### Team Training
1. **Linear Basics** - Issue creation, status updates, commenting
2. **GitHub Integration** - How PR linking works
3. **New Workflow** - Hybrid approach documentation
4. **Claude Integration** - Using Linear MCP with Claude Code

### Gradual Rollout
- Week 1: Development team adopts Linear for new features
- Week 2: All teams migrate active work to Linear
- Week 3: Full adoption, legacy system as backup

## Phase 5: Enhanced Integration (Week 3-4)

### Advanced Features
```bash
# Claude Code + Linear MCP integration
# Ask Claude:
"Show me my assigned Linear issues"
"Update Linear issue LIN-123 status to In Review"
"Create a Linear issue for the bug I found in authentication"
"Add a comment to LIN-456 with implementation details"
```

### Automated Workflows
- **PR Creation** → Auto-update Linear issue status
- **Commit Messages** → Auto-comment on Linear issues
- **Linear Status Change** → Update local documentation
- **Sprint Planning** → Generate GitHub Spec Kit specifications

## Migration Timeline

| Week | Phase | Activities | Deliverables |
|------|-------|------------|--------------|
| 1 | Setup | Linear workspace, MCP install, GitHub integration | Working Linear + Claude integration |
| 2 | Migration | Run migration script, team training | All features in Linear |
| 3 | Adoption | Team workflow transition, documentation updates | Hybrid workflow operational |
| 4 | Optimization | Advanced integrations, process refinement | Full production system |

## Risk Mitigation

### Backup Strategy
- Keep current system operational during migration
- Export Linear data weekly as backup
- Maintain local documentation sync

### Rollback Plan
If Linear integration fails:
1. Continue with current system
2. Export any Linear data created
3. Revert to local-only feature tracking

### Data Integrity
- Migration script includes validation
- Manual verification checklist
- Automated sync monitoring

## Success Metrics

### Week 2 Goals:
- [ ] All team members can create Linear issues
- [ ] GitHub PR → Linear linking works
- [ ] Claude MCP Linear integration functional
- [ ] 90% of active features migrated

### Week 4 Goals:
- [ ] Team velocity increased by 20%
- [ ] Average issue cycle time measured
- [ ] Client roadmap sharing operational
- [ ] Zero data loss from migration

## Post-Migration Benefits

### Immediate Gains:
- Professional project management interface
- Better team collaboration and visibility
- Automated time tracking and velocity metrics
- Client-facing roadmaps and progress sharing

### Long-term Benefits:
- Scalable project management as team grows
- Industry-standard workflows and reporting
- Advanced sprint planning and retrospectives
- Integration ecosystem (Slack, Figma, etc.)

## Support & Resources

### Documentation:
- `docs/linear-hybrid-workflow.md` - Day-to-day workflow
- `docs/linear-setup-guide.md` - Technical setup instructions
- `TEAM_SETUP.md` - Updated team onboarding

### Support Channels:
- Linear documentation: https://linear.app/docs
- Claude MCP Linear docs: Available through Claude
- Internal team Slack/Discord for questions

---

**Next Steps:**
1. Review this plan with team
2. Set up Linear workspace
3. Install Linear MCP
4. Execute Phase 1 setup

**Estimated Total Migration Time:** 2-4 weeks depending on team size and feature count.