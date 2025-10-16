# Claude Code Configuration

## MCP Servers

### Semgrep Security Scanner

The Semgrep MCP server provides security scanning capabilities using Semgrep's rules.

```json
{
  "mcpServers": {
    "semgrep": {
      "command": "python",
      "args": ["-m", "semgrep_mcp", "--semgrep-path", "C:\\Users\\Michael\\AppData\\Roaming\\Python\\Python313\\Scripts\\semgrep.exe"],
      "env": {}
    },
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase",
        "--read-only",
        "--project-ref=blackfish_project"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_c7fb3eeec77571288b6741237e9a0519d97d448f"
      }
    },
    "n8n": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "N8N_API_URL": "https://blackfish.app.n8n.cloud/api/v1",
        "N8N_API_KEY": "your_n8n_api_key"
      }
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

#### Features:
- Security vulnerability scanning
- Access to 5,000+ pre-existing security rules
- Multi-language support
- Integration with Semgrep's rule registry

#### Usage:
The Semgrep MCP server will be available through Claude Code's MCP interface, providing tools for:
- Scanning code files for security vulnerabilities
- Running specific Semgrep rules
- Analyzing code patterns and security issues

### Supabase Backend Integration

The Supabase MCP server provides backend database integration capabilities.

#### Features:
- Database schema exploration and analysis
- Query generation and execution (read-only mode)
- Table structure understanding
- Data relationship mapping
- PostgreSQL database interaction
- Real-time data insights

#### Setup Requirements:
1. **Project Reference**: Your Supabase project reference ID
2. **Access Token**: Personal access token from Supabase dashboard
3. **Read-Only Mode**: Configured for safe database interactions

#### Usage:
The Supabase MCP server enables:
- Database schema analysis and documentation
- SQL query generation and optimization
- Data modeling and relationship understanding
- Backend API development guidance
- Database migration planning

### Chrome DevTools Browser Automation

The Chrome DevTools MCP server provides browser automation and debugging capabilities through Chrome DevTools Protocol.

#### Features:
- Browser automation and interaction
- Page navigation and screenshot capture
- JavaScript execution in browser context
- DOM inspection and manipulation
- Network monitoring and request interception
- Console log access and debugging
- Cookie and storage management
- Multi-tab browser control

#### Configuration Options:
- `--headless`: Run Chrome without UI (default: false)
- `--isolated`: Use temporary profile, auto-cleaned (default: false)
- `--viewport`: Set initial window size (e.g., "1280x720")
- `--executablePath` / `-e`: Path to custom Chrome executable
- `--channel`: Chrome channel (stable, canary, beta, dev)
- `--proxyServer`: Proxy configuration
- `--acceptInsecureCerts`: Ignore certificate errors
- `--browserUrl` / `-u`: Connect to existing Chrome instance

#### Usage:
The Chrome DevTools MCP server enables:
- **Browser Testing**: Automated testing of web applications
- **Web Scraping**: Extract data from websites
- **UI Automation**: Automate repetitive browser tasks
- **Screenshot Capture**: Take screenshots of pages
- **Performance Testing**: Monitor page load and network performance
- **Debugging**: Access browser console and debug web apps
- **E2E Testing**: End-to-end testing workflows

#### Example Configuration:
```json
"chrome-devtools": {
  "command": "npx",
  "args": [
    "-y",
    "chrome-devtools-mcp@latest",
    "--headless",
    "--viewport", "1920x1080"
  ]
}
```

### n8n Workflow Automation Integration

The n8n MCP server provides access to n8n workflow automation documentation and templates.

#### Features:
- Access to 2,500+ n8n workflow templates
- n8n node documentation and examples
- Workflow automation guidance
- Integration patterns and best practices
- Full-text search across n8n documentation

#### Usage:
The n8n MCP server enables:
- **Full Workflow Management**: Create, read, update, and delete n8n workflows
- **Live API Integration**: Direct connection to your n8n instance
- **Template Access**: Search 2,500+ n8n workflow templates
- **Node Documentation**: Get help with n8n node configuration
- **Execution Control**: Start, stop, and monitor workflow executions
- **Credential Management**: Manage n8n credentials and connections

#### API Configuration:
Set these environment variables in your `.env.local`:
```bash
N8N_API_URL=https://your-n8n-instance.com/api/v1
N8N_API_KEY=your_n8n_api_key
```

#### Example Workflow Management:
- List all workflows in your n8n instance
- Create new workflows with nodes and connections
- Execute workflows and monitor their status
- Update existing workflow configurations
- Search and import workflow templates
- Manage webhook endpoints and triggers

## Agent MCP Integration Guidelines

### How Agents Use MCP Servers

All agents and sub-agents in this project have access to the configured MCP servers. Here's how each MCP server should be utilized across different agent types:

#### Chrome DevTools MCP - Browser Automation & Testing
**Primary Use Cases:**
- **Design Review**: Visual testing, screenshot capture, responsive design validation, accessibility testing
- **Code Review**: Frontend testing, UI component validation, JavaScript error detection, performance metrics
- **Security Review**: XSS testing, CSP validation, client-side security testing, authentication flow testing
- **Feature Documentation**: Capturing screenshots and behavior for user-facing features

**When to Use:**
- Testing web applications in real browser environments
- Validating UI components and user interactions
- Capturing visual evidence for design or code reviews
- Testing responsive behavior across viewports
- Monitoring network requests and API integration
- Inspecting browser console for errors and warnings
- Measuring Core Web Vitals and performance metrics

#### Supabase MCP - Database Analysis & Backend Development
**Primary Use Cases:**
- **Code Review**: Database schema validation, query optimization, data modeling review
- **Feature Documentation**: Backend feature documentation, database change documentation
- **Security Review**: SQL injection prevention, data access patterns, authorization logic

**When to Use:**
- Analyzing database schema and relationships
- Validating database design patterns
- Reviewing migration strategies
- Optimizing SQL queries

#### Semgrep MCP - Security Vulnerability Scanning
**Primary Use Cases:**
- **Code Review**: Static security analysis, vulnerability detection
- **Security Review**: Comprehensive security scanning with 5,000+ rules

**When to Use:**
- Scanning for security vulnerabilities
- Identifying authentication/authorization issues
- Detecting input validation problems
- Finding hardcoded secrets

#### Context7 MCP - Documentation & Best Practices
**Primary Use Cases:**
- **All Agents**: Access to up-to-date documentation and framework best practices

**When to Use:**
- Looking up latest framework patterns
- Validating best practices
- Researching component usage
- Understanding modern web development patterns

## Security Review Agent Configuration

### Security-Focused Code Review Agent

Use this agent for comprehensive security analysis that integrates Semgrep scanning and browser-based testing:

```
/agent security-review "Review this PR for security vulnerabilities using Semgrep scanning, focusing on authentication, authorization, input validation, and common security anti-patterns"
```

#### Security Review Workflow:
1. **Static Analysis**: Use Semgrep MCP tools to scan for vulnerabilities
2. **Manual Review**: Examine authentication, authorization, and data handling
3. **Configuration Review**: Check for hardcoded secrets, unsafe configurations
4. **Dependency Analysis**: Review third-party dependencies for known issues
5. **Browser-Based Testing**: Use Chrome DevTools MCP to test client-side security (XSS, CSP, etc.)

#### Example Security Review Commands:
```
# Comprehensive security review with Semgrep and browser testing
/agent pragmatic-code-review "Perform a security-focused code review of the current changes. First use Semgrep MCP tools to scan for security vulnerabilities, then manually review for authentication issues, authorization bypasses, input validation problems, and potential security anti-patterns. For frontend changes, use Chrome DevTools MCP to test XSS vulnerabilities and CSP implementation."

