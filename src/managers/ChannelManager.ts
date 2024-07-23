import Client from "../client/Client";
import Channel, { ChannelData } from "../structures/Channel";
import Message, { MessageData } from "../structures/Message";
import CacheManager from "./CacheManager";

export default class ChannelManager extends CacheManager<typeof Channel, number> {
    constructor(client: Client) {
        super(client, Channel);
    }

    public async fetch(id: number, force: boolean = false): Promise<Channel> {
        // Check if it is in the cache
        if (this.cache.has(id) && !force) {
            return this.cache.get(id);
        }

        const data = (await this.client.sendHTTP(`/channels/${id}`, "get")).data;
        const instance = new Channel(this.client, data as ChannelData);
        this.cache.set(id, instance);

        return instance;
    }
}