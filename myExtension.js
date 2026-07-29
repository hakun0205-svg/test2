class WebSocketExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.ws = null;
    this.lastMessage = '';
    this.isConnected = false;
  }

  getInfo() {
    return {
      id: 'websocket',
      name: 'WebSocket',
      blocks: [
        {
          opcode: 'connect',
          blockType: Scratch.BlockType.COMMAND,
          text: 'connect to [URL]',
          arguments: {
            URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'ws://localhost:8080' }
          }
        },
        {
          opcode: 'disconnect',
          blockType: Scratch.BlockType.COMMAND,
          text: 'disconnect'
        },
        {
          opcode: 'send',
          blockType: Scratch.BlockType.COMMAND,
          text: 'send [MESSAGE]',
          arguments: {
            MESSAGE: { type: Scratch.ArgumentType.STRING }
          }
        },
        {
          opcode: 'sendJSON',
          blockType: Scratch.BlockType.COMMAND,
          text: 'send JSON [OBJ]',
          arguments: {
            OBJ: { type: Scratch.ArgumentType.STRING, defaultValue: '{"hello":"world"}' }
          }
        },
        {
          opcode: 'onMessage',
          blockType: Scratch.BlockType.REPORTER,
          text: 'last message'
        },
        {
          opcode: 'onJSON',
          blockType: Scratch.BlockType.REPORTER,
          text: 'last JSON'
        },
        {
          opcode: 'status',
          blockType: Scratch.BlockType.REPORTER,
          text: 'connection status'
        }
      ]
    };
  }

  connect(args) {
    this.ws = new WebSocket(args.URL);
    this.lastMessage = '';
    this.lastJSON = '';
    this.isConnected = false;

    this.ws.onopen = () => {
      this.isConnected = true;
    };

    this.ws.onclose = () => {
      this.isConnected = false;
    };

    this.ws.onmessage = (event) => {
      this.lastMessage = event.data;

      try {
        this.lastJSON = JSON.stringify(JSON.parse(event.data));
      } catch {
        this.lastJSON = '';
      }
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.isConnected = false;
    }
  }

  send(args) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(args.MESSAGE);
    }
  }

  sendJSON(args) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        const obj = JSON.parse(args.OBJ);
        this.ws.send(JSON.stringify(obj));
      } catch {
        console.warn('Invalid JSON');
      }
    }
  }

  onMessage() {
    return this.lastMessage || '';
  }

  onJSON() {
    return this.lastJSON || '';
  }

  status() {
    return this.isConnected ? 'connected' : 'disconnected';
  }
}

Scratch.extensions.register(new WebSocketExtension());
