import BaseGuild from './BaseGuild.js'
import BaseRole from './BaseRole.js';
import BaseUser from './BaseUser.js'
import Client from './Client.js'
import Role, { RoleData } from './Role.js';

export interface GuildData {
  id: number;
  name: string;
  owner_id: number;
  description: string | null;
  avatar: string | null;
  roles: {[key: number]: RoleData};
}

export default class Guild extends BaseGuild {
  public name: string;
  public description: string;
  public avatar: string | null;
  public owner: BaseUser;
  public roles: Map<number, Role> = new Map();

  constructor(id: number, client: Client, data: GuildData) {
    super(id, client);

    // Load the data
    this.name = data.name;
    this.description = data.description;
    this.avatar = data.avatar;
    this.owner = new BaseUser(data.owner_id, client);
    
    for (const i in data.roles) {
      this.roles.set(data.roles[i].id, new Role(data.roles[i].id, this.client, data.roles[i]));
    }
  }
}