import Client from "../client/Client";
import Application from "./Application";
import Base from "./Base";
import File from "./FileBase";
import FriendRequest from "./FriendRequest";
import Relationship from "./Relationship";
import Server from "./Server";
export interface UserAPIData {
    id: number;
    username: string;
    avatar: string;
    is_bot: boolean;
    about_me: string;
    discriminator: string;
    email: string;
    email_verified: boolean;
    created_at: string;
    profile_banner: string | null;
}
export interface UserEditOptions {
    avatar?: string;
    profile_banner?: string;
}
export default class User extends Base {
    id: number;
    username: string;
    avatar: File;
    isBot: boolean;
    about: string;
    discriminator: string;
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
}
