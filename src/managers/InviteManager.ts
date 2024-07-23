import Client from "../client/Client";
import Invite from "../structures/Invite";
import CacheManager from "./CacheManager";

export default class InviteManager extends CacheManager<typeof Invite, string> {
    constructor(client: Client) {
        super(client, Invite);
    }

    public async fetch(id: string): Promise<Invite> {
        if (this.cache.has(id)) {
            return this.cache.get(id);
        }

        const data = (await this.client.sendHTTP(`/invites/${id}`, "get")).data;
        return await this.addData(data);
    }
}