import Client from "../client/Client";
import User, { UserAPIData } from "../structures/User";
import BaseManager from "./BaseManager";
export default class UserManager extends BaseManager<number, User, UserAPIData> {
    constructor(client: Client);
    fetch(id: number, force?: boolean): Promise<User>;
}
