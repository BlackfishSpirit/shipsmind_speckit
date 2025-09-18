# 🚀 Team Setup Guide

## ShipsMind AI Consulting Website Development

Welcome to the ShipsMind project! This guide will get you up and running with our development workflow using **Specify + Claude Code** for rapid AI-assisted development.

## 🎯 **Daily Startup Commands (Start Here!)**

When opening this project in VSCode, run these commands to get everything ready:

### **Required Startup Commands**

```bash
# 1. Sync with remote repository (important for team collaboration)
git pull origin main

# 2. Start the development server (most important)
pnpm dev

# 3. Verify Claude Code MCP servers are connected
claude mcp list
```

### **Expected MCP Output**

```
✓ playwright: Browser automation & testing - Connected
✓ context7: Up-to-date documentation - Connected
✓ github: GitHub repository integration - Connected
✓ shadcn: shadcn/ui component library - Connected
✓ linear: Linear project management - Connected
```

### **Optional Commands (as needed)**

```bash
# If using Docker services for database
docker-compose up -d

# If database needs setup/reset
pnpm db:push

# If you need Prisma Studio for database management
pnpm db:studio
```

### **Team Collaboration Sync**

```bash
# Full team sync workflow (recommended daily)
git status                           # Check current state
git stash                           # Stash any uncommitted changes (if needed)
git checkout main                   # Switch to main branch
git pull origin main               # Get latest changes
git checkout your-feature-branch   # Return to your feature branch
git rebase main                     # Apply latest changes to your branch
git stash pop                       # Restore your uncommitted changes (if stashed)

# Quick sync (if on main branch already)
git pull origin main               # Get latest changes
```

### **Quick Health Check**

```bash
# Verify everything is working
pnpm dev &
claude mcp list
curl http://localhost:3000  # Should return HTML
```

**Most Important**: The `pnpm dev` command starts your Next.js development server. Your MCP servers automatically connect when you use Claude Code, so no manual activation needed.

---

## 🎯 **Interactive Workflow Checklist**

**📋 http://localhost:3000/dev/workflow**

**New to the project?** Use our interactive workflow dashboard that guides you through every step:

- ✅ **Real-time progress tracking** with user-specific persistence
- ✅ **Step-by-step guidance** with color-coded tasks and time estimates
- ✅ **Copy-paste commands** with one-click copying
- ✅ **Auto-detection** of completed tasks
- ✅ **Documentation links** for detailed explanations

**To access the checklist:**

1. Run the quick-start script: `./quick-start.bat` (Windows) or `./quick-start.sh` (macOS/Linux)
2. Or manually start: `pnpm dev` then visit http://localhost:3000/dev/workflow

---

## 🎯 **Quick Start (5 Minutes)**

### **1. Clone and Install**

```bash
git clone <repository-url>
cd shipsmind_speckit
pnpm install
```

### **2. Environment Setup**

```bash
# Copy environment template
cp .env.example .env.local

# Start development database
pnpm docker:dev

# Initialize database
pnpm db:generate
pnpm db:push

# Start development server
pnpm dev
```

### **3. Verify Setup**

- ✅ **App running**: http://localhost:3000
- ✅ **Database**: `pnpm db:studio` opens Prisma Studio
- ✅ **Docker services**: `docker ps` shows 4 containers

### **Start with the Task Tracking Dashboard**

```bash
# After starting the dev server, visit the interactive workflow guide
# Open in browser: http://localhost:3000/dev/workflow
```

**What it provides:**

- ✅ **Step-by-step checklist** from environment setup to deployment
- ✅ **Progress tracking** with user-specific persistence
- ✅ **Quick access** to commands and documentation
- ✅ **Visual indicators** for completed tasks and dependencies

---

## 🎯 **Interactive Task Tracking Dashboard**

**Access the guided workflow interface at: http://localhost:3000/dev/workflow**

### **How to Use the Task Tracker**

**1. First Time Setup:**

- Start your dev server with `pnpm dev`
- Navigate to http://localhost:3000/dev/workflow
- The system will detect your current environment status
- Follow the color-coded checklist items