# Quick security scan
/agent general-purpose "Use the Semgrep MCP server to scan the current codebase for security vulnerabilities and provide a summary of findings"

# Security-focused PR review with browser testing
/agent pragmatic-code-review "Review this pull request with a security focus. Use Semgrep to identify potential vulnerabilities, then analyze the code for secure coding practices, proper error handling, and potential security risks. Use Chrome DevTools MCP to test any client-side security concerns in the browser."

# XSS vulnerability testing
/agent general-purpose "Use Chrome DevTools MCP to test for XSS vulnerabilities in the user input forms on http://localhost:3000. Test both reflected and stored XSS by injecting common payloads and monitoring the browser console."
```

## Design Workflow Agent Configuration

### Design Agent with Speckit Integration

A specialized agent for front-end design workflows that integrates with the project's workflow system:

```json
{
  "name": "design-workflow",
  "description": "Front-end design specialist with SuperDesign and speckit integration",
  "capabilities": [
    "SuperDesign workflow management",
    "shadcn MCP component integration",
    "TweakCN theme customization",
    "Accessibility compliance",
    "Speckit workflow integration"
  ]
}
```

#### Design Workflow Commands:
```
# Start new design project
/design-start "Brief description of what you want to design"

# Launch design workflow agent
/design-agent "Design brief or specific design request"

