import Client from './Client.js'
import * as index from '../index.js'
import Permissions from './Permissions.js';

export interface MemberData {
  user_id: number;
  guild_id: number;
  nickname: string;
  permissions_bitfield: number;
}

export interface ExtractedMemberData {
  userId: number;
  guildId: number;
  permissionsBitfield: number;
  nickname: string;
}

export default class BaseMember {
  public user: index.BaseUser;
  public guild: index.BaseGuild;
  public permissions: Permissions;
  public nickname: string;
  protected client: Client;

  constructor(data: MemberData, client: Client) {
    this.user = client.user(data.user_id);
    this.guild = client.guild(data.guild_id);
    this.permissions = new Permissions(data.permissions_bitfield);
    this.client = client;

    this.client.triggerEvent("memberClassCreation", this);
  }

  public extractData(): ExtractedMemberData {
    return {
      userId: this.user.id,
      guildId: this.guild.id,
      nickname: this.nickname,
      permissionsBitfield: this.permissions.bitfield
    };
  }

  /*public getPermissions(): Permissions {
    const res = await this.client.sendHTTP(`/guilds/${this.guild.id}/members/${}`)
  }*/

  roles = {
    // Gets the list of roles the user has
    fetch: async () => {

    }
  }
}