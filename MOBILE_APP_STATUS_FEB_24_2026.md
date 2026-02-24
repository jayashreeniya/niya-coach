# Niya Mobile App - Build Status Document
**Date:** February 24, 2026  
**Status:** APK WORKING - Ready for functionality testing  
**Branch:** master  
**Latest Commit:** 02f2865  
**Working APK:** https://github.com/jayashreeniya/niya-coach/actions/runs/22347551998

---

## Current State

The Android APK builds successfully via GitHub Actions and launches without crashing on Android devices. The app is now ready for **functionality testing** before Play Store submission.

---

## Key Files Modified (from original to working state)

### 1. GitHub Actions Workflow
**File:** `.github/workflows/build-apk.yml`
- Runs on `ubuntu-latest` with Node 20, JDK 11
- Yarn install with network timeout
- Manual patch application (bypasses `patch-package` which had CRLF issues on Linux CI)
- Pre-bundles JS with `npx react-native bundle` before Gradle build
- Gradle build uses `-x bundleReleaseJsAndAssets` to skip its own bundling (was causing missing bundle)
- Verifies APK contains JS bundle and native libraries

### 2. MainApplication.java
**File:** `front-end/packages/mobile/android/app/src/main/java/com/Niya/MainApplication.java`
- **12 native modules** manually registered in `getPackages()` (autolinking disabled for all):
  - RNFusedLocationPackage, ForegroundServicePackage, InCallManagerPackage, WebRTCModulePackage
  - ReactNativePushNotificationPackage, TextToSpeechPackage
  - RNCWebViewPackage, RNGestureHandlerPackage, SvgPackage, RNDeviceInfo, NetInfoPackage, AsyncStoragePackage
- Native crash handler with `Thread.setDefaultUncaughtExceptionHandler` (saves to SharedPreferences with `.commit()`)
- Step-by-step diagnostic logging in `onCreate()` (SoLoader, Radar, FacebookSdk)
- `registerReceiver` override for Android 14+ compatibility

### 3. CrashActivity.java
**File:** `front-end/packages/mobile/android/app/src/main/java/com/Niya/CrashActivity.java`
- Displays native crash reports saved by MainApplication's crash handler
- Copy-to-clipboard button for easy sharing
- Selectable text for debugging

### 4. react-native.config.js
**File:** `front-end/packages/mobile/react-native.config.js`
- Autolinking **disabled** for all 12 manually-registered packages (prevents duplicate module registration)
- Custom sourceDir for `react-native-video` (uses android-exoplayer)

### 5. index.js (Entry Point)
**File:** `front-end/packages/mobile/index.js`
- Global JS error handler via `ErrorUtils.setGlobalHandler()` (shows Alert on fatal errors)
- App import wrapped in try-catch (shows "JS Load Error" screen if App module fails to load)

### 6. AndroidManifest.xml
**File:** `front-end/packages/mobile/android/app/src/main/AndroidManifest.xml`
- CrashActivity declared with `android:exported="false"`

### 7. Firebase Versions (aligned)
**Files:** `front-end/package.json`, `front-end/packages/mobile/package.json`
- `@react-native-firebase/app`: 13.1.1
- `@react-native-firebase/analytics`: 13.1.1
- `@react-native-firebase/messaging`: 13.1.1

---

## Patches Applied at Build Time (in workflow)

### Patch 1: react-navigation-stack useTheme.js
- Rewrites `useTheme.js` to be compatible with react-navigation v2
- The original imports from react-navigation v4 API which doesn't exist in v2

### Patch 2: react-native-push-notification PendingIntent
- Adds `FLAG_MUTABLE` for Android 12+ (API 31+) compatibility
- Falls back to `FLAG_UPDATE_CURRENT` for older versions

### Patch 3: react-native-material-dropdown propTypes
- Fixes `Animated.Text.propTypes.style` → `Text.propType` for React Native 0.65+ compatibility
- Adds `Text` import where missing

---

## Issues Resolved (chronological)

| # | Issue | Root Cause | Fix |
|---|-------|-----------|-----|
| 1 | patch-package fails on CI | CRLF line endings on Ubuntu | Manual Node.js patch script in workflow |
| 2 | Firebase version mismatch warning | app@8.4.7 vs analytics/messaging@13.1.1 | Aligned all to 13.1.1 |
| 3 | JS bundle missing from APK | Gradle task ordering bug in RN 0.65 + Gradle 7 | Pre-bundle JS before Gradle, skip bundleReleaseJsAndAssets |
| 4 | Blank crash report | `.apply()` (async) + immediate process kill | `.commit()` (sync) + 1.5s delay |
| 5 | AsyncStorage is null | Modules removed from getPackages() but autolinking failed due to manual settings.gradle conflicts | Added all 12 modules back manually, disabled autolinking for them |

---

## Build Configuration

- **React Native:** 0.65.3
- **React:** 18.2.0
- **compileSdkVersion:** 34
- **targetSdkVersion:** 34
- **minSdkVersion:** 30 (Android 11+)
- **Hermes:** disabled (using JSC)
- **Multidex:** enabled
- **Proguard:** disabled
- **APK type:** Universal (armeabi-v7a, x86, arm64-v8a, x86_64)

---

## Next Steps: Functionality Testing

The following features need to be tested on the device:

1. **User Authentication** - Login/signup flow
2. **Navigation** - All screens accessible, back navigation works
3. **Video Calls** - Coach-to-user video call (VideoSDK integration)
4. **Push Notifications** - Receiving and handling notifications
5. **Location Services** - Radar SDK, geolocation
6. **Assessment Tests** - Wellbeing assessment flow
7. **Chat/Messaging** - In-app communication
8. **Media** - Image picker, document picker, camera
9. **Text-to-Speech** - Voice features
10. **Offline Storage** - AsyncStorage persistence
11. **Deep Linking** - URL scheme handling
12. **Facebook SDK** - Social features/analytics

---

## How to Build a New APK

1. Push changes to `master` branch
2. Go to GitHub Actions: https://github.com/jayashreeniya/niya-coach/actions
3. Select "Build Android APK" workflow
4. Click "Run workflow" → select `master` → click "Run workflow"
5. Wait ~11 minutes for build to complete
6. Download `niya-release-apk` artifact from the completed run