# Review design quality and implementation readiness
/design-review "Review my current design for [specific aspects]"

# Phase-specific commands
/design-layout "Create layout iterations for [component/page description]"
/design-theme "Apply theme variations with [color palette/design language]"
/design-implement "Add interactivity and animations to the design"

# Component conversion
/shadcn "Convert design to shadcn components with proper MCP context"
```

#### Design Process Integration:
1. **Feature Linking**: Design work links to specific features in workflow system
2. **Progress Tracking**: Updates completion status in development dashboard
3. **Quality Gates**: Enforces design standards before development handoff
4. **Documentation**: Maintains design decisions and implementation notes
5. **Team Coordination**: Facilitates handoff between design and development

#### Workflow Phase Integration:
- **Layout Phase** → Updates workflow status to "Design: Layout Complete"
- **Theme Phase** → Updates workflow status to "Design: Theme Applied"
- **Implementation Phase** → Updates workflow status to "Design: Interactive Complete"
- **Component Phase** → Updates workflow status to "Design: Production Ready"

## Setup Instructions

### Supabase MCP Configuration
Before using the Supabase MCP server, you need to configure your credentials:

1. **Get Your Project Reference**:
   - Go to your Supabase project dashboard
   - Copy the project reference from the URL: `https://supabase.com/dashboard/project/[PROJECT_REF]`

2. **Create Access Token**:
   - Go to Supabase Account Settings → Access Tokens
   - Click "Generate new token"
   - Give it a descriptive name (e.g., "Claude Code MCP")
   - Copy the generated token

3. **Update Configuration**:
   - Replace `YOUR_PROJECT_REF_HERE` with your actual project reference
   - Replace `YOUR_ACCESS_TOKEN_HERE` with your actual access token

4. **Security Note**:
   - The server runs in read-only mode for safety
   - Use with development projects, not production
   - Keep your access token secure and never commit it to version control

### Example Configuration
```json
"supabase": {
  "command": "npx",
  "args": [
    "-y",
    "@supabase/mcp-server-supabase",
    "--read-only",
    "--project-ref=blackfish_project"
  ],
  "env": {
    "SUPABASE_ACCESS_TOKEN": "sbp_c7fb3eeec77571288b6741237e9a0519d97d448f"
  }
}
```

To use this configuration:
1. Update the Supabase MCP configuration with your credentials
2. Save this file as `CLAUDE.md` in your project root
3. Restart Claude Code to load the MCP servers
4. The Semgrep and Supabase tools will be available in your Claude Code session
5. Use the security review commands and backend development workflows
