/**
 * Copies vendored fixes into node_modules after yarn install.
 * CI removes postinstall; run this explicitly in workflows (and locally after install).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function copyIfTargetExists(relFrom, relTo) {
  const from = path.join(__dirname, relFrom);
  const to = path.join(root, relTo);
  if (!fs.existsSync(from)) {
    console.warn('[apply-vendor-patches] missing source:', from);
    return false;
  }
  if (!fs.existsSync(path.dirname(to))) {
    console.warn('[apply-vendor-patches] skip (package not installed):', path.dirname(to));
    return false;
  }
  fs.copyFileSync(from, to);
  console.log('[apply-vendor-patches] applied ->', relTo);
  return true;
}

copyIfTargetExists(
  'vendor-patches/videosdk-react-native-webrtc-Permissions.ts',
  'node_modules/@videosdk.live/react-native-webrtc/src/Permissions.ts',
);

/**
 * RN PermissionsModule crashes the process if permission is null (IllegalArgumentException).
 * Some bundles (VideoSDK WebRTC, etc.) can pass undefined. Guard at the JS layer.
 */
function patchReactNativePermissionsAndroid() {
  const rel = 'node_modules/react-native/Libraries/PermissionsAndroid/PermissionsAndroid.js';
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    console.warn('[apply-vendor-patches] skip RN PermissionsAndroid.js (not found)');
    return;
  }
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes('NIYA_GUARD_NULL_PERMISSION')) {
    console.log('[apply-vendor-patches] RN PermissionsAndroid.js already patched');
    return;
  }

  const checkTail = `    invariant(
      NativePermissionsAndroid,
      'PermissionsAndroid is not installed correctly.',
    );

    return NativePermissionsAndroid.checkPermission(permission);`;

  const checkReplacement = `    invariant(
      NativePermissionsAndroid,
      'PermissionsAndroid is not installed correctly.',
    );

    if (permission == null || permission === '') {
      console.warn('[NIYA_GUARD_NULL_PERMISSION] PermissionsAndroid.check* ignoring null/empty permission');
      return Promise.resolve(false);
    }

    return NativePermissionsAndroid.checkPermission(permission);`;

  if (!s.includes(checkTail)) {
    console.warn('[apply-vendor-patches] RN PermissionsAndroid.js: check block not found, skip');
    return;
  }
  const parts = s.split(checkTail);
  if (parts.length !== 3) {
    console.warn('[apply-vendor-patches] RN PermissionsAndroid.js: expected 2 check blocks, got', parts.length - 1);
    return;
  }
  s = parts.join(checkReplacement);

  const requestInvariantToRationale = `    invariant(
      NativePermissionsAndroid,
      'PermissionsAndroid is not installed correctly.',
    );

    if (rationale) {`;

  const requestReplacement = `    invariant(
      NativePermissionsAndroid,
      'PermissionsAndroid is not installed correctly.',
    );

    if (permission == null || permission === '') {
      console.warn('[NIYA_GUARD_NULL_PERMISSION] PermissionsAndroid.request ignoring null/empty permission');
      return Promise.resolve(this.RESULTS.DENIED);
    }

    if (rationale) {`;

  if (!s.includes(requestInvariantToRationale)) {
    console.warn('[apply-vendor-patches] RN PermissionsAndroid.js: request block not found, skip');
    return;
  }
  s = s.replace(requestInvariantToRationale, requestReplacement);

  const multiTail = `    invariant(
      NativePermissionsAndroid,
      'PermissionsAndroid is not installed correctly.',
    );

    return NativePermissionsAndroid.requestMultiplePermissions(permissions);`;

  const multiReplacement = `    invariant(
      NativePermissionsAndroid,
      'PermissionsAndroid is not installed correctly.',
    );

    const filteredPermissions = (permissions || []).filter(
      (p) => p != null && p !== '',
    );
    if (filteredPermissions.length === 0) {
      console.warn('[NIYA_GUARD_NULL_PERMISSION] PermissionsAndroid.requestMultiple: no valid permissions');
      return Promise.resolve({});
    }

    return NativePermissionsAndroid.requestMultiplePermissions(filteredPermissions);`;

  if (!s.includes(multiTail)) {
    console.warn('[apply-vendor-patches] RN PermissionsAndroid.js: requestMultiple block not found, skip');
    return;
  }
  s = s.replace(multiTail, multiReplacement);

  fs.writeFileSync(p, s, 'utf8');
  console.log('[apply-vendor-patches] applied ->', rel);
}

patchReactNativePermissionsAndroid();

