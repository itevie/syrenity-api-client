import BaseRole from "./BaseRole.js";
import Client from "./Client.js";
import Permissions from "./Permissions.js";

export interface RoleData {
  id: number;
  guild_id: number;
  name: string;
  is_everyone: boolean;
  permissions_bitfield: number;
  color: string;
}

export default class Role extends BaseRole {
  public name: string;
  public color: string;
  public isEveryone: boolean;
  public permissions: Permissions;

  constructor(id: number, client: Client, data: RoleData) {
    super(data.id, data.guild_id, client);

    this.name = data.name;
    this.isEveryone = data.is_everyone;
    this.permissions = new Permissions(data.permissions_bitfield);
    this.color = data.color;
  }
}