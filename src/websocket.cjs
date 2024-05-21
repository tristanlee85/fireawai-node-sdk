// src/websocket.mjs

import WebSocket from 'ws';
import axios from 'axios';
import config from './config.mjs';

let ws;
let isSubscribed = false;
let websocketId = '';

export async function connect() {
  if (websocketId) {
    return;
  }

  const authResponse = await axios.post(
    config.authUrl,
    { chat: { collection_id: config.chatbotId, include_context: false } },
    {
      headers: {
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        Authorization: config.apiKey,
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Content-Type': 'application/json',
        Origin: 'http://localhost:3000',
        Pragma: 'no-cache',
        Referer: 'http://localhost:3000/',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'sec-ch-ua':
          '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'x-ec-debug':
          'x-ec-cache,x-ec-cache-remote,x-ec-check-cacheable,x-ec-cache-key,x-ec-cache-state',
        'x-ec-pragma': 'cache-verbose,log-all,trace,track',
      },
    }
  );

  websocketId = authResponse.data.id;
  await connectWebSocket();
}

function connectWebSocket() {
  return new Promise((resolve, reject) => {
    ws = new WebSocket(config.websocketUrl);

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
      } else {
        console.log('Received message:', data.toString());
      }
    });

    ws.on('error', (error) => {
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

    ws.send(JSON.stringify(messageData));

    const startTime = Date.now();
    const timeout = setTimeout(() => {
      ws.close();
      reject('WebSocket connection timed out');
    }, config.websocketTimeout);

    ws.on('message', (data) => {
      const parsedData = JSON.parse(data.toString());
      const { content, context, finished } = parsedData.message?.message || {};

      // console.log('Received message:', parsedData);

      if (finished && content && context) {
        clearTimeout(timeout);
        resolve(parsedData);
        ws.close();
      }
    });
  });
}
