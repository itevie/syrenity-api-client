import Client from "../client/Client.js";
import Channel, { ChannelAPIData } from "../structures/Channel.js";
import Server from "../structures/Server.js";
import BaseManager from "./BaseManager.js";

export default class ServerChannelManager extends BaseManager<number, Channel> {
  private server: Server;

  constructor(client: Client, server: Server) {
    super(client);
    this.server = server;
  }

  public async fetchList(): Promise<Channel[]> {
    let result = await this.client.rest.get<ChannelAPIData[]>(
      `/api/servers/${this.server.id}/channels`,
    );

    if (result.status !== 200)
      throw `Failed to fetch server ${this.server.id} channels: got status ${result.status}`;

    return result.data?.map((x) => new Channel(this.client, x)) ?? [];
  }

  public async create(name: string): Promise<Channel> {
    const result = await this.client.rest.post<ChannelAPIData>(
      `/api/servers/${this.server.id}/channels`,
      {
        name: name,
      },
    );

    return this.addCache(result.data.id, new Channel(this.client, result.data));
  }
}
