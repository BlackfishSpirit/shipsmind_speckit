# Security Review Workflows with Semgrep MCP

## Overview

This document outlines how to integrate Semgrep security scanning into existing code review workflows using the Semgrep MCP server.

## Integration Methods

### 1. Enhanced Pragmatic Code Review

The existing `pragmatic-code-review` agent can be enhanced with security-focused prompts:

```bash
# Security-focused code review
/agent pragmatic-code-review "Perform a comprehensive code review with security focus. Use the Semgrep MCP server to scan for vulnerabilities, then manually review for: authentication/authorization issues, input validation, secure coding practices, configuration security, and dependency security."
```

### 2. Design Review with Security

For UI/frontend changes that might have security implications:

```bash
# Security-aware design review
/agent design-review "Review this design for security considerations including XSS prevention, CSRF protection, secure data handling, and proper authentication flows. Use Semgrep to scan for frontend security vulnerabilities."
```

### 3. Pre-commit Security Checks

Before committing changes, run security analysis:

```bash
# Quick security check before commit
/agent general-purpose "Use Semgrep MCP to scan the staged changes for security vulnerabilities. Focus on high and critical severity issues that should block the commit."
```

## Workflow Integration Points

### Pull Request Reviews

1. **Automated Security Scan**: Use Semgrep MCP in PR reviews
2. **Manual Security Review**: Complement automated scanning with human analysis
3. **Security Checklist**: Ensure all security aspects are covered

### Development Workflow

1. **Pre-commit**: Quick security scan of changes
2. **Feature branches**: Comprehensive security review before merge
3. **Release preparation**: Full codebase security audit

## Security Review Checklist

When conducting security reviews, ensure coverage of:

- [ ] **Authentication & Authorization**
  - Proper authentication mechanisms
  - Authorization checks at appropriate points
  - Session management security

- [ ] **Input Validation**
  - SQL injection prevention
  - XSS prevention
  - Command injection prevention
  - Input sanitization

- [ ] **Data Security**
  - Encryption of sensitive data
  - Secure data transmission
  - Proper secrets management

- [ ] **Configuration Security**
  - No hardcoded secrets
  - Secure default configurations
  - Proper error handling

- [ ] **Dependencies**
  - Known vulnerability scanning
  - Dependency update status
  - Third-party security assessment

## Command Templates

### For JavaScript/TypeScript Projects
```bash
/agent pragmatic-code-review "Security review for JavaScript/TypeScript: Use Semgrep to scan for XSS, prototype pollution, unsafe eval usage, and npm dependency vulnerabilities. Review authentication flows and API security."
```

### For Python Projects
```bash
/agent pragmatic-code-review "Security review for Python: Use Semgrep to scan for SQL injection, command injection, unsafe deserialization, and Python-specific vulnerabilities. Review Django/Flask security configurations."
```

### For Full-Stack Applications
```bash
/agent pragmatic-code-review "Full-stack security review: Use Semgrep to scan both frontend and backend for vulnerabilities. Focus on API security, authentication flows, data validation, and secure communication between components."
```

## Integration with CI/CD

Consider adding security scanning to your CI/CD pipeline:

1. **Automated Semgrep scanning** in GitHub Actions/CI
2. **Security gates** that prevent deployment of vulnerable code
3. **Security reporting** for tracking and remediation

## Best Practices

1. **Run security scans early and often**
2. **Combine automated and manual review**
3. **Document security decisions and exceptions**
4. **Keep security tools and rules updated**
5. **Train team on secure coding practices**

## Troubleshooting

If Semgrep MCP tools are not available:
1. Restart Claude Code to reload MCP configuration
2. Verify Semgrep binary is properly installed
3. Check CLAUDE.md configuration is correct
4. Ensure MCP server path is accurate