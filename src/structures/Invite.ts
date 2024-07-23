import Client from "../client/Client";
import Base from "./Base";
import Server from "./Server";

export interface InviteData {
    guild_id: number,
    created_at: number,
    created_by: number,
    expires_in: number | null,
    max_uses: number | null,
    uses: number,
    id: string,
}

export default class Invite extends Base {
    public id: string;
    public serverId: number;
    public createdAt: Date;
    public createdBy: number;
    public expiresIn: number | null;
    public expiresAt: Date | null;
    public maxUses: number | null;
    public uses: number;

    constructor(client: Client, data: InviteData) {
        super(client);

        this.id = data.id;
        this.serverId = data.guild_id;
        this.createdBy = data.created_by;
        this.createdAt = new Date(data.created_at);
        this.expiresIn = data.expires_in;
        this.expiresAt = data.expires_in ? new Date(data.created_at + data.expires_in) : null;
        this.maxUses = data.max_uses;
        this.uses = data.uses;
    }

    public async fetchServer(): Promise<Server> {
        return this.client.servers.fetch(this.serverId);
    }

    public async delete(): Promise<void> {
        await this.client.sendHTTP(`/guilds/${this.serverId}/invites/${this.id}`, "delete");
    }
}