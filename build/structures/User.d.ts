import Client from "../client/Client.js";
import Application from "./Application.js";
import Base from "./Base.js";
import Channel from "./Channel.js";
import File from "./FileBase.js";
import FriendRequest from "./FriendRequest.js";
import Relationship from "./Relationship.js";
import Server from "./Server.js";
export interface UserAPIData {
    id: number;
    username: string;
    avatar: string;
    is_bot: boolean;
    about_me: string;
    email: string;
    email_verified: boolean;
    created_at: string;
    profile_banner: string | null;
}
export interface UserEditOptions {
    avatar?: string;
    profile_banner?: string;
    about_me?: string;
    username?: string;
}
export default class User extends Base {
    id: number;
    username: string;
    avatar: File;
    isBot: boolean;
    about: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    profileBanner: File;
    data: UserAPIData;
    constructor(client: Client, options: UserAPIData);
    fetchServers(): Promise<Server[]>;
    fetchRelationships(): Promise<Relationship[]>;
    fetchFriendRequests(): Promise<FriendRequest[]>;
    fetchApplications(): Promise<Application[]>;
    edit(options: UserEditOptions): Promise<User>;
    ensureRelationshipWith(userId: number): Promise<{
        channel: Channel;
        relationship: Relationship;
    }>;
}
//# sourceMappingURL=User.d.ts.map