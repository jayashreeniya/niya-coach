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
