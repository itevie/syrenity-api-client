import Axios, { AxiosError, AxiosResponse, RawAxiosRequestConfig } from "axios";
import ServerManager from "../managers/ServerManager";
import UserManager from "../managers/UserManager";
import User from "../structures/User";
import WebsocketManager from "./websocket/WebsocketManager";
import { EventEmitter } from "events";
import ChannelManager from "../managers/ChannelManager";
import { ClientEvents } from "./ClientEvents";
import Server from "../structures/Server";
import { ServerData } from "..";
import HTTPError from "../errors/HTTPErrors";
import FileManager from "../managers/FileManager";
import InviteManager from "../managers/InviteManager";

interface ClientOptions {
    api?: {
        host?: string,
        apiPrefix?: string,
        useSecure?: boolean,
    }
}

const defaultOptions: ClientOptions = {
    api: {
        host: "localhost:3000",
        apiPrefix: "/api",
        useSecure: false,
    }
};

export default interface Client {
    on<T extends keyof ClientEvents>(event: T, listener: (...args: ClientEvents[T]) => any): this
    emit<T extends keyof ClientEvents>(event: T, ...args: ClientEvents[T]): boolean
}

export default class Client extends EventEmitter {
    public options: ClientOptions;
    public token: string | null = null;

    public servers: ServerManager = new ServerManager(this);
    public users: UserManager = new UserManager(this);
    public channels: ChannelManager = new ChannelManager(this);
    public ws: WebsocketManager = new WebsocketManager(this);
    public files: FileManager = new FileManager(this);
    public invites: InviteManager = new InviteManager(this);

    public static defaultAvatarUrl = "syrenity-file://fb624926-31f4-49e9-8ae4-f11d4ebd42e9";

    public user: User | null = null;

    constructor(options: ClientOptions = defaultOptions) {
        super();

        this.options = {
            ...defaultOptions,
            ...options,
            api: {
                ...options.api,
                ...defaultOptions.api
            }
        }
    }

    /**
     * Start the client and connect to the Syrenity server
     * @param token The token needed for requests
     * @param noWebsocket Whether or not to connect to the WS, if this is true, then only REST requests can be used
     */
    public connect(token: string, noWebsocket: boolean = false): void {
        this.token = token;

        if (!noWebsocket) {
            this.ws.connect();
        }
    }

    public async sendHTTP(route: string, method: "post" | "get" | "put" | "patch" | "delete", body: object = {}): Promise<AxiosResponse> {
        const url = `http${this.options.api.useSecure ? "s" : ""}://${this.options.api.host}${this.options.api.apiPrefix}${route}`;

        // Construct axios options
        const sendingData: RawAxiosRequestConfig = {
            url,
            method: method.toUpperCase(),
            headers: {
                Authorization: `Token ${this.token}`
            },
        }

        if (body) {
            sendingData.data = body;
        }

        this.emit("debug", `HTTP ${url}`);
        try {
            return await Axios(sendingData);
        } catch (_err) {
            let err = _err as AxiosError;

            const error = new HTTPError({
                error: (err.response?.data as any)?.error ?? {
                    message: `An unknown error occured`,
                    code: "UnknownHttpError"
                },
                httpStatus: err.response.status,
                underlyingError: _err,
            });

            this.emit("httpError", error);
            throw error;
        }
    }

    public async fetchServerList(): Promise<Server[]> {
        const data = (await this.sendHTTP(`/users/@me/guilds`, "get")).data.guilds;
        const servers: Server[] = [];

        for await (const server of data as ServerData[]) {
            const instance = await this.servers.addData(server);
            servers.push(instance);
        }

        return servers;
    }
}