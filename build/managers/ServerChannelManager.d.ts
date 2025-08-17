import Client from "../client/Client";
import Channel from "../structures/Channel";
import Server from "../structures/Server";
import BaseManager from "./BaseManager";
export default class ServerChannelManager extends BaseManager<number, Channel> {
    private server;
    constructor(client: Client, server: Server);
    fetchList(): Promise<Channel[]>;
    create(name: string): Promise<Channel>;
}
