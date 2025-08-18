import Channel from "../structures/Channel";
import BaseManager from "./BaseManager";
export default class ChannelManager extends BaseManager {
    constructor(client) {
        super(client);
    }
    async fetch(id, force = false) {
        if (!force && this.cache.has(id))
            return this.cache.get(id);
        let channel = await this.client.rest.get(`/api/channels/${id}`);
        return this.addCache(id, new Channel(this.client, channel.data));
    }
}
