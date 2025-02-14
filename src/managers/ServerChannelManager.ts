import Client from "../client/Client";
import Channel, { ChannelAPIData } from "../structures/Channel";
import Server from "../structures/Server";
import BaseManager from "./BaseManager";

export default class ServerChannelManager extends BaseManager<number, Channel> {
  private server: Server;

  constructor(client: Client, server: Server) {
    super(client);
    this.server = server;
  }

  public async fetchList(): Promise<Channel[]> {
    let result = await this.client.rest.get<ChannelAPIData[]>(`/api/servers/${this.server.id}/channels`);
    
    if (result.status !== 200)
      throw `Failed to fetch server ${this.server.id} channels: got status ${result.status}`;

    return result.data?.map(x => new Channel(this.client, x)) ?? [];
  }
}