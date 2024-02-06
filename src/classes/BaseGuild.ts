import BaseMember, { MemberData } from './BaseMember.js';
import BaseRole from './BaseRole.js';
import Channel, {ChannelData} from './Channel.js'
import Client from './Client.js'
import Guild, { GuildData } from './Guild.js';

export default class BaseGuild {
  public id: number;
  protected client: Client;

  constructor(id: number, client: Client) {
    this.id = id;
    this.client = client;
  }

  public async fetch() {
    const res = await this.client.sendHTTP(`/guilds/${this.id}`);
    return new Guild((res.data as GuildData).id, this.client, (res.data as GuildData));
  }

  public role(id: number) {
    return new BaseRole(id, this.id, this.client);
  }

  public async createInvite(): Promise<string> {
    const res = await this.client.sendHTTP(`/guilds/${this.id}/invites`, "POST");

    return res.data.id;
  }

  /**
   * Leaves a guild - removes the member from this guild
   */
  public async leave(): Promise<void> {
    await this.client.sendHTTP(`/guilds/${this.id}/members/${this.client.currentUser.id}`, "DELETE");
  }

  public async setName(newName: string): Promise<Guild> {
    const res = await this.client.sendHTTP(`/guilds/${this.id}`, "PATCH", {
      name: newName
    });

    return new Guild(this.id, this.client, res.data);
  }

  members = {
    fetchList: async (): Promise<BaseMember[]> => {
      const res = await this.client.sendHTTP(`/guilds/${this.id}/members`);

      // Extract the data
      const members: BaseMember[] = [];

      for (const member of res.data.members as MemberData[]) {
        members.push(new BaseMember(member, this.client));
      }

      // Done
      return members;
    }
  }

  channels = {
    fetchList: async (): Promise<Channel[]> => {
      const res = await this.client.sendHTTP(`/guilds/${this.id}/channels`);

      // Extract data properly
      const channels: Channel[] = [];

      for (const channel of res.data.channels as ChannelData[]) {
        channels.push(
          new Channel(channel.id, this.client, channel)
        );
      }

      // Finish
      return channels;
    },

    
    create: async (name: string): Promise<Channel> => {
      const res = await this.client.sendHTTP(`/guilds/${this.id}/channels`, "POST", {
        name,
      });

      return new Channel(res.data.id, this.client, res.data);
    }
  }
}