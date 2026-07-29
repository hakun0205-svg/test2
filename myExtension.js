class WebSocketExtension {
  constructor() {
    this.ws = null;
  }

  connect({URL}) {
    this.ws = new WebSocket(URL);
    this.ws.onopen = () => console.log("connected");
    this.ws.onmessage = (msg) => console.log("received:", msg.data);
  }

  send({MSG}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(MSG);
    }
  }
}

module.exports = WebSocketExtension;
