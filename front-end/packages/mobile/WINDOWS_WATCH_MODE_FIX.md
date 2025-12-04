# Windows Watch Mode Fix

## Problem
Metro bundler fails with "Failed to start watch mode" error on Windows due to file watcher limits.

## Permanent Fix (Run as Administrator)

### Option 1: Increase File Watcher Limit (Recommended)

1. Open PowerShell as Administrator
2. Run this command:
```powershell
New-ItemProperty -Path "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

3. Increase the file watcher limit:
```powershell
# Check current limit
fsutil behavior query MaxDirectoryWatchers

# Increase limit (if needed)
fsutil behavior set MaxDirectoryWatchers 2048
```

### Option 2: Use Workaround Script

Use the `start-metro.ps1` script which sets environment variables to work around the issue:
```powershell
.\start-metro.ps1
```

### Option 3: Install Watchman (Alternative)

If you have WSL or can install Watchman for Windows:
```bash
# In WSL or Git Bash
npm install -g watchman
```

## Temporary Workaround

The current setup uses environment variables to disable watchman. If issues persist:

1. Stop all Metro processes
2. Clear Metro cache: `npx react-native start --reset-cache`
3. Restart Metro using the workaround script

## Verification

After applying fixes, Metro should start without the "Failed to start watch mode" error. Check Metro output for:
- "Metro waiting on port 8081"
- No watch mode errors
- Successful bundle compilation










