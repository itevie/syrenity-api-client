import Client from "../client/Client";
import Base from "./Base";
import File from "./FileBase";
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
}

export interface UserEditOptions {
  avatar?: string;
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

  constructor(client: Client, options: UserAPIData) {
    super(client);

    client.emit("apiUserClassCreation", options);

    this.id = options.id;
    this.username = options.username;
    this.avatar = new File(client, options.avatar);
    this.isBot = options.is_bot;
    this.about = options.about_me;
    this.discriminator = options.discriminator;
    this.email = options.email;
    this.emailVerified = options.email_verified;
    this.createdAt = new Date(options.created_at);
  }

  public async fetchServers(): Promise<Server[]> {
    let result = await this.client.rest.get<ServerAPIData[]>(
      `/api/users/${this.id}/servers`
    );
    return (result.data ?? []).map((x) => new Server(this.client, x));
  }

  public async fetchRelationships(): Promise<Relationship[]> {
    const result = await this.client.rest.get<RelationshipAPIData[]>(
      `/api/users/${this.id}/relationships`
    );
    return result.data.map((x) => new Relationship(this.client, x));
  }

  public async edit(options: UserEditOptions): Promise<User> {
    const result = await this.client.rest.patch<UserAPIData>(
      `/api/users/${this.id}`,
      options
    );
    return this.client.users.addCache(
      result.data.id,
      new User(this.client, result.data)
    );
  }
}
