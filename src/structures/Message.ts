import Client from "../client/Client";
import Base from "./Base";
import Channel from "./Channel";
import User from "./User";

export interface MessageData {
    id: number,
    channel_id: number,
    content: string,
    created_at: Date,
    author_id: number,
    is_pinned: boolean,
    is_edited: boolean,
    is_system: boolean,
    sys_type: string,
}

export interface UpdateMessageData {
    content?: string,
}

export default class Message extends Base {
    public id: number;
    private channelId: number;
    public channel: Channel;
    public content: string;
    public createdAt: Date;
    public author: User;
    private authorId: number;
    public isPinned: boolean;
    public isEdited: boolean;
    public isSystem: boolean;
    public systemType: string | null;

    constructor(client: Client, options: MessageData) {
        super(client);

        this.id = options.id;
        this.content = options.content;
        this.channelId = options.channel_id;
        this.createdAt = new Date(options.created_at);
        this.authorId = options.author_id;
        this.isPinned = options.is_pinned;
        this.isEdited = options.is_edited;
        this.isSystem = options.is_system;
        this.systemType = options.sys_type;
    }

    public async init(): Promise<Message> {
        this.author = await this.client.users.fetch(this.authorId);
        this.channel = await this.client.channels.fetch(this.channelId);

        return this;
    }

    public async delete(): Promise<void> {
        await this.client.sendHTTP(`/channels/${this.channelId}/messages/${this.id}`, "delete");
    }

    public async edit(options: UpdateMessageData): Promise<Message> {
        const data = (await this.client.sendHTTP(`/channels/${this.channelId}/messages/${this.id}`, "patch", options)).data;
        return await this.channel.messages.addData(data);
    }

    public async pin(): Promise<void> {
        await this.client.sendHTTP(`/channels/${this.channelId}/pins/${this.id}`, "put");
    }

    public async unpin(): Promise<void> {
        await this.client.sendHTTP(`/channels/${this.channelId}/pins/${this.id}`, "delete");
    }
}