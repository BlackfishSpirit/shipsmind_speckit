# GitHub Spec Kit Integration

This document describes how GitHub Spec Kit is integrated into the shipsmind-speckit project for spec-driven development.

## What is GitHub Spec Kit?

GitHub Spec Kit is a Python tool for spec-driven development that helps teams:
- Initialize specification-driven projects
- Validate development environment setup
- Ensure consistency across development workflows

## Installation

GitHub Spec Kit is already installed in this project via Python requirements. The installation includes:

- **Python package**: `specify-cli` installed from GitHub
- **Requirements file**: `requirements.txt` contains the installation specification
- **Wrapper scripts**: Cross-platform scripts to handle execution

## Usage

You can use GitHub Spec Kit in several ways:

### Via npm scripts (Recommended)

```bash
# General specify command
pnpm specify --help

# Initialize a new Specify project
pnpm specify:init

# Check development environment
pnpm specify:check
```

### Via Python wrapper script

```bash
# Direct Python execution
python scripts/specify.py --help
python scripts/specify.py init
python scripts/specify.py check
```

### Via Windows batch script

```bash
# Windows only
scripts/specify.bat --help
```

## Available Commands

- `specify init` - Initialize a new Specify project from the latest template
- `specify check` - Check that all required tools are installed

## Integration Features

### Encoding Handling
The integration includes proper UTF-8 encoding handling to avoid character encoding issues on Windows systems.

### Cross-platform Support
- Windows: Uses `.bat` wrapper and Python script
- Unix/Linux/macOS: Uses Python script
- All platforms: Available via npm scripts

### Development Workflow
GitHub Spec Kit is integrated into the development workflow through:
- npm scripts for easy access
- Proper environment setup
- Documentation and examples

## Files Added

- `requirements.txt` - Python dependencies
- `scripts/specify.py` - Cross-platform Python wrapper
- `scripts/specify.bat` - Windows batch wrapper
- `docs/github-spec-kit-integration.md` - This documentation

## Troubleshooting

### Command not found
If you get "command not found" errors, use the npm scripts or Python wrapper instead of trying to run `specify` directly.

### Encoding errors
The wrapper scripts handle encoding issues automatically. If you still encounter problems, ensure your terminal supports UTF-8.

### Installation issues
If GitHub Spec Kit needs to be reinstalled:
```bash
pip install -r requirements.txt
```

## Next Steps

1. Run `pnpm specify:check` to verify your development environment
2. Use `pnpm specify:init` if you want to initialize spec-driven development features
3. Integrate spec validation into your CI/CD pipeline as needed

For more information about GitHub Spec Kit, visit: https://github.com/github/spec-kit