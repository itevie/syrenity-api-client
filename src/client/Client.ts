import axios from "axios";
import UserManager from "../managers/UserManager";
import ChannelManager from "../managers/ChannelManager";
import ServerManager from "../managers/ServerManager";
import EventEmitter from "events";
import {
  PayloadDispatch,
  PayloadHello,
  WebsocketDispatchTypes,
  WebsocketMessage,
  WebsocketMessageType,
} from "./Websocket";
import User, { UserAPIData } from "../structures/User";
import Message, { MessageAPIData } from "../structures/Message";
import Server, { ServerAPIData } from "../structures/Server";
import FileManager from "../managers/FileManager";
import InviteManager from "../managers/InviteManager";
import Member from "../structures/Member";
import { UserReactionApiData } from "../structures/Reaction";

interface ClientEvents {
  debug: [message: string];
  ready: [user: User, isReconnect: boolean];
  disconnect: [];
  reconnect: [];
  error: [error: any];

  messageCreate: [message: Message];
  messageDelete: [messageId: number, channelId: number];
  messageUpdate: [message: Message];

  messageReactionAdd: [reaction: UserReactionApiData, message: Message];
  messageReactionRemove: [reaction: UserReactionApiData, message: Message];

  serverMemberAdd: [member: Member];
  serverMemberRemove: [member: Member];

  userUpdate: [user: User];

  apiUserClassCreation: [user: UserAPIData];
  apiMessageClassCreation: [message: MessageAPIData];
  apiServerClassCreation: [server: ServerAPIData];
}

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

export default interface Client {
  on<T extends keyof ClientEvents>(
    event: T,
    listener: (...args: ClientEvents[T]) => any
  ): this;
  emit<T extends keyof ClientEvents>(
    event: T,
    ...args: ClientEvents[T]
  ): boolean;
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
    this.ws = new WebSocket(this.options.websocketUrl);

    this.ws.addEventListener("message", (msg) => {
      this.handleWebsocketMessage(JSON.parse(msg.data));
    });

    const retry = () => {
      this.debug(
        "ws",
        `Attempting reconnect in ${this.options.reconnectTimeout}ms...`
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
        retry();
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
      })
    );
  }

  private handleWebsocketMessage(message: WebsocketMessage) {
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
      case "Dispatch":
        let dispatch = message.payload as PayloadDispatch<any>;

        switch (dispatch.type as keyof WebsocketDispatchTypes) {
          case "MessageCreate":
            this.emit(
              "messageCreate",
              new Message(this, dispatch.payload.message as MessageAPIData)
            );
            break;
          case "MessageDelete":
            this.emit(
              "messageDelete",
              (dispatch.payload as WebsocketDispatchTypes["MessageDelete"])
                .message_id,
              dispatch.channelId
            );
            break;
          case "MessageUpdate":
            this.emit(
              "messageUpdate",
              new Message(
                this,
                (
                  dispatch.payload as WebsocketDispatchTypes["MessageUpdate"]
                ).message
              )
            );
            break;
          case "UserUpdate":
            this.emit(
              "userUpdate",
              new User(
                this,
                (dispatch.payload as WebsocketDispatchTypes["UserUpdate"]).user
              )
            );
            break;
          case "ServerMemberAdd":
            this.emit(
              "serverMemberAdd",
              new Member(
                this,
                (
                  dispatch.payload as WebsocketDispatchTypes["ServerMemberAdd"]
                ).member
              )
            );
            break;
          case "MessageReactionAdd": {
            const data =
              dispatch.payload as WebsocketDispatchTypes["MessageReactionAdd"];
            this.emit(
              "messageReactionAdd",
              data.reaction,
              new Message(this, data.new_message)
            );
            break;
          }
          case "MessageReactionRemove": {
            const data =
              dispatch.payload as WebsocketDispatchTypes["MessageReactionRemove"];
            this.emit(
              "messageReactionRemove",
              data.reaction,
              new Message(this, data.new_message)
            );
            break;
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
}
