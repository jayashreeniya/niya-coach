# Comprehensive Setup Script for NIYA Coach
$ErrorActionPreference = "Stop"

function Write-Step {
    param($Message)
    Write-Host "`n=== $Message ===" -ForegroundColor Cyan
}

function Install-NodeJS {
    Write-Step "Installing Node.js"
    
    try {
        # Download Node.js installer
        $nodeVersion = "18.17.1" # LTS version compatible with Firebase Tools
        $nodeUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-x64.msi"
        $installerPath = "$env:TEMP\nodejs_installer.msi"
        
        Write-Host "Downloading Node.js..."
        Invoke-WebRequest -Uri $nodeUrl -OutFile $installerPath
        
        Write-Host "Installing Node.js..."
        Start-Process msiexec.exe -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait -NoNewWindow
        
        # Force refresh PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine")
        $env:Path += ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        $env:Path += ";C:\Program Files\nodejs"
        
        # Verify installation
        Write-Host "Verifying Node.js installation..."
        $nodePath = "C:\Program Files\nodejs\node.exe"
        if (Test-Path $nodePath) {
            Write-Host "Node.js installed successfully"
            & $nodePath --version
        } else {
            throw "Node.js installation failed"
        }
    }
    catch {
        throw "Failed to install Node.js: $_"
    }
    finally {
        if (Test-Path $installerPath) {
            Remove-Item $installerPath -Force
        }
    }
}

function Setup-Firebase {
    Write-Step "Setting up Firebase"
    
    try {
        # Create firebase.json if it doesn't exist
        $firebaseConfig = @{
            firestore = @{
                rules = "firestore.rules"
                indexes = "firestore.indexes.json"
            }
            functions = @{
                source = "functions"
            }
            hosting = @{
                public = "build"
                ignore = @(
                    "firebase.json",
                    "**/.*",
                    "**/node_modules/**"
                )
                rewrites = @(
                    @{
                        source = "**"
                        destination = "/index.html"
                    }
                )
            }
            emulators = @{
                auth = @{
                    port = 9099
                }
                functions = @{
                    port = 5001
                }
                firestore = @{
                    port = 8080
                }
                hosting = @{
                    port = 5000
                }
                ui = @{
                    enabled = $true
                    port = 4000
                }
            }
        }
        
        $firebaseConfigJson = $firebaseConfig | ConvertTo-Json -Depth 10
        Set-Content -Path "firebase.json" -Value $firebaseConfigJson
        
        # Install Firebase CLI globally
        Write-Host "Installing Firebase CLI..."
        Start-Process -FilePath "C:\Program Files\nodejs\npm.cmd" -ArgumentList "install -g firebase-tools" -NoNewWindow -Wait
        
        # Initialize Firebase Functions
        Write-Host "Initializing Firebase Functions..."
        if (-not (Test-Path "functions")) {
            mkdir functions | Out-Null
            Set-Location functions
            Start-Process -FilePath "C:\Program Files\nodejs\npm.cmd" -ArgumentList "init -y" -NoNewWindow -Wait
            Start-Process -FilePath "C:\Program Files\nodejs\npm.cmd" -ArgumentList "install firebase-admin firebase-functions @google-cloud/logging" -NoNewWindow -Wait
            
            # Create index.js for Cloud Functions
            $functionsCode = @"
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Log when new messages are created
exports.logNewMessage = functions.firestore
    .document('conversations/{messageId}')
    .onCreate((snap, context) => {
        const message = snap.data();
        console.log('New message:', message);
        return null;
    });

// Automatically delete old messages (older than 30 days)
exports.cleanupOldMessages = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async (context) => {
        const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const snapshot = await admin.firestore()
            .collection('conversations')
            .where('timestamp', '<', cutoff)
            .get();
        
        const deletions = snapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(deletions);
        return null;
    });
"@
            Set-Content -Path "index.js" -Value $functionsCode
            Set-Location ..
        }
        
        # Create enhanced security rules
        $securityRules = @"
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isUserAuthenticated(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isValidMessage() {
      return request.resource.data.message is string &&
             request.resource.data.message.size() <= 1000 &&
             request.resource.data.timestamp is timestamp;
    }
    
    // Conversations collection
    match /conversations/{messageId} {
      allow read: if isAuthenticated() && 
                   (resource.data.userId == request.auth.uid ||
                    resource.data.recipientId == request.auth.uid);
      
      allow create: if isAuthenticated() && 
                     request.resource.data.userId == request.auth.uid &&
                     isValidMessage();
                     
      allow update, delete: if isUserAuthenticated(resource.data.userId);
    }
    
    // User profiles
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isUserAuthenticated(userId);
    }
    
    // User settings
    match /settings/{userId} {
      allow read, write: if isUserAuthenticated(userId);
    }
  }
}
"@
        Set-Content -Path "firestore.rules" -Value $securityRules
        
        # Initialize Firebase project
        Write-Host "`nPlease follow these steps to set up Firebase:"
        Write-Host "1. Go to https://console.firebase.google.com/"
        Write-Host "2. Create a new project named 'niya-coach'"
        Write-Host "3. Enable Authentication (Email/Password)"
        Write-Host "4. Enable Firestore Database"
        Write-Host "5. Enable Cloud Functions"
        Write-Host "`nPress Enter when you're ready to continue..."
        Read-Host
        
        # Login to Firebase
        Start-Process -FilePath "C:\Program Files\nodejs\npx.cmd" -ArgumentList "firebase login" -NoNewWindow -Wait
        
        # Initialize Firebase
        Start-Process -FilePath "C:\Program Files\nodejs\npx.cmd" -ArgumentList "firebase init" -NoNewWindow -Wait
    }
    catch {
        throw "Failed to set up Firebase: $_"
    }
}

