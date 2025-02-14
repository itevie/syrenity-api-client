import Client from "../client/Client";
import User, { UserAPIData } from "../structures/User";
import BaseManager from "./BaseManager";

export default class UserManager extends BaseManager<
  number,
  User,
  UserAPIData
> {
  constructor(client: Client) {
    super(client);
  }

  public async fetch(id: number, force: boolean = false): Promise<User> {
    if (!force && this.cache.has(id)) return this.getCache(id);
    let user = await this.handle(id, () =>
      this.client.rest.get<UserAPIData>(`/api/users/${id}`)
    );
    return this.addCache(id, new User(this.client, user));
  }
}
