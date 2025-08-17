import Client from "../client/Client";
import Base from "./Base";
import Channel, { ChannelAPIData } from "./Channel";
import User, { UserAPIData } from "./User";

export interface RelationshipAPIData {
  channel_id: number;
  channel: ChannelAPIData;
  user1: UserAPIData;
  user2: UserAPIData;
  last_message: string;
  active: boolean;
  created_at: string;
}

export default class Relationship extends Base {
  public channelId: number;
  public channel: Channel;
  public user1: User;
  public user2: User;
  public lastMessage: Date;
  public active: boolean;
  public createdAt: Date;

  constructor(client: Client, data: RelationshipAPIData) {
    super(client);

    this.channelId = data.channel_id;
    this.channel = new Channel(client, data.channel);
    this.user1 = new User(client, data.user1);
    this.user2 = new User(client, data.user2);
    this.lastMessage = new Date(data.last_message);
    this.active = data.active;
    this.createdAt = new Date(data.created_at);
  }

  get recipient() {
    return this.client.user.id === this.user1.id ? this.user2 : this.user1;
  }

  get self() {
    return this.client.user.id !== this.user1.id ? this.user2 : this.user1;
  }
}
