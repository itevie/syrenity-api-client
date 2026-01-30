import Client from "../client/Client";
export default class CacheManager<T, K> {
    protected client: Client;
    protected holds: T;
    cache: Map<K, InstanceType<T>>;
    constructor(client: Client, holds: T);
    get cacheValues(): InstanceType<T>[];
    addData(data: any): Promise<InstanceType<T>>;
}
//# sourceMappingURL=CacheManager.d.ts.map