import { connect, sendMessage } from '../src/index.mjs';
import WebSocket from 'ws';

jest.mock('ws', () => {
  const WebSocket = jest.fn();
  WebSocket.prototype.on = jest.fn((event, cb) => {
    if (event === 'open') {
      setTimeout(cb, 10); // simulate open event
    }
  });
  WebSocket.prototype.send = jest.fn();
  WebSocket.prototype.close = jest.fn();
  return WebSocket;
});

describe('WebSocket Functions', () => {
  beforeAll(async () => {
    await connect();
  });

  test('connect function establishes a WebSocket connection', async () => {
    expect(WebSocket.prototype.on).toHaveBeenCalledWith(
      'open',
      expect.any(Function)
    );
    expect(WebSocket.prototype.on).toHaveBeenCalledWith(
      'message',
      expect.any(Function)
    );
    expect(WebSocket.prototype.on).toHaveBeenCalledWith(
      'error',
      expect.any(Function)
    );
    expect(WebSocket.prototype.on).toHaveBeenCalledWith(
      'close',
      expect.any(Function)
    );
  });

  test('sendMessage function sends a message and receives a response', async () => {
    const mockMessage = 'What is EdgeJS?';
    const mockResponse = {
      message: { message: { content: 'EdgeJS is...', finished: true } },
    };

    WebSocket.prototype.on.mockImplementationOnce((event, cb) => {
      if (event === 'message') {
        cb(JSON.stringify(mockResponse));
      }
    });

    const response = await sendMessage(mockMessage);
    expect(response).toBe('EdgeJS is...');
    expect(WebSocket.prototype.send).toHaveBeenCalled();
  });
});
