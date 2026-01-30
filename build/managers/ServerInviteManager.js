import Invite from "../structures/Invite.js";
import BaseManager from "./BaseManager.js";
export default class ServerInviteManager extends BaseManager {
    server;
    constructor(client, server) {
        super(client);
        this.server = server;
    }
    async create() {
        let result = await this.client.rest.post(`/api/servers/${this.server.id}/invites`);
        return this.addCache(result.data.id, new Invite(this.client, result.data));
    }
    async fetch(id, force = false) {
        if (this.cache.has(id) && !force)
            return this.cache.get(id);
        let result = await this.client.rest.get(`/api/invites/${id}`);
        return this.addCache(id, new Invite(this.client, result.data));
    }
}
