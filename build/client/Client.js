import axios from "axios";
import UserManager from "../managers/UserManager.js";
import ChannelManager from "../managers/ChannelManager.js";
import ServerManager from "../managers/ServerManager.js";
import EventEmitter from "events";
import User from "../structures/User.js";
import Message from "../structures/Message.js";
import Server from "../structures/Server.js";
import FileManager from "../managers/FileManager.js";
import InviteManager from "../managers/InviteManager.js";
import Member from "../structures/Member.js";
import Channel from "../structures/Channel.js";
const defaultClientOptions = {
    baseUrl: "http://localhost:3000",
    websocketUrl: "http://localhost:3000/ws",
    reconnectTimeout: 5000,
};
let WS;
if (typeof WebSocket !== "undefined") {
    // Browser environment
    WS = WebSocket;
}
else {
    // Node environment
    // Dynamically import to avoid bundler issues
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    WS = require("ws");
}
export default class Client extends EventEmitter {
    options;
    token = null;
    users = new UserManager(this);
    channels = new ChannelManager(this);
    servers = new ServerManager(this);
    files = new FileManager(this);
    invites = new InviteManager(this);
    user = null;
    rest = axios.create({});
    ws = null;
    firstConnect = true;
    constructor(options) {
        super();
        this.options = { ...defaultClientOptions, ...options };
    }
    connect(token) {
        this.token = token;
        this.debug("ws", `Attempting to connect to: ${this.options.websocketUrl}`);
        // @ts-ignore
        this.ws = new WS(this.options.websocketUrl);
        this.ws.addEventListener("message", (msg) => {
            this.handleWebsocketMessage(JSON.parse(msg.data));
        });
        const retry = () => {
            this.debug("ws", `Attempting reconnect in ${this.options.reconnectTimeout}ms...`);
            setTimeout(() => {
                this.connect(token);
            }, this.options.reconnectTimeout);
        };
        this.ws.addEventListener("close", () => {
            this.emit("disconnect");
            retry();
        });
        this.ws.addEventListener("error", (err) => {
            if (this.firstConnect) {
                this.emit("error", err);
            }
            else {
            }
        });
        this.rest = axios.create({
            headers: {
                Authorization: `Token ${this.token}`,
            },
            baseURL: this.options.baseUrl,
        });
        this.rest.interceptors.request.use((x) => {
            this.debug("HTTP", `${x.method}: ${x.url}`);
            return x;
        });
    }
    debug(type, ...contents) {
        this.emit("debug", `[${type}]: ${contents.join(", ")}`);
    }
    sendWebsocketMessage(type, message) {
        this.debug("WS", "SEND MESSAGE", type, JSON.stringify(message));
        this.ws.send(JSON.stringify({
            type,
            payload: message,
        }));
    }
    async handleWebsocketMessage(message) {
        this.debug("WS", "RECIEVE MESSAGE", JSON.stringify(message));
        switch (message.type) {
            case "Authenticate":
                this.sendWebsocketMessage("Identify", {
                    token: this.token,
                });
                break;
            case "Hello":
                let user = new User(this, message.payload.user);
                this.user = user;
                this.emit("ready", user, !this.firstConnect);
                this.firstConnect = false;
                break;
            case "Heartbeat":
                this.sendWebsocketMessage("Heartbeat", {});
                break;
            case "Dispatch":
                let dispatch = message.payload;
                switch (dispatch.type) {
                    case "MessageCreate":
                        this.emit("messageCreate", new Message(this, dispatch.payload.message));
                        break;
                    case "MessageDelete":
                        this.emit("messageDelete", dispatch.payload
                            .message_id, dispatch.channelId);
                        break;
                    case "MessageUpdate":
                        this.emit("messageUpdate", new Message(this, dispatch.payload.message));
                        break;
                    case "UserUpdate":
                        this.emit("userUpdate", new User(this, dispatch.payload.user));
                        break;
                    case "ServerMemberAdd":
                        this.emit("serverMemberAdd", new Member(this, dispatch.payload.member));
                        break;
                    case "ServerMemberRemove":
                        this.emit("serverMemberRemove", new Member(this, dispatch.payload.member));
                        break;
                    case "ServerUpdate":
                        this.emit("serverUpdate", new Server(this, dispatch.payload.server));
                        break;
                    case "MessageReactionAdd": {
                        const data = dispatch.payload;
                        this.emit("messageReactionAdd", data.reaction, new Message(this, data.new_message));
                        break;
                    }
                    case "MessageReactionRemove": {
                        const data = dispatch.payload;
                        this.emit("messageReactionRemove", data.reaction, new Message(this, data.new_message));
                        break;
                    }
                    case "ChannelCreate":
                        this.emit("channelCreate", new Channel(this, dispatch.payload.channel));
                        break;
                    case "ChannelPositionUpdate": {
                        const data = dispatch.payload;
                        this.emit("channelPositionUpdate", await this.servers.fetch(dispatch.guildId), data.channels);
                        break;
                    }
                    case "ChannelStartTyping": {
                        const data = dispatch.payload;
                        this.emit("channelStartTyping", await this.channels.fetch(data.channel_id), await this.users.fetch(data.user_id));
                    }
                }
                break;
        }
    }
    async createServer(name) {
        let result = await this.rest.post("/api/servers", {
            name,
        });
        return this.servers.addCache(result.data.id, new Server(this, result.data));
    }
    async fetchServerSettings() {
        return (await this.rest.get("/api")).data;
    }
}
