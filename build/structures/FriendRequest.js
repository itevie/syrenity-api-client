import Base from "./Base";
export default class FriendRequest extends Base {
    forUser;
    byUser;
    createdAt;
    _data;
    constructor(client, data) {
        super(client);
        this.forUser = data.for_user;
        this.byUser = data.by_user;
        this.createdAt = data.created_at;
        this._data = data;
    }
}
