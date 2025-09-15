# 🚀 Team Setup Guide
## ShipsMind AI Consulting Website Development

Welcome to the ShipsMind project! This guide will get you up and running with our development workflow using **Specify + Claude Code** for rapid AI-assisted development.

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

---

## 🤖 **AI-Powered Development Workflow**

### **Specify CLI Setup**

**Install Specify CLI**:
```bash
pip install git+https://github.com/github/spec-kit.git
```

**Verify installation**:
```bash
python specify_wrapper.py check
```

**Expected output**:
```
✓ Git version control (available)
✓ Claude Code CLI (available)
✓ VS Code (for GitHub Copilot) (available)
Specify CLI is ready to use!
```

### **Using Specify for Feature Development**

**1. Create a Specification** (Describe WHAT, not HOW):
```bash
python specify_wrapper.py specify "Add user authentication with email/password login"
```

**2. Generate Technical Plan**:
```bash
python specify_wrapper.py plan
```

**3. Break into Tasks**:
```bash
python specify_wrapper.py tasks
```

**4. Implement with Claude Code**:
- Use Claude Code in VS Code
- Reference the generated plan and tasks
- Let AI implement the features

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
| Service | URL | Purpose |
|---------|-----|---------|
| App | http://localhost:3000 | Next.js development server |
| Database | http://localhost:5433 | PostgreSQL development DB |
| Prisma Studio | `pnpm db:studio` | Database admin interface |
| Portainer | http://localhost:9000 | Docker container management |
| MailHog | http://localhost:8025 | Email testing |

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

### **Spec-Driven Development Process**

**1. Start with a Specification**
```bash
# Example: Adding a new feature
python specify_wrapper.py specify "Add a client testimonials section with star ratings and filtering by industry"
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

| Document | Purpose |
|----------|---------|
| `PROJECT_SPECIFICATION.md` | Overall project goals and requirements |
| `TECHNICAL_PLAN.md` | Technical architecture and implementation |
| `PRODUCTION_DEPLOYMENT.md` | Complete deployment guide and troubleshooting |
| `specify_workflow_guide.md` | Detailed Specify CLI usage |
| `specifyinstall.md` | Specify installation instructions |

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
python specify_wrapper.py specify "Your feature description here"
```

**Happy coding!** 🎉

---

*Last updated: September 15, 2025*