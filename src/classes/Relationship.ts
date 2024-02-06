import Client from "./Client.js";
import BaseChannel from "./BaseChannel.js";
import User from "./User.js";
import BaseUser from "./BaseUser.js";

interface RelationshipData {
  user1: number;
  user2: number;
  channel_id: number;
  active: boolean;
}

export default class Relationship {
  public user1: BaseUser;
  public user2: BaseUser;
  public channel: BaseChannel;
  public active: boolean;
  public client: Client;

  constructor(client: Client, data: RelationshipData) {
    this.user1 = new BaseUser(data.user1, client);
    this.user2 = new BaseUser(data.user2, client);
    this.channel = new BaseChannel(data.channel_id, client);
    this.active = data.active;
    this.client = client;
  }

  public fetchRecipient(): BaseUser {
    return this.user1.id === this.client.currentUser.id ? this.user2 : this.user1;
  }
}