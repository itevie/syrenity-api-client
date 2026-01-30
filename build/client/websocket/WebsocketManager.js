"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const isBrowser = 
// eslint-disable-next-line node/no-unsupported-features/es-builtins
Object.getPrototypeOf(Object.getPrototypeOf(globalThis)) !== Object.prototype;
const Ws = (isBrowser
    ? WebSocket
    : ws_1.default);
class WebsocketManager {
    client;
    wsClient;
    connectedOnce = false;
    constructor(client) {
        this.client = client;
    }
    connect() {
        const url = `ws${this.client.options.api.useSecure ? "s" : ""}://${this.client.options.api.host}/`;
        this.client.emit("debug", `Attempting to connect to WS: ${url}`);
        this.wsClient = new Ws(url);
        for (const i in this.websocketEvents) {
            if (isBrowser) {
                this.wsClient["on" + i] = this.websocketEvents[i];
            }
            else {
                // @ts-ignore
                this.wsClient.on(i, this.websocketEvents[i]);
            }
        }
        /*// Register events
        console.log(this.wsClient);
        // @ts-ignore
        this.wsClient.onmessage = (rawMessage: any) => {
            
        };

        this.wsClient.*/
    }
    send(body) {
        this.wsClient.send(JSON.stringify(body));
    }
    websocketEvents = {
        open: () => {
            this.client.emit("debug", "WS Client connected");
        },
        message: (rawMessage) => {
            rawMessage = isBrowser ? rawMessage.data : rawMessage;
            const message = JSON.parse(rawMessage.toString());
            if (message.op) {
                // Check if the client can handle this operation
                if (this.options[message.op]) {
                    this.client.emit("debug", `Recieved message ${message.op}`);
                    if (message.op === "DISPATCH") {
                        this.options["DISPATCH"](message.t, message.d);
                    }
                    else {
                        this.options[message.op](message.d);
                    }
                }
            }
        },
        close: () => {
            this.client.emit("debug", `Websocket unexpectedly closed`);
            this.client.emit("disconnect");
            setTimeout(() => {
                this.client.emit("debug", "Attempting to reconnect to WS");
                this.connect();
            }, 5000);
        }
    };
    options = {
        "AUTHENTICATE": () => {
            this.client.emit("debug", `Authenticating to WS via token`);
            this.send({
                op: "AUTHENTICATE",
                d: {
                    token: this.client.token
                }
            });
        },
        "HELLO": async (data) => {
            this.client.user = await this.client.users.addData(data.user);
            for (const i in data.guilds) {
                await this.client.servers.addData(data.guilds[i]);
            }
            this.client.emit(this.connectedOnce ? "reconnect" : "ready");
            this.connectedOnce = true;
        },
        "DISPATCH": async (type, _data) => {
            this.client.emit("debug", `Recieved dispatch ${type}`);
            // ----- Messages -----
            if (type === "MessageCreate") {
                const data = _data;
                const channel = await this.client.channels.fetch(data.message.channel_id);
                const message = await channel.messages.addData(data.message);
                this.client.emit("messageCreate", message);
            }
            else if (type === "MessageDelete") {
                const data = _data;
                const channel = await this.client.channels.fetch(data.channelId);
                channel.messages.cache.delete(data.messageId);
                this.client.emit("messageDelete", data.messageId, data.channelId);
            }
            else if (type === "MessageEdit") {
                const data = _data;
                const channel = await this.client.channels.fetch(data.message.channel_id);
                const message = await channel.messages.addData(data.message);
                this.client.emit("messageUpdate", message);
            }
            // ----- Channels -----
            else if (type === "ChannelUpdate") {
                const data = _data;
                const channel = await this.client.channels.addData(data.channel);
                this.client.emit("channelUpdate", channel);
            }
            else if (type === "ChannelDelete") {
                const data = _data;
                const cache = this.client.channels.cache.get(data.channelId);
                if (cache)
                    cache.messages.cache.clear();
                this.client.channels.cache.delete(data.channelId);
                this.client.emit("channelDelete", data.channelId, data.guildId);
            }
            else if (type === "ChannelCreate") {
                const data = _data;
                const channel = await this.client.channels.addData(data.channel);
                this.client.emit("channelCreate", channel);
            }
            // ----- Users -----
            else if (type === "UserUpdate") {
                const data = _data;
                const user = await this.client.users.addData(data.user);
                this.client.emit("userUpdate", user);
            }
        }
    };
}
exports.default = WebsocketManager;
