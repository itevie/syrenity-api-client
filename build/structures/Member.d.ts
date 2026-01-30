import Client from "../client/Client.js";
import Base from "./Base.js";
export interface MemberAPIData {
    guild_id: number;
    user_id: number;
    nickname: string | null;
}
export default class Member extends Base {
    serverId: number;
    userId: number;
    nickname: string | null;
    _data: MemberAPIData;
    constructor(client: Client, data: MemberAPIData);
}
//# sourceMappingURL=Member.d.ts.map