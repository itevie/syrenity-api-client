import BaseManager from "./BaseManager";
import Message from "../structures/Message";
export default class ChannelMessageManager extends BaseManager {
    channel;
    constructor(client, channel) {
        super(client);
        this.channel = channel;
    }
    async send(content) {
        let result = await this.client.rest.post(`/api/channels/${this.channel.id}/messages`, {
            content,
        });
        return new Message(this.client, result.data);
    }
    async query(options) {
        let url = `/api/channels/${this.channel.id}/messages`;
        if (Object.entries(options || {}).length !== 0)
            url += "?";
        if (options?.amount)
            url += `amount=${options.amount}&`;
        if (options?.fromUser)
            url += `from_user=${options.fromUser}&`;
        if (options?.isPinned)
            url += `is_pinned=${options.isPinned}&`;
        if (options?.startAt)
            url += `start_at=${options.startAt}&`;
        let result = await this.client.rest.get(url);
        return (result.data || []).map((x) => new Message(this.client, x));
    }
}
