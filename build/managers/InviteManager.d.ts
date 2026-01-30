import Client from "../client/Client.js";
import Invite from "../structures/Invite.js";
import BaseManager from "./BaseManager.js";
export default class InviteManager extends BaseManager<string, Invite> {
    constructor(client: Client);
    fetch(id: string, force?: boolean): Promise<Invite>;
}
//# sourceMappingURL=InviteManager.d.ts.map