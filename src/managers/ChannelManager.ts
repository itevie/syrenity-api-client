import Client from "../client/Client";
import Channel, { ChannelAPIData } from "../structures/Channel";
import BaseManager from "./BaseManager";

export default class ChannelManager extends BaseManager<number, Channel> {
  constructor(client: Client) {
    super(client);
  }

  public async fetch(id: number): Promise<Channel> {
    let channel = await this.client.rest.get<ChannelAPIData>(`/api/channels/${id}`);
    return new Channel(this.client, channel.data);
  }
}