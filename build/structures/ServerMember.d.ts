import Client from "../client/Client";
import Base from "./Base";
import Server from "./Server";
import User from "./User";
export interface MemberData {
    user_id: number;
    guild_id: number;
    nickname: string;
}
export default class ServerMember extends Base {
    nickname: string;
    server: Server;
    user: User;
    private userId;
    constructor(client: Client, data: MemberData, guild: Server);
    init(): Promise<ServerMember>;
}
//# sourceMappingURL=ServerMember.d.ts.map