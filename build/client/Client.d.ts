import UserManager from "../managers/UserManager.js";
import ChannelManager from "../managers/ChannelManager.js";
import ServerManager from "../managers/ServerManager.js";
import EventEmitter from "events";
import { ClientEventFunction, ClientEvents } from "./Websocket.js";
import User from "../structures/User.js";
import Server from "../structures/Server.js";
import FileManager from "../managers/FileManager.js";
import InviteManager from "../managers/InviteManager.js";
interface ClientOptions {
    baseUrl?: string;
    websocketUrl?: string;
    reconnectTimeout?: number;
}
export default interface Client {
    on<T extends keyof ClientEvents>(event: T, listener: (...args: ClientEvents[T]) => any): this;
    emit<T extends keyof ClientEvents>(event: T, ...args: ClientEvents[T]): boolean;
    removeListener<T extends keyof ClientEvents>(event: T, callback: ClientEventFunction<T>): this;
}
export default class Client extends EventEmitter {
    readonly options: ClientOptions;
    private token;
    users: UserManager;
    channels: ChannelManager;
    servers: ServerManager;
    files: FileManager;
    invites: InviteManager;
    user: User | null;
    rest: Axios.AxiosInstance;
    ws: WebSocket | null;
    firstConnect: boolean;
    constructor(options: ClientOptions);
    connect(token: string): void;
    private debug;
    private sendWebsocketMessage;
    private handleWebsocketMessage;
    createServer(name: string): Promise<Server>;
    fetchServerSettings(): Promise<ServerSettings>;
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
export {};
//# sourceMappingURL=Client.d.ts.map