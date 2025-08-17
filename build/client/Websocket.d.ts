import Channel, { ChannelAPIData } from "../structures/Channel";
import Member, { MemberAPIData } from "../structures/Member";
import Message, { MessageAPIData } from "../structures/Message";
import { UserReactionApiData } from "../structures/Reaction";
import Server, { ServerAPIData } from "../structures/Server";
import User, { UserAPIData } from "../structures/User";
export type WebsocketMessageType = "Authenticate" | "Hello" | "Identify" | "Dispatch" | "Heartbeat";
export interface WebsocketMessage {
    type: WebsocketMessageType;
    payload: any;
}
export interface WebsocketDispatchTypes {
    MessageCreate: {
        message: MessageAPIData;
    };
    MessageDelete: {
        message_id: number;
    };
    MessageUpdate: {
        message: MessageAPIData;
    };
    ServerMemberAdd: {
        member: MemberAPIData;
    };
    ServerMemberRemove: {
        member: MemberAPIData;
    };
    ServerUpdate: {
        server: ServerAPIData;
    };
    ChannelCreate: {
        channel: ChannelAPIData;
    };
    ChannelPositionUpdate: {
        channels: number[];
    };
    ChannelStartTyping: {
        channel_id: number;
        user_id: number;
    };
    UserUpdate: {
        user: UserAPIData;
    };
    MessageReactionAdd: {
        reaction: UserReactionApiData;
        new_message: MessageAPIData;
    };
    MessageReactionRemove: {
        reaction: UserReactionApiData;
        new_message: MessageAPIData;
    };
}
export interface ClientEvents {
    debug: [message: string];
    ready: [user: User, isReconnect: boolean];
    disconnect: [];
    reconnect: [];
    error: [error: any];
    messageCreate: [message: Message];
    messageDelete: [messageId: number, channelId: number];
    messageUpdate: [message: Message];
    messageReactionAdd: [reaction: UserReactionApiData, message: Message];
    messageReactionRemove: [reaction: UserReactionApiData, message: Message];
    serverMemberAdd: [member: Member];
    serverMemberRemove: [member: Member];
    serverUpdate: [server: Server];
    channelCreate: [channel: Channel];
    channelPositionUpdate: [server: Server, channels: number[]];
    channelStartTyping: [channelId: Channel, userId: User];
    userUpdate: [user: User];
    apiUserClassCreation: [user: UserAPIData];
    apiMessageClassCreation: [message: MessageAPIData];
    apiServerClassCreation: [server: ServerAPIData];
}
export type ClientEventFunction<T extends keyof ClientEvents> = (...args: ClientEvents[T]) => void;
export type PayloadHello = UserAPIData;
export type PayloadMessageCreate = MessageAPIData;
export interface PayloadDispatch<T extends keyof WebsocketDispatchTypes> {
    guildId?: number;
    channelId?: number;
    type: T;
    payload: WebsocketDispatchTypes[T];
}
