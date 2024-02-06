import { BaseChannel, BaseGuild, BaseUser, Channel, Message } from ".";
import BaseMember from "./classes/BaseMember";
import Guild from "./classes/Guild";
import User from "./classes/User";

export interface ClientEvents {
  debug: [message: string];
  ready: [data: {
    guilds: Guild[],
    user: User,
  }];
  error: [error: Error];

  disconnect: [];
  reconnect: [];
  reconnectionFailure: [];

  messageCreate: [message: Message];
  messageUpdate: [message: Message];
  messageDelete: [{messageId: number, channel: BaseChannel, guild: BaseGuild}];

  userClassCreation: [user: User];
  memberClassCreation: [member: BaseMember];

  channelCreate: [channel: Channel];

  typingStart: [data: {user: BaseUser, guild: BaseGuild, channel: BaseChannel}]
}

export default {}
