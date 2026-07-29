class WebSocketExtension {
  constructor() {
    this.ws = null;
    this.lastMessage = "";
  }

  getInfo() {
    return {
      id: "websocket",
      name: "WebSocket",
      blocks: [
        {
          opcode: "connect",
          blockType: "command",
          text: "connect to [URL]",
          arguments: {
            URL: {
              type: "string",
              defaultValue: "ws://localhost:8080"
            }
          }
        },
        {
          opcode: "send",
          blockType: "command",
          text: "send [MSG]",
          arguments: {
            MSG: {
              type: "string",
              defaultValue: "hello"
            }
          }
        },
        {
          opcode: "lastMessage",
          blockType: "reporter",
          text: "last received message"
        }
      ]
    };
  }

  connect({ URL }) {
    this.ws = new WebSocket(URL);
    this.ws.onopen = () => console.log("Connected:", URL);
    this.ws.onmessage = (msg) => {
      this.lastMessage = msg.data;
      console.log("Received:", msg.data);
    };
    this.ws.onerror = (err) => console.error("WebSocket error:", err);
  }

  send({ MSG }) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(MSG);
    } else {
      console.warn("WebSocket is not connected.");
    }
  }

  lastMessage() {
    return this.lastMessage;
  }
}

Scratch.extensions.register(new WebSocketExtension());
