import Client from "../client/Client.js";
import Server from "../structures/Server.js";
import BaseManager from "./BaseManager.js";
export default class ServerManager extends BaseManager<number, Server> {
    constructor(client: Client);
    fetch(id: number, force?: boolean): Promise<Server>;
}
//# sourceMappingURL=ServerManager.d.ts.map