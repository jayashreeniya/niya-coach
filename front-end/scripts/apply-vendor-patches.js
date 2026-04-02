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
