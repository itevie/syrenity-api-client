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
    messageId: number;
    amount: number;
    emoji: string;
    createdAt: Date;
    users: number[];
    constructor(client: Client, data: ReactionApiData);
}
//# sourceMappingURL=Reaction.d.ts.map