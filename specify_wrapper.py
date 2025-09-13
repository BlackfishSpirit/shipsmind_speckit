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