import Client from "../client/Client.js";
import Channel from "../structures/Channel.js";
import BaseManager from "./BaseManager.js";
import Message from "../structures/Message.js";
export interface ChannelMessageQueryOptions {
    amount?: number;
    startAt?: number;
    fromUser?: number;
    isPinned?: boolean;
}
export default class ChannelMessageManager extends BaseManager<number, Channel> {
    channel: Channel;
    constructor(client: Client, channel: Channel);
    send(content: string): Promise<Message>;
    query(options?: ChannelMessageQueryOptions): Promise<Message[]>;
}
//# sourceMappingURL=ChannelMessageManager.d.ts.map