import Client from "../client/Client";
import Channel from "../structures/Channel";
import Message from "../structures/Message";
import CacheManager from "./CacheManager";
export interface FetchMessageOptions {
    amount?: number;
    startAt?: number;
    fromUser?: number;
    isPinned?: boolean;
    orderBy?: "ascending" | "descending";
}
export interface CreateMessageOptions {
    content: string;
}
export default class MessageManager extends CacheManager<typeof Message, number> {
    private channel;
    constructor(client: Client, channel: Channel);
    create(options: CreateMessageOptions): Promise<Message>;
    fetch(op: FetchMessageOptions): Promise<Message[]>;
    fetchId(id: number, force?: boolean): Promise<Message>;
}
//# sourceMappingURL=MessageManager.d.ts.map