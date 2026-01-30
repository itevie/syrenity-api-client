import Client from "../client/Client.js";

export default class BaseManager<ID, CLASS, DATA_CLASS = {}> {
  protected client: Client;
  public cache: Map<ID, CLASS> = new Map();
  protected loading: Map<ID, Axios.IPromise<Axios.AxiosXHR<DATA_CLASS>>> =
    new Map();

  constructor(client: Client) {
    this.client = client;
  }

  public async handle(
    id: ID,
    cb: () => Axios.IPromise<Axios.AxiosXHR<DATA_CLASS>>,
  ): Promise<DATA_CLASS> {
    // Check if it is currently being fetched
    if (this.loading.has(id)) return (await this.loading.get(id)).data;

    // Otherwise, run the fetch function
    this.loading.set(id, cb());

    // Await the new fetch function
    return (await this.loading.get(id)).data;
  }

  public getCache(id: ID): CLASS | null {
    if (this.cache.has(id)) {
      this.loading.delete(id);
      return this.cache.get(id);
    }

    return null;
  }

  public addCache(id: ID, value: CLASS): CLASS {
    this.cache.set(id, value);
    return value;
  }
}
