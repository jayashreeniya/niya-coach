# Mobile App Rebuild Guide - For Non-Developers

## Important Note

Rebuilding a mobile app requires development tools to be installed. Since you mentioned you're not a mobile app developer, you have a few options:

## Option 1: Have a Developer Rebuild (Recommended)

**Easiest Option**: Have a mobile app developer rebuild the app for you.

**What to tell them:**
- The backend URL has already been updated in the config files
- They just need to rebuild the app (no code changes needed)
- Files updated: `front-end/packages/framework/src/config.js` and `front-end/packages/components/src/utils.ts`
- Backend URL: `https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io`

## Option 2: Install Prerequisites and Rebuild Yourself

If you want to rebuild yourself, you'll need to install:

### Required Software:

1. **Java Development Kit (JDK) 11 or 17**
   - Download from: https://adoptium.net/
   - Install and set JAVA_HOME environment variable

2. **Android Studio**
   - Download from: https://developer.android.com/studio
   - Install Android SDK (API level 30+)
   - Set ANDROID_HOME environment variable

3. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

4. **React Native CLI**
   - Install: `npm install -g react-native-cli`

### Environment Variables to Set:

**Windows PowerShell:**
```powershell
# Set JAVA_HOME (adjust path to your JDK installation)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:PATH += ";$env:JAVA_HOME\bin"

# Set ANDROID_HOME (adjust path to your Android SDK)
$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools"
```

### Then Rebuild:

```bash
cd front-end/packages/mobile
npm run android
```

## Option 3: Use a Build Service

You could use a cloud build service like:
- **App Center** (Microsoft)
- **Bitrise**
- **CircleCI**

These services can build your app in the cloud without installing everything locally.

## Current Status

✅ **Backend URL Configuration**: COMPLETE
- Updated in: `front-end/packages/framework/src/config.js`
- Updated in: `front-end/packages/components/src/utils.ts`
- Backend URL: `https://niya-admin-app-india.blueisland-fcf21982.centralindia.azurecontainerapps.io`

⏳ **App Rebuild**: PENDING
- Requires development tools (Java, Android Studio, etc.)
- Or a developer to rebuild for you

## What's Already Done

1. ✅ Backend API deployed with date format fixes
2. ✅ Backend URL updated in mobile app config files
3. ✅ No code changes needed - just rebuild required

## What's Needed

1. ⏳ Rebuild the mobile app to include updated backend URL
2. ⏳ Test the app connects to the new backend
3. ⏳ Verify API calls work correctly

## Recommendation

**Best approach**: Have a mobile app developer rebuild the app. They will:
1. Have all the required tools already installed
2. Know how to handle any build issues
3. Can test the app properly
4. Can create release builds for distribution

## Summary

- **Configuration**: ✅ Complete (backend URL updated)
- **Code Changes**: ✅ Complete (no changes needed)
- **Rebuild**: ⏳ Needs developer tools or a developer

The hard part (updating the backend URL) is done. The rebuild is straightforward for someone with the right tools.




