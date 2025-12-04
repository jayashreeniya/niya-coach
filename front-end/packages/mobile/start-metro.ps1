# Metro bundler startup script with Windows watch mode workaround
$env:WATCHMAN_DISABLE = "1"
$env:CI = "false"
$env:REACT_NATIVE_PACKAGER_TIMEOUT = "60000"

# Ensure all commands run from the mobile package root
Set-Location -Path $PSScriptRoot

# Metro on Node 20 needs the legacy OpenSSL provider flag
$env:NODE_OPTIONS = "--openssl-legacy-provider"

# Clear Metro cache
Write-Host "Starting Metro bundler with watch mode workaround..."
npx react-native start --reset-cache










