"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = __importDefault(require("../structures/Message"));
const CacheManager_1 = __importDefault(require("./CacheManager"));
const defaultOptions = {
    amount: 20,
    startAt: null,
    fromUser: null,
    isPinned: null,
    orderBy: "descending",
};
class MessageManager extends CacheManager_1.default {
    channel;
    constructor(client, channel) {
        super(client, Message_1.default);
        this.channel = channel;
    }
    async create(options) {
        // Create message
        const result = (await this.client.sendHTTP(`/channels/${this.channel.id}/messages`, "post", {
            content: options.content,
        })).data;
        return await this.addData(result);
    }
    async fetch(op) {
        const options = {
            ...defaultOptions,
            ...op
        };
        // Get query
        let query = [];
        if (options.amount !== null)
            query.push(`amount=${options.amount}`);
        if (options.startAt !== null)
            query.push(`start_at=${options.startAt}`);
        if (options.fromUser !== null)
            query.push(`from_user=${options.fromUser}`);
        if (options.isPinned !== null)
            query.push(`pinned=${options.isPinned}`);
        if (options.orderBy !== null)
            query.push(`order_by=${options.orderBy === "ascending" ? "asc" : "desc"}`);
        // Query string
        let queryString = "";
        for (const i in query)
            queryString += `${query[i]}&`;
        const data = (await this.client.sendHTTP(`/channels/${this.channel.id}/messages?${queryString}`, "get")).data;
        const messages = [];
        for await (const d of data.messages) {
            let msg = await new Message_1.default(this.client, d).init();
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
    async fetchId(id, force = false) {
        // Check if it is in the cache
        if (this.cache.has(id) && !force) {
            return this.cache.get(id);
        }
        const data = (await this.client.sendHTTP(`/channels/${this.channel.id}/messages/${id}`, "get")).data;
        const instance = await new Message_1.default(this.client, data).init();
        this.cache.set(id, instance);
        return instance;
    }
}
exports.default = MessageManager;
