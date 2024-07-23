import Client from "../client/Client";
import Server, { GuildData } from "../structures/Server";
import CacheManager from "./CacheManager";
import ServerMemberManager from "./ServerMemberManager";

export default class ServerManager extends CacheManager<typeof Server, number> {
    constructor(client: Client) {
        super(client, Server);
    }

    public async fetch(id: number, force?: boolean): Promise<Server> {
        // Check if it is in the cache
        if (this.cache.has(id) && !force) {
            return this.cache.get(id);
        }

        const data = (await this.client.sendHTTP(`/guilds/${id}`, "get")).data;
        const instance = new Server(this.client, data as GuildData);
        this.cache.set(id, instance);

        return instance;
    }
}