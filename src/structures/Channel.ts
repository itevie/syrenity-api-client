import Client from "../client/Client";
import Base from "./Base";
import ChannelMessageManager from "../managers/ChannelMessageManager";
import ChannelBase from "./ChannelBase";

export interface ChannelAPIData {
  id: number;
  type: "channel" | "dm";
  guild_id: number | null;
  name: string;
  topic: string | null;
  is_nsfw: boolean;
  position: number;
}

export interface ChannelEditOptions {
  name?: string;
  position?: number;
}

export default class Channel extends ChannelBase {
  public type: "channel" | "dm";
  public guildId: number | null;
  public name: string;
  public topic: string | null;
  public nsfw: boolean;
  public position: number;
  public _data: ChannelAPIData;

  public messages: ChannelMessageManager;

  constructor(client: Client, data: ChannelAPIData) {
    super(client, data.id);

    this.messages = new ChannelMessageManager(client, this);

    this._data = data;

    this.id = data.id;
    this.type = data.type;
    this.topic = data.topic;
    this.guildId = data.guild_id;
    this.name = data.name;
    this.nsfw = data.is_nsfw;
    this.position = data.position;
  }

  public async edit(options: ChannelEditOptions) {
    const result = await this.client.rest.patch<ChannelAPIData>(
      `/api/channels/${this.id}`,
      options
    );
    return this.client.channels.addCache(
      result.data.id,
      new Channel(this.client, result.data)
    );
  }

  public strip() {
    return {
      id: this.id,
      type: this.type,
      topic: this.topic,
      guildId: this.guildId,
      name: this.name,
      nsfw: this.name,
    } as const;
  }
}
