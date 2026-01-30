import Client from "../client/Client.js";
import Application, { ApplicationAPIData } from "./Application.js";
import Base from "./Base.js";
import Channel, { ChannelAPIData } from "./Channel.js";
import File from "./FileBase.js";
import FriendRequest, { FriendRequestAPIData } from "./FriendRequest.js";
import Relationship, { RelationshipAPIData } from "./Relationship.js";
import Server, { ServerAPIData } from "./Server.js";

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
  public id: number;
  public username: string;
  public avatar: File;
  public isBot: boolean;
  public about: string;
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

  public async ensureRelationshipWith(
    userId: number,
  ): Promise<{ channel: Channel; relationship: Relationship }> {
    let result = await this.client.rest.post<{
      channel: ChannelAPIData;
      relationship: RelationshipAPIData;
    }>(`/api/users/${this.id}/relationships/${userId}/ensure`);

    return {
      channel: new Channel(this.client, result.data.channel),
      relationship: new Relationship(this.client, result.data.relationship),
    };
  }
}
