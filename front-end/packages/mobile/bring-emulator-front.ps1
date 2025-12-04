Add-Type @'
using System;
using System.Runtime.InteropServices;
public class WindowHelper {
    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    public const int SW_RESTORE = 9;
    [DllImport("user32.dll")]
    public static extern bool IsIconic(IntPtr hWnd);
}
'@

$emulator = Get-Process | Where-Object {
    $_.MainWindowTitle -ne "" -and (
        $_.ProcessName -like "*qemu*" -or 
        $_.ProcessName -like "*emulator*" -or 
        $_.MainWindowTitle -like "*Android*" -or
        $_.MainWindowTitle -like "*AVD*"
    )
}

if ($emulator) {
    foreach ($proc in $emulator) {
        if ($proc.MainWindowHandle -ne [IntPtr]::Zero) {
            if ([WindowHelper]::IsIconic($proc.MainWindowHandle)) {
                [WindowHelper]::ShowWindow($proc.MainWindowHandle, [WindowHelper]::SW_RESTORE)
            }
            [WindowHelper]::SetForegroundWindow($proc.MainWindowHandle)
            Write-Host "Brought $($proc.ProcessName) ($($proc.MainWindowTitle)) to front"
        }
    }
} else {
    Write-Host "Emulator window not found. Make sure emulator is running."
    Write-Host "Available processes with windows:"
    Get-Process | Where-Object { $_.MainWindowTitle -ne "" } | Select-Object ProcessName, MainWindowTitle | Format-Table
}




