import Client from "../client/Client";
import Base from "./Base";
import Server from "./Server";
import User from "./User";

export interface MemberData {
    user_id: number,
    guild_id: number,
    nickname: string,
}

export default class ServerMember extends Base {
    public nickname: string;
    public server: Server;
    public user: User;
    private userId: number;

    constructor(client: Client, data: MemberData, guild: Server) {
        super(client);
        
        this.nickname = data.nickname;
        this.server = guild;
        this.userId = data.user_id;
    }

    public async init(): Promise<ServerMember> {
        this.user = await this.client.users.fetch(this.userId);
        return this;
    }
}