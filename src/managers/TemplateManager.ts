import Client from "../client/Client";
import BaseManager from "./BaseManager";

export default class _Manager extends BaseManager<unknown, unknown> {
  constructor(client: Client) {
    super(client);
  }
}