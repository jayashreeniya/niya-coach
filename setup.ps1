# Error handling
$ErrorActionPreference = "Stop"

function Write-Step {
    param($Message)
    Write-Host "`n=== $Message ===" -ForegroundColor Cyan
}

try {
    Write-Step "Checking Prerequisites"
    
    # Check if winget is available
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        throw "Winget is not installed. Please install App Installer from the Microsoft Store."
    }

    # Install Node.js using winget if not present
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Step "Installing Node.js"
        winget install OpenJS.NodeJS.LTS
        
        # Refresh PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    } else {
        Write-Host "Node.js is already installed"
    }

    # Verify Node.js installation
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion"

    Write-Step "Setting up project"
    # Navigate to project directory
    Set-Location -Path "C:\Users\Hp\niya-coach\niya-coach"

    # Clean npm cache and temporary files
    Write-Host "Cleaning npm cache..."
    npm cache clean --force
    Remove-Item -Path "$env:TEMP\npm-*" -Recurse -Force -ErrorAction SilentlyContinue

    # Install dependencies with increased memory limit
    Write-Host "Installing dependencies..."
    $env:NODE_OPTIONS="--max-old-space-size=4096"
    npm install --no-audit --no-fund

    Write-Step "Setting up Firebase"
    # Install Firebase CLI globally
    Write-Host "Installing Firebase CLI..."
    npm install -g firebase-tools

    # Create Firebase config placeholder
    $firebaseConfig = @"
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
"@
    Set-Content -Path ".\src\firebase.ts" -Value $firebaseConfig -Force

    # Create .env file template
    $envContent = @"
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
"@
    Set-Content -Path ".\.env" -Value $envContent -Force

    Write-Step "Starting application"
    # Start the application as a background job
    $startScript = {
        Set-Location -Path "C:\Users\Hp\niya-coach\niya-coach"
        npm start
    }
    Start-Job -ScriptBlock $startScript

    Write-Step "Setup Complete!"
    Write-Host "`nImportant next steps:"
    Write-Host "1. Create a Firebase project at https://console.firebase.google.com/"
    Write-Host "2. Copy your Firebase configuration values to the .env file"
    Write-Host "3. Access the application at http://localhost:3000"
    Write-Host "`nTo view the application logs, run: Get-Job | Receive-Job"

} catch {
    Write-Host "`nError: $_" -ForegroundColor Red
    Write-Host "Stack Trace: $($_.ScriptStackTrace)" -ForegroundColor Red
    exit 1
} 