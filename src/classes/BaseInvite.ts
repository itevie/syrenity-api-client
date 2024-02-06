import Client from './Client.js'
import * as index from '../index.js'
import { InviteData } from "./Invite.js";

export default class BaseInvite {
    protected client: Client;
    public code: string;

    constructor(code: string, client: Client) {
        this.code = code;
        this.client = client;
    }

    public async fetch(): Promise<index.Invite> {
        const data = await this.client.sendHTTP(`/invites/${this.code}`);
        return new index.Invite(this.client, data.data as InviteData);
    }

    public async use(): Promise<void> {
      await this.client.sendHTTP(`/invites/${this.code}`, "POST");
    }
}
