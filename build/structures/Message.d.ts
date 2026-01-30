import Client from "../client/Client.js";
import Base from "./Base.js";
import FileBase from "./FileBase.js";
import Reaction, { ReactionApiData } from "./Reaction.js";
import User, { UserAPIData } from "./User.js";
import { WebhookAPIData } from "./Webhook.js";
export interface MessageAPIData {
    id: number;
    content: string;
    channel_id: number;
    created_at: string;
    author_id: number;
    author: UserAPIData;
    is_pinned: boolean;
    is_edited: boolean;
    is_system: boolean;
    sys_type: string | null;
    reactions: ReactionApiData[];
    webhook_id: string;
    webhook: WebhookAPIData;
    proxy_id: number;
}
export interface AuthorDisplay {
    type: "normal" | "proxy";
    username: string;
    avatar: FileBase;
}
export default class Message extends Base {
    id: number;
    content: string;
    channelID: number;
    createdAt: Date;
    authorId: number;
    author: User;
    isPinned: boolean;
    isEdited: boolean;
    isSystem: boolean;
    systemType: string | null;
    reactions: Reaction[];
    webhookId: string;
    _data: MessageAPIData;
    constructor(client: Client, data: MessageAPIData);
    getDisplay(): AuthorDisplay;
    react(emoji: string): Promise<void>;
    removeReaction(emoji: string): Promise<void>;
    delete(): Promise<void>;
    edit(content: string): Promise<Message>;
    pin(): Promise<void>;
    unpin(): Promise<void>;
    strip(): {
        readonly id: number;
        readonly content: string;
        readonly channelID: number;
        readonly createdAt: Date;
        readonly authorId: number;
        readonly isEdited: boolean;
        readonly isPinned: boolean;
        readonly isSystem: boolean;
        readonly systemType: string;
    };
}
//# sourceMappingURL=Message.d.ts.map