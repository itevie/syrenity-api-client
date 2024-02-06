import Client from './Client.js'
import * as index from '../index.js'
import { UserData } from './User.js'
import { AxiosResponse } from 'axios';

const fetching: Map<number, Promise<AxiosResponse>> = new Map();

export default class BaseUser {
  public id: number;
  protected client: Client;

  constructor(id: number, client: Client) {
    this.id = id;
    this.client = client;
  }

  public async fetch(): Promise<index.User> {
    // Check if the user is in cache
    if (this.client.cacheManager.users.has(this.id)) {
      const cached = this.client.cacheManager.users.get(this.id);
      return new index.User(cached.id, this.client, cached);
    }

    // Check if already fetching
    if (fetching.has(this.id))
      return new index.User(this.id, this.client, (await fetching.get(this.id)).data as UserData);

    // GET the user from server
    let request = this.client.sendHTTP(`/users/${this.id === -1 ? "@me" : this.id}`);
    fetching.set(this.id, request);
    
    let res = (await request).data as UserData;
    fetching.delete(this.id);

    // Update cache
    this.client.cacheManager.users.set(this.id, res);

    // Create the user
    const user = new index.User(res.id, this.client, res);

    // Return user
    return user;
  }

  public async updateAvatar(newAvatar: string) {
    const res = (await this.client.sendHTTP(`/users/${this.id}/avatar`, "PATCH", {
      avatar: newAvatar
    }));
  }
}