function Install-Dependencies {
    Write-Step "Installing Dependencies"
    
    try {
        # Clean npm cache
        Start-Process -FilePath "C:\Program Files\nodejs\npm.cmd" -ArgumentList "cache clean --force" -NoNewWindow -Wait
        
        # Install project dependencies
        Start-Process -FilePath "C:\Program Files\nodejs\npm.cmd" -ArgumentList "install --legacy-peer-deps" -NoNewWindow -Wait
        
        # Verify installation
        if (Test-Path "node_modules") {
            Write-Host "Dependencies installed successfully"
        } else {
            throw "Dependencies installation failed"
        }
    }
    catch {
        throw "Failed to install dependencies: $_"
    }
}

function Start-Development {
    Write-Step "Starting Development Server"
    
    try {
        # Start Firebase emulators
        $emulatorJob = Start-Job -ScriptBlock {
            Set-Location $using:PWD
            & "C:\Program Files\nodejs\npx.cmd" firebase emulators:start
        }
        
        # Start React development server
        $reactJob = Start-Job -ScriptBlock {
            Set-Location $using:PWD
            & "C:\Program Files\nodejs\npm.cmd" start
        }
        
        Write-Host "`nDevelopment servers started in background"
        Write-Host "React App: http://localhost:3000"
        Write-Host "Firebase Emulator UI: http://localhost:4000"
    }
    catch {
        throw "Failed to start development servers: $_"
    }
}

# Main execution
try {
    # Set working directory
    Set-Location -Path "C:\Users\Hp\niya-coach\niya-coach"
    
    # Check if Node.js is installed
    if (-not (Test-Path "C:\Program Files\nodejs\node.exe")) {
        Install-NodeJS
    } else {
        Write-Host "Node.js is already installed"
    }
    
    Install-Dependencies
    Setup-Firebase
    Start-Development
    
    Write-Step "Setup Complete!"
    Write-Host "`nYour NIYA Coach application is now ready!"
    Write-Host "1. React App: http://localhost:3000"
    Write-Host "2. Firebase Emulator UI: http://localhost:4000"
    Write-Host "3. Update the .env file with your Firebase configuration"
    Write-Host "`nTo view server logs, run: Get-Job | Receive-Job"
}
catch {
    Write-Host "`nError: $_" -ForegroundColor Red
    Write-Host "Stack Trace: $($_.ScriptStackTrace)" -ForegroundColor Red
    exit 1
} 