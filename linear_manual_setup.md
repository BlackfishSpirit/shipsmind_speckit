# Linear Manual Setup Instructions

## Overview

This guide provides step-by-step instructions to manually configure your Linear workspace with the projects, teams, labels, and workflows required for the ShipsMind project.

**Prerequisites:**
- ✅ Linear MCP connection working (verified)
- ✅ Admin access to Linear workspace
- ✅ Linear workspace URL: https://linear.app

## Step 1: Create Projects

1. **Navigate to Linear workspace**
   - Go to https://linear.app
   - Select your workspace

2. **Create ShipsMind Website Project**
   - Click the `+` button in your workspace or team's project view
   - Fill in project details:
     - Name: `ShipsMind Website` (required)
     - Description: `Main website development project for ShipsMind AI Consulting`
     - Assign a project lead (recommended)
     - Update the project icon (optional)
     - Set start and target dates using timeframe options (optional)
   - Click "Create Project"

## Step 2: Set Up Teams

1. **Access Team Settings**
   - Click Settings (gear icon) → Teams
   - Or click the workspace in the upper left corner → Settings → Teams

2. **Create Development Team**
   - Click "+ Add team" or use command bar (Cmd/Ctrl + K)
   - Name: `Development`
   - Identifier: `DEV` (3-letter code)
   - Description: `Frontend, backend, and infrastructure development`
   - Configure if team should be private (optional)
   - Click "Create Team"

3. **Create Product Team**
   - Click "+ Add team"
   - Name: `Product`
   - Identifier: `PRD`
   - Description: `Product management and feature planning`
   - Click "Create Team"

4. **Create Design Team**
   - Click "+ Add team"
   - Name: `Design`
   - Identifier: `DES`
   - Description: `UI/UX design and user experience`
   - Click "Create Team"

## Step 3: Configure Team-Specific Settings

For each team created, configure the following settings:

1. **Team Configuration Options**
   - Timezone settings
   - Team-specific issue labels
   - Issue templates
   - Workflow statuses (see Step 5)
   - Slack notifications (if using Slack)
   - Cycles configuration

2. **Copy Settings Between Teams**
   - When creating new teams, you can copy settings from existing teams
   - This saves time if teams share similar workflows

## Step 4: Add Custom Issue Labels (Team-Specific)

1. **Navigate to Team Settings**
   - Go to Settings → Teams → [Select Team] → Labels

2. **Create Technical Issue Labels for each team:**
   - `frontend` - For front-end related work
   - `backend` - For server-side development
   - `api` - For API development and integration

3. **Create Priority Issue Labels:**
   - `urgent` - High priority items
   - `enhancement` - Feature improvements
   - `refactor` - Code refactoring tasks

4. **Create Workflow Issue Labels:**
   - `spec-driven` - Features developed using GitHub Spec Kit workflow

**Note:** These are issue labels that you can apply to Linear issues to categorize and filter them. Each team can have their own set of labels.

## Step 5: Configure Custom Workflow Statuses

**Note:** Workflow statuses are team-specific in Linear.

1. **Access Status Configuration**
   - Go to Settings → Teams → [Select Team] → Issue statuses & automations
   - Or: Settings → Administration → Teams → [Team] → Workflow → Issue statuses and automations

2. **Create Custom Statuses by Category**

   **Backlog Category:**
   - Default: Backlog
   - Add: Icebox (for future ideas)

   **Unstarted Category:**
   - Default: Todo
   - Keep as-is or rename

   **Started Category:**
   - Default: In Progress
   - Add: In Review
   - Add: Testing

   **Completed Category:**
   - Default: Done
   - Keep as-is

   **Canceled Category:**
   - Default: Canceled
   - Keep as-is

3. **Add New Statuses**
   - Click the `+` button next to any category
   - Name your new status (e.g., "In Review", "Testing")
   - Choose color and description
   - Click "Create"

4. **Reorder Statuses**
   - Drag statuses to reorder within their category
   - Categories cannot be moved but statuses within them can be reordered

## Step 6: GitHub Integration Setup

1. **Access Integration Settings**
   - Click the workspace in the upper left corner → Settings
   - Navigate to Integrations → GitHub
   - Or go to Settings → Integrations and find GitHub

2. **Connect GitHub Integration**
   - Click "Connect" button next to "Connect Linear with GitHub pull requests"
   - Follow OAuth flow to authorize Linear access to GitHub
   - **Recommendation:** Only grant access to the specific `shipsmind_speckit` repository for security

3. **Configure Repository Access**
   - Select your GitHub organization/account
   - Choose `shipsmind_speckit` repository
   - The integration will enable automatic linking between PRs/commits and Linear issues

