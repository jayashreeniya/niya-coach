Write-Host "=== Deep Disk Cleanup ==="
$before = [math]::Round((Get-PSDrive C).Free / 1GB, 2)
Write-Host "Free space before: $before GB"

# 1. Kill all Java/Gradle
Write-Host "Killing Java processes..."
Stop-Process -Name java -Force -ErrorAction SilentlyContinue

# 2. Android build dirs
Write-Host "Cleaning Android build dirs..."
Remove-Item -Recurse -Force "D:\Niya.life\niyasourcecode\front-end\packages\mobile\android\app\build" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "D:\Niya.life\niyasourcecode\front-end\packages\mobile\android\.gradle" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "D:\Niya.life\niyasourcecode\front-end\packages\mobile\android\build" -ErrorAction SilentlyContinue

# 3. Gradle caches - ALL of them
Write-Host "Cleaning ALL Gradle caches..."
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\caches" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\daemon" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\native" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:USERPROFILE\.gradle\build-scan-data" -ErrorAction SilentlyContinue

# 4. Temp files
Write-Host "Cleaning temp files..."
Remove-Item -Recurse -Force "$env:TEMP\*" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "C:\Windows\Temp\*" -ErrorAction SilentlyContinue

# 5. npm cache
Write-Host "Cleaning npm cache..."
Remove-Item -Recurse -Force "$env:APPDATA\npm-cache" -ErrorAction SilentlyContinue

# 6. Cursor caches
Write-Host "Cleaning Cursor caches..."
Remove-Item -Recurse -Force "$env:APPDATA\Cursor\Cache" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:APPDATA\Cursor\CachedData" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:APPDATA\Cursor\CachedExtensionVSIXs" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:APPDATA\Cursor\Code Cache" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:APPDATA\Cursor\GPUCache" -ErrorAction SilentlyContinue

# 7. Windows Update downloads
Write-Host "Cleaning Windows Update downloads..."
Remove-Item -Recurse -Force "C:\Windows\SoftwareDistribution\Download\*" -ErrorAction SilentlyContinue

# 8. Recycle bin
Write-Host "Emptying Recycle Bin..."
Clear-RecycleBin -Force -ErrorAction SilentlyContinue

# 9. Old status/debug MD files in project (large accumulation)
Write-Host "Cleaning old status files..."
$statusFiles = @(
    "D:\Niya.life\niyasourcecode\FINAL_DEPLOYMENT_STATUS_DEC_10_2025.md",
    "D:\Niya.life\niyasourcecode\FINAL_STATUS_DEC_10_2025.md",
    "D:\Niya.life\niyasourcecode\MOBILE_APP_STATUS_DEC_17_2025.md",
    "D:\Niya.life\niyasourcecode\CURRENT_STATUS_DEC_9_2025_AFTERNOON.md",
    "D:\Niya.life\niyasourcecode\FINAL_STATUS_DEC_9_2025_EVENING.md",
    "D:\Niya.life\niyasourcecode\CURRENT_STATUS_DEC_8_2025_END_OF_SESSION.md",
    "D:\Niya.life\niyasourcecode\END_OF_SESSION_STATUS_DEC_9_2025.md",
    "D:\Niya.life\niyasourcecode\ASSESSMENT_QUESTIONS_STATUS_DEC_5.md",
    "D:\Niya.life\niyasourcecode\CURRENT_STATUS_DEC_8_2025.md",
    "D:\Niya.life\niyasourcecode\CURRENT_STATUS_DEC_5_2025_AFTERNOON.md",
    "D:\Niya.life\niyasourcecode\FINAL_STATUS_DEC_5_2025.md",
    "D:\Niya.life\niyasourcecode\CURRENT_SESSION_STATUS_DEC_4_2025.md",
    "D:\Niya.life\niyasourcecode\SESSION_STATUS_DEC_5_2025_APIS_FIXED.md",
    "D:\Niya.life\niyasourcecode\V31_SYNTAX_FIX_STATUS.md",
    "D:\Niya.life\niyasourcecode\V30_RESTORE_STATUS.md",
    "D:\Niya.life\niyasourcecode\DEPLOYMENT_STATUS_SUMMARY_2025_10_28.md",
    "D:\Niya.life\niyasourcecode\DEPLOYMENT_STATUS_SUMMARY_2025_10_27.md",
    "D:\Niya.life\niyasourcecode\DEPLOYMENT_STATUS_2025_10_29.md",
    "D:\Niya.life\niyasourcecode\CURRENT_WORK_STATUS.md",
    "D:\Niya.life\niyasourcecode\CURRENT_CONFIGURATION_STATUS.md",
    "D:\Niya.life\niyasourcecode\ADMIN_FIXES_STATUS.md",
    "D:\Niya.life\niyasourcecode\DEPLOYMENT_STATUS_CURRENT.md",
    "D:\Niya.life\niyasourcecode\MOBILE_APP_STATUS_DEC_22_2025.md",
    "D:\Niya.life\niyasourcecode\COACH_SPECIALIZATION_ISSUE_STATUS.md"
)
foreach ($f in $statusFiles) {
    Remove-Item -Force $f -ErrorAction SilentlyContinue
}

# 10. Metro/RN temp caches
Write-Host "Cleaning Metro/RN caches..."
Remove-Item -Recurse -Force "$env:TEMP\metro-*" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:TEMP\react-*" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:TEMP\haste-*" -ErrorAction SilentlyContinue

# 11. Old bundle file
$bundleFile = "D:\Niya.life\niyasourcecode\front-end\packages\mobile\latest.bundle.js"
if (Test-Path $bundleFile) {
    $size = [math]::Round((Get-Item $bundleFile).Length / 1MB, 1)
    Write-Host "Removing old bundle file ($size MB)..."
    Remove-Item -Force $bundleFile -ErrorAction SilentlyContinue
}

# 12. Backup controller files
Write-Host "Removing backup files..."
Remove-Item -Force "D:\Niya.life\niyasourcecode\back-end\app\controllers\bx_block_calendar\booked_slots_controller.rb.original" -ErrorAction SilentlyContinue
Remove-Item -Force "D:\Niya.life\niyasourcecode\back-end\app\controllers\bx_block_calendar\booked_slots_controller.rb.backup-*" -ErrorAction SilentlyContinue

$after = [math]::Round((Get-PSDrive C).Free / 1GB, 2)
Write-Host "=== Free space after: $after GB (freed $([math]::Round($after - $before, 2)) GB) ==="
