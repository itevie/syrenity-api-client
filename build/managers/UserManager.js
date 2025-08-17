import User from "../structures/User";
import BaseManager from "./BaseManager";
export default class UserManager extends BaseManager {
    constructor(client) {
        super(client);
    }
    async fetch(id, force = false) {
        if (!force && this.cache.has(id))
            return this.getCache(id);
        let user = await this.handle(id, () => this.client.rest.get(`/api/users/${id}`));
        return this.addCache(id, new User(this.client, user));
    }
}
