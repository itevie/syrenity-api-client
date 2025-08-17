import Server from "../structures/Server";
import BaseManager from "./BaseManager";
export default class ServerManager extends BaseManager {
    constructor(client) {
        super(client);
    }
    async fetch(id, force = false) {
        if (this.cache.has(id) && !force)
            return this.cache.get(id);
        let server = await this.client.rest.get(`/api/servers/${id}`);
        return this.addCache(id, new Server(this.client, server.data));
    }
}
