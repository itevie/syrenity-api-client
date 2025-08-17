import Base from "./Base";
import Channel from "./Channel";
import User from "./User";
export default class Relationship extends Base {
    channelId;
    channel;
    user1;
    user2;
    lastMessage;
    active;
    createdAt;
    constructor(client, data) {
        super(client);
        this.channelId = data.channel_id;
        this.channel = new Channel(client, data.channel);
        this.user1 = new User(client, data.user1);
        this.user2 = new User(client, data.user2);
        this.lastMessage = new Date(data.last_message);
        this.active = data.active;
        this.createdAt = new Date(data.created_at);
    }
    get recipient() {
        return this.client.user.id === this.user1.id ? this.user2 : this.user1;
    }
    get self() {
        return this.client.user.id !== this.user1.id ? this.user2 : this.user1;
    }
}
