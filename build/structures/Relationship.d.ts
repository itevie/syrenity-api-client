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
    channelId: number;
    channel: Channel;
    user1: User;
    user2: User;
    lastMessage: Date;
    activeUser1: boolean;
    activeUser2: boolean;
    isFriends: boolean;
    createdAt: Date;
    constructor(client: Client, data: RelationshipAPIData);
    get recipient(): User;
    get self(): User;
    clientActive(): boolean;
    activeFor(userId: number): boolean;
}
//# sourceMappingURL=Relationship.d.ts.map