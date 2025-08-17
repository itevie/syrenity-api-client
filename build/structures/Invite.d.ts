import Client from "../client/Client";
import Base from "./Base";
import { ChannelAPIData } from "./Channel";
import { ServerAPIData } from "./Server";
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
