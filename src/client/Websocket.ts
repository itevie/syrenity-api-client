import { MessageAPIData } from "../structures/Message";
import { UserAPIData } from "../structures/User";

export type WebsocketMessageType =
  | "Authenticate"
  | "Hello"
  | "Identify"
  | "DispatchMessageCreate";

export interface WebsocketMessage {
  type: WebsocketMessageType;
  payload: any;
}

// ----- Payloads -----
export type PayloadHello = UserAPIData;
export type PayloadMessageCreate = MessageAPIData;
