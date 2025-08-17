import Client from "../client/Client";
import Base from "./Base";

export interface FriendRequestAPIData {
  for_user: number;
  by_user: number;
  created_at: Date;
}

export default class FriendRequest extends Base {
  public forUser: number;
  public byUser: number;
  public createdAt: Date;
  public _data: FriendRequestAPIData;

  public constructor(client: Client, data: FriendRequestAPIData) {
    super(client);

    this.forUser = data.for_user;
    this.byUser = data.by_user;
    this.createdAt = data.created_at;
    this._data = data;
  }
}
