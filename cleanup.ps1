# Aggressive disk cleanup for APK build
Write-Host "Starting aggressive cleanup..."

# 1. Gradle caches (user-level)
$gradleCache = "$env:USERPROFILE\.gradle\caches"
if (Test-Path $gradleCache) {
    Write-Host "Cleaning Gradle caches..."
    Remove-Item -Recurse -Force "$gradleCache\*" -ErrorAction SilentlyContinue
}

# 2. Gradle daemon logs
$gradleDaemon = "$env:USERPROFILE\.gradle\daemon"
if (Test-Path $gradleDaemon) {
    Remove-Item -Recurse -Force "$gradleDaemon\*" -ErrorAction SilentlyContinue
}

# 3. Gradle wrapper dists (except latest)
$gradleWrapper = "$env:USERPROFILE\.gradle\wrapper\dists"
if (Test-Path $gradleWrapper) {
    Write-Host "Cleaning old Gradle wrapper distributions..."
    # Keep the latest, remove older ones
    $dists = Get-ChildItem $gradleWrapper -Directory | Sort-Object LastWriteTime
    if ($dists.Count -gt 1) {
        $dists | Select-Object -SkipLast 1 | ForEach-Object { 
            Remove-Item -Recurse -Force $_.FullName -ErrorAction SilentlyContinue 
        }
    }
}

# 4. Windows temp files
Write-Host "Cleaning temp files..."
Remove-Item -Recurse -Force "$env:TEMP\*" -ErrorAction SilentlyContinue

# 5. npm cache
Write-Host "Cleaning npm cache..."
$npmCache = "$env:APPDATA\npm-cache"
if (Test-Path $npmCache) {
    Remove-Item -Recurse -Force "$npmCache\*" -ErrorAction SilentlyContinue
}

# 6. Cursor cache/logs
$cursorCache = "$env:APPDATA\Cursor\Cache"
if (Test-Path $cursorCache) {
    Write-Host "Cleaning Cursor cache..."
    Remove-Item -Recurse -Force "$cursorCache\*" -ErrorAction SilentlyContinue
}
$cursorCodeCache = "$env:APPDATA\Cursor\Code Cache"
if (Test-Path $cursorCodeCache) {
    Remove-Item -Recurse -Force "$cursorCodeCache\*" -ErrorAction SilentlyContinue
}

# 7. Android build intermediates in the project
$androidBuild = "D:\Niya.life\niyasourcecode\front-end\packages\mobile\android\app\build"
if (Test-Path $androidBuild) {
    Write-Host "Cleaning Android build directory..."
    Remove-Item -Recurse -Force $androidBuild -ErrorAction SilentlyContinue
}
$androidGradle = "D:\Niya.life\niyasourcecode\front-end\packages\mobile\android\.gradle"
if (Test-Path $androidGradle) {
    Remove-Item -Recurse -Force $androidGradle -ErrorAction SilentlyContinue
}

# 8. Metro bundler cache
$metroCache = "$env:TEMP\metro-*"
Remove-Item -Recurse -Force $metroCache -ErrorAction SilentlyContinue

# 9. React Native packager cache
$rnCache = "$env:TEMP\react-*"
Remove-Item -Recurse -Force $rnCache -ErrorAction SilentlyContinue

# 10. Windows Update cleanup (if accessible)
$winSxsCleanup = "C:\Windows\SoftwareDistribution\Download\*"
Remove-Item -Recurse -Force $winSxsCleanup -ErrorAction SilentlyContinue

# Check result
$free = [math]::Round((Get-PSDrive C).Free / 1GB, 2)
Write-Host "Done. Free space: ${free} GB"
