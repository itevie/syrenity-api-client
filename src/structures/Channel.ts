import Client from "../client/Client";
import MessageManager from "../managers/MessageManager";
import Base from "./Base";
import Server from "./Server";

/**
 * The type of a channel
 * 
 * dm - A DM channel, between two users 
 * 
 * channel - A guild channel 
 * 
 * category - A category that is represented as a channel 
 */
export type ChannelType = "dm" | "channel" | "category";
export interface ChannelData {
    id: number,
    type: ChannelType,
    guild_id: number,
    name: string,
    topic: string,
}

interface UpdateChannelOptions {
    name?: string,
    topic?: string,
}

export default class Channel extends Base {
    public messages: MessageManager;

    public id: number;
    public serverId: number;
    public type: ChannelType;
    public name: string;
    public topic: string;

    constructor(client: Client, options: ChannelData) {
        super(client);

        this.messages = new MessageManager(client, this);

        this.id = options.id;
        this.serverId = options.guild_id;
        this.type = options.type;
        this.name = options.name;
        this.topic = options.topic;
    }

    /**
     * Edit certain features of a channel
     * @param options The features to modify
     * @returns The modified channel
     */
    public async edit(options: UpdateChannelOptions): Promise<Channel> {
        const data = (await this.client.sendHTTP(`/channels/${this.id}`, "patch", options)).data;
        return await this.client.channels.addData(data);
    }

    /**
     * Deletes a channel
     */
    public async delete(): Promise<void> {
        (await this.client.sendHTTP(`/guilds/${this.serverId}/channels/${this.id}`, "delete"));
        return;
    }

    /**
     * Gets the server which the channel is witihin
     * @returns The server
     */
    public async getServer(): Promise<Server> {
        return this.client.servers.fetch(this.serverId);
    }
}