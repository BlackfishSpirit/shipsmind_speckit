# GitHub Spec Kit - Project Integration

**🎉 GitHub Spec Kit is now fully integrated into this project!**

This document is for reference only - new team members don't need to manually install GitHub Spec Kit.

## For This Project (Recommended)

GitHub Spec Kit is automatically installed with project dependencies and accessible via npm scripts:

```bash
# Install project dependencies (includes GitHub Spec Kit)
pnpm install

# Verify GitHub Spec Kit is working
pnpm specify:check

# Initialize spec-driven development
pnpm specify:init

# Run any specify command
pnpm specify -- <command>
```

## Manual Installation (Not Required for This Project)

If you need GitHub Spec Kit for other projects:

### Prerequisites

- Python 3.11+ (tested with Python 3.13)
- Git
- An AI coding agent (Claude Code, GitHub Copilot, etc.)

### Installation Steps

```bash
pip install git+https://github.com/github/spec-kit.git
```

### Verify Manual Installation

```bash
python -m specify check
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

## Usage

### Basic Commands

```bash
# Check system requirements
python specify_wrapper.py check

# Get help
python specify_wrapper.py --help

# Initialize a new project
python specify_wrapper.py init [project_name]
```

### Using from Other Projects

1. **Copy the wrapper:** Copy `specify_wrapper.py` to your project directory
2. **Use full path:** Reference the wrapper with full path from any directory

```bash
# From any directory
python E:\path\to\specify_wrapper.py [command]
```

## Troubleshooting

### Common Issues

**Issue:** `UnicodeEncodeError: 'charmap' codec can't encode characters`

- **Solution:** Use the `specify_wrapper.py` script instead of calling specify directly

**Issue:** `specify.exe not found`

- **Solution:** Update the `specify_path` variable in the wrapper script to match your Python Scripts directory

**Issue:** Commands timeout during `init`

- **Solution:** The CLI may be waiting for interactive input. Try running in a more capable terminal like Windows Terminal

### Path Configuration

Find your Python Scripts directory:

```python
import sys
import os
print(os.path.join(os.path.dirname(sys.executable), "Scripts"))
```

## Next Steps

Once installed, you can use the Specify CLI to organize projects using the spec-driven development methodology:

1. **Specify** - Describe what your project should do (not how)
2. **Plan** - Generate technical implementation plans
3. **Tasks** - Break down into actionable items
4. **Implement** - Have AI agents implement features

For more information, see the [GitHub Spec Kit repository](https://github.com/github/spec-kit).
