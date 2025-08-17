import Client from "../client/Client";
import Invite from "../structures/Invite";
import BaseManager from "./BaseManager";
export default class InviteManager extends BaseManager<string, Invite> {
    constructor(client: Client);
    fetch(id: string, force?: boolean): Promise<Invite>;
}
