import Server from "../structures/Server.js";
import ServerMember from "../structures/ServerMember.js";
import CacheManager from "./CacheManager.js";
export default class ServerMemberManager extends CacheManager<typeof ServerMember, number> {
    private server;
    constructor(server: Server);
    fetch(id: number, force?: boolean): Promise<ServerMember>;
}
//# sourceMappingURL=ServerMemberManager.d.ts.map