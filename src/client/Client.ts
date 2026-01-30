import axios from "axios";
import UserManager from "../managers/UserManager.js";
import ChannelManager from "../managers/ChannelManager.js";
import ServerManager from "../managers/ServerManager.js";
import EventEmitter from "events";
import {
  ClientEventFunction,
  ClientEvents,
  PayloadDispatch,
  PayloadHello,
  WebsocketDispatchTypes,
  WebsocketMessage,
  WebsocketMessageType,
} from "./Websocket.js";
import User, { UserAPIData } from "../structures/User.js";
import Message, { MessageAPIData } from "../structures/Message.js";
import Server, { ServerAPIData } from "../structures/Server.js";
import FileManager from "../managers/FileManager.js";
import InviteManager from "../managers/InviteManager.js";
import Member from "../structures/Member.js";
import Channel from "../structures/Channel.js";

interface ClientOptions {
  baseUrl?: string;
  websocketUrl?: string;
  reconnectTimeout?: number;
}

const defaultClientOptions: ClientOptions = {
  baseUrl: "http://localhost:3000",
  websocketUrl: "http://localhost:3000/ws",
  reconnectTimeout: 5000,
};

let WS: typeof WebSocket;

if (typeof WebSocket !== "undefined") {
  // Browser environment
  WS = WebSocket;
} else {
  // Node environment
  // Dynamically import to avoid bundler issues
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  WS = require("ws");
}

export default interface Client {
  on<T extends keyof ClientEvents>(
    event: T,
    listener: (...args: ClientEvents[T]) => any,
  ): this;
  emit<T extends keyof ClientEvents>(
    event: T,
    ...args: ClientEvents[T]
  ): boolean;
  removeListener<T extends keyof ClientEvents>(
    event: T,
    callback: ClientEventFunction<T>,
  ): this;
}

export default class Client extends EventEmitter {
  public readonly options: ClientOptions;
  private token: string | null = null;

  public users = new UserManager(this);
  public channels = new ChannelManager(this);
  public servers = new ServerManager(this);
  public files = new FileManager(this);
  public invites = new InviteManager(this);

  public user: User | null = null;

  public rest = axios.create({});
  public ws: WebSocket | null = null;

  public firstConnect: boolean = true;

  constructor(options: ClientOptions) {
    super();

    this.options = { ...defaultClientOptions, ...options };
  }

  public connect(token: string) {
    this.token = token;

    this.debug("ws", `Attempting to connect to: ${this.options.websocketUrl}`);

    // @ts-ignore
    this.ws = new WS(this.options.websocketUrl);

    this.ws.addEventListener("message", (msg) => {
      this.handleWebsocketMessage(JSON.parse(msg.data));
    });

    const retry = () => {
      this.debug(
        "ws",
        `Attempting reconnect in ${this.options.reconnectTimeout}ms...`,
      );
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
      } else {
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

  private debug(type: string, ...contents: string[]) {
    this.emit("debug", `[${type}]: ${contents.join(", ")}`);
  }

  private sendWebsocketMessage(type: WebsocketMessageType, message: object) {
    this.debug("WS", "SEND MESSAGE", type, JSON.stringify(message));

    this.ws.send(
      JSON.stringify({
        type,
        payload: message,
      }),
    );
  }

  private async handleWebsocketMessage(message: WebsocketMessage) {
    this.debug("WS", "RECIEVE MESSAGE", JSON.stringify(message));

    switch (message.type) {
      case "Authenticate":
        this.sendWebsocketMessage("Identify", {
          token: this.token,
        });
        break;
      case "Hello":
        let user = new User(this, message.payload.user as PayloadHello);
        this.user = user;
        this.emit("ready", user, !this.firstConnect);
        this.firstConnect = false;
        break;
      case "Heartbeat":
        this.sendWebsocketMessage("Heartbeat", {});
        break;
      case "Dispatch":
        let dispatch = message.payload as PayloadDispatch<any>;

        switch (dispatch.type as keyof WebsocketDispatchTypes) {
          case "MessageCreate":
            this.emit(
              "messageCreate",
              new Message(this, dispatch.payload.message as MessageAPIData),
            );
            break;
          case "MessageDelete":
            this.emit(
              "messageDelete",
              (dispatch.payload as WebsocketDispatchTypes["MessageDelete"])
                .message_id,
              dispatch.channelId,
            );
            break;
          case "MessageUpdate":
            this.emit(
              "messageUpdate",
              new Message(
                this,
                (
                  dispatch.payload as WebsocketDispatchTypes["MessageUpdate"]
                ).message,
              ),
            );
            break;
          case "UserUpdate":
            this.emit(
              "userUpdate",
              new User(
                this,
                (dispatch.payload as WebsocketDispatchTypes["UserUpdate"]).user,
              ),
            );
            break;
          case "ServerMemberAdd":
            this.emit(
              "serverMemberAdd",
              new Member(
                this,
                (
                  dispatch.payload as WebsocketDispatchTypes["ServerMemberAdd"]
                ).member,
              ),
            );
            break;
          case "ServerMemberRemove":
            this.emit(
              "serverMemberRemove",
              new Member(
                this,
                (
                  dispatch.payload as WebsocketDispatchTypes["ServerMemberRemove"]
                ).member,
              ),
            );
            break;
          case "ServerUpdate":
            this.emit(
              "serverUpdate",
              new Server(
                this,
                (
                  dispatch.payload as WebsocketDispatchTypes["ServerUpdate"]
                ).server,
              ),
            );
            break;
          case "MessageReactionAdd": {
            const data =
              dispatch.payload as WebsocketDispatchTypes["MessageReactionAdd"];
            this.emit(
              "messageReactionAdd",
              data.reaction,
              new Message(this, data.new_message),
            );
            break;
          }
          case "MessageReactionRemove": {
            const data =
              dispatch.payload as WebsocketDispatchTypes["MessageReactionRemove"];
            this.emit(
              "messageReactionRemove",
              data.reaction,
              new Message(this, data.new_message),
            );
            break;
          }
          case "ChannelCreate":
            this.emit(
              "channelCreate",
              new Channel(
                this,
                (
                  dispatch.payload as WebsocketDispatchTypes["ChannelCreate"]
                ).channel,
              ),
            );
            break;
          case "ChannelPositionUpdate": {
            const data =
              dispatch.payload as WebsocketDispatchTypes["ChannelPositionUpdate"];

            this.emit(
              "channelPositionUpdate",
              await this.servers.fetch(dispatch.guildId),
              data.channels,
            );
            break;
          }
          case "ChannelStartTyping": {
            const data =
              dispatch.payload as WebsocketDispatchTypes["ChannelStartTyping"];

            this.emit(
              "channelStartTyping",
              await this.channels.fetch(data.channel_id),
              await this.users.fetch(data.user_id),
            );
          }
        }
        break;
    }
  }

  public async createServer(name: string): Promise<Server> {
    let result = await this.rest.post<ServerAPIData>("/api/servers", {
      name,
    });
    return this.servers.addCache(result.data.id, new Server(this, result.data));
  }

  public async fetchServerSettings(): Promise<ServerSettings> {
    return (await this.rest.get<ServerSettings>("/api")).data;
  }
}

export interface ServerSettings {
  version: {
    git: {
      id: string;
      abbrId: string;
      message: string;
    };
  };
}
