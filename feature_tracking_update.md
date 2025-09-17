# Feature Tracking System - Team Update Guide

🎉 **New Feature Tracking System has been added to the project!**

## Quick Update Instructions

### Step 1: Update Your Branch
```bash
# Switch to main and get latest changes
git checkout main
git pull origin main

# Switch back to your feature branch
git checkout your-feature-branch

# Merge main into your branch (choose one method)
git merge main
# OR
git rebase main
```

### Step 2: Verify Installation
```bash
# Install any dependencies (should be instant)
pnpm install

# Test feature tracking commands
pnpm features:list
pnpm features:metrics
```

### Step 3: Check the Dashboard
```bash
# Start development server
pnpm dev

# Open in browser: http://localhost:3000/dev/features
```

## 🚀 You're Ready!

The feature tracking system is now available with these commands:

### Basic Commands
```bash
pnpm features:list              # List all features
pnpm features:metrics          # Show project metrics
pnpm features:create "Name" "Description" --priority high
pnpm features:move feat-001 active
```

### Spec-Driven Development
```bash
# Create feature with GitHub Spec Kit integration
pnpm features:spec "Add user authentication system"
```

### Web Dashboard
- Visit: http://localhost:3000/dev/features
- View features, backlog, metrics, and epics

## Optional: Document Your Current Work

If you're working on features that aren't tracked yet:

```bash
# Document your current feature
pnpm features:create "Your Feature Name" "What you're building" --priority medium --hours 16

# Set it as active
pnpm features:move feat-xxx active
```

## Need Help?

- **Full Documentation:** `docs/feature-tracking-guide.md`
- **Templates:** Check `docs/features/templates/`
- **Issues?** Run `pnpm features:metrics` to test if everything works

---

**That's it!** The system uses existing infrastructure, so no additional setup is required. Happy feature tracking! 🎯