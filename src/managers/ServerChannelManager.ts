import Client from "../client/Client";
import Channel, { ChannelData } from "../structures/Channel";
import Server from "../structures/Server";
import ChannelManager from "./ChannelManager";

export default class ServerChannelManager extends ChannelManager {
    private server: Server;
    constructor(server: Server) {
        super((server as any).client);
        this.server = server;
        this.cache = this.client.channels.cache;
    }

    public async fetchList(): Promise<Channel[]> {
        const data = (await this.client.sendHTTP(`/guilds/${this.server.id}/channels`, "get")).data;
        const channels: Channel[] = [];

        for await (const channel of data.channels as ChannelData[]) {
            const instance = await this.addData(channel);
            channels.push(instance);
        }

        return channels;
    }

    public async create(name: string): Promise<Channel> {
        const data = (await this.client.sendHTTP(`/guilds/${this.server.id}/channels`, "post", { name })).data;
        return await this.client.channels.addData(data);
    }
}