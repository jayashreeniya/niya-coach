# Mobile App Rebuild Guide - Backend URL Update

## Date: 2025-11-13

## ✅ Configuration Status

### Backend URL Already Updated
The backend URL has been updated in the JavaScript/TypeScript configuration files:

1. **`front-end/packages/framework/src/config.js`**
   ```javascript
   const baseURL = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io";
   ```

2. **`front-end/packages/components/src/utils.ts`**
   ```typescript
   const BASE_URL: string = "https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io";
   ```

### ✅ Native Code Check
- **Android**: No backend URL in native Java/Kotlin code ✅
- **iOS**: No backend URL in native Swift/Objective-C code ✅
- **Configuration**: All backend URLs are in JavaScript/TypeScript layer ✅

## Why Rebuild is Needed

When you rebuild the mobile app, React Native will:
1. Bundle the JavaScript code (including the updated config files)
2. Include the new backend URL in the app bundle
3. The app will then use the updated backend URL

## Rebuild Instructions

### Prerequisites
- Node.js installed
- React Native CLI installed
- For Android: Android Studio with Android SDK
- For iOS: Xcode (macOS only)

### Step 1: Clean Previous Builds

#### Android
```bash
cd front-end/packages/mobile/android
./gradlew clean
cd ../../..
```

#### iOS
```bash
cd front-end/packages/mobile/ios
rm -rf build
rm -rf Pods
pod install
cd ../../..
```

### Step 2: Clear Metro Cache
```bash
cd front-end/packages/mobile
npx react-native start --reset-cache
```
(Press Ctrl+C to stop after cache is cleared)

### Step 3: Rebuild App

#### For Android (Debug)
```bash
cd front-end/packages/mobile
npm run android
```

#### For Android (Release APK)
```bash
cd front-end/packages/mobile/android
./gradlew assembleRelease
```
APK location: `android/app/build/outputs/apk/release/app-release.apk`

#### For Android (Release AAB - Play Store)
```bash
cd front-end/packages/mobile/android
./gradlew bundleRelease
```
AAB location: `android/app/build/outputs/bundle/release/app-release.aab`

#### For iOS (Simulator)
```bash
cd front-end/packages/mobile
npm run ios
```

#### For iOS (Device/Archive)
1. Open Xcode:
   ```bash
   cd front-end/packages/mobile
   npm run xcode
   ```

2. In Xcode:
   - Select target device
   - Product → Clean Build Folder (Cmd+Shift+K)
   - Product → Archive

## Verification

### After Rebuild, Verify Backend URL:

1. **Run the app**
2. **Enable React Native Debugger** (shake device or Cmd+D/Ctrl+M)
3. **Check Network Requests**:
   - Open React Native Debugger
   - Go to Network tab
   - Make an API call (e.g., login)
   - Verify requests go to: `https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io`

### Test API Connectivity

1. **Test Login**: Try logging in with valid credentials
2. **Check Console**: Look for any network errors
3. **Verify Response**: Ensure API responses are received correctly

## What Changed

### Backend Updates
- ✅ Date format parsing improved (DD/MM/YYYY and YYYY-MM-DD support)
- ✅ Error handling enhanced
- ✅ API endpoints standardized

### Mobile App Updates
- ✅ Backend URL updated to deployed backend
- ✅ No code changes needed - just rebuild

## Troubleshooting

### Issue: App still uses old backend URL
**Solution:**
1. Clear Metro cache: `npx react-native start --reset-cache`
2. Clean build folders (Android: `./gradlew clean`, iOS: Clean in Xcode)
3. Rebuild app completely
4. Uninstall old app from device/emulator before installing new build

### Issue: Network requests fail
**Solution:**
1. Verify backend is running: `curl https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/healthcheck`
2. Check CORS settings (already configured)
3. Verify network permissions in AndroidManifest.xml (already set)
4. Check iOS Info.plist for network security (already configured)

### Issue: Build fails
**Solution:**
- Android: `cd android && ./gradlew clean && cd .. && npm run android`
- iOS: Clean build folder in Xcode, then rebuild

## Files Modified (Already Done)

✅ `front-end/packages/framework/src/config.js` - Backend URL updated
✅ `front-end/packages/components/src/utils.ts` - Backend URL updated

## Files NOT Modified (No Changes Needed)

- ✅ Android native code (Java/Kotlin) - No backend URL here
- ✅ iOS native code (Swift/Objective-C) - No backend URL here
- ✅ AndroidManifest.xml - Only permissions, no URLs
- ✅ iOS Info.plist - Only permissions, no URLs
- ✅ build.gradle files - Build config only
- ✅ Podfile - Dependencies only

## Summary

**Status**: ✅ Configuration complete, ready to rebuild

**Action Required**: Rebuild the mobile app (Android and/or iOS) to include the updated backend URL in the app bundle.

**No Code Changes Needed**: The backend URL is already updated in the config files. Just rebuild!




