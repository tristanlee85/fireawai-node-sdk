import express from 'express';
import {
  authorizeWebSocketConnection,
  sendWebSocketMessage,
} from './websocket.mjs';
import config from './config.mjs';

const router = express.Router();

router.post('/message', async (req, res) => {
  const messageBody = req.body.message;

  try {
    await authorizeWebSocketConnection();
    const response = await sendWebSocketMessage(messageBody);
    res.json({ response });
    if (config.singleRequestMode) {
      shutdownServer();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function shutdownServer() {
  console.log('Shutting down server...');
  process.exit();
}

export default router;
