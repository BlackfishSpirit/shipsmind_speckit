# GitHub Spec Kit Workflow Guide: Creating a Website

This comprehensive guide documents the complete process of using GitHub Spec Kit to organize and develop a website project, including our actual experience and troubleshooting steps.

## Table of Contents

1. [Overview](#overview)
2. [Installation Experience](#installation-experience)
3. [Complete Development Environment Setup](#complete-development-environment-setup)
4. [The Specify Workflow](#the-specify-workflow)
5. [Step-by-Step Website Creation](#step-by-step-website-creation)
6. [Team Implementation Guide](#team-implementation-guide)
7. [Troubleshooting](#troubleshooting)
8. [Chat Session Documentation](#chat-session-documentation)

## Overview

GitHub Spec Kit implements "Spec-Driven Development" - a methodology that emphasizes describing **what** and **why** before diving into **how**. This approach helps teams:

- Create clear project specifications
- Generate focused technical plans
- Break down work into actionable tasks
- Leverage AI agents effectively

## Installation Experience

### What We Encountered

During our installation on Windows, we discovered that the Specify CLI has Unicode encoding issues with the Windows console. Here's how we solved it:

**Problem:** CLI crashed with `UnicodeEncodeError` when displaying banner
**Solution:** Created a wrapper script that handles encoding properly

### Our Solution: specify_wrapper.py

```python
#!/usr/bin/env python
import os
import sys
import subprocess

# Set environment variables to handle Unicode better
os.environ['PYTHONIOENCODING'] = 'utf-8'
os.environ['TERM'] = 'dumb'

# Path to the specify executable
specify_path = r"C:/Users/Michael/AppData/Roaming/Python/Python313/Scripts/specify.exe"

try:
    # Run the specify command with all arguments passed through
    result = subprocess.run([sys.executable, specify_path] + sys.argv[1:], 
                          capture_output=False, 
                          text=True,
                          encoding='utf-8')
    sys.exit(result.returncode)
except FileNotFoundError:
    print("Error: specify.exe not found. Make sure it's installed.")
    sys.exit(1)
except Exception as e:
    print(f"Error running specify: {e}")
    sys.exit(1)
```

## Complete Development Environment Setup

This section ensures your entire team has the exact same development environment, including MCP configurations, VS Code settings, and Docker services.

### Prerequisites Checklist

- [ ] Windows 10/11 or macOS/Linux
- [ ] Python 3.11+ installed
- [ ] Node.js 18.17.0+ installed  
- [ ] pnpm 8.0.0+ installed
- [ ] Docker Desktop installed and running
- [ ] VS Code with recommended extensions
- [ ] Claude Code CLI access

### Step 1: Project Setup

```bash
# Clone or create your project directory
git clone <your-repo> 
cd your-project

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
```

### Step 2: Docker Development Environment

**Start the development services:**
```bash
# Start all development containers
pnpm docker:dev

# Verify containers are running
docker ps

# Expected services:
# - PostgreSQL (port 5433)
# - Redis (port 6379)  
# - Portainer (port 9000)
# - MailHog (port 8025)
```

**Access Development Tools:**
- **Portainer UI:** http://localhost:9000 (container management)
- **MailHog UI:** http://localhost:8025 (email testing)
- **Database:** `postgresql://speckit_user:speckit_password@localhost:5433/shipsmind_speckit_development`

### Step 3: VS Code Configuration

The project includes `.vscode/settings.json` with optimized settings for:

**TypeScript & Imports:**
- Auto-imports enabled
- Non-relative import preferences  
- File move updates enabled

**Code Formatting:**
- Format on save enabled
- Prettier as default formatter
- ESLint auto-fix on save
- Import organization on save

**Tailwind CSS Support:**
- IntelliSense for `cn()`, `cx()`, `cva()` functions
- CSS validation disabled (Tailwind handles this)
- String suggestions enabled

**Performance Optimizations:**
- Excludes `.next`, `node_modules`, `dist` from search
- Optimized file associations
- Prisma notifications disabled

**Required VS Code Extensions:**
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint", 
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Step 4: MCP (Model Context Protocol) Configuration

Your project includes MCP server configuration for enhanced AI capabilities.

**Current MCP Configuration (`.claude/settings.local.json`):**
```json
{
  "permissions": {
    "allow": [
      "Bash(mkdir:*)",
      "Bash(python:*)", 
      "Read(//e/ClaudeCode/**)",
      "Bash(rm:*)",
      "Bash(mcp list:*)",
      "mcp__archon__perform_rag_query"
    ],
    "deny": [],
    "ask": []
  }
}
```

**MCP Features Available:**
- **Archon RAG Queries** - Semantic search and knowledge retrieval
- **Enhanced file operations** - Safe bash commands and file access
- **Project-scoped access** - Secure permissions for development tasks

**Verifying MCP Setup:**
```bash
# Check if MCP servers are running (in Claude Code)
mcp list

# Test RAG functionality
# (Available through Claude Code interface)
```

### Step 5: Database Setup

**Initialize Database:**
```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database  
pnpm db:push

# (Optional) Seed database
pnpm db:seed
```

**Database Management:**
```bash
# Open Prisma Studio
pnpm db:studio

# Reset database (development only)
pnpm db:reset

# View database logs
pnpm docker:logs
```

### Step 6: Development Workflow

**Daily Development Startup:**
```bash
# 1. Start Docker services
pnpm docker:dev

# 2. Install any new dependencies
pnpm install

# 3. Update database if needed
pnpm db:generate

# 4. Start development server
pnpm dev

# 5. Open in browser: http://localhost:3000
```

**Code Quality Commands:**
```bash
# Lint and fix issues
pnpm lint:fix

# Format all files
pnpm format

# Type checking
pnpm type-check

# Run all checks
pnpm lint && pnpm type-check && pnpm format:check
```

**Shutdown:**
```bash
# Stop development server (Ctrl+C)
# Stop Docker containers
pnpm docker:down
```

### Step 7: Team Sync Verification

**Environment Health Check:**
```bash
# Verify all systems
pnpm docker:dev          # ✅ Docker services
docker ps                # ✅ 4 containers running  
pnpm type-check          # ✅ TypeScript passes
pnpm lint                # ✅ ESLint passes
pnpm format:check        # ✅ Prettier passes
```

**Team Consistency Checklist:**
- [ ] Same Node.js version (`node --version`)
- [ ] Same pnpm version (`pnpm --version`)
- [ ] Docker containers running (`docker ps`)
- [ ] VS Code extensions installed
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] MCP permissions configured
- [ ] Code formatting consistent

### Troubleshooting Development Environment

**Docker Issues:**
```bash
# Containers won't start
pnpm docker:down
docker system prune -f
pnpm docker:dev

# Port conflicts  
docker ps -a
# Kill conflicting processes or change ports
```

**Database Issues:**
```bash
# Connection refused
docker logs shipsmind-speckit-postgres-dev

# Schema out of sync
pnpm db:push --force-reset
```

**VS Code Issues:**
```bash
# Extensions not working
# 1. Restart VS Code
# 2. Reload window (Ctrl+Shift+P > Reload Window)
# 3. Check extension recommendations
```

## The Specify Workflow

The GitHub Spec Kit follows a 4-step process:

### 1. **Specify** (`/specify` command)
- Describe the project's purpose and requirements
- Focus on **what** and **why**, not technical details
- Example: "Build a website that showcases our team's projects with a clean, modern design"

### 2. **Plan** (`/plan` command)
- Generate technical implementation approach
- Define architecture and tech stack
- Example: "Use React with Tailwind CSS, deploy on Vercel"

### 3. **Tasks** (`/tasks` command)
- Break down the plan into actionable items
- Create specific, measurable tasks
- Example: "Create header component with navigation menu"

### 4. **Implement**
- Have AI agents execute the tasks
- Review and iterate on implementations

## Step-by-Step Website Creation

### Phase 1: Project Setup

```bash
# 1. Install Specify CLI (see specifyinstall.md for details)
pip install git+https://github.com/github/spec-kit.git

# 2. Create wrapper script (Windows users)
# Copy specify_wrapper.py to your project

# 3. Verify installation
python specify_wrapper.py check
```

Expected output:
```
Check Available Tools
├── ● Git version control (available)
├── ● Claude Code CLI (available)
├── ● Gemini CLI (not found - optional)
├── ● VS Code (for GitHub Copilot) (available)
└── ● Cursor IDE agent (optional) (not found - optional)

Specify CLI is ready to use!
```

### Phase 2: Initialize Project

```bash
# Initialize new project
python specify_wrapper.py init my_website

# Or manually create .specify directory structure:
mkdir -p .specify/{memory,scripts,templates}
```

### Phase 3: Create Specification

This is where you describe **what** your website should accomplish:

**Example Website Specification:**

```markdown
# Website Specification

## Purpose
Create a professional portfolio website that showcases our development team's projects and capabilities.

## Target Users
- Potential clients looking for development services
- Developers interested in joining our team
- Project stakeholders wanting to see our work

## Key Features
1. **Project Portfolio** - Showcase completed projects with descriptions, technologies used, and links
2. **Team Profiles** - Display team member bios, skills, and contact information
3. **Contact Form** - Allow visitors to reach out for inquiries
4. **Blog Section** - Share technical insights and company updates
5. **Responsive Design** - Work seamlessly on desktop and mobile devices

## Success Criteria
- Fast loading times (< 3 seconds)
- Accessible design (WCAG 2.1 compliance)
- SEO optimized for relevant keywords
- Easy content management for non-technical team members
```

### Phase 4: Generate Technical Plan

Based on your specification, create a technical implementation plan:

**Example Technical Plan:**

```markdown
# Technical Implementation Plan

## Architecture
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Content Management**: Markdown files with frontmatter
- **Deployment**: Vercel for automatic deployments
- **Domain**: Custom domain with HTTPS

## Project Structure
```
src/
├── components/
│   ├── Header/
│   ├── Footer/
│   ├── ProjectCard/
│   └── ContactForm/
├── pages/
│   ├── Home/
│   ├── Portfolio/
│   ├── Team/
│   └── Contact/
├── content/
│   ├── projects/
│   └── blog/
└── styles/
```

## Key Dependencies
- React Router for navigation
- React Hook Form for contact form
- Markdown parser for content
- Image optimization library
```

### Phase 5: Break Down into Tasks

Create specific, actionable tasks:

```markdown
# Website Development Tasks

## Setup & Configuration
- [ ] Initialize React project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up project structure
- [ ] Configure ESLint and Prettier

## Core Components
- [ ] Create responsive header with navigation
- [ ] Build footer with social links
- [ ] Develop project card component
- [ ] Implement contact form with validation

## Pages
- [ ] Build homepage with hero section
- [ ] Create portfolio page with project grid
- [ ] Develop team page with member profiles
- [ ] Implement contact page

## Content & Deployment
- [ ] Add project content and images
- [ ] Optimize images for web
- [ ] Configure Vercel deployment
- [ ] Set up custom domain
- [ ] Test across devices and browsers
```

## Team Implementation Guide

### For Project Managers
1. **Start with Specification** - Work with stakeholders to clearly define the "what" and "why"
2. **Review Technical Plans** - Ensure plans align with business requirements
3. **Track Task Progress** - Use the task breakdown for project tracking

### For Developers
1. **Follow the Plan** - Use the generated technical plan as your implementation guide
2. **Update Tasks** - Mark tasks complete and add new ones as needed
3. **Document Decisions** - Keep the specification updated with any changes

### For AI Agent Integration
1. **Provide Context** - Share the specification and plan with your AI coding assistant
2. **Task-by-Task Implementation** - Work through tasks systematically
3. **Review and Iterate** - Have AI agents implement, then review and refine

## Troubleshooting

### Common Issues from Our Experience

**Issue: CLI Unicode Errors on Windows**
- **Symptom**: `UnicodeEncodeError` when running specify commands
- **Solution**: Use the `specify_wrapper.py` script instead of direct CLI calls

**Issue: init Command Hangs**
- **Symptom**: `specify init` command appears to freeze
- **Solution**: The command may be waiting for interactive input. Try running in Windows Terminal or PowerShell

**Issue: Commands Not Found**
- **Symptom**: `specify: command not found`
- **Solution**: Use full path to wrapper script or copy it to your project directory

## Chat Session Documentation

### Initial Request
The user wanted to organize a project using the GitHub Spec Kit process and specifically requested help with the getting started guide from https://github.com/github/spec-kit.

### Installation Journey
1. **Attempted uvx installation** - Failed due to uvx not being available on Windows
2. **Tried direct pip installation** - Succeeded but CLI had Unicode issues
3. **Created wrapper solution** - Successfully resolved all Windows compatibility issues
4. **Verified functionality** - Confirmed CLI works across different directories

### Key Learnings
- Windows requires special handling for Unicode characters in CLI output
- The wrapper script approach is more reliable than trying to fix PATH issues
- Testing with `check` command is essential before proceeding with project work

### Workflow Testing
- Successfully demonstrated the CLI commands
- Confirmed tool detection (Git, Claude Code, VS Code)
- Validated the wrapper script works from multiple directories

### Documentation Creation
The user requested comprehensive documentation that includes:
- Installation steps (created `specifyinstall.md`)
- Workflow guide with actual experience
- Team-friendly instructions
- Complete chat session context

## Next Steps

1. **Use this guide** to implement the Specify workflow on your website project
2. **Customize the examples** to match your specific requirements
3. **Share with your team** to establish consistent development practices
4. **Iterate and improve** the process based on your team's experience

## Resources

- [GitHub Spec Kit Repository](https://github.com/github/spec-kit)
- [Installation Guide](./specifyinstall.md)
- [Wrapper Script](./specify_wrapper.py)

---

*This guide was created based on our actual implementation experience and includes both successes and challenges encountered during the process.*