import Client from "../client/Client.js";
import Base from "./Base.js";
import User from "./User.js";
import ServerChannelManager from "../managers/ServerChannelManager.js";
import File from "./FileBase.js";
import ServerInviteManager from "../managers/ServerInviteManager.js";
export interface ServerAPIData {
    id: number;
    name: string;
    owner_id: number;
    description: string | null;
    avatar: string | null;
}
export interface EditServerOptions {
    name?: string;
    avatar?: string;
}
export default class Server extends Base {
    id: number;
    name: string;
    ownerID: number;
    description: string | null;
    avatar: File | null;
    _data: ServerAPIData;
    channels: ServerChannelManager;
    invites: ServerInviteManager;
    constructor(client: Client, data: ServerAPIData);
    fetchOwner(): Promise<User>;
    edit(options: EditServerOptions): Promise<Server>;
    leave(): Promise<void>;
    strip(): {
        readonly id: number;
        readonly name: string;
        readonly ownerID: number;
        readonly description: string;
        readonly avatar: File;
    };
}
//# sourceMappingURL=Server.d.ts.map