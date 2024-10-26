import Client from "../client/Client";

export default class Base {
  protected client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  public strip(): object {
    return {};
  }
}