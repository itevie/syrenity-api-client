import Application from "./Application.js";
import Base from "./Base.js";
import Channel from "./Channel.js";
import File from "./FileBase.js";
import FriendRequest from "./FriendRequest.js";
import Relationship from "./Relationship.js";
import Server from "./Server.js";
export default class User extends Base {
    id;
    username;
    avatar;
    isBot;
    about;
    email;
    emailVerified;
    createdAt;
    profileBanner;
    data;
    constructor(client, options) {
        super(client);
        this.data = options;
        client.emit("apiUserClassCreation", options);
        this.id = options.id;
        this.username = options.username;
        this.avatar = new File(client, options.avatar);
        this.profileBanner = new File(client, options.profile_banner);
        this.isBot = options.is_bot;
        this.about = options.about_me;
        this.email = options.email;
        this.emailVerified = options.email_verified;
        this.createdAt = new Date(options.created_at);
    }
    async fetchServers() {
        let result = await this.client.rest.get(`/api/users/${this.id}/servers`);
        return (result.data ?? []).map((x) => new Server(this.client, x));
    }
    async fetchRelationships() {
        const result = await this.client.rest.get(`/api/users/${this.id}/relationships`);
        return result.data.map((x) => new Relationship(this.client, x));
    }
    async fetchFriendRequests() {
        const result = await this.client.rest.get(`/api/users/${this.id}/friend_requests`);
        return result.data.map((x) => new FriendRequest(this.client, x));
    }
    async fetchApplications() {
        const result = await this.client.rest.get(`/api/users/${this.id}/applications`);
        return result.data.map((x) => new Application(this.client, x));
    }
    async edit(options) {
        const result = await this.client.rest.patch(`/api/users/${this.id}`, options);
        return this.client.users.addCache(result.data.id, new User(this.client, result.data));
    }
    async ensureRelationshipWith(userId) {
        let result = await this.client.rest.post(`/api/users/${this.id}/relationships/${userId}/ensure`);
        return {
            channel: new Channel(this.client, result.data.channel),
            relationship: new Relationship(this.client, result.data.relationship),
        };
    }
}
