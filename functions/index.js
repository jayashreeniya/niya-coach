const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
<<<<<<< HEAD
const functions = require("firebase-functions");
const axios = require("axios");
=======
>>>>>>> 2beeaa2221b658742b9f66cd4380decd3352cd86

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
<<<<<<< HEAD

// Proxy for OpenAI API
exports.openaiProxy = onRequest(async (req, res) => {
  try {
    const apiKey = functions.config().openai.key;
    if (!apiKey) {
      res.status(500).json({ error: 'OpenAI API key not configured in Firebase environment.' });
      return;
    }
    const { endpoint, ...openaiPayload } = req.body;
    if (!endpoint) {
      res.status(400).json({ error: 'Missing endpoint in request body.' });
      return;
    }
    const openaiUrl = `https://api.openai.com/v1/${endpoint}`;
    const openaiRes = await axios.post(openaiUrl, openaiPayload, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    res.status(openaiRes.status).json(openaiRes.data);
  } catch (error) {
    console.error('Error in openaiProxy:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
});
=======
>>>>>>> 2beeaa2221b658742b9f66cd4380decd3352cd86
