import BaseInvite from "./BaseInvite.js";
import BaseGuild from "./BaseGuild.js";
import BaseUser from "./BaseUser.js";
import Client from './Client.js'

export interface InviteData {
    guild_id: number;
    created_at: Date;
    created_by: number;
    id: string;
}

export default class Invite extends BaseInvite {
    public guild: BaseGuild;
    public createdAt: Date;
    public author: BaseUser;

    constructor(client: Client, data: InviteData) {
        super(data.id, client);
        this.guild = new BaseGuild(data.guild_id, this.client);
        this.createdAt = new Date(data.created_at);
        this.author = new BaseUser(data.created_by, this.client);
    }
}
