export default class BaseManager {
    client;
    cache = new Map();
    loading = new Map();
    constructor(client) {
        this.client = client;
    }
    async handle(id, cb) {
        // Check if it is currently being fetched
        if (this.loading.has(id))
            return (await this.loading.get(id)).data;
        // Otherwise, run the fetch function
        this.loading.set(id, cb());
        // Await the new fetch function
        return (await this.loading.get(id)).data;
    }
    getCache(id) {
        if (this.cache.has(id)) {
            this.loading.delete(id);
            return this.cache.get(id);
        }
        return null;
    }
    addCache(id, value) {
        this.cache.set(id, value);
        return value;
    }
}
