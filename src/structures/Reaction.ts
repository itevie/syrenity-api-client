import Client from "../client/Client.js";
import Base from "./Base.js";

export interface ReactionApiData {
  message_id: number;
  emoji: string;
  created_at: string;
  amount: number;
  users: number[];
}

export interface UserReactionApiData {
  message_id: number;
  emoji: string;
  user_id: number;
  created_at: string;
}

export default class Reaction extends Base {
  public messageId: number;
  public amount: number;
  public emoji: string;
  public createdAt: Date;
  public users: number[];

  constructor(client: Client, data: ReactionApiData) {
    super(client);
    this.messageId = data.message_id;
    this.amount = data.amount;
    this.emoji = data.emoji;
    this.createdAt = new Date(data.created_at);
    this.users = data.users;
  }
}
