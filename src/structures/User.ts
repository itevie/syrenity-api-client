import Client from "../client/Client";
import Application, { ApplicationAPIData } from "./Application";
import Base from "./Base";
import File from "./FileBase";
import FriendRequest, { FriendRequestAPIData } from "./FriendRequest";
import Relationship, { RelationshipAPIData } from "./Relationship";
import Server, { ServerAPIData } from "./Server";

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
  public id: number;
  public username: string;
  public avatar: File;
  public isBot: boolean;
  public about: string;
  public discriminator: string;
  public email: string;
  public emailVerified: boolean;
  public createdAt: Date;
  public profileBanner: File;
  public data: UserAPIData;

  constructor(client: Client, options: UserAPIData) {
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

  public async fetchServers(): Promise<Server[]> {
    let result = await this.client.rest.get<ServerAPIData[]>(
      `/api/users/${this.id}/servers`,
    );
    return (result.data ?? []).map((x) => new Server(this.client, x));
  }

  public async fetchRelationships(): Promise<Relationship[]> {
    const result = await this.client.rest.get<RelationshipAPIData[]>(
      `/api/users/${this.id}/relationships`,
    );
    return result.data.map((x) => new Relationship(this.client, x));
  }

  public async fetchFriendRequests(): Promise<FriendRequest[]> {
    const result = await this.client.rest.get<FriendRequestAPIData[]>(
      `/api/users/${this.id}/friend_requests`,
    );
    return result.data.map((x) => new FriendRequest(this.client, x));
  }

  public async fetchApplications(): Promise<Application[]> {
    const result = await this.client.rest.get<ApplicationAPIData[]>(
      `/api/users/${this.id}/applications`,
    );
    return result.data.map((x) => new Application(this.client, x));
  }

  public async edit(options: UserEditOptions): Promise<User> {
    const result = await this.client.rest.patch<UserAPIData>(
      `/api/users/${this.id}`,
      options,
    );
    return this.client.users.addCache(
      result.data.id,
      new User(this.client, result.data),
    );
  }
}
