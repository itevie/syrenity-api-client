import Client from "./Client.js";
import BaseUser from "./BaseUser.js";

interface FriendRequestData {
  for_user: number;
  by_user: number;
  created_at: Date;
}

export default class FriendRequest {
  forUser: BaseUser;
  byUser: BaseUser;
  createdAt: Date;
  client: Client;

  constructor(client: Client, data: FriendRequestData) {
    this.forUser = new BaseUser(data.for_user, client);
    this.byUser = new BaseUser(data.by_user, client);
    this.createdAt = new Date(data.created_at);
    this.client = client;
  }

  public fetchOther(): BaseUser {
    return this.client.currentUser.id === this.forUser.id ? this.byUser : this.forUser;
  }
}