**2. Progress Tracking:**

```bash
# Your progress is automatically saved to:
~/.shipsmind/workflows/
```

- ✅ **Green checkmarks**: Completed tasks
- 🔄 **Yellow indicators**: In progress or needs attention
- ❌ **Red alerts**: Missing dependencies or errors
- 📋 **Blue info**: Instructions or next steps

**3. Available Workflow Sections:**

- **Environment Setup**: Automated detection of Docker, MCP, and dependencies
- **Feature Development**: Guided Specify CLI workflow with examples
- **AI Reviews**: One-click access to code, design, and security reviews
- **Testing & Quality**: Linting, type-checking, and build validation
- **Git Workflow**: Guided commit and PR creation process

**4. Interactive Features:**

- **Copy buttons**: Click to copy commands to clipboard
- **Status detection**: Real-time check of running services
- **Documentation links**: Quick access to relevant guides
- **Command execution**: Some tasks can be run directly from the interface

**5. Team Collaboration:**

- Each team member has their own progress tracking
- Shared project status is visible to all team members
- Dependencies between tasks are clearly marked
- Blockers and issues are highlighted for team coordination

---

## 🤖 **AI-Powered Development Workflow**

This project includes advanced AI agents for code review, design review, and security analysis using Claude Code with Microsoft Playwright MCP integration.

### **Specify CLI Setup**

**GitHub Spec Kit is pre-integrated** - no manual installation needed! It's automatically installed with project dependencies.

**Verify installation**:

```bash
pnpm specify:check
```

**Expected output**:

```
✓ Git version control (available)
✓ Claude Code CLI (available)
✓ VS Code (for GitHub Copilot) (available)
Specify CLI is ready to use!
```

**Available Commands**:

```bash
# Check development environment
pnpm specify:check

# Initialize spec-driven development
pnpm specify:init

# General specify commands
pnpm specify -- <command>
```

### **Using Specify for Feature Development**

**1. Initialize Spec-Driven Development**:

```bash
pnpm specify:init
```

**2. Create a Specification** (Describe WHAT, not HOW):

```bash
pnpm specify -- specify "Add user authentication with email/password login"
```

**3. Generate Technical Plan**:

```bash
pnpm specify -- plan
```

**4. Break into Tasks**:

```bash
pnpm specify -- tasks
```

**5. Implement with Claude Code**:

- Use Claude Code in VS Code
- Reference the generated plan and tasks
- Let AI implement the features

### **AI Review Agents Setup**

**Available Agents & Commands:**

- **Pragmatic Code Review**: Comprehensive code quality and architecture review (agent + slash command)
- **Design Review**: UI/UX validation with Playwright browser automation (agent + slash command)
- **Security Review**: Security vulnerability analysis (slash command)
- **GitHub Actions**: Automated PR reviews with Claude Code integration

**Install Playwright MCP** (Required for design reviews):

```bash
claude mcp add playwright -- npx @playwright/mcp@latest
```

**Verify MCP Installation**:

```bash
claude mcp list
# Should show: playwright: npx @playwright/mcp@latest - ✓ Connected
```

**MCP Capabilities:**

- **Browser Automation**: Navigate, click, type, screenshot, test responsiveness
- **IDE Integration**: Get diagnostics, execute code, lint analysis
- **Semantic Search**: Find relevant code patterns and documentation

### **GitHub Actions Setup** (Optional)

**Enable Automated PR Reviews:**

1. Add `CLAUDE_CODE_OAUTH_TOKEN` to your repository secrets
2. GitHub Actions workflow is pre-configured in `.github/workflows/claude-code-review.yml`
3. Reviews will automatically run on every pull request

**Features:**

- Comprehensive code quality analysis
- Security vulnerability detection
- Performance and scalability review
- UI/UX and accessibility validation
- Automated feedback on every PR

---

## 🛠️ **Development Environment**

### **Prerequisites**

- **Node.js**: 18.17.0+
- **pnpm**: 8.0.0+
- **Docker**: For development database
- **Python**: 3.11+ (for Specify CLI)
- **Claude Code**: AI coding assistant

