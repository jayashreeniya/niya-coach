# Mobile App Setup Guide - iOS & Android

**Created**: November 3, 2025  
**Status**: Planning Phase  
**App Type**: React Native (Monorepo structure)

## Project Structure

```
front-end/packages/mobile/
├── android/          # Android native code
├── ios/              # iOS native code (Xcode workspace)
├── App.tsx           # Main React Native entry point
├── package.json       # Mobile app dependencies
└── metro.config.js   # Metro bundler config
```

## Prerequisites

### For iOS Development:
- **macOS** (required for iOS development)
- **Xcode** (latest version recommended)
- **CocoaPods** (`sudo gem install cocoapods`)
- **Node.js** (v14+ recommended)
- **Yarn** or **npm**

### For Android Development:
- **Java Development Kit (JDK)** - Version 11 or 17
- **Android Studio** (with Android SDK)
- **Android SDK** (API level 30+)
- **Node.js** (v14+ recommended)
- **Yarn** or **npm**

## Setup Steps

### 1. Install Dependencies

From the `front-end` directory:

```bash
# Install root dependencies
yarn install

# Or if using npm
npm install
```

**Note**: The project uses Yarn workspaces. The `preinstall` script installs core blocks first.

### 2. iOS Setup

#### Step 1: Install CocoaPods Dependencies

```bash
cd packages/mobile/ios
pod install
cd ../../..
```

#### Step 2: Open Xcode Workspace

```bash
# From front-end directory
yarn xcode

# Or manually
open packages/mobile/ios/Niya.xcworkspace
```

**Important**: Always open `.xcworkspace`, NOT `.xcodeproj`

#### Step 3: Configure iOS Project

1. Select a simulator or connected device in Xcode
2. Check `Info.plist` for required permissions
3. Verify `GoogleService-Info.plist` exists (for Firebase)
4. Check bundle identifier in Xcode project settings

#### Step 4: Run iOS App

```bash
# From front-end directory
yarn ios

# Or from mobile package
cd packages/mobile
yarn ios
```

### 3. Android Setup

#### Step 1: Configure Android SDK

1. Open Android Studio
2. Go to **Tools > SDK Manager**
3. Ensure these are installed:
   - Android SDK Platform 30+
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools

#### Step 2: Set Environment Variables

**Windows (PowerShell):**
```powershell
$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
```

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
```

#### Step 3: Start Android Emulator

```bash
# List available emulators
emulator -list-avds

# Start an emulator
emulator -avd <emulator_name>
```

Or use Android Studio: **Tools > Device Manager > Start**

#### Step 4: Run Android App

```bash
# From front-end directory
yarn android

# Or from mobile package
cd packages/mobile
yarn android
```

## Common Issues & Solutions

### iOS Issues

#### 1. Pod Install Fails
```bash
# Clear CocoaPods cache
pod cache clean --all
rm -rf Pods Podfile.lock
pod install
```

#### 2. Build Errors Related to React Native
```bash
# Clean build folder in Xcode
# Product > Clean Build Folder (Cmd+Shift+K)
```

#### 3. Metro Bundler Issues
```bash
# Clear Metro cache
yarn start --reset-cache
```

#### 4. Missing GoogleService-Info.plist
- Check if file exists in `ios/` directory
- If missing, download from Firebase Console
- Ensure it's added to Xcode project

### Android Issues

#### 1. Gradle Build Fails
```bash
cd packages/mobile/android
./gradlew clean
./gradlew build
```

#### 2. SDK Version Mismatch
- Check `android/build.gradle` for `minSdkVersion` and `targetSdkVersion`
- Ensure Android SDK is installed for those versions

#### 3. Missing google-services.json
- File should be in `android/app/`
- Download from Firebase Console if missing

#### 4. Java Version Issues
- Ensure JDK 11 or 17 is installed
- Check `JAVA_HOME` environment variable

## Configuration Files to Check

### iOS
- `ios/Podfile` - CocoaPods dependencies
- `ios/Niya/Info.plist` - App permissions and settings
- `ios/GoogleService-Info.plist` - Firebase configuration
- `ios/Niya.xcworkspace` - Xcode workspace

### Android
- `android/build.gradle` - Root build configuration
- `android/app/build.gradle` - App-level build configuration
- `android/app/src/main/AndroidManifest.xml` - App permissions
- `android/app/google-services.json` - Firebase configuration

## Environment Variables

Check if there's a `.env` file or environment configuration needed:

```bash
# Look for .env files
find . -name ".env*" -type f
```

Common variables needed:
- `API_BASE_URL` - Backend API endpoint
- `FIREBASE_*` - Firebase configuration
- `GOOGLE_SIGNIN_*` - Google Sign-In configuration

## Testing the App

### Run Metro Bundler
```bash
# From front-end directory
cd packages/mobile
yarn start
```

### Run on Device/Emulator

**iOS:**
```bash
yarn ios
```

**Android:**
```bash
yarn android
```

## Next Steps (When Ready)

1. ✅ Verify dependencies install correctly
2. ✅ Check iOS workspace opens in Xcode
3. ✅ Verify Android Gradle builds
4. ✅ Test Metro bundler starts
5. ✅ Check API endpoint configuration
6. ✅ Test login/authentication flow
7. ✅ Verify Firebase integration
8. ✅ Test on physical devices (if possible)

## Backend API Integration

The mobile app connects to the Rails backend. Ensure:
- Backend API is running and accessible
- API base URL is configured correctly
- CORS settings allow mobile app requests
- Authentication tokens are handled properly

**Backend URL**: Check `packages/mobile/` for API configuration files.

## Documentation References

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Firebase React Native](https://rnfirebase.io/)

## Current Status

- 📋 Setup plan created
- ⏳ Waiting to begin implementation
- ⏳ Dependencies need verification
- ⏳ iOS/Android build configurations need review

## Notes

- The app uses a monorepo structure with Yarn workspaces
- Core blocks are in `packages/blocks/core/`
- Dependencies are managed at the root level
- Make sure to run `yarn install` from `front-end/` directory first













