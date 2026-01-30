import Client from "../client/Client.js";
import Base from "./Base.js";
import Channel, { ChannelAPIData } from "./Channel.js";
import User, { UserAPIData } from "./User.js";

export interface RelationshipAPIData {
  channel_id: number;
  channel: ChannelAPIData;
  user1: UserAPIData;
  user2: UserAPIData;
  last_message: string;
  active_user_1: boolean;
  active_user_2: boolean;
  is_friends: boolean;
  created_at: string;
}

export default class Relationship extends Base {
  public channelId: number;
  public channel: Channel;
  public user1: User;
  public user2: User;
  public lastMessage: Date;
  public activeUser1: boolean;
  public activeUser2: boolean;
  public isFriends: boolean;
  public createdAt: Date;

  constructor(client: Client, data: RelationshipAPIData) {
    super(client);

    this.channelId = data.channel_id;
    this.channel = new Channel(client, data.channel);
    this.user1 = new User(client, data.user1);
    this.user2 = new User(client, data.user2);
    this.lastMessage = new Date(data.last_message);
    this.activeUser1 = data.active_user_1;
    this.activeUser2 = data.active_user_2;
    this.isFriends = data.is_friends;
    this.createdAt = new Date(data.created_at);
  }

  get recipient() {
    return this.client.user.id === this.user1.id ? this.user2 : this.user1;
  }

  get self() {
    return this.client.user.id !== this.user1.id ? this.user2 : this.user1;
  }

  public clientActive() {
    return this.activeFor(this.client.user.id);
  }

  public activeFor(userId: number) {
    return (
      (this.user1.id === userId && this.activeUser1) ||
      (this.user2.id === userId && this.activeUser2)
    );
  }
}