/**
 * The new @videosdk.live/react-native-webrtc (0.0.24) declares a maven dependency
 * on io.github.webrtc-sdk:android which fails to resolve in our Gradle setup.
 * Replace it with a local AAR reference (AAR downloaded in CI step).
 */
function patchWebrtcBuildGradle() {
  const rel = 'node_modules/@videosdk.live/react-native-webrtc/android/build.gradle';
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    console.warn('[apply-vendor-patches] skip webrtc build.gradle (not found)');
    return;
  }
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes('NIYA_WEBRTC_LOCAL_AAR')) {
    console.log('[apply-vendor-patches] webrtc build.gradle already patched');
    return;
  }
  // Replace maven dependency with local AAR via flatDir
  s = s.replace(
    "dependencies {",
    "// NIYA_WEBRTC_LOCAL_AAR\nrepositories {\n    flatDir { dirs 'libs' }\n}\n\ndependencies {"
  );
  s = s.replace(
    "api 'io.github.webrtc-sdk:android:125.6422.06.1'",
    "api(name: 'webrtc-android', ext: 'aar')"
  );
  fs.writeFileSync(p, s, 'utf8');
  console.log('[apply-vendor-patches] applied ->', rel);
}

patchWebrtcBuildGradle();

/**
 * @videosdk.live/react-sdk ships pre-compiled JS (dist/index.js) targeting modern
 * environments with optional chaining (?.) and nullish coalescing (??) syntax.
 * Our RN 0.65 JSC runtime cannot handle these. Metro's Babel transform should
 * handle them but doesn't in practice (version mismatch between metro-react-native-
 * babel-preset 0.72.4 and Metro 0.66). Manually transpile the syntax away.
 */
function patchVideoSdkModernSyntax() {
  // Find all JS files in VideoSDK packages that may contain modern syntax.
  // react-sdk may be hoisted, nested, or resolved via yarn workspaces.
  const sdkDirs = [
    'node_modules/@videosdk.live/react-sdk',
    'node_modules/@videosdk.live/react-native-sdk',
    'node_modules/@videosdk.live/react-native-sdk/node_modules/@videosdk.live/react-sdk',
  ];
  // Dynamically find react-sdk wherever yarn placed it
  try {
    const resolved = require.resolve('@videosdk.live/react-sdk/package.json', { paths: [root] });
    const resolvedDir = path.dirname(resolved);
    const relDir = path.relative(root, resolvedDir).replace(/\\/g, '/');
    if (!sdkDirs.includes(relDir)) {
      sdkDirs.push(relDir);
      console.log('[apply-vendor-patches] found react-sdk at:', relDir);
    }
  } catch (e) {
    console.warn('[apply-vendor-patches] could not resolve @videosdk.live/react-sdk:', e.message);
  }
  const targets = [];
  for (const dir of sdkDirs) {
    const absDir = path.join(root, dir);
    if (!fs.existsSync(absDir)) continue;
    (function walk(d) {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'android' && entry.name !== 'ios') {
          walk(path.join(d, entry.name));
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
          targets.push(path.relative(root, path.join(d, entry.name)).replace(/\\/g, '/'));
        }
      }
    })(absDir);
  }
  console.log('[apply-vendor-patches] VideoSDK JS files to check:', targets.length);

  for (const rel of targets) {
    const p = path.join(root, rel);
    if (!fs.existsSync(p)) continue;
    let s = fs.readFileSync(p, 'utf8');
    if (!s.includes('?.') && !s.includes('??')) continue;

    // Transpile optional chaining: obj?.prop → obj == null ? void 0 : obj.prop
    // Handle method calls: obj?.method() → obj == null ? void 0 : obj.method()
    // Handle computed: obj?.[key] → obj == null ? void 0 : obj[key]
    // Also handle nullish coalescing: a ?? b → a != null ? a : b
    // Use @babel/core programmatically if available, otherwise do regex replacement
    try {
      const babel = require('@babel/core');
      const result = babel.transformSync(s, {
        filename: p,
        plugins: [
          '@babel/plugin-syntax-jsx',
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator',
        ],
        parserOpts: { allowReturnOutsideFunction: true },
        babelrc: false,
        configFile: false,
        sourceType: 'unambiguous',
      });
      if (result && result.code) {
        fs.writeFileSync(p, result.code, 'utf8');
        console.log('[apply-vendor-patches] transpiled modern syntax ->', rel);
      }
    } catch (e) {
      console.warn('[apply-vendor-patches] babel transform failed for', rel, e.message);
    }
  }
}

patchVideoSdkModernSyntax();
