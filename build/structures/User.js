import Application from "./Application";
import Base from "./Base";
import File from "./FileBase";
import FriendRequest from "./FriendRequest";
import Relationship from "./Relationship";
import Server from "./Server";
export default class User extends Base {
    id;
    username;
    avatar;
    isBot;
    about;
    discriminator;
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
        this.discriminator = options.discriminator;
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
}
