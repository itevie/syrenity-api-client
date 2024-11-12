import Client from "../client/Client";
import Base from "./Base";
import User from "./User";
import ServerChannelManager from "../managers/ServerChannelManager";
import Channel, { ChannelAPIData } from "./Channel";
import File from "./File";
import ServerInviteManager from "../managers/ServerInviteManager";

export interface ServerAPIData {
  id: number;
  name: string;
  owner_id: number;
  description: string | null;
  avatar: string | null;
}

export default class Server extends Base {
  public id: number;
  public name: string;
  public ownerID: number;
  public description: string | null;
  public avatar: File | null;

  public channels: ServerChannelManager;
  public invites: ServerInviteManager;

  constructor(client: Client, data: ServerAPIData) {
    super(client);

    this.client.emit("apiServerClassCreation", data);

    this.channels = new ServerChannelManager(client, this);
    this.invites = new ServerInviteManager(client, this);

    this.id = data.id;
    this.name = data.name;
    this.ownerID = data.owner_id;
    this.description = data.description;
    this.avatar = data.avatar ? new File(client, data.avatar) : null;
  }

  public async fetchOwner(): Promise<User> {
    return await this.client.users.fetch(this.id);
  }

  public strip() {
    return {
      id: this.id,
      name: this.name,
      ownerID: this.ownerID,
      description: this.description,
      avatar: this.avatar
    } as const;
  }
}