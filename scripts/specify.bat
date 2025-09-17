@echo off
REM GitHub Spec Kit wrapper script for Windows
REM Sets proper encoding and runs the specify command

chcp 65001 > nul
set PYTHONIOENCODING=utf-8

"C:\Users\Michael\AppData\Roaming\Python\Python313\Scripts\specify.exe" %*