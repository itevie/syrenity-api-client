import Base from "./Base.js";
import FileBase from "./FileBase.js";
import Reaction from "./Reaction.js";
import User from "./User.js";
export default class Message extends Base {
    id;
    content;
    channelID;
    createdAt;
    authorId;
    author;
    isPinned;
    isEdited;
    isSystem;
    systemType;
    reactions;
    webhookId;
    _data;
    constructor(client, data) {
        super(client);
        this.client.emit("apiMessageClassCreation", data);
        this.id = data.id;
        this.content = data.content;
        this.channelID = data.channel_id;
        this.createdAt = new Date(data.created_at);
        this.authorId = data.author_id;
        this.author = new User(client, data.author);
        this.isEdited = data.is_edited;
        this.isPinned = data.is_pinned;
        this.isSystem = data.is_system;
        this.systemType = data.sys_type;
        this.reactions = data.reactions.map((x) => new Reaction(this.client, x));
        this.webhookId = data.webhook_id;
        this._data = data;
    }
    getDisplay() {
        if (this._data.webhook) {
            return {
                avatar: new FileBase(this.client, this._data.webhook.proxy_user.avatar),
                username: this._data.webhook.proxy_user.username,
                type: "proxy",
            };
        }
        return {
            avatar: this.author.avatar,
            username: this.author.username,
            type: "normal",
        };
    }
    async react(emoji) {
        await this.client.rest.post(`/api/channels/${this.channelID}/messages/${this.id}/reactions/${emoji}`);
    }
    async removeReaction(emoji) {
        await this.client.rest.delete(`/api/channels/${this.channelID}/messages/${this.id}/reactions/${emoji}`);
    }
    async delete() {
        await this.client.rest.delete(`/api/channels/${this.channelID}/messages/${this.id}`);
    }
    async edit(content) {
        const result = await this.client.rest.patch(`/api/channels/${this.channelID}/messages/${this.id}`, {
            content,
        });
        return new Message(this.client, result.data);
    }
    async pin() {
        await this.client.rest.post(`/api/channels/${this.channelID}/pins/${this.id}`);
    }
    async unpin() {
        await this.client.rest.delete(`/api/channels/${this.channelID}/pins/${this.id}`);
    }
    strip() {
        return {
            id: this.id,
            content: this.content,
            channelID: this.channelID,
            createdAt: this.createdAt,
            authorId: this.authorId,
            isEdited: this.isEdited,
            isPinned: this.isPinned,
            isSystem: this.isSystem,
            systemType: this.systemType,
        };
    }
}
