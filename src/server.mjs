import express from 'express';
import bodyParser from 'body-parser';
import config from './config.mjs';
import { connect, sendMessage } from './websocket.mjs';

const app = express();

app.use(bodyParser.json());

app.post('/api/message', async (req, res) => {
  const messageBody = req.body.message;

  try {
    await connect();
    const response = await sendMessage(messageBody);
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

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default server;
