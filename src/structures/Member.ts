import Client from "../client/Client";
import Base from "./Base";

export interface MemberAPIData {
  guild_id: number;
  user_id: number;
  nickname: string | null;
}

export default class Member extends Base {
  public serverId: number;
  public userId: number;
  public nickname: string | null;
  public _data: MemberAPIData;

  constructor(client: Client, data: MemberAPIData) {
    super(client);
    this.serverId = data.guild_id;
    this.userId = data.user_id;
    this.nickname = data.nickname;
    this._data = data;
  }
}
