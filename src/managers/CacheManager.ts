import Client from "../client/Client";
import Base from "../structures/Base";

export default class CacheManager<T, K> {
    protected client: Client;
    protected holds: T;
    // @ts-ignore
    public cache: Map<K, InstanceType<T>> = new Map(); 

    constructor(client: Client, holds: T) {
        this.client = client;
        this.holds = holds;
    }

    get cacheValues() {
        return Array.from(this.cache.values());
    }

    // @ts-ignore
    public async addData(data: any): Promise<InstanceType<T>> {
        // @ts-ignore
        const instance = new this.holds(this.client, data);
        if (instance.init) await instance.init();
        this.cache.set(data.id, instance);
        return instance;
    }
}