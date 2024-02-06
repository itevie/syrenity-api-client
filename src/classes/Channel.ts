import BaseChannel from './BaseChannel.js'
import BaseGuild from './BaseGuild.js'
import Client from './Client.js'

interface ChannelData {
  id: number;
  type: 'dm' | 'channel' | 'category';
  guild_id: number;
  name: string;
  topic: string | null;
  is_nsfw: boolean;
}

/**
 * Represents a Syrenity channel with fully complete data
 */
export default class Channel extends BaseChannel {
  public type: "dm" | "channel" | "category";
  public name: string;
  public topic: string | null;
  public isNSFW: boolean;
  public guild: BaseGuild;

  constructor(id: number, client: Client, data: ChannelData) {
    super(id, client);

    // Load the data
    this.name = data.name;
    this.type = data.type;
    this.topic = data.topic;
    this.isNSFW = data.is_nsfw;
    this.guild = new BaseGuild(data.guild_id, client);
  }
}

export {ChannelData};