import WebSocket from 'ws';
import axios from 'axios';
import { getConfig } from './config.mjs';

let ws;
let isSubscribed = false;
let websocketId = '';

const { apiKey, chatbotId, websocketUrl, authUrl, websocketTimeout } =
  getConfig();

export async function connect() {
  if (websocketId) {
    return;
  }

  if (!apiKey || !chatbotId) {
    throw new Error(
      'Missing required environment variables: `apiKey` and/or `chatbotId`'
    );
  }

  const authResponse = await axios.post(
    authUrl,
    { chat: { collection_id: chatbotId, include_context: true } },
    {
      headers: {
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        Authorization: apiKey,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
    }
  );

  websocketId = authResponse.data.id;
  return connectWebSocket();
}

function connectWebSocket() {
  return new Promise((resolve, reject) => {
    ws = new WebSocket(websocketUrl);

    ws.on('open', () => {
      console.log('WebSocket connection established');
    });

    ws.on('message', (data) => {
      const parsedData = JSON.parse(data.toString());
      if (parsedData.type === 'welcome') {
        ws.send(
          JSON.stringify({
            command: 'subscribe',
            identifier: JSON.stringify({
              channel: 'ChatChannel',
              id: websocketId,
            }),
          })
        );
      } else if (parsedData.type === 'confirm_subscription') {
        console.log('Subscription confirmed');
        isSubscribed = true;
        resolve();
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket connection error:', error);
      reject(error);
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
      isSubscribed = false;
    });
  });
}

export function sendMessage(message) {
  return new Promise((resolve, reject) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return reject('WebSocket is not connected');
    }

    if (!isSubscribed) {
      return reject('Subscription not confirmed');
    }

    const messageData = {
      command: 'message',
      identifier: JSON.stringify({ channel: 'ChatChannel', id: websocketId }),
      data: JSON.stringify({
        command: 'message',
        identifier: JSON.stringify({ channel: 'ChatChannel', id: websocketId }),
        data: message,
      }),
    };

    console.log('Sending message:', message);

    ws.send(JSON.stringify(messageData));

    const startTime = Date.now();
    const timeout = setTimeout(() => {
      ws.close();
      reject('WebSocket connection timed out');
    }, websocketTimeout);

    ws.on('message', (data) => {
      const parsedData = JSON.parse(data.toString());
      const { content, finished } = parsedData.message?.message || {};

      if (finished && content) {
        console.log('Received response:', content);
        clearTimeout(timeout);
        resolve(parsedData);
        ws.close();
      }
    });
  });
}
