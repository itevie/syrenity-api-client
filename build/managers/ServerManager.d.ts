import Client from "../client/Client";
import Server from "../structures/Server";
import BaseManager from "./BaseManager";
export default class ServerManager extends BaseManager<number, Server> {
    constructor(client: Client);
    fetch(id: number, force?: boolean): Promise<Server>;
}
