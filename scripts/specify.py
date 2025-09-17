#!/usr/bin/env python3
"""
GitHub Spec Kit Python wrapper script
Handles encoding issues and provides a cross-platform interface
"""

import os
import sys
import subprocess
from pathlib import Path

def run_specify(args):
    """Run the specify command with proper encoding settings."""

    # Set environment variables for proper encoding
    env = os.environ.copy()
    env['PYTHONIOENCODING'] = 'utf-8'
    env['PYTHONUTF8'] = '1'

    # Try different ways to find and run specify
    specify_paths = [
        # Windows paths
        Path.home() / "AppData/Roaming/Python/Python313/Scripts/specify.exe",
        Path.home() / "AppData/Local/Programs/Python/Python313/Scripts/specify.exe",
        # Unix-like paths
        Path.home() / ".local/bin/specify",
        "/usr/local/bin/specify",
        "/usr/bin/specify"
    ]

    specify_exe = None
    for path in specify_paths:
        if path.exists():
            specify_exe = str(path)
            break

    if not specify_exe:
        # Try as Python module
        try:
            result = subprocess.run([
                sys.executable, "-c",
                "import specify_cli; specify_cli.main()"
            ] + args, env=env, capture_output=False)
            return result.returncode
        except Exception as e:
            print(f"Error running specify as module: {e}")
            return 1

    try:
        result = subprocess.run([specify_exe] + args, env=env, capture_output=False)
        return result.returncode
    except Exception as e:
        print(f"Error running specify: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(run_specify(sys.argv[1:]))