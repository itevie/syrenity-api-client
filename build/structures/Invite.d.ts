import Client from "../client/Client.js";
import Base from "./Base.js";
import { ChannelAPIData } from "./Channel.js";
import { ServerAPIData } from "./Server.js";
export interface InviteAPIData {
    id: string;
    guild_id: number;
    channel_id: number | null;
    created_by: number;
    created_at: string;
    expires_in: number;
    max_uses: number;
    uses: number;
    guild: ServerAPIData;
    channel: ChannelAPIData | null;
}
export default class Invite extends Base {
    id: string;
    guildId: number;
    channelId: number;
    createdBy: number;
    createdAt: Date;
    expiresIn: number;
    maxUses: number;
    uses: number;
    constructor(client: Client, data: InviteAPIData);
    use(): Promise<void>;
}
//# sourceMappingURL=Invite.d.ts.map