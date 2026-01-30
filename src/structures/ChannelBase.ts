import Client from "../client/Client.js";
import Base from "./Base.js";

export default class ChannelBase extends Base {
  public id: number;

  constructor(client: Client, id: number) {
    super(client);
    this.id = id;
  }
}
