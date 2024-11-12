import Client from "../client/Client";
import User, { UserAPIData } from "../structures/User";
import BaseManager from "./BaseManager";

export default class UserManager extends BaseManager<number, User> {
  constructor(client: Client) {
    super(client);
  }

  public async fetch(id: number, force: boolean = false): Promise<User> {
    if (this.cache.has(id) && !force) return this.cache.get(id) as User;
    let user = await this.client.rest.get<UserAPIData>(`/api/users/${id}`);
    return this.addCache(id, new User(this.client, user.data));
  }
}
