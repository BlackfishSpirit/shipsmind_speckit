# Specify CLI Installation Guide for Windows

This document outlines the steps to install and configure the GitHub Spec Kit CLI on Windows systems.

## Prerequisites

- Python 3.11+ (tested with Python 3.13)
- Git
- An AI coding agent (Claude Code, GitHub Copilot, etc.)

## Installation Steps

### 1. Install Python Dependencies

```bash
pip install uv
pip install git+https://github.com/github/spec-kit.git
```

### 2. Fix Windows Unicode Issues

The Specify CLI uses Unicode characters that don't display properly in Windows console. Create a wrapper script to handle this:

**File: `specify_wrapper.py`**

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

> **Note:** Update the `specify_path` variable to match your Python Scripts directory path.

### 3. Verify Installation

```bash
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
