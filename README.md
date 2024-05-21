# Fireaw.ai Node SDK

This project is a Node.js server that provides a REST API to interact with the Fireaw.ai service, allowing clients to send messages and receive responses without needing to manage WebSocket connections directly. It can also be imported as a module in other Node.js projects.

## Features

- REST API to send messages to a WebSocket.
- Handles WebSocket connection, subscription, and message parsing.
- Configurable timeout for WebSocket connections.
- Can be run in single request mode or continuous mode.
- Can be imported as a module in other Node.js projects.

## Requirements

- Node.js 18.x or higher
- npm 8.x or higher

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/fireawai-node-api.git
   cd fireawai-node-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root of the project and add the following environment variables:

```env
PORT=3000
API_KEY=your_api_key_here
CHATBOT_ID=your_chatbot_id_here
WEBSOCKET_TIMEOUT=120000  # Optional, timeout in milliseconds (default is 2 minutes)
```

## Usage

### Starting the Server

You can start the server using the following command:

```bash
npm start
```

### Sending a Query

To send a query using the REST API, you can use `curl` or any HTTP client. Here’s an example using `curl`:

```bash
curl -X POST http://localhost:3000/api/message \
  -H "Content-Type: application/json" \
  -d '{"message": "your query"}'
```

### Using as a Module

To use the API in another Node.js project:

1. Install the package (assuming it's published on npm or use a local path if not):

   ```bash
   npm install fireawai-node-api
   ```

2. Import and use the functions:

   ```javascript
   import { connect, sendMessage } from 'fireawai-node-api';

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

## Project Structure

- `src/index.mjs`: Entry point for module exports.
- `src/server.mjs`: Main server file.
- `src/api.mjs`: API routes.
- `src/websocket.mjs`: WebSocket handling logic.
- `src/config.mjs`: Configuration loading.
- `test/api.test.js`: Unit tests for the API.
- `.env`: Environment variables.
- `.gitignore`: Git ignore file.
- `README.md`: Readme file.
- `package.json`: NPM package file.
- `package-lock.json`: NPM package-lock file.

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
