import Base from "./Base";
import ServerChannelManager from "../managers/ServerChannelManager";
import File from "./FileBase";
import ServerInviteManager from "../managers/ServerInviteManager";
export default class Server extends Base {
    id;
    name;
    ownerID;
    description;
    avatar;
    _data;
    channels;
    invites;
    constructor(client, data) {
        super(client);
        this.client.emit("apiServerClassCreation", data);
        this.channels = new ServerChannelManager(client, this);
        this.invites = new ServerInviteManager(client, this);
        this._data = data;
        this.id = data.id;
        this.name = data.name;
        this.ownerID = data.owner_id;
        this.description = data.description;
        this.avatar = data.avatar ? new File(client, data.avatar) : null;
    }
    async fetchOwner() {
        return await this.client.users.fetch(this.id);
    }
    async edit(options) {
        const result = await this.client.rest.patch(`/api/servers/${this.id}`, options);
        return this.client.servers.addCache(result.data.id, new Server(this.client, result.data));
    }
    async leave() {
        await this.client.rest.delete(`/api/users/${this.client.user.id}/servers/${this.id}`);
    }
    strip() {
        return {
            id: this.id,
            name: this.name,
            ownerID: this.ownerID,
            description: this.description,
            avatar: this.avatar,
        };
    }
}
