import Client from "../client/Client";

export default class BaseManager<K, V> {
  protected client: Client;
  public cache: Map<K, V> = new Map();

  constructor(client: Client) {
    this.client = client;
  }

  protected addCache(id: K, value: V): V {
    this.cache.set(id, value);
    return value;
  }
}