import Client from "../client/Client.js";
import Channel, { ChannelAPIData } from "../structures/Channel.js";
import BaseManager from "./BaseManager.js";

export default class ChannelManager extends BaseManager<number, Channel> {
  constructor(client: Client) {
    super(client);
  }

  public async fetch(id: number, force: boolean = false): Promise<Channel> {
    if (!force && this.cache.has(id)) return this.cache.get(id);
    let channel = await this.client.rest.get<ChannelAPIData>(
      `/api/channels/${id}`,
    );
    return this.addCache(id, new Channel(this.client, channel.data));
  }
}
