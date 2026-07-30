class WebSocketExtension {
    constructor() {
        this.ws = null;
        this.lastMessage = "";
        this.lastError = "";
        this.connected = false;

        this.currentCommand = "";
        this.commandRunning = false;

        this.lastData = "";
    }

    getInfo() {
        return {
            id: "websocketext",
            name: "WebSocket",
            blocks: [
                {
                    opcode: "connect",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "WebSocket [URL] に接続する",
                    arguments: {
                        URL: { type: Scratch.ArgumentType.STRING, defaultValue: "ws://localhost:8080" }
                    }
                },
                {
                    opcode: "disconnect",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "WebSocket を切断する"
                },
                {
                    opcode: "isConnected",
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: "WebSocket 接続中？"
                },
                {
                    opcode: "sendMessage",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "WebSocket で [MESSAGE] を送信する",
                    arguments: {
                        MESSAGE: { type: Scratch.ArgumentType.STRING, defaultValue: "Hello" }
                    }
                },
                {
                    opcode: "receivedMessage",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "WebSocket で受信したメッセージ"
                },
                {
                    opcode: "onReceive",
                    blockType: Scratch.BlockType.HAT,
                    text: "WebSocket 受信イベント"
                },
                {
                    opcode: "errorMessage",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "WebSocket エラー"
                },
                {
                    opcode: "connectionState",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "WebSocket 接続状態"
                },
                {
                    opcode: "runCommand",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "WebSocket コマンドを実行する [CMD]",
                    arguments: {
                        CMD: { type: Scratch.ArgumentType.STRING, defaultValue: "ping" }
                    }
                },
                {
                    opcode: "stopCommand",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "WebSocket コマンドを停止する"
                },
                {
                    opcode: "currentCommand",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "WebSocket 実行中のコマンド"
                },
                {
                    opcode: "fetchData",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "WebSocket データを取得する [API]",
                    arguments: {
                        API: { type: Scratch.ArgumentType.STRING, defaultValue: "/status" }
                    }
                },
                {
                    opcode: "fetchedData",
                    blockType: Scratch.BlockType.REPORTER,
                    text: "WebSocket 取得したデータ"
                }
            ]
        };
    }

    connect({ URL }) {
        if (this.ws) this.ws.close();

        this.ws = new WebSocket(URL);

        this.ws.onopen = () => {
            this.connected = true;
        };

        this.ws.onmessage = (event) => {
            this.lastMessage = event.data;
            Scratch.vm.runtime.startHats("websocketext_onReceive");
        };

        this.ws.onerror = (err) => {
            this.lastError = String(err);
        };

        this.ws.onclose = () => {
            this.connected = false;
        };
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.connected = false;
    }

    isConnected() {
        return this.connected;
    }

    sendMessage({ MESSAGE }) {
        if (this.ws && this.connected) {
            this.ws.send(MESSAGE);
        }
    }

    receivedMessage() {
        return this.lastMessage;
    }

    onReceive() {
        return true; // HAT block trigger
    }

    errorMessage() {
        return this.lastError;
    }

    connectionState() {
        return this.connected ? "connected" : "disconnected";
    }

    runCommand({ CMD }) {
        if (this.ws && this.connected) {
            this.currentCommand = CMD;
            this.commandRunning = true;
            this.ws.send(JSON.stringify({ cmd: CMD }));
        }
    }

    stopCommand() {
        this.commandRunning = false;
        this.currentCommand = "";
    }

    currentCommand() {
        return this.currentCommand;
    }

    async fetchData({ API }) {
        if (!this.ws || !this.connected) return;

        this.ws.send(JSON.stringify({ api: API }));
    }

    fetchedData() {
        return this.lastMessage;
    }
}

Scratch.extensions.register(new WebSocketExtension());
