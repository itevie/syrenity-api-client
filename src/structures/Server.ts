import Client from "../client/Client";
import Base from "./Base";
import ServerMemberManager from "../managers/ServerMemberManager";
import ServerMember from "./ServerMember";
import ServerChannelManager from "../managers/ServerChannelManager";
import ServerInviteManager from "../managers/ServerInviteManager";

export interface GuildData {
    id: number,
    name: string,
    owner_id: number,
    description: string,
    avatar: string,
}

export default class Server extends Base {
    public members: ServerMemberManager;
    public channels: ServerChannelManager;
    public invites: ServerInviteManager;

    public id: number;
    public name: string;
    public description: string;
    public ownerId: number;
    public avatar: string;

    constructor(client: Client, options: GuildData) {
        super(client);

        this.id = options.id;
        this.name = options.name;
        this.description = options.description,
            this.avatar = options.avatar;
        this.ownerId = options.owner_id;

        this.members = new ServerMemberManager(this);
        this.channels = new ServerChannelManager(this);
        this.invites = new ServerInviteManager(client, this);
    }

    public async fetchOwner(): Promise<ServerMember> {
        return await this.members.fetch(this.ownerId);
    }
}