### **Key Technologies**

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Clerk (configured)
- **Deployment**: Production server with nginx

### **Development Services**

| Service       | URL                   | Purpose                     |
| ------------- | --------------------- | --------------------------- |
| App           | http://localhost:3000 | Next.js development server  |
| Database      | http://localhost:5433 | PostgreSQL development DB   |
| Prisma Studio | `pnpm db:studio`      | Database admin interface    |
| Portainer     | http://localhost:9000 | Docker container management |
| MailHog       | http://localhost:8025 | Email testing               |

---

## 📋 **Common Development Tasks**

### **Database Operations**

```bash
# View database in browser
pnpm db:studio

# Reset database (development only)
pnpm db:reset

# Push schema changes
pnpm db:push

# Generate Prisma client after schema changes
pnpm db:generate
```

### **Code Quality**

```bash
# Lint and fix code
pnpm lint:fix

# Format all files
pnpm format

# Type checking
pnpm type-check

# Run all checks
pnpm lint && pnpm type-check && pnpm format:check
```

### **Docker Services**

```bash
# Start all development containers
pnpm docker:dev

# Stop containers
pnpm docker:down

# View container logs
pnpm docker:logs
```

---

## 🎨 **VS Code Configuration**

The project includes optimized VS Code settings:

### **Recommended Extensions**

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- TypeScript and JavaScript

### **Auto-configured Features**

- ✅ Format on save
- ✅ Auto-fix ESLint errors
- ✅ Organize imports on save
- ✅ Tailwind CSS autocomplete
- ✅ TypeScript strict mode

---

## 🚀 **Building New Features**

### **AI-Powered Code Review Workflow**

**1. Code Review Agent**
Use after implementing features or before merging:

```
"I've finished implementing the user dashboard. Please review it using the pragmatic-code-review agent."
```

**2. Design Review Agent**
Use for UI/UX changes with Playwright automation:

```
"Please conduct a design review of the new homepage layout using the design-review agent."
```

**3. Security Review Command**
Use the slash command for security analysis:

```
/security-review
```

**4. New Slash Commands Available**
Complete git-based reviews of current branch changes:

```
/pragmatic-code-review
/design-review
```

**5. GitHub Actions Integration**
Automated code review on every pull request via `.github/workflows/claude-code-review.yml`

**Agent Features:**

- **Pragmatic Code Review**: Architecture, security, performance, maintainability analysis
- **Design Review**: Responsive testing, accessibility compliance, visual consistency
- **Security Review**: Vulnerability detection, OWASP compliance, penetration testing
- **Automated PR Reviews**: GitHub Actions integration for continuous quality

### **Spec-Driven Development Process**

**1. Start with a Specification**

```bash
# Example: Adding a new feature
pnpm specify -- specify "Add a client testimonials section with star ratings and filtering by industry"
```

**2. Use Claude Code Integration**

- Open the project in VS Code with Claude Code
- Reference the Specify output
- Use Claude to implement components, database changes, and styling

**3. Follow the Project Architecture**

```
components/
├── ui/           # shadcn/ui base components
├── marketing/    # Marketing-specific components
├── forms/        # Form components with validation
└── layout/       # Headers, footers, navigation

app/
├── (routes)/     # Next.js app router pages
├── api/          # API endpoints
└── globals.css   # Global styles

prisma/
└── schema.prisma # Database schema
```

**4. Test and Deploy**

```bash
# Test locally
pnpm dev

# Build for production
pnpm build

# Deploy (see PRODUCTION_DEPLOYMENT.md)
```

---

## 📖 **Documentation Resources**

| Document                    | Purpose                                       |
| --------------------------- | --------------------------------------------- |
| `PROJECT_SPECIFICATION.md`  | Overall project goals and requirements        |
| `TECHNICAL_PLAN.md`         | Technical architecture and implementation     |
| `PRODUCTION_DEPLOYMENT.md`  | Complete deployment guide and troubleshooting |
| `docs/feature-tracking-guide.md` | Feature tracking system documentation    |
| `docs/linear-hybrid-workflow.md` | Linear + GitHub Spec Kit workflow        |
| `docs/linear-migration-plan.md`  | Migration plan to Linear MCP             |
| `specify_workflow_guide.md` | Detailed Specify CLI usage                    |

