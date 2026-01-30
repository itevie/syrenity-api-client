import Channel from "../structures/Channel.js";
import BaseManager from "./BaseManager.js";
export default class ServerChannelManager extends BaseManager {
    server;
    constructor(client, server) {
        super(client);
        this.server = server;
    }
    async fetchList() {
        let result = await this.client.rest.get(`/api/servers/${this.server.id}/channels`);
        if (result.status !== 200)
            throw `Failed to fetch server ${this.server.id} channels: got status ${result.status}`;
        return result.data?.map((x) => new Channel(this.client, x)) ?? [];
    }
    async create(name) {
        const result = await this.client.rest.post(`/api/servers/${this.server.id}/channels`, {
            name: name,
        });
        return this.addCache(result.data.id, new Channel(this.client, result.data));
    }
}
