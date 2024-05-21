import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  apiKey: process.env.API_KEY,
  chatbotId: process.env.CHATBOT_ID,
  websocketUrl: 'wss://www.fireaw.ai/cable',
  authUrl: 'https://www.fireaw.ai/api/v1/chats',
  websocketTimeout: process.env.WEBSOCKET_TIMEOUT || 2 * 60 * 1000, // 2 minutes
};

export default config;
