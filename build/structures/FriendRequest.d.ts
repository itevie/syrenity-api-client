import Client from "../client/Client";
import Base from "./Base";
export interface FriendRequestAPIData {
    for_user: number;
    by_user: number;
    created_at: Date;
}
export default class FriendRequest extends Base {
    forUser: number;
    byUser: number;
    createdAt: Date;
    _data: FriendRequestAPIData;
    constructor(client: Client, data: FriendRequestAPIData);
}
