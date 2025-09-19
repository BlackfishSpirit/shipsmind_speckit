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

To use this configuration:
1. Save this file as `CLAUDE.md` in your project root
2. Restart Claude Code to load the MCP server
3. The Semgrep tools will be available in your Claude Code session
4. Use the security review commands above for comprehensive security analysis