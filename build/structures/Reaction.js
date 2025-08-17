import Base from "./Base";
export default class Reaction extends Base {
    messageId;
    amount;
    emoji;
    createdAt;
    users;
    constructor(client, data) {
        super(client);
        this.messageId = data.message_id;
        this.amount = data.amount;
        this.emoji = data.emoji;
        this.createdAt = new Date(data.created_at);
        this.users = data.users;
    }
}
