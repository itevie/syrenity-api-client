import Invite from "../structures/Invite.js";
import BaseManager from "./BaseManager.js";
export default class InviteManager extends BaseManager {
    constructor(client) {
        super(client);
    }
    async fetch(id, force = false) {
        if (this.cache.has(id) && !force)
            return this.cache.get(id);
        let result = await this.client.rest.get(`/api/invites/${id}`);
        return this.addCache(id, new Invite(this.client, result.data));
    }
}