---

## 🐛 **Troubleshooting**

### **Common Issues**

**TypeScript errors during build**:

```bash
# Remove unused imports
# Claude Code can help identify and fix these automatically
```

**Database connection issues**:

```bash
# Restart Docker services
pnpm docker:down && pnpm docker:dev

# Regenerate Prisma client
pnpm db:generate
```

**Port conflicts**:

```bash
# Check what's using the port
netstat -tlnp | grep :3000

# Kill the process or use a different port
```

**VS Code not recognizing Tailwind classes**:

```bash
# Restart VS Code and ensure Tailwind CSS extension is installed
# Check that tailwind.config.ts is properly configured
```

---

## 🌟 **Best Practices**

### **Development Workflow**

1. **Always start with Specify** - Describe the feature before implementing
2. **Use Claude Code** - Let AI handle the implementation details
3. **Follow the component structure** - Keep components organized and reusable
4. **Test in development** - Use `pnpm dev` and check all functionality
5. **Commit frequently** - Small, focused commits with descriptive messages

### **Code Standards**

- **TypeScript**: Use strict typing, no `any` types
- **Components**: Use shadcn/ui components as base, customize as needed
- **Styling**: Tailwind classes preferred, CSS modules for complex cases
- **Database**: Use Prisma for all database operations
- **Forms**: React Hook Form + Zod validation

### **Deployment**

- **Production deploys**: Follow `PRODUCTION_DEPLOYMENT.md` exactly
- **Environment variables**: Never commit secrets, use `.env.example` template
- **Database changes**: Always test migrations in development first

---

## 🌐 **Remote Development via SSH Tunnel**

For team members who need to develop remotely on the Ubuntu server (192.168.0.103) through the Cloudflare tunnel:

### **Prerequisites**

- Windows machine with PowerShell
- Access to the project (team member permissions)

### **SSH Tunnel Setup Steps**

**1. Install cloudflared:**

```powershell
# Download and install cloudflared
New-Item -ItemType Directory -Path "C:\cloudflared" -Force
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "C:\cloudflared\cloudflared.exe"

# Test installation
C:\cloudflared\cloudflared.exe version
```

**2. Add cloudflared to PATH:**

```powershell
# Add to current session
$env:PATH += ";C:\cloudflared"

# Add permanently to user PATH
$userPath = [Environment]::GetEnvironmentVariable("PATH", [EnvironmentVariableTarget]::User)
if ($userPath -notlike "*C:\cloudflared*") {
    [Environment]::SetEnvironmentVariable("PATH", "$userPath;C:\cloudflared", [EnvironmentVariableTarget]::User)
}

# Verify PATH works
cloudflared version
```

**3. Generate SSH key pair:**

```powershell
# Generate new SSH key (save as 'shipsmind-key')
ssh-keygen -t ed25519 -f shipsmind-key
```

**4. Copy SSH key to server** (while on LAN or ask admin to do this):

```bash
# Copy public key to server
scp shipsmind-key.pub mike@192.168.0.103:~/

# SSH to server and set up key
ssh mike@192.168.0.103
mkdir -p ~/.ssh
chmod 700 ~/.ssh
cat ~/shipsmind-key.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
rm ~/shipsmind-key.pub
exit
```

**5. Authenticate with Cloudflare:**

```powershell
# Login to Cloudflare (opens browser)
cloudflared tunnel login

# Verify tunnel access
cloudflared tunnel list
```

**6. Create SSH config file:**
Create `C:\Users\[YourUsername]\.ssh\config`:

```ini
Host shipsmind-remote
    HostName ssh.shipsmind.com
    User mike
    IdentityFile C:\Users\[YourUsername]\shipsmind-key
    ProxyCommand cloudflared access ssh --hostname %h
    ServerAliveInterval 30
    ServerAliveCountMax 3
```

