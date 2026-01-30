"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CacheManager {
    client;
    holds;
    // @ts-ignore
    cache = new Map();
    constructor(client, holds) {
        this.client = client;
        this.holds = holds;
    }
    get cacheValues() {
        return Array.from(this.cache.values());
    }
    // @ts-ignore
    async addData(data) {
        // @ts-ignore
        const instance = new this.holds(this.client, data);
        if (instance.init)
            await instance.init();
        this.cache.set(data.id, instance);
        return instance;
    }
}
exports.default = CacheManager;
