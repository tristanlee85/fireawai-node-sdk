import dotenv from 'dotenv';

dotenv.config();

let config = {
  port: process.env.PORT || 3000,
  apiKey: process.env.FIREAWAI_API_KEY,
  chatbotId: process.env.FIREAWAI_CHATBOT_ID,
  websocketUrl: 'wss://www.fireaw.ai/cable',
  authUrl: 'https://www.fireaw.ai/api/v1/chats',
  websocketTimeout: process.env.WEBSOCKET_TIMEOUT || 2 * 60 * 1000, // 2 minutes
};

export function setConfig(newConfig) {
  config = { ...config, ...newConfig };
}

export function getConfig() {
  return config;
}

export default config;
