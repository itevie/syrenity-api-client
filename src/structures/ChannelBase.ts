import Client from "../client/Client";
import Base from "./Base";

export default class ChannelBase extends Base {
  public id: number;

  constructor(client: Client, id: number) {
    super(client);
    this.id = id;
  }
}
