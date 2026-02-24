# Step 1: Clean up old build artifacts
Write-Host "=== Cleaning up ==="
$freeC = [math]::Round((Get-PSDrive C).Free / 1GB, 2)
$freeD = [math]::Round((Get-PSDrive D).Free / 1GB, 2)
Write-Host "C: $freeC GB free | D: $freeD GB free"

# Clean old build dirs
Remove-Item -Recurse -Force "D:\Niya.life\niyasourcecode\front-end\packages\mobile\android\app\build" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "D:\Niya.life\niyasourcecode\front-end\packages\mobile\android\.gradle" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "D:\Niya.life\niyasourcecode\front-end\packages\mobile\android\build" -ErrorAction SilentlyContinue

# Clean old gradle home on D
Remove-Item -Recurse -Force "D:\gradle_home\caches" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "D:\gradle_home\daemon" -ErrorAction SilentlyContinue

# Clean temp
Remove-Item -Recurse -Force "D:\temp\*" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:TEMP\*" -ErrorAction SilentlyContinue

# Ensure D drive dirs exist
New-Item -ItemType Directory -Force -Path "D:\gradle_home" | Out-Null
New-Item -ItemType Directory -Force -Path "D:\temp" | Out-Null

$freeC2 = [math]::Round((Get-PSDrive C).Free / 1GB, 2)
$freeD2 = [math]::Round((Get-PSDrive D).Free / 1GB, 2)
Write-Host "After cleanup - C: $freeC2 GB free | D: $freeD2 GB free"

# Step 2: Set environment to use D drive
Write-Host ""
Write-Host "=== Starting APK Build (using D: drive for cache/temp) ==="
$env:GRADLE_USER_HOME = "D:\gradle_home"
$env:TEMP = "D:\temp"
$env:TMP = "D:\temp"
$env:GRADLE_OPTS = "-Dorg.gradle.daemon=true -Djava.io.tmpdir=D:\temp -Xmx2g"

# Step 3: Build
Set-Location "D:\Niya.life\niyasourcecode\front-end\packages\mobile\android"
Write-Host "Running: gradlew assembleRelease"
Write-Host "Started at: $(Get-Date)"
& .\gradlew.bat assembleRelease 2>&1
$exitCode = $LASTEXITCODE
Write-Host ""
Write-Host "Finished at: $(Get-Date)"
Write-Host "Exit code: $exitCode"

if ($exitCode -eq 0) {
    Write-Host ""
    Write-Host "=== BUILD SUCCESSFUL ==="
    $apkPath = "D:\Niya.life\niyasourcecode\front-end\packages\mobile\android\app\build\outputs\apk\release\app-release.apk"
    if (Test-Path $apkPath) {
        $size = [math]::Round((Get-Item $apkPath).Length / 1MB, 1)
        Write-Host "APK: $apkPath"
        Write-Host "Size: $size MB"
    }
} else {
    Write-Host ""
    Write-Host "=== BUILD FAILED ==="
}
