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

## Security Review Agent Configuration

### Security-Focused Code Review Agent

Use this agent for comprehensive security analysis that integrates Semgrep scanning:

```
/agent security-review "Review this PR for security vulnerabilities using Semgrep scanning, focusing on authentication, authorization, input validation, and common security anti-patterns"
```

#### Security Review Workflow:
1. **Static Analysis**: Use Semgrep MCP tools to scan for vulnerabilities
2. **Manual Review**: Examine authentication, authorization, and data handling
3. **Configuration Review**: Check for hardcoded secrets, unsafe configurations
4. **Dependency Analysis**: Review third-party dependencies for known issues

#### Example Security Review Commands:
```
# Comprehensive security review with Semgrep
/agent pragmatic-code-review "Perform a security-focused code review of the current changes. First use Semgrep MCP tools to scan for security vulnerabilities, then manually review for authentication issues, authorization bypasses, input validation problems, and potential security anti-patterns."

# Quick security scan
/agent general-purpose "Use the Semgrep MCP server to scan the current codebase for security vulnerabilities and provide a summary of findings"

# Security-focused PR review
/agent pragmatic-code-review "Review this pull request with a security focus. Use Semgrep to identify potential vulnerabilities, then analyze the code for secure coding practices, proper error handling, and potential security risks."
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
