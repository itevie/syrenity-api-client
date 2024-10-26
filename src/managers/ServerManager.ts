import Client from "../client/Client";
import Server, { ServerAPIData } from "../structures/Server";
import BaseManager from "./BaseManager";

export default class ServerManager extends BaseManager<number, Server> {
  constructor(client: Client) {
    super(client);
  }

  public async fetch(id: number, force: boolean = false): Promise<Server> {
    if (this.cache.has(id) && !force) return this.cache.get(id) as Server;
    let server = await this.client.rest.get<ServerAPIData>(`/api/servers/${id}`);
    return this.addCache(id, new Server(this.client, server.data));
  }
}