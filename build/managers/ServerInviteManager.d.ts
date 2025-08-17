import Client from "../client/Client";
import Invite from "../structures/Invite";
import Server from "../structures/Server";
import BaseManager from "./BaseManager";
export default class ServerInviteManager extends BaseManager<string, Invite> {
    private server;
    constructor(client: Client, server: Server);
    create(): Promise<Invite>;
    fetch(id: string, force?: boolean): Promise<Invite>;
}
