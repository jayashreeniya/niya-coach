# Firebase Setup Helper Script
$ErrorActionPreference = "Stop"

try {
    # Install Firebase CLI if not already installed
    if (-not (Test-Command firebase)) {
        Write-Host "Installing Firebase CLI..."
        Start-Process -FilePath "npm" -ArgumentList "install -g firebase-tools" -NoNewWindow -Wait
    }

    # Login to Firebase
    Write-Host "Please log in to Firebase in your browser..."
    Start-Process -FilePath "firebase" -ArgumentList "login" -NoNewWindow -Wait

    # Initialize Firebase
    Write-Host "Initializing Firebase..."
    Start-Process -FilePath "firebase" -ArgumentList "init" -NoNewWindow -Wait

    # Get Firebase config
    Write-Host "Getting Firebase configuration..."
    $firebaseConfig = firebase apps:sdkconfig web

    # Update firebase.ts with the new config
    Write-Host "Updating Firebase configuration..."
    $configContent = @"
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = $firebaseConfig;

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
"@

    Set-Content -Path ".\src\firebase.ts" -Value $configContent -Force

    Write-Host "Firebase setup complete!"
    Write-Host "Your application is now configured with Firebase."

} catch {
    Write-Host "An error occurred during Firebase setup: $_"
    exit 1
} 