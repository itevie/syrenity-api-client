import Client from './Client.js'
import { UserData } from './User.js'

interface CacheItem<T> {
  createdAt: number;
  data: T;
}

interface Cache {
  users: Map<number, CacheItem<UserData>>;
}

export default class CacheManager {
  private cache: Cache;
  private client: Client;

  constructor(client: Client) {
    this.client = client;
    this.cache = {
      users: new Map<number, CacheItem<UserData>>(),
    };
  }

  public users = {
    set: (id: number, data: UserData) => {
      this.client.log(`Set user ${id} in cache`, "cache");
      this.cache.users.set(id, {
        data,
        createdAt: Date.now(),
      });
    },

    has: (id: number): boolean => {
      return this.cache.users.has(id);
    },

    get: (id: number): UserData | null => {
      this.client.log(`User ${id} fetched from cache`, "cache");
      if (this.users.has(id) === false)
        return null;
      return this.cache.users.get(id).data;
    }
  }
}