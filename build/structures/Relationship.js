import Base from "./Base.js";
import Channel from "./Channel.js";
import User from "./User.js";
export default class Relationship extends Base {
    channelId;
    channel;
    user1;
    user2;
    lastMessage;
    activeUser1;
    activeUser2;
    isFriends;
    createdAt;
    constructor(client, data) {
        super(client);
        this.channelId = data.channel_id;
        this.channel = new Channel(client, data.channel);
        this.user1 = new User(client, data.user1);
        this.user2 = new User(client, data.user2);
        this.lastMessage = new Date(data.last_message);
        this.activeUser1 = data.active_user_1;
        this.activeUser2 = data.active_user_2;
        this.isFriends = data.is_friends;
        this.createdAt = new Date(data.created_at);
    }
    get recipient() {
        return this.client.user.id === this.user1.id ? this.user2 : this.user1;
    }
    get self() {
        return this.client.user.id !== this.user1.id ? this.user2 : this.user1;
    }
    clientActive() {
        return this.activeFor(this.client.user.id);
    }
    activeFor(userId) {
        return ((this.user1.id === userId && this.activeUser1) ||
            (this.user2.id === userId && this.activeUser2));
    }
}