**7. Test SSH connection:**

```powershell
ssh shipsmind-remote
```

### **VS Code Remote Development Setup**

**1. Install VS Code Extension:**

- Install "Remote - SSH" extension in VS Code

**2. Connect to Remote Server:**

- Press `Ctrl+Shift+P`
- Type "Remote-SSH: Connect to Host"
- Select `shipsmind-remote`
- VS Code opens connected to the Ubuntu server

**3. Start Development:**

```bash
# On the remote server, navigate to project
cd /path/to/shipsmind_speckit

# Start development server
pnpm dev

# Access via tunnel: https://shipsmind.com
```

### **Team Development Workflow**

**Daily Remote Development:**

1. Connect via VS Code Remote-SSH to `shipsmind-remote`
2. Navigate to project directory
3. Run `pnpm dev` to start development server
4. Access application via https://shipsmind.com
5. Use Claude Code with full MCP capabilities (all servers work remotely)
6. Commit and push changes through VS Code or terminal

**Benefits:**

- ✅ **Full development environment** on powerful Ubuntu server
- ✅ **All MCP servers available** (playwright, context7, github, shadcn)
- ✅ **Secure access** through Cloudflare tunnel
- ✅ **Team collaboration** on same server environment
- ✅ **Production-like setup** for testing

---

## 🤝 **Getting Help**

### **Resources**

- **Specify Documentation**: See `specify_workflow_guide.md`
- **Production Issues**: See `PRODUCTION_DEPLOYMENT.md` troubleshooting section
- **Claude Code**: Use the AI assistant for implementation questions
- **Technical Architecture**: Review `TECHNICAL_PLAN.md`

### **Development Support**

- **Database issues**: Check Docker containers with `pnpm docker:logs`
- **Build errors**: Run `pnpm type-check` and `pnpm lint` for diagnostics
- **Styling problems**: Use browser dev tools and Tailwind documentation

---

## ✅ **Ready to Start!**

You're now set up for rapid AI-assisted development with:

- ✅ **Complete development environment**
- ✅ **Specify CLI for spec-driven development**
- ✅ **Claude Code integration**
- ✅ **Production deployment pipeline**
- ✅ **Modern React/TypeScript stack**

**Start building your first feature**:

```bash
# Option 1: Check assigned Linear issues (Recommended)
# Visit: https://linear.app (your assigned development tasks)

# Option 2: Start with GitHub Spec Kit for new features
pnpm specify:init
pnpm features:spec "Your feature description here"

# Option 3: View development workflow checklist
# Visit: http://localhost:3000/dev/workflow

# Option 4: View feature tracking dashboard
# Visit: http://localhost:3000/dev/features
```

## **🔄 Hybrid Workflow: Linear + Development Guide**

Your development workflow now integrates Linear project management with local development tools:

### **Daily Development Flow:**

1. **Check Linear assignments**: https://linear.app (your tasks)
2. **Follow setup guide**: http://localhost:3000/dev/workflow (environment)
3. **Create feature branch**: `git checkout -b feature/[issue-id]-description`
4. **Develop using workflow**: Follow the step-by-step development checklist
5. **Commit with Linear linking**: `git commit -m "Feature work - Refs DEV-X"`
6. **GitHub auto-updates Linear**: Commits appear in Linear issue timeline

### **Integration Benefits:**

- ✅ **Project Management**: Linear handles assignments, priorities, roadmaps
- ✅ **Development Process**: Workflow pages guide setup, coding, reviews
- ✅ **Automatic Linking**: Git commits ↔ Linear issues via GitHub integration
- ✅ **Team Coordination**: Linear for planning, workflow for execution
- ✅ **Progress Tracking**: Both systems complement each other

### **Quick Links:**

- **Linear Workspace**: https://linear.app
- **Development Workflow**: http://localhost:3000/dev/workflow
- **Feature Dashboard**: http://localhost:3000/dev/features
- **Manual Setup Guide**: /linear_manual_setup.md

**Happy coding!** 🎉

---

_Last updated: September 18, 2025_
