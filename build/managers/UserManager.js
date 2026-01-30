import User from "../structures/User.js";
import BaseManager from "./BaseManager.js";
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
