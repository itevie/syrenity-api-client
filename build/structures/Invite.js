import Base from "./Base";
export default class Invite extends Base {
    id;
    guildId;
    channelId;
    createdBy;
    createdAt;
    expiresIn;
    maxUses;
    uses;
    constructor(client, data) {
        super(client);
        this.id = data.id;
        this.guildId = data.guild_id;
        this.channelId = data.channel_id;
        this.createdBy = data.created_by;
        this.createdAt = new Date(data.created_at);
        this.expiresIn = data.expires_in;
        this.maxUses = data.max_uses;
        this.uses = data.uses;
    }
    async use() {
        await this.client.rest.post(`/api/invites/${this.id}`);
    }
}
