import Client from "../client/Client.js";
import Channel from "../structures/Channel.js";
import Server from "../structures/Server.js";
import BaseManager from "./BaseManager.js";
export default class ServerChannelManager extends BaseManager<number, Channel> {
    private server;
    constructor(client: Client, server: Server);
    fetchList(): Promise<Channel[]>;
    create(name: string): Promise<Channel>;
}
//# sourceMappingURL=ServerChannelManager.d.ts.map