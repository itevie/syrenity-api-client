import Client from './Client.js'
import { BaseGuild, Role } from "../index.js";
import { RoleData } from './Role.js';

export default class BaseRole {
  public id: number;
  public guild: BaseGuild;
  public client: Client;

  constructor(id: number, guild_id: number, client: Client) {
    this.id = id;
    this.guild = new BaseGuild(guild_id, client);
    this.client = client;
  }

  public async fetch() {
    const res = await this.client.sendHTTP(`/guilds/${this.guild.id}/roles/${this.id}`);
    return new Role(this.id, this.client, res.data as RoleData);
  }
}