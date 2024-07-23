import HTTPError, { ErrorCodeData } from "../errors/HTTPErrors";
import Channel from "../structures/Channel";
import Message from "../structures/Message";
import User, { UserData } from "../structures/User";

export interface ClientEvents {
    debug: [message: string],
    error: [message: string],
    httpError: [error: HTTPError<keyof ErrorCodeData>],
    ready: [],
    disconnect: [],
    reconnect: [],

    // ----- Dispatch Ones -----
    messageCreate: [message: Message],
    messageDelete: [messageId: number, channelId: number],
    messageUpdate: [message: Message],

    channelUpdate: [channel: Channel],
    channelCreate: [channel: Channel],
    channelDelete: [channelId: number, guildId: number],

    userUpdate: [user: User],

    // ----- Special User Cases (mainly frontend) -----
    userClassCreation: [user: UserData],
}