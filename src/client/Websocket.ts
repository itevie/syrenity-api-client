import { MemberAPIData } from "../structures/Member";
import { MessageAPIData } from "../structures/Message";
import { UserReactionApiData } from "../structures/Reaction";
import { UserAPIData } from "../structures/User";

export type WebsocketMessageType =
  | "Authenticate"
  | "Hello"
  | "Identify"
  | "Dispatch";

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

// ----- Payloads -----
export type PayloadHello = UserAPIData;
export type PayloadMessageCreate = MessageAPIData;
export interface PayloadDispatch<T extends keyof WebsocketDispatchTypes> {
  guildId?: number;
  channelId?: number;
  type: T;
  payload: WebsocketDispatchTypes[T];
}
