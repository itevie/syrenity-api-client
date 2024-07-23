import Client from "../client/Client";
import Channel from "../structures/Channel";
import Message, { MessageData } from "../structures/Message";
import CacheManager from "./CacheManager";

export interface FetchMessageOptions {
    amount?: number,
    startAt?: number,
    fromUser?: number,
    isPinned?: boolean,
    orderBy?: "ascending" | "descending"
}

export interface CreateMessageOptions {
    content: string,
}

const defaultOptions: FetchMessageOptions = {
    amount: 20,
    startAt: null,
    fromUser: null,
    isPinned: null,
    orderBy: "descending",
}

export default class MessageManager extends CacheManager<typeof Message, number> {
    private channel: Channel;   
    constructor(client: Client, channel: Channel) {
        super(client, Message);

        this.channel = channel;
    }

    public async create(options: CreateMessageOptions): Promise<Message> {
        // Create message
        const result = (await this.client.sendHTTP(
            `/channels/${this.channel.id}/messages`, 
            "post",
            {
                content: options.content,
            }
        )).data as MessageData;

        return await this.addData(result);
    }

    public async fetch(op: FetchMessageOptions): Promise<Message[]> {
        const options = {
            ...defaultOptions,
            ...op
        };

        // Get query
        let query = [];
        if (options.amount !== null) query.push(`amount=${options.amount}`);
        if (options.startAt !== null) query.push(`start_at=${options.startAt}`);
        if (options.fromUser !== null) query.push(`from_user=${options.fromUser}`);
        if (options.isPinned !== null) query.push(`pinned=${options.isPinned}`);
        if (options.orderBy !== null) query.push(`order_by=${options.orderBy === "ascending" ? "asc" : "desc"}`);

        // Query string
        let queryString = "";
        for (const i in query) queryString += `${query[i]}&`;

        const data = (await this.client.sendHTTP(`/channels/${this.channel.id}/messages?${queryString}`, "get")).data;
        const messages: Message[] = [];

        for await (const d of (data.messages as MessageData[])) {
            let msg = await new Message(this.client, d).init();
            this.cache.set(d.id, msg);
            messages.push(msg);
        }

        return messages;
    }

    /*public async addData(data: MessageData): Promise<Message> {
        const instance = await new Message(this.client, data).init();
        this.cache.set(data.id, instance);
        return instance;
    }*/

    public async fetchId(id: number, force: boolean = false): Promise<Message> {
        // Check if it is in the cache
        if (this.cache.has(id) && !force) {
            return this.cache.get(id);
        }

        const data = (await this.client.sendHTTP(`/channels/${this.channel.id}/messages/${id}`, "get")).data;
        const instance = await new Message(this.client, data as MessageData).init();
        this.cache.set(id, instance);

        return instance;
    }
}