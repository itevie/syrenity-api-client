import Client from "../client/Client";
import Base from "./Base";

export default class File extends Base {
  private isSyrenity: boolean = false;
  public url: string;
  public id: string;
  
  constructor(client: Client, url: string) {
    super(client);

    if (url.startsWith("syrenity-file://")) {
      this.id = url.replace("syrenity-file://", "");
      this.url = `${client.options.baseUrl}/files/${this.id}`;
      this.isSyrenity = true;
    } else {
      this.url = url;
    }
  }
}