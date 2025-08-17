import Client from "../client/Client";
import ChannelMessageManager from "../managers/ChannelMessageManager";
import ChannelBase from "./ChannelBase";
export interface ChannelAPIData {
    id: number;
    type: "channel" | "dm";
    guild_id: number | null;
    name: string;
    topic: string | null;
    is_nsfw: boolean;
    position: number;
}
export interface ChannelEditOptions {
    name?: string;
    position?: number;
}
export default class Channel extends ChannelBase {
    type: "channel" | "dm";
    guildId: number | null;
    name: string;
    topic: string | null;
    nsfw: boolean;
    position: number;
    _data: ChannelAPIData;
    messages: ChannelMessageManager;
    constructor(client: Client, data: ChannelAPIData);
    edit(options: ChannelEditOptions): Promise<Channel>;
    startTyping(): Promise<void>;
    strip(): {
        readonly id: number;
        readonly type: "channel" | "dm";
        readonly topic: string;
        readonly guildId: number;
        readonly name: string;
        readonly nsfw: string;
    };
}
