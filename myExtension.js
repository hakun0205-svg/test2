class ChatExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.ws = null;
    this.lastMessage = '';
    this.chatLog = [];
  }

  getInfo() {
    return {
      id: 'chatws',
      name: 'Chat WebSocket',
      blocks: [
        {
          opcode: 'connectChat',
          blockType: Scratch.BlockType.COMMAND,
          text: 'チャットに接続 [URL]',
          arguments: {
            URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'ws://localhost:8080' }
          }
        },
        {
          opcode: 'sendChat',
          blockType: Scratch.BlockType.COMMAND,
          text: 'チャットに送信 [MESSAGE]',
          arguments: {
            MESSAGE: { type: Scratch.ArgumentType.STRING }
          }
        },
        {
          opcode: 'getLastChat',
          blockType: Scratch.BlockType.REPORTER,
          text: '最新のチャットメッセージ'
        },
        {
          opcode: 'getChatLog',
          blockType: Scratch.BlockType.REPORTER,
          text: 'チャットログ'
        }
      ]
    };
  }

  connectChat(args) {
    this.ws = new WebSocket(args.URL);
    this.lastMessage = '';
    this.chatLog = [];

    this.ws.onmessage = (event) => {
      this.lastMessage = event.data;
      this.chatLog.push(event.data);
    };
  }

  sendChat(args) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(args.MESSAGE);
    }
  }

  getLastChat() {
    return this.lastMessage || '';
  }

  getChatLog() {
    return JSON.stringify(this.chatLog);
  }
}

Scratch.extensions.register(new ChatExtension());
