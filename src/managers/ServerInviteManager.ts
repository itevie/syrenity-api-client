import Client from "../client/Client";
import Invite, { InviteData } from "../structures/Invite";
import Server from "../structures/Server";
import InviteManager from "./InviteManager";

interface CreateInviteOptions {
    expiresIn?: number | null,
    channelId?: number | null,
    maxUses?: number | null,
}

export default class ServerInviteManager extends InviteManager {
    private server: Server;
    constructor(client: Client, server: Server) {
        super(client);
        this.server = server;
    }

    public async fetchAll(): Promise<Invite[]> {
        let result = (await this.client.sendHTTP(`/guilds/${this.server.id}/invites`, "get")).data.invites as InviteData[];
        let invites: Invite[] = [];

        for (let i in result) {
            invites.push(await this.client.invites.addData(result[i]));
        }

        return invites;
    }

    public async create(options?: CreateInviteOptions): Promise<Invite> {
        let result = (await this.client.sendHTTP(`/guilds/${this.server.id}/invites`, "post", {
            max_uses: options?.maxUses,
            channel_id: options?.channelId,
            expires_in: options?.expiresIn
        })).data;

        return await this.client.invites.addData(result as InviteData);
    }
}