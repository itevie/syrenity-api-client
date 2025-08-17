import Client from "../client/Client";
import Channel from "../structures/Channel";
import BaseManager from "./BaseManager";
import Message from "../structures/Message";
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
