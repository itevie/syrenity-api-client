"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ServerMember_js_1 = __importDefault(require("../structures/ServerMember.js"));
const CacheManager_js_1 = __importDefault(require("./CacheManager.js"));
class ServerMemberManager extends CacheManager_js_1.default {
    server;
    constructor(server) {
        super(server.client, ServerMember_js_1.default);
        this.server = server;
    }
    async fetch(id, force) {
        // Check if it is in the cache
        if (this.cache.has(id) && !force) {
            return this.cache.get(id);
        }
        const data = (await this.client.sendHTTP(`/guilds/${this.server.id}/members/${id}`, "get")).data;
        const instance = await new ServerMember_js_1.default(this.client, data, this.server).init();
        this.cache.set(id, instance);
        return instance;
    }
}
exports.default = ServerMemberManager;
