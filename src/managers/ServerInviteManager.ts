import Client from "../client/Client";
import Invite, { InviteAPIData } from "../structures/Invite";
import Server from "../structures/Server";
import BaseManager from "./BaseManager";

export default class ServerInviteManager extends BaseManager<string, Invite> {
  private server: Server;

  constructor(client: Client, server: Server) {
    super(client);
    this.server = server;
  }

  public async create(): Promise<Invite> {
    let result = await this.client.rest.post<InviteAPIData>(`/api/servers/${this.server.id}/invites`);
    return this.addCache(result.data.id, new Invite(this.client, result.data));
  }

  public async fetch(id: string, force: boolean = false) {
    if (this.cache.has(id) && !force) return this.cache.get(id);
    let result = await this.client.rest.get<InviteAPIData>(`/api/invites/${id}`);
    return this.addCache(id, new Invite(this.client, result.data));
  }
}