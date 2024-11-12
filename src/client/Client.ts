import axios from "axios";
import UserManager from "../managers/UserManager";
import ChannelManager from "../managers/ChannelManager";
import ServerManager from "../managers/ServerManager";
import EventEmitter from "events";
import {
  PayloadHello,
  PayloadMessageCreate,
  WebsocketMessage,
  WebsocketMessageType,
} from "./Websocket";
import User, { UserAPIData } from "../structures/User";
import Message, { MessageAPIData } from "../structures/Message";
import Server, { ServerAPIData } from "../structures/Server";

interface ClientEvents {
  debug: [message: string];
  ready: [user: User];
  messageCreate: [message: Message];

  apiUserClassCreation: [user: UserAPIData];
  apiMessageClassCreation: [message: MessageAPIData];
  apiServerClassCreation: [server: ServerAPIData];
}

interface ClientOptions {
  baseUrl?: string;
  websocketUrl?: string;
}

const defaultClientOptions: ClientOptions = {
  baseUrl: "http://localhost:3000",
  websocketUrl: "http://localhost:3000/ws",
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

  public user: User | null = null;

  public rest = axios.create({});
  public ws: WebSocket | null = null;

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

    this.ws.addEventListener("error", (err) => {
      console.log(err);
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
        this.emit("ready", user);
        break;
      case "DispatchMessageCreate":
        let msg = new Message(
          this,
          message.payload.message as PayloadMessageCreate
        );
        this.emit("messageCreate", msg);
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
