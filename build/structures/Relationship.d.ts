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
    channelId: number;
    channel: Channel;
    user1: User;
    user2: User;
    lastMessage: Date;
    active: boolean;
    createdAt: Date;
    constructor(client: Client, data: RelationshipAPIData);
    get recipient(): User;
    get self(): User;
}
