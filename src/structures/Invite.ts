import Client from "../client/Client";
import Base from "./Base";

export interface InviteAPIData {
  id: string;
  guild_id: number;
  channel_id: number;
  created_by: number;
  created_at: string;
  expires_in: number;
  max_uses: number;
  uses: number;
}

export default class Invite extends Base {
  public id: string;
  public guildId: number;
  public channelId: number;
  public createdBy: number;
  public createdAt: Date;
  public expiresIn: number;
  public maxUses: number;
  public uses: number;

  constructor(client: Client, data: InviteAPIData) {
    super(client);

    this.id = data.id;
    this.guildId = data.guild_id;
    this.channelId = data.channel_id;
    this.createdBy = data.created_by;
    this.createdAt = new Date(data.created_at);
    this.expiresIn = data.expires_in;
    this.maxUses = data.max_uses;
    this.uses = data.uses;
  }
}