4. **Set Up Branch Format**
   - After setup, go to the GitHub integration settings
   - Find the "Branch format" section
   - Choose `identifier-title` format
   - This enables branches like: `feature/lin-123-user-authentication`

5. **Configure Automatic Linking**
   - **Branch Names:** Include issue ID in branch name (e.g., `feature/lin-123-feature-name`)
   - **PR Titles:** Include issue ID in PR title
   - **Commit Messages:** Use formats like:
     - `Fixes LIN-123` (will close the issue when PR merges)
     - `Refs LIN-456` (will link but not close)
     - `Updates LIN-789` (will link and update status)

6. **Enable Team Automations**
   - After integration setup, team members can configure:
     - PR automation under team workflow settings
     - Personal git automations under account preferences
   - Issues automatically update from "In Progress" to "Done" as PRs move from draft to merged

## Step 7: Team Member Setup

1. **Invite Team Members**
   - Go to Settings → Members
   - Click "Invite Members"
   - Add team member emails
   - Assign appropriate teams (Development, Product, Design)

2. **Set Permissions**
   - Admin: Full workspace access
   - Member: Standard team access
   - Guest: Limited access to specific projects

3. **Configure Notifications**
   - Each member should configure their notification preferences
   - Recommended: Enable email for assignments and mentions

## Step 8: Multi-Team Project Configuration

1. **Add Teams to Projects**
   - Go to Projects → ShipsMind Website
   - From the project details page, add additional teams
   - Click "Add teams" and select Development, Product, Design
   - This creates tabs to toggle between team-specific issues within the project

2. **Configure Project Settings**
   - Add team members to the project
   - Create custom issue views within the project
   - Attach relevant documents and links
   - Set project description and timeline

## Step 9: Verification Checklist

After completing setup, verify the following:

- [ ] **Projects**: "ShipsMind Website" project exists with multiple teams assigned
- [ ] **Teams**: Development, Product, Design teams created with appropriate identifiers
- [ ] **Workflow Statuses**: Custom statuses (In Review, Testing) added to each team
- [ ] **Labels**: Team-specific labels (frontend, backend, api, urgent, enhancement, refactor, spec-driven) created
- [ ] **GitHub Integration**: Repository connected with automatic PR/commit linking enabled
- [ ] **Branch Format**: `identifier-title` format configured for automatic linking
- [ ] **Team Members**: All members invited and assigned to appropriate teams

## Step 10: Test the Setup

1. **Test GitHub Integration with Existing Issue**

   **Use Issue:** PRD-1 (Test issue) - currently available in your workspace

   **Create test branch and commit:**
   ```bash
   # Navigate to your project
   cd E:\ClaudeCode\shipsmind_speckit

   # Create test branch
   git checkout -b feature/prd-1-test-integration

   # Make a small change
   echo "// Testing Linear integration with PRD-1" >> test-integration.md

   # Commit with Linear issue reference
   git add .
   git commit -m "Test GitHub integration - Refs PRD-1"

   # Push to GitHub
   git push origin feature/prd-1-test-integration
   ```

2. **Verify Integration Works**
   - **In Linear:** Go to issue PRD-1
   - **Look for:** Commit should appear in the issue timeline/activity
   - **Wait:** Allow 5-10 minutes for sync
   - **Expected:** You should see the commit "Test GitHub integration - Refs PRD-1" linked to the issue

3. **Test Claude MCP Integration**
   - Ask Claude: "Show me Linear issue PRD-1"
   - Ask Claude: "Add a comment to PRD-1 saying GitHub integration test completed"
   - Verify Claude can interact with the configured workspace

## Next Steps

After manual setup is complete:

1. **Run Migration Script**
   ```bash
   python .feature-tracking/scripts/linear-migration.py migrate --workspace blackfishspirit
   ```

2. **Update Team Documentation**
   - Update `TEAM_SETUP.md` with new Linear workflow
   - Share Linear workspace URL with team
   - Schedule team training session

3. **Begin Using Linear**
   - Start creating issues for new features
   - Use GitHub Spec Kit + Linear hybrid workflow
   - Monitor integration and adjust as needed

## Troubleshooting

**Common Issues:**

- **GitHub integration not working**: Check repository permissions and webhook configuration
- **Team members can't see projects**: Verify team assignments in project settings
- **Workflow states missing**: Ensure all teams have access to the same workflow
- **Labels not appearing**: Check label visibility settings for each team

## Support Resources

- **Linear Documentation**: https://linear.app/docs
- **GitHub Integration Guide**: https://linear.app/docs/github
- **API Documentation**: https://developers.linear.app/docs

---

**Estimated Setup Time**: 30-45 minutes for complete manual configuration
**Next**: Run the migration script to import existing features