# Fireaw.ai Node SDK

This project is a Node.js SDK for interacting with the Fireaw.ai service, providing functions to send messages and receive responses through WebSocket, without needing to manage WebSocket connections directly. It also includes an optional REST API server for interacting with the service.

## Features

- Functions to connect to Fireaw.ai WebSocket.
- Send messages and receive responses through WebSocket.
- Handles WebSocket connection, subscription, and message parsing.
- Configurable timeout for WebSocket connections.
- Optional REST API server for sending messages and receiving responses.

## Requirements

- Node.js 18.x or higher
- npm 8.x or higher

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:tristanlee85/fireawai-node-sdk.git
   cd fireawai-node-sdk
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Configuration

### Using Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:

```env
FIREAWAI_API_KEY=your_api_key_here
FIREAWAI_CHATBOT_ID=your_chatbot_id_here
WEBSOCKET_TIMEOUT=120000  # Optional, timeout in milliseconds (default is 2 minutes)
```

### Programmatic Configuration

Alternatively, you can configure the SDK programmatically:

```javascript
const { setConfig } = require('fireawai-node-sdk');

setConfig({
  apiKey: 'your_api_key_here',
  chatbotId: 'your_chatbot_id_here',
  websocketTimeout: 120000, // Optional
});
```

## Usage

### Using as a Module

To create a connection and send a message to Fireaw.ai:

```javascript
const { connect, sendMessage, setConfig } = require('fireawai-node-sdk');

// Optionally set configuration programmatically if not using environment variables
setConfig({
  apiKey: 'your_api_key_here',
  chatbotId: 'your_chatbot_id_here',
  port: 3000,
  websocketTimeout: 120000, // Optional
});

(async () => {
  try {
    await connect();
    const response = await sendMessage('your query');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
})();
```

### Using the REST API

You can start the server using the following command:

```bash
npm start
```

### Sending a Query Using the REST API

To send a query using the REST API, you can use `curl` or any HTTP client. Here’s an example using `curl`:

```bash
curl -X POST http://localhost:3000/api/message \
  -H "Content-Type: application/json" \
  -d '{"message": "your query"}'
```

## Dependencies

- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `ws`: Simple to use, blazing fast and thoroughly tested WebSocket client and server for Node.js.
- `axios`: Promise based HTTP client for the browser and Node.js.
- `body-parser`: Node.js body parsing middleware.
- `dotenv`: Module to load environment variables from a `.env` file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
