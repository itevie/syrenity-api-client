import Client from "../client/Client";
import User, { UserData } from "../structures/User";
import CacheManager from "./CacheManager";

export default class UserManager extends CacheManager<typeof User, number> {
    constructor(client: Client) {
        super(client, User);
    }

    public async fetch(id: number, force?: boolean): Promise<User> {
        // Check if it is in the cache
        if (this.cache.has(id) && !force) {
            return this.cache.get(id);
        }

        const data = (await this.client.sendHTTP(`/users/${id}`, "get")).data;
        const instance = new User(this.client, data as UserData);
        this.cache.set(id, instance);

        return instance;
    }
}