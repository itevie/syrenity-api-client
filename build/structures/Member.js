import Base from "./Base.js";
export default class Member extends Base {
    serverId;
    userId;
    nickname;
    _data;
    constructor(client, data) {
        super(client);
        this.serverId = data.guild_id;
        this.userId = data.user_id;
        this.nickname = data.nickname;
        this._data = data;
    }
}
