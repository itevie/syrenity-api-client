import Client from "../client/Client";
import Base from "./Base";
import User, { UserAPIData } from "./User";

export interface ApplicationAPIData {
  id: number;
  token: string | null;
  application_name: string;
  bot_account: number;
  owner_id: number;
  bot: UserAPIData;
  owner: UserAPIData;
  created_at: string;
}

export default class Application extends Base {
  public id: number;
  public token: string | null;
  public applicationName: string;
  public bot: User;
  public owner: User;
  public createdAt: Date;

  constructor(client: Client, data: ApplicationAPIData) {
    super(client);

    this.id = data.id;
    this.token = data.token;
    this.applicationName = data.application_name;
    this.bot = new User(client, data.bot);
    this.owner = new User(client, data.owner);
  }
}
