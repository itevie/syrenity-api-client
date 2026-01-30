import Client from "../client/Client.js";
import Invite from "../structures/Invite.js";
import Server from "../structures/Server.js";
import BaseManager from "./BaseManager.js";
export default class ServerInviteManager extends BaseManager<string, Invite> {
    private server;
    constructor(client: Client, server: Server);
    create(): Promise<Invite>;
    fetch(id: string, force?: boolean): Promise<Invite>;
}
//# sourceMappingURL=ServerInviteManager.d.ts.map