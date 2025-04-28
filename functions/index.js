const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

// Log when new messages are created
exports.logNewMessage = onDocumentCreated("conversations/{messageId}", (event) => {
  const message = event.data.data();
  console.log('New message:', message);
  return null;
});

// Automatically delete old messages (older than 30 days)
exports.cleanupOldMessages = onSchedule("every 24 hours", async (event) => {
  const db = getFirestore();
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  
  const snapshot = await db.collection('conversations')
    .where('timestamp', '<', cutoff)
    .get();
  
  const deletions = snapshot.docs.map(doc => doc.ref.delete());
  await Promise.all(deletions);
  return null;
});
