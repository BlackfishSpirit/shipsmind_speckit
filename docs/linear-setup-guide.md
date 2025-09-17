# Linear MCP Setup Guide

## Overview

This guide walks through setting up Linear MCP integration for the ShipsMind project, enabling seamless project management through Claude Code.

## Prerequisites

- ✅ Claude Code installed and configured
- ✅ Linear workspace created (or access to existing workspace)
- ✅ Linear API access (paid plan required for API features)
- ✅ Team admin permissions in Linear workspace

## Step 1: Create Linear Workspace

### Option A: New Workspace
1. Visit [linear.app](https://linear.app)
2. Sign up and create new workspace
3. Choose workspace name (e.g., "ShipsMind")
4. Invite team members

### Option B: Existing Workspace
1. Use existing Linear workspace
2. Ensure you have admin permissions
3. Note workspace URL for configuration

## Step 2: Generate Linear API Key

1. **Go to Linear Settings**
   - Navigate to Settings → API → Personal API Keys
   - Or visit: `https://linear.app/settings/api`

2. **Create New API Key**
   - Click "Create new key"
   - Name: "Claude Code MCP Integration"
   - Permissions: Full access (required for MCP)
   - Click "Create"

3. **Save API Key**
   - Copy the generated key immediately
   - Store securely (it won't be shown again)
   - Format: `lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 3: Install Linear MCP

### Add Linear MCP to Claude Code
```bash
# Install Linear MCP
claude mcp add linear --transport http https://api.linear.app/mcp --api-key YOUR_LINEAR_API_KEY

# Alternative installation method (if above doesn't work)
claude mcp add linear --transport sse --api-key YOUR_LINEAR_API_KEY --endpoint https://api.linear.app/mcp
```

### Verify Installation
```bash
# Check MCP connection
claude mcp list

# Expected output should include:
# ✓ linear: Linear project management - Connected
```

## Step 4: Configure Linear Workspace

### Set Up Teams
1. **Create Development Team**
   - Go to Settings → Teams
   - Create "Development" team
   - Add team members

2. **Create Projects**
   - Create "ShipsMind Website" project
   - Set up project settings and timeline

### Configure Issue Types
1. **Standard Issue Types:**
   - Feature (for new functionality)
   - Bug (for bug fixes)
   - Task (for general tasks)
   - Epic (for large initiatives)

2. **Custom Labels:**
   - `frontend`, `backend`, `api`
   - `urgent`, `enhancement`, `refactor`
   - `spec-driven` (for GitHub Spec Kit features)

### Set Up Workflows
1. **Standard Workflow:**
   - Backlog → In Progress → In Review → Testing → Done

2. **Custom States (Optional):**
   - Planning (for spec generation phase)
   - Blocked (for issues waiting on dependencies)

## Step 5: GitHub Integration

### Connect GitHub Repository
1. **In Linear Settings:**
   - Go to Settings → Integrations → GitHub
   - Click "Install GitHub Integration"
   - Authorize Linear to access your repository

2. **Configure Repository:**
   - Select `shipsmind_speckit` repository
   - Enable automatic linking
   - Set up branch naming conventions

### Set Up Automatic Linking
```bash
# Commit message format for automatic linking:
git commit -m "Add user authentication

Implements JWT-based login system.
Fixes LIN-123"

# This will:
# - Link commit to Linear issue LIN-123
# - Update issue status automatically
# - Add commit details to issue timeline
```

## Step 6: Test Integration

### Test Claude MCP Commands
Ask Claude:
```
"Show me my Linear issues"
"Create a test Linear issue for authentication feature"
"List all Linear projects in the workspace"
"Update the test issue status to In Progress"
```

### Test GitHub Integration
1. Create a test Linear issue
2. Create a branch with issue number: `feature/lin-123-test-feature`
3. Make commits referencing the issue
4. Verify automatic linking in Linear

## Step 7: Team Migration

### Run Migration Script
```bash
# Migrate existing features to Linear
python .feature-tracking/scripts/linear-migration.py migrate --workspace your-workspace

# Verify migration
python .feature-tracking/scripts/linear-migration.py verify
```

### Team Training
1. **Share documentation:**
   - `docs/linear-hybrid-workflow.md`
   - `docs/feature-tracking-guide.md`

2. **Demo session:**
   - Show Linear workspace
   - Demonstrate Claude MCP commands
   - Walk through hybrid workflow

## Step 8: Advanced Configuration

### Slack/Discord Integration (Optional)
1. In Linear Settings → Integrations
2. Install Slack/Discord integration
3. Configure notification channels
4. Set up automated updates

### Custom Fields (Optional)
1. Create custom fields for:
   - Business Value (High/Medium/Low)
   - Technical Complexity (High/Medium/Low)
   - Estimated Hours

2. Use in feature tracking workflow

### API Webhooks (Advanced)
1. Set up webhooks for status changes
2. Sync with local documentation system
3. Trigger automated workflows

## Troubleshooting

### Common Issues

**Linear MCP not connecting:**
```bash
# Check API key format
echo $LINEAR_API_KEY

# Reinstall MCP
claude mcp remove linear
claude mcp add linear --transport http https://api.linear.app/mcp --api-key YOUR_KEY
```

**Claude can't access Linear:**
```bash
# Verify Claude can see Linear
claude mcp list

# Test with simple command
# Ask Claude: "List my Linear teams"
```

**GitHub integration not working:**
- Check repository permissions in Linear settings
- Verify webhook configuration
- Test with manual commit message linking

### Error Messages

**"Invalid API key":**
- Regenerate API key in Linear settings
- Ensure key has full access permissions
- Update MCP configuration with new key

**"Workspace not found":**
- Verify workspace URL format
- Check user permissions in workspace
- Ensure API key belongs to correct workspace

**"Rate limit exceeded":**
- Linear API has rate limits
- Wait and retry
- Consider reducing frequency of API calls

## Security Best Practices

### API Key Management
- Store API key securely (not in version control)
- Rotate API keys regularly
- Use environment variables for sensitive data
- Limit API key permissions to minimum required

### Workspace Security
- Enable two-factor authentication
- Review team member permissions regularly
- Monitor API usage and access logs
- Set up audit logging

## Backup & Recovery

### Data Export
```bash
# Export Linear data regularly
# (Linear provides export functionality in Settings)

# Backup local feature tracking
cp .feature-tracking/data/backlog.json .feature-tracking/data/backlog.backup.json
```

### Recovery Plan
1. Local system can operate independently if Linear is unavailable
2. GitHub integration provides additional backup via commit history
3. Regular exports ensure data recovery capability

## Success Checklist

After completing setup, verify:

- [ ] Linear MCP shows as connected in `claude mcp list`
- [ ] Can create Linear issues via Claude commands
- [ ] GitHub commits link to Linear issues automatically
- [ ] Team members can access Linear workspace
- [ ] Migration script completed successfully
- [ ] Local feature tracking system links to Linear
- [ ] Documentation updated for hybrid workflow

## Next Steps

1. **Team Training:** Schedule demo session for team
2. **Workflow Adoption:** Start using hybrid workflow for new features
3. **Process Refinement:** Adjust workflow based on team feedback
4. **Advanced Features:** Explore Linear automations and integrations

## Support Resources

- **Linear Documentation:** https://linear.app/docs
- **Linear API Reference:** https://developers.linear.app/docs
- **Claude MCP Documentation:** Available through Claude
- **Internal Documentation:**
  - `docs/linear-hybrid-workflow.md`
  - `docs/linear-migration-plan.md`

---

**Estimated Setup Time:** 2-4 hours for initial setup + team training
**Maintenance:** Minimal once configured properly