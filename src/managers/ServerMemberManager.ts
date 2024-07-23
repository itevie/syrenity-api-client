import Client from "../client/Client";
import Server from "../structures/Server";
import ServerMember, { MemberData } from "../structures/ServerMember";
import User, { UserData } from "../structures/User";
import CacheManager from "./CacheManager";

export default class ServerMemberManager extends CacheManager<typeof ServerMember, number> {
    private server: Server;
    constructor(server: Server) {
        super((server as any).client, ServerMember);
        this.server = server;
    }

    public async fetch(id: number, force?: boolean): Promise<ServerMember> {
        // Check if it is in the cache
        if (this.cache.has(id) && !force) {
            return this.cache.get(id);
        }

        const data = (await this.client.sendHTTP(`/guilds/${this.server.id}/members/${id}`, "get")).data;
        
        const instance = await new ServerMember(
            this.client, 
            data as MemberData,
            this.server,
        ).init();
        this.cache.set(id, instance);

        return instance;
    }
}