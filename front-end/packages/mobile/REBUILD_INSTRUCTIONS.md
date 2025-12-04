# Mobile App Rebuild Instructions

## Date: 2025-11-13

## Backend URL Configuration

### ✅ Already Updated
The backend URL has been updated in the following files:
- `front-end/packages/framework/src/config.js` - `baseURL` set to deployed backend
- `front-end/packages/components/src/utils.ts` - `BASE_URL` set to deployed backend

**Backend URL**: `https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io`

## Prerequisites

### Required Software
1. **Node.js** (v14 or higher)
2. **React Native CLI**
3. **Android Studio** (for Android builds)
4. **Xcode** (for iOS builds - macOS only)
5. **Java JDK** (for Android)
6. **CocoaPods** (for iOS)

### Environment Setup
```bash
# Install dependencies
cd front-end/packages/mobile
npm install

# For iOS, install pods
cd ios
pod install
cd ..
```

## Rebuild Steps

### For Android

#### 1. Clean Build
```bash
cd front-end/packages/mobile/android
./gradlew clean
cd ../..
```

#### 2. Clear Metro Cache
```bash
# Stop Metro bundler if running
# Then clear cache
npx react-native start --reset-cache
```

#### 3. Build APK (Debug)
```bash
cd front-end/packages/mobile
npm run android
```

#### 4. Build APK (Release)
```bash
cd front-end/packages/mobile/android
./gradlew assembleRelease
```

The APK will be generated at:
`android/app/build/outputs/apk/release/app-release.apk`

#### 5. Build AAB (for Play Store)
```bash
cd front-end/packages/mobile/android
./gradlew bundleRelease
```

The AAB will be generated at:
`android/app/build/outputs/bundle/release/app-release.aab`

### For iOS

#### 1. Clean Build
```bash
cd front-end/packages/mobile/ios
rm -rf build
rm -rf Pods
pod install
cd ../..
```

#### 2. Clear Metro Cache
```bash
npx react-native start --reset-cache
```

#### 3. Build and Run (Simulator)
```bash
cd front-end/packages/mobile
npm run ios
```

#### 4. Build for Device/Archive
1. Open Xcode:
   ```bash
   npm run xcode
   # Or manually: open ios/Niya.xcworkspace
   ```

2. In Xcode:
   - Select your target device or "Any iOS Device"
   - Product → Archive
   - Follow the archive process

## Verification Steps

### 1. Check Backend URL in App
After building, verify the app connects to the correct backend:
- Check network requests in React Native Debugger
- Verify API calls go to: `https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io`

### 2. Test API Connectivity
- Test login functionality
- Test API endpoints that require authentication
- Verify date format handling works correctly

### 3. Test Date Formats
The backend now supports:
- `DD/MM/YYYY` format (e.g., `13/11/2025`)
- `YYYY-MM-DD` format (e.g., `2025-11-13`)

Ensure the mobile app sends dates in one of these formats.

## Troubleshooting

### Android Build Issues

#### Issue: Gradle Build Fails
```bash
cd front-end/packages/mobile/android
./gradlew clean
./gradlew --stop
cd ../..
npm install
```

#### Issue: Metro Bundler Issues
```bash
# Clear all caches
rm -rf node_modules
rm -rf android/app/build
rm -rf android/.gradle
npm install
npx react-native start --reset-cache
```

### iOS Build Issues

#### Issue: Pod Installation Fails
```bash
cd front-end/packages/mobile/ios
rm -rf Pods
rm Podfile.lock
pod deintegrate
pod install
```

#### Issue: Build Errors
```bash
cd front-end/packages/mobile/ios
rm -rf build
rm -rf ~/Library/Developer/Xcode/DerivedData
# Then rebuild in Xcode
```

### Network Issues

#### Issue: Cannot Connect to Backend
1. Verify backend URL is correct in config files
2. Check if backend is accessible: `curl https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io/healthcheck`
3. Check CORS settings on backend
4. Verify network permissions in app manifest

## Build Scripts Reference

### Available npm Scripts
```bash
npm run android      # Run on Android
npm run ios          # Run on iOS
npm run start        # Start Metro bundler
npm run compile      # Compile TypeScript
npm run studio       # Open Android Studio
npm run xcode        # Open Xcode workspace
```

## Configuration Files

### Backend URL Locations
- `front-end/packages/framework/src/config.js` - Main config
- `front-end/packages/components/src/utils.ts` - Utils config

### Build Configuration
- `android/app/build.gradle` - Android build config
- `ios/Podfile` - iOS dependencies
- `package.json` - npm scripts and dependencies

## Post-Build Testing

### Checklist
- [ ] App builds successfully
- [ ] App connects to backend
- [ ] Login works
- [ ] API calls succeed
- [ ] Date formats work correctly
- [ ] No console errors
- [ ] Network requests show correct backend URL

## Notes

- The backend URL is already configured correctly
- No code changes needed - just rebuild
- Backend supports both DD/MM/YYYY and YYYY-MM-DD date formats
- Ensure mobile app uses one of these formats when sending dates

## Support

If you encounter issues:
1. Check backend logs: `az containerapp logs show --name niya-admin-app-india --resource-group niya-rg --tail 50`
2. Verify backend is running: `az containerapp show --name niya-admin-app-india --resource-group niya-rg --query "properties.runningStatus"`
3. Test backend directly: Use the test scripts in `front-end/packages/mobile/test_*.ps1`




