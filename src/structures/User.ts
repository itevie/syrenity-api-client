import Client from "../client/Client";
import Base from "./Base";
import File from "./File";
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
    let result = await this.client.rest.get<ServerAPIData[]>(`/api/users/${this.id}/servers`);
    console.log(result);
    return result.data.map(x => new Server(this.client, x));
  }
}