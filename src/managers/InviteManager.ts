import Client from "../client/Client";
import Invite, { InviteAPIData } from "../structures/Invite";
import Server from "../structures/Server";
import BaseManager from "./BaseManager";

export default class InviteManager extends BaseManager<string, Invite> {
  constructor(client: Client) {
    super(client);
  }

  public async fetch(id: string, force: boolean = false) {
    if (this.cache.has(id) && !force) return this.cache.get(id);
    let result = await this.client.rest.get<InviteAPIData>(
      `/api/invites/${id}`
    );
    return this.addCache(id, new Invite(this.client, result.data));
  }
}
