import Client from "../client/Client.js";
import User, { UserAPIData } from "../structures/User.js";
import BaseManager from "./BaseManager.js";
export default class UserManager extends BaseManager<number, User, UserAPIData> {
    constructor(client: Client);
    fetch(id: number, force?: boolean): Promise<User>;
}
//# sourceMappingURL=UserManager.d.ts.map