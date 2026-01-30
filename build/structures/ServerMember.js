"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
class ServerMember extends Base_1.default {
    nickname;
    server;
    user;
    userId;
    constructor(client, data, guild) {
        super(client);
        this.nickname = data.nickname;
        this.server = guild;
        this.userId = data.user_id;
    }
    async init() {
        this.user = await this.client.users.fetch(this.userId);
        return this;
    }
}
exports.default = ServerMember;
